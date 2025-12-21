# Hostinger Environment Variables Setup

## Required Environment Variables

Copy and paste these **exact values** into your Hostinger control panel's Environment Variables section:

### 1. Supabase Configuration

**Variable Name:** `VITE_SUPABASE_URL`  
**Value:**
```
https://togpvwfxmydgitkwqdgd.supabase.co
```

**Variable Name:** `VITE_SUPABASE_ANON_KEY`  
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
```

### 2. AliCloud API Key

**Variable Name:** `VITE_ALICLOUD_API_KEY`  
**Value:**
```
sk-f457a807f49f4c958636696c751f7533
```

### 3. Backend API URL (NOT NEEDED - Using Supabase Edge Functions)

**Variable Name:** `VITE_API_URL`  
**Value:** **DO NOT SET THIS VARIABLE** (leave it empty/removed)

**✅ Using Supabase Edge Functions:**
- AI content generation uses Supabase Edge Functions (not FastAPI)
- Edge Function is deployed at: `https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content`
- Frontend automatically uses Edge Function when `VITE_API_URL` is not set
- No separate backend deployment needed!

**Features using Edge Functions:**
- Blog post generation
- Tool description generation  
- Image generation
- SEO content generation

---

## Quick Copy-Paste Format

If your Hostinger panel accepts multiple variables at once, use this format:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
VITE_ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

**✅ Note:** `VITE_API_URL` is NOT needed - using Supabase Edge Functions instead!

---

## Important Notes

1. **VITE_ Prefix Required**: All frontend environment variables MUST start with `VITE_` for Vite to expose them to client-side code.

2. **Build-Time Variables**: These are embedded during `npm run build`. After adding/changing variables:
   - Rebuild: `npm run build`
   - Redeploy the `dist/` folder to Hostinger

3. **Domain**: Your domain is `skillsparkhub.com` (from SSH config)

4. **Backend Status**: **Using Supabase Edge Functions** for AI content generation. No separate backend needed! The Edge Function is automatically used when `VITE_API_URL` is not set.

---

## Verification Steps

After adding variables in Hostinger:

1. ✅ Rebuild locally: `npm run build`
2. ✅ Upload `dist/` folder contents to Hostinger web root
3. ✅ Visit `https://skillsparkhub.com`
4. ✅ Check browser console (F12) for any environment variable errors
5. ✅ Test Supabase connection (try logging in)
6. ✅ Test AI features (if using backend, verify API calls work)

---

## Troubleshooting

### Variables Not Working
- Ensure all variables start with `VITE_`
- Rebuild after changing variables
- Check browser console for errors
- Verify variables are set in Hostinger control panel

### Backend Connection Issues
- **Using Supabase Edge Functions** - no separate backend needed
- Edge Function URL: `https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content`
- Make sure `VITE_API_URL` is NOT set (frontend will use Edge Function automatically)
- Verify Edge Function is deployed in Supabase dashboard
- Check Edge Function logs in Supabase dashboard if API calls are failing
- Ensure `ALICLOUD_API_KEY` secret is set in Supabase Edge Function secrets

