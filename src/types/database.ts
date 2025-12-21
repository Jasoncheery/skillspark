export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  name_chinese: string | null;
  description: string | null;
  description_chinese: string | null;
  short_description: string | null;
  short_description_chinese: string | null;
  category: string | null;
  icon_url: string | null;
  cover_image_url: string | null;
  features: string[];
  use_cases: string[];
  pricing_info: {
    free: boolean;
    paid: boolean;
    price?: string;
    currency?: string;
    pricing_model?: string;
  } | null;
  tutorial_urls: string[];
  screenshots: string[];
  demo_video_url: string | null;
  comparison_data: Record<string, any> | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type LessonType = 'online' | 'offline' | 'hybrid';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  description: string | null;
  description_chinese: string | null;
  lesson_type: LessonType;
  cover_image_url: string | null;
  instructor_id: string | null;
  duration_minutes: number | null;
  difficulty_level: DifficultyLevel | null;
  price: number | null;
  currency: string;
  max_participants: number | null;
  registration_deadline: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  location_chinese: string | null;
  is_published: boolean;
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type ContentType = 'video' | 'text' | 'quiz' | 'material' | 'assignment';

export interface LessonContent {
  id: string;
  lesson_id: string;
  content_type: ContentType;
  title: string;
  content: string | null;
  video_url: string | null;
  video_provider: string | null;
  material_urls: string[];
  order_index: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = 'registered' | 'attended' | 'completed' | 'cancelled';

export interface LessonRegistration {
  id: string;
  lesson_id: string;
  user_id: string;
  status: RegistrationStatus;
  progress_percentage: number;
  registered_at: string;
  completed_at: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  excerpt: string | null;
  excerpt_chinese: string | null;
  content: string;
  content_chinese: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type PageType = 'static' | 'landing' | 'custom';

export interface Page {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  content: string | null;
  content_chinese: string | null;
  page_type: PageType;
  template_data: Record<string, any> | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Image {
  id: string;
  filename: string;
  original_filename: string;
  storage_path: string;
  url: string;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  alt_text_chinese: string | null;
  category: string | null;
  tags: string[];
  uploaded_by: string | null;
  created_at: string;
}

export type JobType = 'blog_post' | 'tool_description' | 'image' | 'seo_content';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ContentGenerationJob {
  id: string;
  job_type: JobType;
  target_type: string | null;
  target_id: string | null;
  prompt: string;
  status: JobStatus;
  result_data: Record<string, any> | null;
  error_message: string | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
}

