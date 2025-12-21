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

### 3. Backend API URL (REQUIRED - FastAPI backend is used for AI features)

**Variable Name:** `VITE_API_URL`  
**Value (choose one based on your backend deployment):**

**⚠️ IMPORTANT:** Your FastAPI backend is REQUIRED for AI content generation features:
- Blog post generation
- Tool description generation  
- Image generation
- SEO content generation

**Option A:** If backend is deployed on Railway/Render/Similar (Recommended):
```
https://your-backend-app.railway.app
```
or
```
https://your-backend-app.onrender.com
```

**Option B:** If backend is on a separate subdomain:
```
https://api.skillsparkhub.com
```

**Option C:** If backend is on the same domain (requires reverse proxy setup):
```
https://skillsparkhub.com/api
```

**Option D:** If backend is on Hostinger VPS/Cloud:
```
https://api.skillsparkhub.com
```
or
```
http://localhost:8000
```
(if running on same server with reverse proxy)

**Current value in .env:** `http://localhost:8000` (this won't work in production!)

**⚠️ You MUST deploy the FastAPI backend separately or the AI generation features will not work!**

---

## Quick Copy-Paste Format

If your Hostinger panel accepts multiple variables at once, use this format:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
VITE_ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
VITE_API_URL=https://your-backend-url.com
```

**⚠️ IMPORTANT:** Replace `https://your-backend-url.com` with your actual FastAPI backend URL after deploying it!

---

## Important Notes

1. **VITE_ Prefix Required**: All frontend environment variables MUST start with `VITE_` for Vite to expose them to client-side code.

2. **Build-Time Variables**: These are embedded during `npm run build`. After adding/changing variables:
   - Rebuild: `npm run build`
   - Redeploy the `dist/` folder to Hostinger

3. **Domain**: Your domain is `skillsparkhub.com` (from SSH config)

4. **Backend Status**: **FastAPI backend IS REQUIRED** for AI content generation. You must deploy it separately (Railway, Render, or Hostinger VPS) and set `VITE_API_URL` to point to it.

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
- **FastAPI backend is REQUIRED** - AI features won't work without it
- Deploy backend to Railway, Render, or similar service first
- Set `VITE_API_URL` to your deployed backend URL
- Backend needs `ALICLOUD_API_KEY` environment variable set
- Check backend logs if API calls are failing
- Verify CORS is configured correctly in backend (currently allows all origins)

