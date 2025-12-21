#!/usr/bin/env node
/**
 * Test script to verify AI tools were inserted correctly
 */

const SUPABASE_URL = 'https://togpvwfxmydgitkwqdgd.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y';

async function testAITools() {
  console.log('🔍 Testing AI Tools...\n');

  try {
    // Fetch all active AI tools
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?is_active=eq.true&select=*&order=order_index`, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const tools = await response.json();

    console.log(`✅ Found ${tools.length} AI tools:\n`);

    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.name_chinese || 'N/A'})`);
      console.log(`   Slug: ${tool.slug}`);
      console.log(`   Category: ${tool.category || 'N/A'}`);
      console.log(`   Featured: ${tool.is_featured ? 'Yes' : 'No'}`);
      console.log(`   Active: ${tool.is_active ? 'Yes' : 'No'}`);
      console.log(`   Features: ${tool.features?.length || 0} features`);
      console.log(`   Website: ${tool.website_url || 'N/A'}`);
      console.log('');
    });

    // Test categories
    const categoriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?is_active=eq.true&select=category`, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    });

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categories = [...new Set(categoriesData.map(t => t.category).filter(Boolean))];
      console.log(`📂 Categories found: ${categories.join(', ')}\n`);
    }

    console.log('✨ Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Refresh your browser at http://localhost:5173/ai-tools');
    console.log('   2. You should see the AI tools displayed');
    console.log('   3. Try clicking on a tool to see the detail page');

  } catch (err) {
    console.error('❌ Error testing AI tools:', err.message);
    process.exit(1);
  }
}

testAITools();

