-- ============================================
-- COMPLETE DATABASE SETUP + AI TOOLS SEED
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Step 1: Run the migration (creates all tables)
-- This file includes the full migration from 001_initial_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('admin', 'teacher', 'student', 'guest')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tools table
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_chinese TEXT,
  description TEXT,
  description_chinese TEXT,
  short_description TEXT,
  short_description_chinese TEXT,
  category TEXT,
  icon_url TEXT,
  cover_image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  use_cases JSONB DEFAULT '[]'::jsonb,
  pricing_info JSONB,
  tutorial_urls JSONB DEFAULT '[]'::jsonb,
  screenshots JSONB DEFAULT '[]'::jsonb,
  demo_video_url TEXT,
  comparison_data JSONB,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_chinese TEXT,
  description TEXT,
  description_chinese TEXT,
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('online', 'offline', 'hybrid')),
  cover_image_url TEXT,
  instructor_id UUID REFERENCES public.user_profiles(id),
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'HKD',
  max_participants INTEGER,
  registration_deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  location_chinese TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson content (for online/hybrid lessons)
CREATE TABLE IF NOT EXISTS public.lesson_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'quiz', 'material', 'assignment')),
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  video_provider TEXT,
  material_urls JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson registrations
CREATE TABLE IF NOT EXISTS public.lesson_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(lesson_id, user_id)
);

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_chinese TEXT,
  excerpt TEXT,
  excerpt_chinese TEXT,
  content TEXT NOT NULL,
  content_chinese TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.user_profiles(id),
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom pages
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_chinese TEXT,
  content TEXT,
  content_chinese TEXT,
  page_type TEXT NOT NULL CHECK (page_type IN ('static', 'landing', 'custom')),
  template_data JSONB,
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id)
);

-- Image library
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  alt_text_chinese TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  uploaded_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content generation jobs
CREATE TABLE IF NOT EXISTS public.content_generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL CHECK (job_type IN ('blog_post', 'tool_description', 'image', 'seo_content')),
  target_type TEXT,
  target_id UUID,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_data JSONB,
  error_message TEXT,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Ensure all required columns exist (in case tables were created with different schema)
DO $$ 
BEGIN
  -- Add missing columns to blog_posts if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'is_published') THEN
      ALTER TABLE public.blog_posts ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'published_at') THEN
      ALTER TABLE public.blog_posts ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'is_featured') THEN
      ALTER TABLE public.blog_posts ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'view_count') THEN
      ALTER TABLE public.blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'category') THEN
      ALTER TABLE public.blog_posts ADD COLUMN category TEXT;
    END IF;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON public.ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON public.ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON public.ai_tools(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON public.lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON public.lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_instructor ON public.lessons(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.lessons(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_lesson_content_lesson ON public.lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_registrations_lesson ON public.lesson_registrations(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_registrations_user ON public.lesson_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
-- Only create indexes if the columns exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'is_published') THEN
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at) WHERE is_published = TRUE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'category') THEN
    CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_images_category ON public.images(category);
CREATE INDEX IF NOT EXISTS idx_content_jobs_status ON public.content_generation_jobs(status);

-- Row Level Security (RLS) Policies
-- Drop existing policies if they exist, then recreate
DO $$ 
BEGIN
  -- Enable RLS on all tables
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.lesson_registrations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.content_generation_jobs ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Drop and recreate policies (safer approach)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can view published AI tools" ON public.ai_tools;
DROP POLICY IF EXISTS "Admins can manage AI tools" ON public.ai_tools;
DROP POLICY IF EXISTS "Anyone can view published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers and admins can manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can view content for published lessons" ON public.lesson_content;
DROP POLICY IF EXISTS "Teachers and admins can manage lesson content" ON public.lesson_content;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.lesson_registrations;
DROP POLICY IF EXISTS "Users can register for lessons" ON public.lesson_registrations;
DROP POLICY IF EXISTS "Users can update their own registrations" ON public.lesson_registrations;
DROP POLICY IF EXISTS "Teachers and admins can view all registrations" ON public.lesson_registrations;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Anyone can view images" ON public.images;
DROP POLICY IF EXISTS "Admins can manage images" ON public.images;
DROP POLICY IF EXISTS "Users can view their own jobs" ON public.content_generation_jobs;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.content_generation_jobs;
DROP POLICY IF EXISTS "Admins can create jobs" ON public.content_generation_jobs;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- AI Tools policies (public read, admin write)
CREATE POLICY "Anyone can view published AI tools"
  ON public.ai_tools FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage AI tools"
  ON public.ai_tools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lessons policies
CREATE POLICY "Anyone can view published lessons"
  ON public.lessons FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Teachers and admins can manage lessons"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Lesson content policies
CREATE POLICY "Anyone can view content for published lessons"
  ON public.lesson_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      WHERE id = lesson_content.lesson_id AND is_published = TRUE
    )
  );

CREATE POLICY "Teachers and admins can manage lesson content"
  ON public.lesson_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Lesson registrations policies
CREATE POLICY "Users can view their own registrations"
  ON public.lesson_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for lessons"
  ON public.lesson_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON public.lesson_registrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers and admins can view all registrations"
  ON public.lesson_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pages policies
CREATE POLICY "Anyone can view published pages"
  ON public.pages FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Images policies
CREATE POLICY "Anyone can view images"
  ON public.images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage images"
  ON public.images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Content generation jobs policies
CREATE POLICY "Users can view their own jobs"
  ON public.content_generation_jobs FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all jobs"
  ON public.content_generation_jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create jobs"
  ON public.content_generation_jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_ai_tools_updated_at ON public.ai_tools;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
DROP TRIGGER IF EXISTS update_lesson_content_updated_at ON public.lesson_content;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON public.ai_tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_content_updated_at BEFORE UPDATE ON public.lesson_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 2: SEED AI TOOLS DATA
-- ============================================

INSERT INTO public.ai_tools (
  slug, name, name_chinese, description, description_chinese,
  short_description, short_description_chinese, category,
  features, use_cases, pricing_info, tutorial_urls,
  website_url, is_featured, is_active, order_index
) VALUES
(
  'gamma',
  'Gamma',
  'Gamma',
  'Gamma is an AI-powered presentation tool that helps you create beautiful, engaging presentations in minutes. Simply describe what you want, and Gamma generates a professional presentation with slides, layouts, and content automatically.',
  'Gamma 是一個 AI 驅動的簡報工具，可幫助您在幾分鐘內創建精美、引人入勝的簡報。只需描述您想要的內容，Gamma 就會自動生成包含投影片、佈局和內容的專業簡報。',
  'AI-powered presentation tool that creates beautiful slides automatically',
  'AI 驅動的簡報工具，自動創建精美的投影片',
  '簡報製作',
  '["AI-generated presentations", "Multiple templates", "Export to PDF/PPT", "Real-time collaboration", "Custom branding"]'::jsonb,
  '["教學簡報製作", "課程內容展示", "學生作品展示", "培訓材料準備"]'::jsonb,
  '{"free": true, "plans": [{"name": "Free", "price": 0, "features": ["Limited presentations"]}, {"name": "Pro", "price": 10, "currency": "USD", "period": "month", "features": ["Unlimited presentations", "Custom branding"]}]}'::jsonb,
  '["https://gamma.app/docs", "https://www.youtube.com/watch?v=gamma-tutorial"]'::jsonb,
  'https://gamma.app',
  true,
  true,
  1
),
(
  'animaker',
  'Animaker',
  'Animaker',
  'Animaker is a cloud-based animation and video creation platform that allows users to create professional animated videos, presentations, and infographics without any design or animation skills. Perfect for creating engaging educational content.',
  'Animaker 是一個基於雲端的動畫和影片創作平台，讓用戶無需任何設計或動畫技能即可創建專業的動畫影片、簡報和信息圖表。非常適合創建引人入勝的教育內容。',
  'Cloud-based animation and video creation platform for educational content',
  '基於雲端的動畫和影片創作平台，用於教育內容',
  '影片製作',
  '["Drag-and-drop interface", "Thousands of templates", "Character builder", "Voice-over recording", "Multiple export formats"]'::jsonb,
  '["教學影片製作", "動畫課程內容", "學生專案展示", "宣傳影片製作"]'::jsonb,
  '{"free": true, "plans": [{"name": "Free", "price": 0, "features": ["Limited exports"]}, {"name": "Basic", "price": 10, "currency": "USD", "period": "month", "features": ["HD exports", "More templates"]}, {"name": "Starter", "price": 19, "currency": "USD", "period": "month", "features": ["Full HD", "No watermark"]}]}'::jsonb,
  '["https://www.animaker.com/help", "https://www.youtube.com/c/Animaker"]'::jsonb,
  'https://www.animaker.com',
  true,
  true,
  2
),
(
  'n8n',
  'n8n',
  'n8n',
  'n8n is a powerful workflow automation tool that allows you to connect different apps and services together. Create automated workflows to streamline your teaching tasks, manage student data, and integrate various educational tools.',
  'n8n 是一個強大的工作流程自動化工具，可讓您將不同的應用程式和服務連接在一起。創建自動化工作流程以簡化您的教學任務、管理學生數據並整合各種教育工具。',
  'Workflow automation platform to connect apps and automate tasks',
  '工作流程自動化平台，用於連接應用程式和自動化任務',
  '自動化工具',
  '["Visual workflow builder", "500+ integrations", "Self-hosted option", "Webhook support", "Custom nodes"]'::jsonb,
  '["教學流程自動化", "學生數據管理", "多平台內容同步", "通知系統設置"]'::jsonb,
  '{"free": true, "plans": [{"name": "Community", "price": 0, "features": ["Self-hosted", "Open source"]}, {"name": "Cloud", "price": 20, "currency": "USD", "period": "month", "features": ["Hosted", "Support"]}]}'::jsonb,
  '["https://docs.n8n.io", "https://www.youtube.com/c/n8n-io"]'::jsonb,
  'https://n8n.io',
  true,
  true,
  3
),
(
  'canva',
  'Canva',
  'Canva',
  'Canva is a graphic design platform that makes it easy to create professional designs for presentations, social media, posters, and more. With AI-powered features, it helps teachers create engaging visual content quickly.',
  'Canva 是一個圖形設計平台，可輕鬆為簡報、社交媒體、海報等創建專業設計。憑藉 AI 驅動的功能，它幫助教師快速創建引人入勝的視覺內容。',
  'Graphic design platform with AI features for creating visual content',
  '具有 AI 功能的圖形設計平台，用於創建視覺內容',
  '設計工具',
  '["Thousands of templates", "AI design tools", "Brand kit", "Team collaboration", "Export in multiple formats"]'::jsonb,
  '["教學材料設計", "海報和傳單製作", "社交媒體內容", "簡報美化"]'::jsonb,
  '{"free": true, "plans": [{"name": "Free", "price": 0, "features": ["Basic templates"]}, {"name": "Pro", "price": 12.99, "currency": "USD", "period": "month", "features": ["Premium templates", "Brand kit"]}]}'::jsonb,
  '["https://www.canva.com/designschool", "https://www.youtube.com/c/Canva"]'::jsonb,
  'https://www.canva.com',
  false,
  true,
  4
),
(
  'notion',
  'Notion',
  'Notion',
  'Notion is an all-in-one workspace that combines notes, docs, wikis, and databases. Perfect for organizing course materials, creating student wikis, and managing educational projects.',
  'Notion 是一個一體化工作空間，結合了筆記、文檔、維基和數據庫。非常適合組織課程材料、創建學生維基和管理教育項目。',
  'All-in-one workspace for notes, docs, and project management',
  '一體化工作空間，用於筆記、文檔和項目管理',
  '生產力工具',
  '["Unified workspace", "Database and views", "Templates gallery", "Team collaboration", "API access"]'::jsonb,
  '["課程材料組織", "學生專案管理", "協作筆記", "知識庫建立"]'::jsonb,
  '{"free": true, "plans": [{"name": "Free", "price": 0, "features": ["Personal use"]}, {"name": "Plus", "price": 8, "currency": "USD", "period": "month", "features": ["Team collaboration"]}]}'::jsonb,
  '["https://www.notion.so/help", "https://www.youtube.com/c/Notion"]'::jsonb,
  'https://www.notion.so',
  false,
  true,
  5
),
(
  'chatgpt',
  'ChatGPT',
  'ChatGPT',
  'ChatGPT is an AI-powered conversational assistant that can help with lesson planning, content creation, answering student questions, and providing personalized learning support.',
  'ChatGPT 是一個 AI 驅動的對話助手，可以幫助進行課程規劃、內容創建、回答學生問題和提供個性化學習支持。',
  'AI conversational assistant for education and content creation',
  '用於教育和內容創建的 AI 對話助手',
  'AI 助手',
  '["Natural language conversations", "Content generation", "Code assistance", "Multi-language support", "Custom instructions"]'::jsonb,
  '["課程內容生成", "作業輔導", "語言學習", "創意寫作"]'::jsonb,
  '{"free": true, "plans": [{"name": "Free", "price": 0, "features": ["GPT-3.5 access"]}, {"name": "Plus", "price": 20, "currency": "USD", "period": "month", "features": ["GPT-4 access", "Priority support"]}]}'::jsonb,
  '["https://help.openai.com", "https://www.youtube.com/c/OpenAI"]'::jsonb,
  'https://chat.openai.com',
  true,
  true,
  6
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You should now see 6 AI tools in your database
-- Refresh your website to see them displayed

