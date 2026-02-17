# SkillSpark - AI Tools Informative Website

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/skillspark/deploys)

## 🎯 Project Overview

SkillSpark (技撚星火) is an informative website showcasing AI tools and providing educational resources for educators. The platform introduces various AI tools (Gamma, Animaker, in-house meeting minutes tool, and more), offers offline workshops and online courses, and features AI-powered content generation for SEO and blog posts.

## 🚀 Live Demo

- **Frontend**: [https://skillspark.netlify.app](https://skillspark.netlify.app) (Coming Soon)
- **API Documentation**: [https://api.skillspark.com/docs](https://api.skillspark.com/docs) (Coming Soon)

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling (blue/yellow theme matching SkillSpark logo)
- **React Query (TanStack Query)** for server state
- **Zustand** for client state management
- **React Router v6** for navigation
- **Vite** for build tooling

### Backend
- **Supabase** for database, authentication, and storage
- **FastAPI** for AI operations and content generation
- **AliCloud API** for text and image generation

### AI Services
- **AliCloud Qwen** for text generation (blog posts, tool descriptions, SEO content)
- **AliCloud Wanx** for image generation

## 📋 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your AliCloud credentials

# Run FastAPI server
uvicorn main:app --reload
```

### Environment Variables

See [SETUP.md](./SETUP.md) for detailed environment variable configuration.

Quick setup:
1. Copy `.env.example` to `.env` and fill in your credentials
2. Or see `SETUP.md` for pre-configured values

### Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

Quick setup:
1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Verify tables are created

### Production Deployment

See [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md) for Hostinger deployment instructions.

## 📖 Documentation

### Quick Start
- [Setup Guide](./SETUP.md) - Environment setup and configuration
- [Implementation Status](./docs/IMPLEMENTATION_STATUS.md) - Current feature status

### Core Documentation
- [Project Summary](./docs/PROJECT_SUMMARY.md) - Project overview
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) - Technical architecture
- [Action Items](./docs/ACTION_ITEMS.md) - Feature completion tracker
- [Development Roadmap](./docs/ROADMAP.md) - Future development plans

### Setup Guides
- [Authentication Setup](./AUTHENTICATION_IMPLEMENTATION.md) - Auth implementation details
- [Storage Setup](./docs/STORAGE_SETUP.md) - Image library storage configuration
- [Database Setup](./DATABASE_SETUP.md) - Database schema and migrations

## 🎯 Key Features

### For Visitors
- 🔍 **AI Tools Showcase**: Browse and learn about various AI tools (Gamma, Animaker, meeting minutes tool, etc.)
- 📚 **Lessons**: Access online courses and register for offline workshops
- 📝 **AI Guides**: Read blog posts and guides about AI applications
- 🎨 **Modern UI**: Clean, responsive design matching dotai.hk structure

### For Students
- 📖 **Course Registration**: Register for online and offline lessons
- 📊 **Progress Tracking**: Track learning progress for online courses
- 🎥 **Video Lessons**: Watch online course content

### For Teachers
- 📝 **Lesson Management**: Create and manage online/offline lessons
- 👥 **Student Management**: View registrations and student progress
- 📊 **Analytics**: Monitor lesson engagement

### For Admins
- 👥 **User Management**: Manage users, roles, and permissions
- 🤖 **AI Tools Management**: Add, edit, and manage AI tool listings
- 📝 **Content Management**: Manage blog posts, pages, and images
- 🎨 **AI Content Generation**: Generate blog posts, tool descriptions, and images using AI
- 📚 **Lesson Management**: Full control over courses and registrations

## 🎨 Design System

The website uses a blue and yellow color scheme matching the SkillSpark logo (技撚星火). Design system configuration is available in `src/config/designSystem.json`, and site structure is defined in `src/config/siteStructure.json`.

## 📁 Project Structure

```
skillspark/
├── src/
│   ├── components/
│   │   ├── ai-tools/          # AI tool showcase components
│   │   ├── lessons/            # Lesson components
│   │   ├── admin/              # Admin panel components
│   │   ├── blog/               # Blog components
│   │   ├── layout/             # Navigation, header, footer
│   │   └── ui/                 # Reusable UI components
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── AIToolsPage.tsx     # AI tools listing
│   │   ├── AIToolDetailPage.tsx # Individual tool page
│   │   ├── LessonsPage.tsx     # Lessons listing
│   │   ├── LessonDetailPage.tsx # Lesson detail/player
│   │   ├── BlogPage.tsx        # Blog listing
│   │   ├── BlogPostPage.tsx    # Individual blog post
│   │   └── dashboard/          # Admin/Teacher/Student dashboards
│   ├── services/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── api.ts              # FastAPI client
│   │   ├── aiService.ts        # AliCloud AI integration
│   │   └── contentService.ts   # Content generation
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   └── config/
│       ├── designSystem.json   # Design system config
│       └── siteStructure.json  # Site structure/sitemap
├── backend/                    # FastAPI backend
│   ├── main.py
│   ├── services/
│   │   └── alicloud.py         # AliCloud integration
│   └── requirements.txt
└── supabase/
    └── migrations/             # Database migrations
```

## 🔐 Authentication

The application uses Supabase Auth for authentication. User roles include:
- **admin**: Full access to all features
- **teacher**: Can create and manage lessons
- **student**: Can register for lessons and view content
- **guest**: Can browse public content

## 🤖 AI Content Generation

The platform includes AI-powered content generation using AliCloud API:
- **Blog Posts**: Generate SEO-optimized blog posts
- **Tool Descriptions**: Auto-generate AI tool descriptions
- **Images**: Generate images for blog posts and tool listings
- **SEO Content**: Generate meta titles, descriptions, and keywords

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Contact

For business inquiries and support, please contact the development team.
