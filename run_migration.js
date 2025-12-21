#!/usr/bin/env node
/**
 * Run Supabase migration using service role key
 * This script executes the SQL migration directly
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://togpvwfxmydgitkwqdgd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4ODY3MywiZXhwIjoyMDgxODY0NjczfQ.YAWkSVgxqu8d53nMH96nN4vn1dxA8OTeORvL8i_O0ps';

// Read SQL file
const sqlContent = fs.readFileSync('supabase/migrations/002_create_user_profile_trigger.sql', 'utf8');

// Supabase doesn't have a direct SQL execution endpoint via REST API
// We need to use the Management API or run it manually
console.log('='.repeat(60));
console.log('SUPABASE MIGRATION SQL');
console.log('='.repeat(60));
console.log('\n⚠️  Supabase REST API does not support direct SQL execution.');
console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
console.log('\n1. Go to: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/sql/new');
console.log('2. Copy and paste the SQL below');
console.log('3. Click "Run" button');
console.log('\n' + '='.repeat(60));
console.log(sqlContent);
console.log('='.repeat(60));

// Alternative: Try using Supabase CLI
console.log('\n\n💡 Alternative: Use Supabase CLI');
console.log('   1. Install Supabase CLI: npm install -g supabase');
console.log('   2. Link project: supabase link --project-ref togpvwfxmydgitkwqdgd');
console.log('   3. Run migration: supabase db push');
console.log('\n   Or use psql with connection string from Supabase Dashboard');

