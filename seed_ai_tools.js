#!/usr/bin/env node
/**
 * Seed AI Tools into Supabase
 * Uses service role key to bypass RLS
 */

const SUPABASE_URL = 'https://togpvwfxmydgitkwqdgd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4ODY3MywiZXhwIjoyMDgxODY0NjczfQ.YAWkSVgxqu8d53nMH96nN4vn1dxA8OTeORvL8i_O0ps';

// Use REST API directly
async function supabaseInsert(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

async function supabaseSelect(table, query = {}) {
  const params = new URLSearchParams();
  if (query.eq) {
    params.append(query.eq.column, `eq.${query.eq.value}`);
  }
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

const aiTools = [
  {
    slug: 'gamma',
    name: 'Gamma',
    name_chinese: 'Gamma',
    description: 'Gamma is an AI-powered presentation tool that helps you create beautiful, engaging presentations in minutes. Simply describe what you want, and Gamma generates a professional presentation with slides, layouts, and content automatically.',
    description_chinese: 'Gamma 是一個 AI 驅動的簡報工具，可幫助您在幾分鐘內創建精美、引人入勝的簡報。只需描述您想要的內容，Gamma 就會自動生成包含投影片、佈局和內容的專業簡報。',
    short_description: 'AI-powered presentation tool that creates beautiful slides automatically',
    short_description_chinese: 'AI 驅動的簡報工具，自動創建精美的投影片',
    category: '簡報製作',
    icon_url: 'https://gamma.app/favicon.ico',
    cover_image_url: 'https://gamma.app/og-image.png',
    features: [
      'AI-generated presentations',
      'Multiple templates',
      'Export to PDF/PPT',
      'Real-time collaboration',
      'Custom branding'
    ],
    use_cases: [
      '教學簡報製作',
      '課程內容展示',
      '學生作品展示',
      '培訓材料準備'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Free', price: 0, features: ['Limited presentations'] },
        { name: 'Pro', price: 10, currency: 'USD', period: 'month', features: ['Unlimited presentations', 'Custom branding'] }
      ]
    },
    tutorial_urls: [
      'https://gamma.app/docs',
      'https://www.youtube.com/watch?v=gamma-tutorial'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://gamma.app',
    is_featured: true,
    is_active: true,
    order_index: 1
  },
  {
    slug: 'animaker',
    name: 'Animaker',
    name_chinese: 'Animaker',
    description: 'Animaker is a cloud-based animation and video creation platform that allows users to create professional animated videos, presentations, and infographics without any design or animation skills. Perfect for creating engaging educational content.',
    description_chinese: 'Animaker 是一個基於雲端的動畫和影片創作平台，讓用戶無需任何設計或動畫技能即可創建專業的動畫影片、簡報和信息圖表。非常適合創建引人入勝的教育內容。',
    short_description: 'Cloud-based animation and video creation platform for educational content',
    short_description_chinese: '基於雲端的動畫和影片創作平台，用於教育內容',
    category: '影片製作',
    icon_url: 'https://www.animaker.com/favicon.ico',
    cover_image_url: 'https://www.animaker.com/og-image.png',
    features: [
      'Drag-and-drop interface',
      'Thousands of templates',
      'Character builder',
      'Voice-over recording',
      'Multiple export formats'
    ],
    use_cases: [
      '教學影片製作',
      '動畫課程內容',
      '學生專案展示',
      '宣傳影片製作'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Free', price: 0, features: ['Limited exports'] },
        { name: 'Basic', price: 10, currency: 'USD', period: 'month', features: ['HD exports', 'More templates'] },
        { name: 'Starter', price: 19, currency: 'USD', period: 'month', features: ['Full HD', 'No watermark'] }
      ]
    },
    tutorial_urls: [
      'https://www.animaker.com/help',
      'https://www.youtube.com/c/Animaker'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://www.animaker.com',
    is_featured: true,
    is_active: true,
    order_index: 2
  },
  {
    slug: 'n8n',
    name: 'n8n',
    name_chinese: 'n8n',
    description: 'n8n is a powerful workflow automation tool that allows you to connect different apps and services together. Create automated workflows to streamline your teaching tasks, manage student data, and integrate various educational tools.',
    description_chinese: 'n8n 是一個強大的工作流程自動化工具，可讓您將不同的應用程式和服務連接在一起。創建自動化工作流程以簡化您的教學任務、管理學生數據並整合各種教育工具。',
    short_description: 'Workflow automation platform to connect apps and automate tasks',
    short_description_chinese: '工作流程自動化平台，用於連接應用程式和自動化任務',
    category: '自動化工具',
    icon_url: 'https://n8n.io/favicon.ico',
    cover_image_url: 'https://n8n.io/og-image.png',
    features: [
      'Visual workflow builder',
      '500+ integrations',
      'Self-hosted option',
      'Webhook support',
      'Custom nodes'
    ],
    use_cases: [
      '教學流程自動化',
      '學生數據管理',
      '多平台內容同步',
      '通知系統設置'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Community', price: 0, features: ['Self-hosted', 'Open source'] },
        { name: 'Cloud', price: 20, currency: 'USD', period: 'month', features: ['Hosted', 'Support'] }
      ]
    },
    tutorial_urls: [
      'https://docs.n8n.io',
      'https://www.youtube.com/c/n8n-io'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://n8n.io',
    is_featured: true,
    is_active: true,
    order_index: 3
  },
  {
    slug: 'canva',
    name: 'Canva',
    name_chinese: 'Canva',
    description: 'Canva is a graphic design platform that makes it easy to create professional designs for presentations, social media, posters, and more. With AI-powered features, it helps teachers create engaging visual content quickly.',
    description_chinese: 'Canva 是一個圖形設計平台，可輕鬆為簡報、社交媒體、海報等創建專業設計。憑藉 AI 驅動的功能，它幫助教師快速創建引人入勝的視覺內容。',
    short_description: 'Graphic design platform with AI features for creating visual content',
    short_description_chinese: '具有 AI 功能的圖形設計平台，用於創建視覺內容',
    category: '設計工具',
    icon_url: 'https://www.canva.com/favicon.ico',
    cover_image_url: 'https://www.canva.com/og-image.png',
    features: [
      'Thousands of templates',
      'AI design tools',
      'Brand kit',
      'Team collaboration',
      'Export in multiple formats'
    ],
    use_cases: [
      '教學材料設計',
      '海報和傳單製作',
      '社交媒體內容',
      '簡報美化'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Free', price: 0, features: ['Basic templates'] },
        { name: 'Pro', price: 12.99, currency: 'USD', period: 'month', features: ['Premium templates', 'Brand kit'] }
      ]
    },
    tutorial_urls: [
      'https://www.canva.com/designschool',
      'https://www.youtube.com/c/Canva'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://www.canva.com',
    is_featured: false,
    is_active: true,
    order_index: 4
  },
  {
    slug: 'notion',
    name: 'Notion',
    name_chinese: 'Notion',
    description: 'Notion is an all-in-one workspace that combines notes, docs, wikis, and databases. Perfect for organizing course materials, creating student wikis, and managing educational projects.',
    description_chinese: 'Notion 是一個一體化工作空間，結合了筆記、文檔、維基和數據庫。非常適合組織課程材料、創建學生維基和管理教育項目。',
    short_description: 'All-in-one workspace for notes, docs, and project management',
    short_description_chinese: '一體化工作空間，用於筆記、文檔和項目管理',
    category: '生產力工具',
    icon_url: 'https://www.notion.so/favicon.ico',
    cover_image_url: 'https://www.notion.so/og-image.png',
    features: [
      'Unified workspace',
      'Database and views',
      'Templates gallery',
      'Team collaboration',
      'API access'
    ],
    use_cases: [
      '課程材料組織',
      '學生專案管理',
      '協作筆記',
      '知識庫建立'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Free', price: 0, features: ['Personal use'] },
        { name: 'Plus', price: 8, currency: 'USD', period: 'month', features: ['Team collaboration'] }
      ]
    },
    tutorial_urls: [
      'https://www.notion.so/help',
      'https://www.youtube.com/c/Notion'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://www.notion.so',
    is_featured: false,
    is_active: true,
    order_index: 5
  },
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    name_chinese: 'ChatGPT',
    description: 'ChatGPT is an AI-powered conversational assistant that can help with lesson planning, content creation, answering student questions, and providing personalized learning support.',
    description_chinese: 'ChatGPT 是一個 AI 驅動的對話助手，可以幫助進行課程規劃、內容創建、回答學生問題和提供個性化學習支持。',
    short_description: 'AI conversational assistant for education and content creation',
    short_description_chinese: '用於教育和內容創建的 AI 對話助手',
    category: 'AI 助手',
    icon_url: 'https://chat.openai.com/favicon.ico',
    cover_image_url: 'https://openai.com/og-image.png',
    features: [
      'Natural language conversations',
      'Content generation',
      'Code assistance',
      'Multi-language support',
      'Custom instructions'
    ],
    use_cases: [
      '課程內容生成',
      '作業輔導',
      '語言學習',
      '創意寫作'
    ],
    pricing_info: {
      free: true,
      plans: [
        { name: 'Free', price: 0, features: ['GPT-3.5 access'] },
        { name: 'Plus', price: 20, currency: 'USD', period: 'month', features: ['GPT-4 access', 'Priority support'] }
      ]
    },
    tutorial_urls: [
      'https://help.openai.com',
      'https://www.youtube.com/c/OpenAI'
    ],
    screenshots: [],
    demo_video_url: null,
    comparison_data: null,
    website_url: 'https://chat.openai.com',
    is_featured: true,
    is_active: true,
    order_index: 6
  }
];

async function seedAITools() {
  console.log('🌱 Starting AI Tools seeding...\n');

  for (const tool of aiTools) {
    try {
      // Check if tool already exists
      const existing = await supabaseSelect('ai_tools', {
        eq: { column: 'slug', value: tool.slug }
      });

      if (existing && existing.length > 0) {
        console.log(`⏭️  Skipping ${tool.name} (already exists)`);
        continue;
      }

      // Insert tool
      const data = await supabaseInsert('ai_tools', tool);

      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Successfully inserted ${tool.name} (${tool.slug})`);
      } else {
        console.log(`✅ Successfully inserted ${tool.name} (${tool.slug})`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${tool.name}:`, err.message);
    }
  }

  console.log('\n✨ Seeding completed!');
}

seedAITools().catch(console.error);

