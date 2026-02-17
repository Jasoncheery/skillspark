# Deploy Supabase Edge Function - Ready to Deploy! 🚀

## ✅ Setup Status

The Edge Function code is **already created** at:
```
supabase/functions/generate-content/index.ts
```

You just need to **deploy it**!

## Step-by-Step Deployment

### Step 1: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 2: Link Your Project

```bash
supabase link --project-ref togpvwfxmydgitkwqdgd
```

### Step 3: Set the Secret (AliCloud API Key)

```bash
supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

### Step 4: Deploy the Function

```bash
supabase functions deploy generate-content --project-ref togpvwfxmydgitkwqdgd
```

## ✅ After Deployment

The function will be available at:
```
https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content
```

## Test the Function

### Test Text Generation

```bash
curl -L -X POST 'https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y' \
  -H 'Content-Type: application/json' \
  --data '{"prompt": "寫一篇關於 AI 工具的介紹", "job_type": "blog_post", "max_length": 200}'
```

### Test Image Generation

```bash
curl -L -X POST 'https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-image' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y' \
  -H 'Content-Type: application/json' \
  --data '{"prompt": "現代簡潔的 AI 工具介面", "width": 1024, "height": 1024}'
```

## Verify Deployment

After deploying, you can verify it's working:

```bash
# List all functions
supabase functions list --project-ref togpvwfxmydgitkwqdgd

# View logs
supabase functions logs generate-content --project-ref togpvwfxmydgitkwqdgd
```

## What's Already Done ✅

1. ✅ Function code created at `supabase/functions/generate-content/index.ts`
2. ✅ Function handles text generation
3. ✅ Function handles image generation
4. ✅ Frontend code updated to use Edge Functions automatically

## What You Need to Do

Just run the 4 commands above to deploy!

