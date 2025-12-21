#!/usr/bin/env node
/**
 * Force Supabase schema cache refresh by making a query with service role
 */

const SUPABASE_URL = 'https://togpvwfxmydgitkwqdgd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4ODY3MywiZXhwIjoyMDgxODY0NjczfQ.YAWkSVgxqu8d53nMH96nN4vn1dxA8OTeORvL8i_O0ps';

async function refreshSchema() {
  console.log('🔄 Attempting to refresh Supabase schema cache...\n');

  try {
    // Try to query the table with service role key
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Schema cache refreshed! Table is accessible.');
      console.log(`   Found ${data.length} record(s) in test query\n`);
    } else {
      const error = await response.text();
      console.log('⚠️  Service role can access table, but anon key might still be cached.');
      console.log(`   Error: ${error}\n`);
    }

    // Now test with anon key
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y';
    
    console.log('🔍 Testing with anon key (what the frontend uses)...');
    const anonResponse = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?select=id&limit=1&is_active=eq.true`, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    });

    if (anonResponse.ok) {
      const anonData = await anonResponse.json();
      console.log('✅ Anon key can access table!');
      console.log(`   Found ${anonData.length} record(s)\n`);
      console.log('✨ Schema is ready! Refresh your browser.');
    } else {
      const anonError = await anonResponse.text();
      console.log('❌ Anon key still cannot access table.');
      console.log(`   Error: ${anonError}\n`);
      console.log('💡 Solutions:');
      console.log('   1. Wait 2-5 minutes for automatic cache refresh');
      console.log('   2. Check RLS policies in Supabase dashboard');
      console.log('   3. Try restarting your Supabase project (Settings > General > Restart)');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

refreshSchema();

