# SkillSpark Setup Guide

## Local Development Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y

# FastAPI Backend (for local development)
VITE_API_URL=http://localhost:8000

# AliCloud DashScope API Configuration
VITE_ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

## Backend Environment Variables

Create a `backend/.env` file with:

```env
# AliCloud DashScope API Configuration
ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

## Database Setup

1. Go to your Supabase project: https://togpvwfxmydgitkwqdgd.supabase.co
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Verify tables are created in the Table Editor

## Hostinger Production Environment Variables

When deploying to Hostinger, set these environment variables in your hosting control panel:

### Required Variables (Frontend)

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
VITE_ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

### Backend API URL (if using separate backend)

If you're running the FastAPI backend separately, set:
```
VITE_API_URL=https://your-backend-domain.com
```

If the backend is on the same domain, use:
```
VITE_API_URL=https://your-domain.com/api
```

### Important Notes for Hostinger

1. **VITE_ prefix**: All frontend environment variables MUST start with `VITE_` for Vite to expose them to the client
2. **Build-time variables**: These are embedded at build time, so rebuild after changing them
3. **Backend deployment**: If deploying FastAPI backend separately, you'll need:
   - Python hosting or Docker container
   - Set `ALICLOUD_API_KEY` in backend environment

## Supabase Service Role Key (Backend Only)

For server-side operations, you can use the service role key (keep this secret!):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ CRITICAL SECURITY WARNING**: 
- **NEVER** commit the service role key to version control
- **NEVER** expose it in frontend code
- Only use it in backend/server-side code or environment variables
- Get your service role key from: Supabase Dashboard → Settings → API → `service_role` key
- If exposed, immediately rotate it in Supabase Dashboard

## Verification Steps

1. ✅ Check `.env` file exists in root directory
2. ✅ Check `backend/.env` file exists
3. ✅ Run database migration in Supabase
4. ✅ Test local development: `npm run dev`
5. ✅ Test backend: `cd backend && uvicorn main:app --reload`
6. ✅ Set environment variables in Hostinger
7. ✅ Rebuild and deploy to Hostinger

