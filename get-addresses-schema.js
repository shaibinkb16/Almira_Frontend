// Get actual addresses table schema
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load from Backend .env for service role access
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

const supabase = createClient(
  envVars.SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Getting addresses table schema...\n');

// Query information_schema
const { data, error } = await supabase.rpc('exec_sql', {
  sql: `
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'addresses'
    ORDER BY ordinal_position;
  `
});

if (error && error.code === '42883') {
  console.log('⚠️  RPC function not available. Using direct query...\n');

  // Try direct REST API approach
  const response = await fetch(`${envVars.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': envVars.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${envVars.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'addresses'
        ORDER BY ordinal_position;
      `
    })
  });

  if (!response.ok) {
    console.log('❌ Cannot query schema via API');
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:\n');
    console.log('SELECT column_name, data_type, is_nullable');
    console.log("FROM information_schema.columns");
    console.log("WHERE table_schema = 'public' AND table_name = 'addresses'");
    console.log("ORDER BY ordinal_position;");
  }
} else if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log('✅ Addresses Table Schema:\n');
  console.table(data);

  console.log('\n📋 Column Names:');
  data.forEach(col => {
    console.log(`  - ${col.column_name} (${col.data_type})`);
  });
}
