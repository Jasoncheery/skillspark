# SkillSpark - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • FastAPI       │    │ • Supabase      │
│ • TypeScript    │    │ • AliCloud API  │    │ • AliCloud      │
│ • TailwindCSS   │    │ • Content Gen   │    │   (Qwen/Wanx)   │
│ • React Query   │    │                 │    │                 │
│ • Zustand       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│                 │
│ • PostgreSQL    │
│ • Auth          │
│ • Storage       │
│ • RLS Policies │
└─────────────────┘
```

## 📱 Frontend Architecture

### Component Hierarchy
```
App
├── Router
├── AuthProvider (Zustand + Supabase)
├── Layout
│   ├── Header (Navigation)
│   ├── MainContent
│   │   ├── HomePage
│   │   ├── AIToolsPage
│   │   ├── AIToolDetailPage
│   │   ├── LessonsPage
│   │   ├── LessonDetailPage
│   │   ├── BlogPage
│   │   ├── BlogPostPage
│   │   └── AdminDashboard
│   └── Footer
└── Modals & Overlays
```

### State Management Strategy
```typescript
// Zustand Stores
interface AuthStore {
  user: User | null
  profile: UserProfile | null
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

// React Query Keys
const queryKeys = {
  aiTools: ['ai-tools'],
  lessons: ['lessons'],
  blogPosts: ['blog-posts'],
  // ...
}
```

## 🗄️ Database Schema

### Core Tables
- `user_profiles`: User information and roles
- `ai_tools`: AI tool listings and details
- `lessons`: Online/offline lessons
- `lesson_content`: Lesson materials and videos
- `lesson_registrations`: Student enrollments
- `blog_posts`: Blog articles
- `pages`: Custom pages
- `images`: Image library
- `content_generation_jobs`: AI generation queue

### Row Level Security (RLS)
- Public read access for published content
- Admin write access for all resources
- User-specific access for registrations
- Teacher access for lesson management

## 🔄 Data Flow

### AI Content Generation Flow
```
Admin → Frontend → FastAPI → AliCloud API
                ↓
         Supabase (Job Queue)
                ↓
         Update Content
```

### Lesson Registration Flow
```
Student → Frontend → Supabase
                ↓
         Create Registration
                ↓
         Update Progress
```

## 🔐 Authentication Flow

```
User Login → Supabase Auth → JWT Token
                    ↓
         Fetch User Profile
                    ↓
         Set Auth State (Zustand)
                    ↓
         Route Protection
```

## 🚀 Deployment Architecture

### Frontend
- **Hosting**: Netlify/Vercel
- **Build**: Vite production build
- **CDN**: Automatic via hosting platform

### Backend
- **Hosting**: Railway/Render/Heroku
- **Runtime**: Python 3.11+
- **Process**: Uvicorn ASGI server

### Database
- **Hosting**: Supabase (managed PostgreSQL)
- **Backup**: Automatic daily backups
- **Scaling**: Managed by Supabase

## 🔧 Technology Decisions

### Why React + TypeScript?
- Type safety for large codebase
- Excellent developer experience
- Strong ecosystem and community

### Why Supabase?
- Managed PostgreSQL with RLS
- Built-in authentication
- Real-time capabilities
- File storage

### Why FastAPI?
- High performance async framework
- Automatic API documentation
- Type validation with Pydantic
- Easy integration with AI services

### Why AliCloud?
- Cost-effective AI services
- Good support for Chinese content
- Reliable text and image generation
