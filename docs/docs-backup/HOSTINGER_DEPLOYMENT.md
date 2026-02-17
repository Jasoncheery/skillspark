# Hostinger Deployment Guide

## Environment Variables for Hostinger

When deploying to Hostinger, you need to set these environment variables in your hosting control panel.

### Step 1: Access Environment Variables

1. Log in to your Hostinger control panel
2. Navigate to your website/domain
3. Look for "Environment Variables" or "Build Settings"
4. Add the following variables:

### Required Environment Variables

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
VITE_ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

### Backend API URL

If you're running the FastAPI backend on Hostinger (separate subdomain or path):

```
VITE_API_URL=https://api.yourdomain.com
```

Or if backend is on the same domain:

```
VITE_API_URL=https://yourdomain.com/api
```

If you're NOT using the FastAPI backend (only using Supabase), you can omit this or set it to an empty string.

### Important Notes

1. **VITE_ Prefix**: All frontend environment variables MUST start with `VITE_` for Vite to expose them to the client-side code.

2. **Build Time**: These variables are embedded at build time. After setting/changing them:
   - Rebuild your application
   - Redeploy to Hostinger

3. **Build Command**: Make sure your build command is:
   ```bash
   npm run build
   ```

4. **Output Directory**: The build output will be in the `dist/` folder, which should be your web root.

## Deployment Steps

### 1. Build Locally (Optional - for testing)

```bash
npm install
npm run build
```

### 2. Upload to Hostinger

- Upload the contents of the `dist/` folder to your web root
- Or use Hostinger's Git deployment if available
- Or use FTP/SFTP to upload files

### 3. Set Environment Variables

- Set the environment variables listed above in Hostinger's control panel
- Rebuild if using automated deployment

### 4. Database Setup

Make sure you've run the database migration in Supabase:
- Go to https://togpvwfxmydgitkwqdgd.supabase.co
- Navigate to SQL Editor
- Run the SQL from `supabase/migrations/001_initial_schema.sql`

## Backend Deployment (If Needed)

If you need to deploy the FastAPI backend separately:

1. **Option 1: Hostinger VPS/Cloud**
   - Set up Python environment
   - Install dependencies: `pip install -r requirements.txt`
   - Set `ALICLOUD_API_KEY` environment variable
   - Run with: `uvicorn main:app --host 0.0.0.0 --port 8000`

2. **Option 2: Separate Backend Service**
   - Deploy to Railway, Render, or similar
   - Set environment variables there
   - Update `VITE_API_URL` in frontend

3. **Option 3: Supabase Edge Functions**
   - Convert FastAPI endpoints to Supabase Edge Functions
   - Deploy directly to Supabase

## Verification Checklist

- [ ] Environment variables set in Hostinger
- [ ] Database migration run in Supabase
- [ ] Build completed successfully
- [ ] Files uploaded to web root
- [ ] Website accessible
- [ ] Supabase connection working (check browser console)
- [ ] API calls working (if using backend)

## Troubleshooting

### Variables Not Working

- Ensure all variables start with `VITE_`
- Rebuild after changing variables
- Check browser console for errors
- Verify variables are set in Hostinger control panel

### Database Connection Issues

- Verify Supabase URL and anon key are correct
- Check Supabase project is active
- Verify RLS policies are set correctly
- Check browser console for specific errors

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Review build logs for specific errors

