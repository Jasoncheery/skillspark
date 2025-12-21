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
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_images_category ON public.images(category);
CREATE INDEX IF NOT EXISTS idx_content_jobs_status ON public.content_generation_jobs(status);

-- Row Level Security (RLS) Policies

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

