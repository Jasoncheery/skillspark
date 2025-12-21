# Quick Deploy Guide - Supabase Edge Function

## Step 1: Login to Supabase

```bash
supabase login
```

This will open your browser. Log in with your Supabase account.

## Step 2: Run the Deploy Script

```bash
./deploy_edge_function.sh
```

The script will:
1. ✅ Check if you're logged in
2. ✅ Set the AliCloud API key secret
3. ✅ Deploy the Edge Function

## Step 3: Verify Deployment

After deployment, test it:

```bash
curl -X POST \
  https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "測試", "job_type": "blog_post", "max_length": 100}'
```

You should get a response with generated content.

## That's It! 🎉

Your Edge Function is now deployed. The frontend will automatically use it (no `VITE_API_URL` needed).

## Manual Deployment (Alternative)

If the script doesn't work, run these commands manually:

```bash
# 1. Link project
supabase link --project-ref togpvwfxmydgitkwqdgd

# 2. Set secret
supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533

# 3. Deploy
supabase functions deploy generate-content
```

## Check Deployment Status

```bash
# List all functions
supabase functions list

# View logs
supabase functions logs generate-content

# Check secrets
supabase secrets list
```

