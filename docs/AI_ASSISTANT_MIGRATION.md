---
name: AI Assistant Migration (Minimal Dependencies)
overview: "Migrate AI Assistant from nexusspark-ai to skillspark with minimal new dependencies. Use existing packages (lucide-react, react-markdown, zustand) where possible. Add only essential packages: framer-motion for animations, clsx/tailwind-merge for utilities. LLM: AliCloud Qwen (qwen-plus model) via FastAPI backend."
todos:
  - id: agent1-backend
    content: Agent 1 - Create FastAPI streaming chat endpoint using existing AliCloud Qwen service. Add /api/ai/chat endpoint with SSE streaming. Test with npm run dev.
    status: completed
  - id: agent2-core-component
    content: Agent 2 - Migrate core AIAssistant component, adapt to use existing skillspark components (no shadcn). Use existing lucide-react, react-markdown. Create useAIChat hook for FastAPI.
    status: completed
    dependencies:
      - agent1-backend
  - id: agent3-features
    content: "Agent 3 - Add LibreChat features: artifacts (using react-markdown), conversation history (Supabase), file uploads (Supabase storage). Use existing packages only."
    status: pending
    dependencies:
      - agent2-core-component
  - id: agent4-theme-routing
    content: Agent 4 - Apply nexusspark theme to Tailwind config, add framer-motion animations, add /dashboard/ai-assistant route, integrate with student dashboard. Run npm run dev to verify.
    status: completed
    dependencies:
      - agent2-core-component
---

# AI Assistant Migration Plan (Minimal Dependencies)

## Overview

Migrate the AI Assistant functionality from nexusspark-ai to skillspark with **minimal new dependencies**. Use existing skillspark packages where possible. Designed for 4 agents to work in parallel.

## Current LLM Configuration

### Text Generation
**LLM in use: AliCloud Qwen (qwen-plus model)**
- Provider: AliCloud DashScope API
- Model: `qwen-plus` (balanced performance/quality)
- Location: `backend/services/alicloud.py`
- Alternative models available: 
  - `qwen-turbo` - Faster, cost-effective
  - `qwen-max` - Best quality, slower and more expensive

### Image Generation
**Model in use: AliCloud Wanx (wanx-v1 model)**
- Provider: AliCloud DashScope API
- Model: `wanx-v1` (Tongyi Wanxiang / 通义万相)
- Location: `backend/services/alicloud.py` - `generate_image()` method
- **Note**: Qwen VL models are for image understanding/analysis, NOT generation. Use Wanx for image generation.

### Image Understanding (If Needed)
**Available: Qwen VL models** (for analyzing/understanding images in chat)
- `qwen-vl-plus` - Vision-language model for image analysis
- `qwen-vl-max` - Most capable vision model
- **Use case**: When AI Assistant needs to understand/analyze uploaded images
- **NOT for**: Image generation (use Wanx instead)

## Development Setup

**Always run `npm run dev` after making changes to verify the application works correctly.**

## Architecture Changes (Minimal Dependencies)

### Agent 1: Backend (FastAPI Chat Endpoint)

- **Create streaming chat endpoint**: Add `/api/ai/chat` endpoint using existing `AliCloudService`
- **Use existing AliCloud Qwen**: Leverage `backend/services/alicloud.py` - extend for chat completion
- **SSE streaming**: Implement Server-Sent Events for real-time responses
- **Files to modify/create**:
- `backend/main.py` - Add `/api/ai/chat` endpoint
- `backend/services/alicloud.py` - Add `chat_completion()` method with streaming
- **Dependencies**: None (use existing httpx, FastAPI)
- **Test**: Run FastAPI server and test streaming endpoint

### Agent 2: Core Component Migration (Use Existing Packages)

- **Migrate AIAssistant component**: Copy from nexusspark-ai and adapt to use **existing skillspark components only**
- **Use existing packages**:
- `lucide-react` (already in skillspark) - for icons
- `react-markdown` (already in skillspark) - for message rendering
- `zustand` (already in skillspark) - for state management
- `@tanstack/react-query` (already in skillspark) - for data fetching
- **Create chat hook**: `src/hooks/useAIChat.ts` - adapt for FastAPI streaming
- **Replace shadcn components**: Use skillspark's existing UI components or create simple alternatives
- **Files to create**:
- `src/pages/AIAssistantPage.tsx` - Main component (adapted, no shadcn dependencies)
- `src/hooks/useAIChat.ts` - Chat hook for FastAPI
- **Dependencies to add**: None (use existing packages)
- **Test**: Run `npm run dev` and verify component renders

### Agent 3: LibreChat Features (Minimal Dependencies)

- **Artifacts**: Use existing `react-markdown` and `react-syntax-highlighter` (already in skillspark) for code rendering
- **Conversation History**: Store in Supabase using existing `@supabase/supabase-js`
- **File Uploads**: Use Supabase Storage (already configured)
- **Files to create**:
- `src/components/ai-assistant/ArtifactRenderer.tsx` - Use react-markdown
- `src/components/ai-assistant/FileUpload.tsx` - Use Supabase storage
- `src/services/conversationService.ts` - Use existing Supabase client
- **Dependencies to add**: None (use existing packages)
- **Database**: May need `conversations` and `messages` tables (use existing Supabase setup)

### Agent 4: Theme & Routing (Minimal Dependencies)

- **Add framer-motion**: Only animation library to add (essential for nexusspark feel)
- **Add utility packages**: `clsx` and `tailwind-merge` (small, essential for class management)
- **Update Tailwind config**: Merge nexusspark theme with skillspark's blue/yellow
- **Add routing**: `/ai-assistant` route with ProtectedRoute
- **Update navigation**: Add link to student dashboard
- **Files to modify**:
- `package.json` - Add only: `framer-motion`, `clsx`, `tailwind-merge`
- `tailwind.config.ts` - Merge theme configurations
- `src/routes/AppRoutes.tsx` - Add route
- `src/pages/dashboard/StudentDashboard.tsx` - Add navigation link
- **Dependencies to add**: Only 3 packages (framer-motion, clsx, tailwind-merge)
- **Test**: Run `npm run dev` and verify theme and routing work

## Agent Work Distribution

### Agent 1: Backend (Independent)

- Works on FastAPI chat endpoint
- No dependencies on other agents
- Can start immediately

### Agent 2: Core Component (Depends on Agent 1)

- Waits for backend endpoint
- Migrates AIAssistant component
- Uses existing skillspark packages only

### Agent 3: Features (Depends on Agent 2)

- Adds artifacts, history, file uploads
- Uses existing packages (react-markdown, Supabase)

### Agent 4: Theme & Routing (Depends on Agent 2)

- Adds minimal dependencies (framer-motion, clsx, tailwind-merge)
- Applies theme and routing
- Can work in parallel with Agent 3

## Minimal Dependencies Strategy

### Existing Packages to Reuse

- ✅ `lucide-react` - Icons (already in skillspark)
- ✅ `react-markdown` - Message rendering (already in skillspark)
- ✅ `react-syntax-highlighter` - Code highlighting (already in skillspark)
- ✅ `zustand` - State management (already in skillspark)
- ✅ `@tanstack/react-query` - Data fetching (already in skillspark)
- ✅ `@supabase/supabase-js` - Database & storage (already in skillspark)
- ✅ `react-router-dom` - Routing (already in skillspark)

### New Dependencies (Minimal - Only 3 packages)

- `framer-motion` - Essential animations for nexusspark feel
- `clsx` - Class name utility (small, essential)
- `tailwind-merge` - Tailwind class merging (small, essential)

### NOT Adding

- ❌ shadcn/ui components (too many dependencies, use existing components)
- ❌ @radix-ui/* packages (avoid unless absolutely necessary)
- ❌ Additional UI libraries

## Implementation Checklist

### Agent 1: Backend

- [ ] Extend `AliCloudService` with chat completion method
- [ ] Add streaming support (SSE)
- [ ] Create `/api/ai/chat` endpoint in FastAPI
- [ ] Test with curl/Postman
- [ ] Document endpoint in code

### Agent 2: Core Component

- [ ] Copy AIAssistant.tsx from nexusspark-ai
- [ ] Remove all shadcn imports
- [ ] Replace with skillspark components or simple alternatives
- [ ] Create useAIChat hook for FastAPI
- [ ] Test with `npm run dev`

### Agent 3: Features

- [ ] Create ArtifactRenderer using react-markdown
- [ ] Implement conversation history service (Supabase)
- [ ] Add file upload component (Supabase Storage)
- [ ] Test all features

### Agent 4: Theme & Routing

- [ ] Install: `framer-motion`, `clsx`, `tailwind-merge`
- [ ] Update Tailwind config with nexusspark theme
- [ ] Add `/ai-assistant` route
- [ ] Update student dashboard navigation
- [ ] Test with `npm run dev`

## Database Schema (If Needed)

```sql
-- conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Important Notes

1. **Text LLM**: Using **AliCloud Qwen (qwen-plus)** via FastAPI backend
2. **Image Generation**: Using **AliCloud Wanx (wanx-v1)** - already implemented in `backend/services/alicloud.py`
3. **Image Understanding**: If needed, use **Qwen VL models** (qwen-vl-plus/max) for analyzing uploaded images in chat
4. **Always test**: Run `npm run dev` after each change
5. **Minimal dependencies**: Only add 3 packages (framer-motion, clsx, tailwind-merge)
6. **Use existing packages**: Leverage skillspark's existing dependencies
7. **Component replacement**: Replace shadcn components with existing skillspark components or simple alternatives
8. **Theme**: Maintain skillspark's blue/yellow brand while adding nexusspark's vibrancy
9. **4 agents**: Work can be parallelized as shown in dependencies

## Alibaba Model Summary

| Model | Use Case | Current Status |
|-------|----------|----------------|
| **qwen-plus** | Text generation (chat) | ✅ In use |
| **wanx-v1** | Image generation | ✅ Already implemented |
| **qwen-vl-plus/max** | Image understanding/analysis | ⚠️ Available if needed for file uploads |

## Testing Commands

```bash
# Frontend
npm run dev

# Backend (separate terminal)
cd backend
uvicorn main:app --reload
```