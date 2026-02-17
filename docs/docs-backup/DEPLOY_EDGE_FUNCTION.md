# Deploy Supabase Edge Function - Step by Step

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Logged in to Supabase: `supabase login`

## Quick Deploy Script

I've created a script to automate the deployment. Run:

```bash
./deploy_edge_function.sh
```

## Manual Steps

If you prefer to do it manually:

### Step 1: Login to Supabase (if not already)

```bash
supabase login
```

This will open a browser for authentication.

### Step 2: Link Your Project

```bash
supabase link --project-ref togpvwfxmydgitkwqdgd
```

### Step 3: Set the AliCloud API Key Secret

```bash
supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

### Step 4: Deploy the Edge Function

```bash
supabase functions deploy generate-content
```

## Verify Deployment

After deployment, the function will be available at:

```
https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content
```

### Test Text Generation

```bash
curl -X POST \
  https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "寫一篇關於 AI 工具的介紹",
    "job_type": "blog_post",
    "max_length": 500
  }'
```

### Test Image Generation

```bash
curl -X POST \
  https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-image \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "現代簡潔的 AI 工具介面",
    "width": 1024,
    "height": 1024
  }'
```

Replace `YOUR_ANON_KEY` with:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
```

## Update Frontend

The frontend code is already updated to use Edge Functions automatically when `VITE_API_URL` is not set.

## Environment Variables for Hostinger

After deployment, you only need these in Hostinger:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
```

**No `VITE_API_URL` needed!**

## Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in: `supabase login`
- Check your Supabase account has access to the project

### "Function not found" Error
- Make sure the function is deployed: `supabase functions list`
- Check the function name matches: `generate-content`

### "Secret not found" Error
- Verify secret is set: `supabase secrets list`
- Set it again: `supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533`

### API Calls Failing
- Check function logs: `supabase functions logs generate-content`
- Verify the secret is set correctly
- Check AliCloud API key is valid

