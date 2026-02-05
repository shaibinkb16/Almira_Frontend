// Test Supabase Database Connection and Schema
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...values] = line.split('=');
      return [key.trim(), values.join('=').trim()];
    })
);

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Testing Supabase Connection...\n');
console.log(`📍 URL: ${supabaseUrl}\n`);

async function testConnection() {
  console.log('1️⃣ Testing basic connection...');
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    console.log('✅ Connection successful!\n');
    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    return false;
  }
}

async function checkTableColumns(tableName, expectedColumns) {
  console.log(`\n📊 Checking ${tableName} table schema...`);
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
      console.error(`❌ Error querying ${tableName}:`, error.message);
      return false;
    }

    if (!data || data.length === 0) {
      console.log(`⚠️  ${tableName} table is empty (no data to verify columns)`);
      return true;
    }

    const actualColumns = Object.keys(data[0]);
    console.log(`   Columns found: ${actualColumns.join(', ')}`);

    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    if (missingColumns.length > 0) {
      console.error(`   ❌ Missing columns: ${missingColumns.join(', ')}`);
      return false;
    }

    console.log(`   ✅ All expected columns present`);
    return true;
  } catch (err) {
    console.error(`❌ Error checking ${tableName}:`, err.message);
    return false;
  }
}

async function testCartItemsQuery() {
  console.log('\n3️⃣ Testing cart_items query with joins...');
  try {
    // This is the exact query that's failing in the app
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
      console.error('❌ Cart items query failed:', error.message);
      console.error('   Details:', JSON.stringify(error, null, 2));
      return false;
    }

    console.log('✅ Cart items query successful!');
    if (data && data.length > 0) {
      console.log('   Sample data:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (err) {
    console.error('❌ Cart items query failed:', err.message);
    return false;
  }
}

async function checkAuthStatus() {
  console.log('\n4️⃣ Checking authentication status...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Auth check failed:', error.message);
      return false;
    }

    if (session) {
      console.log('✅ User is authenticated');
      console.log(`   User ID: ${session.user.id}`);
      console.log(`   Email: ${session.user.email}`);
    } else {
      console.log('ℹ️  No active session (user not logged in)');
    }
    return true;
  } catch (err) {
    console.error('❌ Auth check failed:', err.message);
    return false;
  }
}

async function testProductVariantsTable() {
  console.log('\n5️⃣ Testing product_variants table directly...');
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Product variants query failed:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error details:', error.details);
      console.error('   Error hint:', error.hint);
      return false;
    }

    console.log('✅ Product variants query successful!');
    if (data && data.length > 0) {
      console.log('   Available columns:', Object.keys(data[0]).join(', '));
      console.log('   Sample data:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('   ⚠️  Table is empty');
    }
    return true;
  } catch (err) {
    console.error('❌ Product variants query failed:', err.message);
    return false;
  }
}

async function checkAllTables() {
  console.log('\n2️⃣ Checking required tables...');
  const tables = [
    'categories',
    'products',
    'product_variants',
    'cart_items',
    'wishlist_items',
    'addresses',
    'orders',
    'order_items',
    'reviews',
    'coupons',
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`);
    }
  }
}

// Run all tests
(async () => {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.log('\n❌ Cannot proceed with further tests - connection failed');
      process.exit(1);
    }

    await checkAllTables();
    await testProductVariantsTable();
    await testCartItemsQuery();
    await checkAuthStatus();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
})();
