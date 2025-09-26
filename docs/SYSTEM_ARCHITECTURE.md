# Skillspark - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express       │    │ • Vimeo API     │
│ • TypeScript    │    │ • Supabase      │    │ • OpenAI/       │
│ • TailwindCSS   │    │ • JWT Auth      │    │   DeepSeek      │
│ • React Query   │    │ • File Upload   │    │ • D-ID Avatar   │
│ • Zustand       │    │ • WebSockets    │    │ • Luma AI       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Frontend Architecture

### Component Hierarchy
```
App
├── Router
├── AuthProvider (Zustand + React Query)
├── Layout
│   ├── Navigation
│   │   ├── Sidebar
│   │   └── TopBar
│   └── MainContent
│       ├── Dashboard
│       ├── CoursePlayer
│       ├── CourseManager
│       ├── AIHub
│       └── Analytics
└── Modals & Overlays
```

### State Management Strategy
```typescript
// Zustand Stores
interface AuthStore {
  user: User | null
  organization: Organization | null
  login: (credentials) => Promise<void>
  logout: () => void
}

interface UIStore {
  sidebarOpen: boolean
  currentTheme: 'light' | 'dark'
  notifications: Notification[]
}

// React Query Keys
const queryKeys = {
  courses: ['courses'],
  lessons: (courseId: string) => ['lessons', courseId],
  progress: (userId: string) => ['progress', userId],
  analytics: (orgId: string) => ['analytics', orgId]
}
```

### Page Structure
```
src/pages/
├── auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ResetPasswordPage.tsx
├── dashboard/
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── courses/
│   ├── CourseListPage.tsx
│   ├── CoursePlayerPage.tsx
│   ├── CourseEditPage.tsx
│   └── LessonEditPage.tsx
├── ai-hub/
│   ├── AvatarStudioPage.tsx
│   ├── VideoGeneratorPage.tsx
│   └── ContentAnalyzerPage.tsx
└── analytics/
    ├── ProgressAnalyticsPage.tsx
    ├── EngagementAnalyticsPage.tsx
    └── SkillProfilingPage.tsx
```

## 🗄️ Database Schema (Supabase)

### Core Tables
```sql
-- Organizations (Multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  domain VARCHAR UNIQUE,
  settings JSONB DEFAULT '{}',
  plan VARCHAR DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  role VARCHAR CHECK (role IN ('admin', 'teacher', 'student')),
  organization_id UUID REFERENCES organizations(id),
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  curriculum JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR NOT NULL,
  type VARCHAR CHECK (type IN ('video', 'text', 'quiz', 'assignment')),
  content JSONB DEFAULT '{}',
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analytics
CREATE TABLE ai_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR NOT NULL,
  event_data JSONB DEFAULT '{}',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Example RLS Policy
CREATE POLICY "Users can only see their organization's data"
ON users FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM users WHERE id = auth.uid()
));
```

## 🔌 API Architecture

### RESTful Endpoints
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   ├── POST /refresh
│   └── POST /logout
├── organizations/
│   ├── GET /
│   ├── POST /
│   └── PUT /:id
├── courses/
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   └── PUT /:id
├── lessons/
│   ├── GET /course/:courseId
│   ├── POST /
│   └── PUT /:id
├── progress/
│   ├── GET /user/:userId
│   ├── POST /update
│   └── GET /analytics
└── ai/
    ├── POST /avatar/create
    ├── POST /video/generate
    └── POST /analyze/content
```

### WebSocket Events
```typescript
// Real-time features
interface WebSocketEvents {
  'lesson:progress': { lessonId: string, progress: number }
  'course:enrollment': { courseId: string, userId: string }
  'ai:job:status': { jobId: string, status: string, result?: any }
}
```

## 🤖 AI Services Integration

### Service Architecture
```typescript
// AI Service Layer
class AIService {
  // Avatar Generation (D-ID)
  async createAvatar(script: string, voiceId: string): Promise<AvatarJob>
  
  // Video Generation (Luma)
  async generateVideo(prompt: string): Promise<VideoJob>
  
  // Speech Services (OpenAI Whisper)
  async speechToText(audioFile: File): Promise<string>
  async textToSpeech(text: string): Promise<AudioFile>
  
  // Content Analysis (OpenAI/DeepSeek)
  async analyzeProgress(progressData: ProgressData[]): Promise<SkillProfile>
}
```

### AI Analytics Pipeline
```
Learning Events → Data Collection → AI Analysis → Skill Profiling → Recommendations
     ↓                 ↓               ↓              ↓               ↓
Video Views      Progress Tracking  Pattern Rec.   Skill Mapping   Learning Paths
Quiz Results     Engagement Metrics AI Insights    Career Advice   Content Suggestions
Assignment Scores Time Analytics    Predictions    Certifications  Improvement Areas
```

## 🚀 Deployment Architecture

### Frontend (Netlify)
```yaml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend (Future - Vercel/Railway)
```yaml
# Environment Variables
NODE_ENV=production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
OPENAI_API_KEY=xxx
DEEPSEEK_API_KEY=xxx
DID_API_KEY=xxx
VIMEO_CLIENT_ID=xxx
```

## 🔒 Security Architecture

### Authentication Flow
```
1. User Login → JWT Token Generation
2. Token Storage → Secure HTTP-only cookies
3. API Requests → Bearer token validation
4. Row Level Security → Supabase RLS policies
5. Route Protection → React Router guards
```

### Data Privacy
- **GDPR Compliance**: User data export/deletion
- **SOC 2 Type II**: Audit-ready security controls
- **Encryption**: At-rest and in-transit
- **Access Control**: Role-based permissions
