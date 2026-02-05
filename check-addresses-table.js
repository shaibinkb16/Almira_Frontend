// Check addresses table structure
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

console.log('🔍 Checking addresses table...\n');

// Try to query the table
const { data, error } = await supabase
  .from('addresses')
  .select('*')
  .limit(0);

if (error) {
  console.error('❌ Error querying addresses table:', error.message);
  console.log('\n📝 The addresses table might not exist or have different columns.');
  console.log('\nPlease run this SQL in Supabase SQL Editor:\n');
  console.log('```sql');
  console.log('-- Check addresses table');
  console.log('SELECT column_name, data_type');
  console.log('FROM information_schema.columns');
  console.log("WHERE table_name = 'addresses'");
  console.log("AND table_schema = 'public'");
  console.log('ORDER BY ordinal_position;');
  console.log('```');
} else {
  console.log('✅ Addresses table exists!');
  console.log('\nTrying to insert a test address...');

  // Try to insert with both pincode and postal_code
  const testAddress = {
    user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
    type: 'shipping',
    full_name: 'Test User',
    phone: '9876543210',
    address_line1: 'Test Address',
    city: 'Test City',
    state: 'Test State',
    pincode: '560001',
  };

  const { error: insertError } = await supabase
    .from('addresses')
    .insert(testAddress)
    .select();

  if (insertError) {
    console.log('❌ Insert failed:', insertError.message);
    console.log('\nColumn name issue detected.');
    console.log('The table might use "postal_code" instead of "pincode"');
  } else {
    console.log('✅ Insert successful! Table uses "pincode" column.');
    // Clean up test data
    await supabase.from('addresses').delete().eq('full_name', 'Test User');
  }
}
