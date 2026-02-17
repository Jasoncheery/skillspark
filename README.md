# SkillSpark - Educational Platform

Complete redesign of SkillSpark with modern tech stack, cute animated UI, and AI-powered features for teachers, students, and administrators.

## Architecture

```
┌─────────────────────────┐
│   Next.js Frontend      │
│   (Hostinger Web Host)  │
│   Port 80/443           │
└───────────┬─────────────┘
            │ HTTPS/REST API
            │
┌───────────▼─────────────┐
│   Strapi Backend        │
│   (VPS Docker)          │
│   Port 1337             │
└───────────┬─────────────┘
            │ PostgreSQL
            │
┌───────────▼─────────────┐
│   PostgreSQL            │
│   (VPS Native)          │
│   Port 5432             │
│   DB: new_project_db    │
└─────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Remotion + Framer Motion
- **State**: Zustand
- **Deployment**: Hostinger Web Hosting

### Backend
- **Framework**: Strapi 5.x
- **Deployment**: Docker on Hostinger VPS
- **Database**: PostgreSQL (new_project_db)
- **API**: REST + GraphQL

### AI/LLM
- Qwen API (primary)
- OpenAI, Claude, Gemini (multi-LLM support)
- Document embeddings for semantic search

## Features by Role

### Teachers
- AI chat interface
- Generate educational artifacts (worksheets, presentations)
- Generate exam papers
- Manage classes and students
- View student submissions

### Students
- AI chat for learning assistance
- Upload homework
- Self-checking with AI feedback
- View grades and progress

### Admins
- Custom prompt management
- User management
- LLM configuration
- Page/content management
- System analytics

### Universal (All Roles)
- Document upload and management
- Automatic embedding generation
- Semantic search across documents

## Project Structure

```
skillspark-new/
├── frontend/          # Next.js application
├── backend/           # Strapi CMS
├── docs/              # Documentation
└── .cursor/rules/     # Claude Skills reference
```

## Development

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run develop
```

## Deployment

### Backend (Docker)
```bash
cd backend
docker build -t skillspark-backend .
docker run -p 1337:1337 skillspark-backend
```

### Frontend (Hostinger Web Hosting)
```bash
cd frontend
npm run build
# Upload .next/standalone to Hostinger
```

## Environment Variables

See `.env.example` in each directory for required environment variables.

## Database

- **Host**: 72.62.67.205:5432
- **Database**: new_project_db
- **User**: new_project_user

## License

Proprietary - All rights reserved
