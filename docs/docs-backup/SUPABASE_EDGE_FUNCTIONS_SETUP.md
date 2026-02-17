# Supabase Edge Functions Setup (Recommended)

This replaces the FastAPI backend with Supabase Edge Functions, eliminating the need for a separate backend deployment.

## Benefits

- ✅ No separate backend server needed
- ✅ No VPS management
- ✅ No `VITE_API_URL` environment variable needed
- ✅ Automatic scaling
- ✅ Free tier available
- ✅ Everything in Supabase

## Setup Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref togpvwfxmydgitkwqdgd
```

### 4. Set Edge Function Secret

Set the AliCloud API key as a secret:

```bash
supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

### 5. Deploy Edge Function

```bash
supabase functions deploy generate-content
```

### 6. Update Frontend Code

The Edge Function will be available at:
```
https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content
```

Update `src/services/aiService.ts` to use Supabase Edge Functions instead of FastAPI.

## Testing

After deployment, test the function:

```bash
curl -X POST https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt", "job_type": "blog_post"}'
```

## Environment Variables for Hostinger

With Edge Functions, you only need:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**No `VITE_API_URL` needed!**

