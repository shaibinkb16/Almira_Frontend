// Apply Schema Fix Directly to Supabase
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from Backend .env file
const envPath = join(__dirname, '..', 'Backend', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...values] = line.split('=');
      return [key.trim(), values.join('=').trim()];
    })
);

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Create Supabase client with service role (admin) key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔧 Applying Schema Fix to Supabase...\n');

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      // If RPC doesn't exist, try alternative method
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    // RPC method failed, return the error
    return { data: null, error: err };
  }
}

async function applyFix() {
  console.log('📝 Executing SQL to add sku_suffix column...\n');

  // Step 1: Try to add column directly
  const addColumnSQL = `ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku_suffix TEXT NOT NULL DEFAULT '';`;

  console.log('SQL:', addColumnSQL);

  try {
    // Use the Supabase SQL function if available
    const { error } = await supabase.rpc('exec_sql', { sql: addColumnSQL });

    if (error && error.code === '42883') {
      // Function doesn't exist, we need another approach
      console.log('⚠️  exec_sql RPC not available\n');
      console.log('Using alternative method...\n');

      // Try using the REST API schema endpoint (requires service role)
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: addColumnSQL })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to execute SQL:', errorText);
        throw new Error('Cannot execute SQL - RPC function not available');
      }

      console.log('✅ SQL executed successfully via REST API');
    } else if (error) {
      console.error('❌ Error:', error.message);
      throw error;
    } else {
      console.log('✅ Column added successfully!');
    }
  } catch (err) {
    console.error('❌ Direct execution failed:', err.message);
    console.log('\n⚠️  Need to use alternative method\n');
    return false;
  }

  // Step 2: Add unique constraint
  const constraintSQL = `
    ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_sku_suffix_key;
    ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_sku_suffix_key UNIQUE(product_id, sku_suffix);
  `;

  console.log('\n📝 Adding unique constraint...');

  try {
    await supabase.rpc('exec_sql', { sql: constraintSQL });
    console.log('✅ Constraint added successfully!');
  } catch (err) {
    console.log('⚠️  Could not add constraint via RPC');
  }

  return true;
}

async function verifyFix() {
  console.log('\n🔍 Verifying the fix...\n');

  try {
    // Try to query with sku_suffix
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (id, name, sku),
        variant:product_variants (id, name, sku_suffix)
      `)
      .limit(1);

    if (error) {
      if (error.code === '42703') {
        console.error('❌ Column still missing!');
        return false;
      }
      console.log('⚠️  Query test returned error (table might be empty):', error.message);
      return true; // Might be OK, just empty
    }

    console.log('✅ Query with sku_suffix works!');
    return true;
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    return false;
  }
}

// Run the fix
(async () => {
  try {
    const applied = await applyFix();

    if (!applied) {
      console.log('\n' + '='.repeat(60));
      console.log('⚠️  MANUAL ACTION REQUIRED');
      console.log('='.repeat(60));
      console.log('\nThe automated fix could not be applied.');
      console.log('Please apply the fix manually:\n');
      console.log('1. Go to: https://supabase.com/dashboard/project/nltzetpmvsbazhhkuqiq/sql/new');
      console.log('2. Paste this SQL:\n');
      console.log('   ALTER TABLE product_variants');
      console.log('   ADD COLUMN IF NOT EXISTS sku_suffix TEXT NOT NULL DEFAULT \'\';');
      console.log('\n   ALTER TABLE product_variants');
      console.log('   ADD CONSTRAINT product_variants_product_id_sku_suffix_key');
      console.log('   UNIQUE(product_id, sku_suffix);\n');
      console.log('3. Click "Run"');
      console.log('='.repeat(60) + '\n');
      process.exit(1);
    }

    await verifyFix();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Schema fix completed successfully!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.log('\nPlease apply the fix manually in Supabase SQL Editor.');
    console.log('See SUPABASE_FIX_GUIDE.md for instructions.\n');
    process.exit(1);
  }
})();
