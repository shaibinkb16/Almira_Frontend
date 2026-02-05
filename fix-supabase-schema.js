// Fix Supabase Database Schema Issues
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

console.log('🔧 Fixing Supabase Database Schema...\n');
console.log(`📍 URL: ${supabaseUrl}\n`);

async function checkColumnExists(tableName, columnName) {
  try {
    // Query information_schema to check if column exists
    const { data, error } = await supabase.rpc('check_column_exists', {
      p_table_name: tableName,
      p_column_name: columnName
    }).single();

    if (error && error.code !== 'PGRST116') {
      // Function might not exist, let's try a different approach
      console.log(`   ℹ️  Using alternative method to check column...`);

      // Try to select the column
      const testQuery = await supabase.from(tableName).select(columnName).limit(0);
      return !testQuery.error || testQuery.error.code !== '42703';
    }

    return data;
  } catch (err) {
    return false;
  }
}

async function getTableColumns(tableName) {
  console.log(`\n📊 Getting columns for ${tableName}...`);

  try {
    // Use SQL to get column information
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: tableName
    });

    if (error) {
      console.log(`   ⚠️  Could not query column info, trying direct query...`);
      // Fallback: try to select from table
      const { data: sampleData, error: selectError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (selectError) {
        console.error(`   ❌ Error: ${selectError.message}`);
        return [];
      }

      if (sampleData && sampleData.length > 0) {
        const columns = Object.keys(sampleData[0]);
        console.log(`   ✅ Found columns: ${columns.join(', ')}`);
        return columns;
      } else {
        console.log(`   ⚠️  Table is empty, cannot determine columns from data`);
        return [];
      }
    }

    console.log(`   ✅ Columns:`, data.map(c => c.column_name).join(', '));
    return data.map(c => c.column_name);
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return [];
  }
}

async function fixProductVariantsTable() {
  console.log('\n1️⃣ Checking product_variants table structure...');

  const columns = await getTableColumns('product_variants');

  const requiredColumns = [
    'id',
    'product_id',
    'name',
    'sku_suffix',
    'price_adjustment',
    'stock_quantity',
    'image_url',
    'attributes',
    'created_at',
    'updated_at'
  ];

  const missingColumns = requiredColumns.filter(col => !columns.includes(col));

  if (missingColumns.length === 0 && columns.length > 0) {
    console.log('   ✅ All columns present!');
    return true;
  }

  if (columns.length === 0) {
    console.log('   ⚠️  Cannot determine current columns. Will try to add missing column...');
  } else {
    console.log(`   ⚠️  Missing columns: ${missingColumns.join(', ')}`);
  }

  // Try to add missing column using SQL
  console.log('\n2️⃣ Attempting to add missing column...');

  try {
    // Check if sku_suffix is missing
    if (missingColumns.includes('sku_suffix') || columns.length === 0) {
      console.log('   Adding sku_suffix column...');

      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE product_variants
          ADD COLUMN IF NOT EXISTS sku_suffix TEXT NOT NULL DEFAULT '';

          -- Update the unique constraint
          ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_sku_suffix_key;
          ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_sku_suffix_key
            UNIQUE(product_id, sku_suffix);
        `
      });

      if (error) {
        console.error(`   ❌ Failed to add column via RPC: ${error.message}`);
        console.log('   ℹ️  Trying direct SQL approach...');

        // Alternative: Execute SQL directly
        const { error: sqlError } = await supabase.rpc('exec', {
          query: 'ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku_suffix TEXT NOT NULL DEFAULT \'\''
        });

        if (sqlError) {
          console.error(`   ❌ Failed: ${sqlError.message}`);
          console.log('\n   ⚠️  Please run this SQL manually in Supabase SQL Editor:');
          console.log('   ```sql');
          console.log('   ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku_suffix TEXT NOT NULL DEFAULT \'\';');
          console.log('   ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_sku_suffix_key;');
          console.log('   ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_sku_suffix_key UNIQUE(product_id, sku_suffix);');
          console.log('   ```');
          return false;
        }
      }

      console.log('   ✅ Column added successfully!');
    }

    return true;
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return false;
  }
}

async function testCartQuery() {
  console.log('\n3️⃣ Testing cart_items query with product_variants join...');

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          sku,
          base_price,
          sale_price,
          stock_quantity,
          images
        ),
        variant:product_variants (
          id,
          name,
          sku_suffix,
          price_adjustment,
          stock_quantity,
          image_url
        )
      `)
      .limit(1);

    if (error) {
      console.error('   ❌ Query failed:', error.message);
      console.error('   Error code:', error.code);
      return false;
    }

    console.log('   ✅ Query successful!');
    return true;
  } catch (err) {
    console.error('   ❌ Error:', err.message);
    return false;
  }
}

async function verifySchema() {
  console.log('\n4️⃣ Verifying schema by querying system tables...');

  try {
    // Try to get table info from pg_catalog
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: 'product_variants',
      schema_name: 'public'
    });

    if (error && error.code !== 'PGRST116') {
      console.log('   ⚠️  RPC function not available, skipping detailed verification');
      return;
    }

    if (data) {
      console.log('   ✅ Schema details:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log('   ℹ️  Could not verify via system tables');
  }
}

// Alternative: Apply migration SQL directly
async function applyMigrationSQL() {
  console.log('\n5️⃣ Applying migration SQL to fix schema...');

  const migrationSQL = `
    -- Check and fix product_variants table
    DO $$
    BEGIN
      -- Add sku_suffix column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'product_variants'
        AND column_name = 'sku_suffix'
      ) THEN
        ALTER TABLE product_variants ADD COLUMN sku_suffix TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added sku_suffix column';
      ELSE
        RAISE NOTICE 'sku_suffix column already exists';
      END IF;

      -- Fix unique constraint
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'product_variants_product_id_sku_suffix_key'
        AND table_name = 'product_variants'
      ) THEN
        ALTER TABLE product_variants DROP CONSTRAINT product_variants_product_id_sku_suffix_key;
      END IF;

      ALTER TABLE product_variants
        ADD CONSTRAINT product_variants_product_id_sku_suffix_key
        UNIQUE(product_id, sku_suffix);

      RAISE NOTICE 'Schema fix completed';
    END $$;
  `;

  console.log('   📝 Migration SQL prepared');
  console.log('   ⚠️  This requires running SQL directly in Supabase SQL Editor');
  console.log('\n   Please copy and run this SQL in your Supabase project:');
  console.log('   ```sql');
  console.log(migrationSQL);
  console.log('   ```\n');

  return migrationSQL;
}

// Run all fixes
(async () => {
  try {
    const fixed = await fixProductVariantsTable();

    if (!fixed) {
      console.log('\n⚠️  Could not automatically fix schema.');
      const sql = await applyMigrationSQL();

      // Save SQL to file
      const fs = await import('fs');
      const sqlPath = join(__dirname, 'fix-schema.sql');
      fs.writeFileSync(sqlPath, sql);
      console.log(`   ✅ SQL saved to: ${sqlPath}`);
    } else {
      await testCartQuery();
    }

    await verifySchema();

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Schema fix process completed!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Fix process failed:', error.message);
    console.error(error);
    process.exit(1);
  }
})();
