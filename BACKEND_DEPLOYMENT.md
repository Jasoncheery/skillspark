# FastAPI Backend Deployment Guide

## Overview

Your FastAPI backend is **REQUIRED** for AI content generation features:
- Blog post generation
- Tool description generation
- Image generation
- SEO content generation

The backend uses AliCloud DashScope API (Qwen for text, Wanx for images).

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **Create new project**: Click "New Project"
3. **Deploy from GitHub**:
   - Connect your GitHub repo
   - Select the `backend` folder as root
   - Railway will auto-detect Python

4. **Set Environment Variables**:
   ```
   ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
   PORT=8000
   ```

5. **Deploy**: Railway will automatically deploy
6. **Get URL**: Copy the generated URL (e.g., `https://your-app.railway.app`)
7. **Update Frontend**: Set `VITE_API_URL` in Hostinger to this URL

### Option 2: Render

1. **Sign up**: Go to [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect GitHub repo**
4. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3

5. **Set Environment Variables**:
   ```
   ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
   ```

6. **Deploy**: Render will deploy automatically
7. **Get URL**: Copy the generated URL
8. **Update Frontend**: Set `VITE_API_URL` in Hostinger

### Option 3: Hostinger VPS/Cloud (If Available)

If you have Hostinger VPS or Cloud hosting:

1. **SSH into server**:
   ```bash
   ssh -p 65002 -i ~/.ssh/skillspark_hostinger u587479061@195.35.5.53
   ```

2. **Set up Python environment**:
   ```bash
   cd ~
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Upload backend code**:
   ```bash
   # Create backend directory
   mkdir -p ~/backend
   # Upload files via SFTP or git clone
   ```

4. **Install dependencies**:
   ```bash
   cd ~/backend
   pip install -r requirements.txt
   ```

5. **Set environment variable**:
   ```bash
   export ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
   ```

6. **Run with PM2 or systemd**:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start backend
   pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name skillspark-api
   pm2 save
   pm2 startup
   ```

7. **Set up reverse proxy** (if using same domain):
   - Configure nginx to proxy `/api` to `http://localhost:8000`
   - Or use subdomain: `api.skillsparkhub.com`

### Option 4: Other Platforms

- **Heroku**: Similar to Render
- **Fly.io**: Good for global distribution
- **DigitalOcean App Platform**: Simple deployment
- **AWS/GCP/Azure**: More complex but scalable

## Environment Variables for Backend

**Required:**
```
ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533
```

**Optional:**
```
PORT=8000  # Some platforms set this automatically
```

## Testing Backend Deployment

After deployment, test the endpoints:

1. **Health check**:
   ```bash
   curl https://your-backend-url.com/
   ```
   Should return: `{"message":"SkillSpark API","version":"1.0.0"}`

2. **Test text generation**:
   ```bash
   curl -X POST https://your-backend-url.com/api/ai/generate-text \
     -H "Content-Type: application/json" \
     -d '{"prompt":"Test prompt","job_type":"blog_post","max_length":100}'
   ```

3. **Check CORS**: The backend allows all origins (`allow_origins=["*"]`), which is fine for now but should be restricted in production.

## Update Frontend Environment Variable

After deploying backend, update `VITE_API_URL` in Hostinger:

1. Go to Hostinger control panel
2. Navigate to Environment Variables
3. Set `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
4. Rebuild and redeploy frontend

## Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Health check endpoint returns success
- [ ] `ALICLOUD_API_KEY` set in backend environment
- [ ] `VITE_API_URL` set in Hostinger frontend environment
- [ ] Frontend rebuilt and redeployed
- [ ] Test AI generation features in admin panel
- [ ] Check browser console for API errors

## Troubleshooting

### Backend Not Starting
- Check logs in deployment platform
- Verify `ALICLOUD_API_KEY` is set correctly
- Check Python version (requires 3.8+)
- Verify all dependencies installed

### CORS Errors
- Backend already allows all origins
- If issues persist, check browser console for specific error
- Verify backend URL is correct in `VITE_API_URL`

### API Calls Failing
- Verify backend URL is accessible
- Check backend logs for errors
- Verify AliCloud API key is valid
- Test endpoints directly with curl

### Timeout Issues
- Image generation can take 60-120 seconds
- Text generation usually takes 10-30 seconds
- Check backend timeout settings
- Consider increasing timeout in frontend if needed

