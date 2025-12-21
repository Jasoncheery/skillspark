# Hostinger Environment Variables - Final Setup

## Option 1: Using Supabase Edge Functions (RECOMMENDED) ⭐

**No separate backend needed!**

Set these in Hostinger:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
```

**That's it!** No `VITE_API_URL` needed.

**Next Steps:**
1. Deploy Supabase Edge Function (see `SUPABASE_EDGE_FUNCTIONS_SETUP.md`)
2. Set the secret: `supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533`
3. Deploy: `supabase functions deploy generate-content`

---

## Option 2: Using FastAPI on Hostinger VPS

If you deploy FastAPI on your VPS, set these:

```
VITE_SUPABASE_URL=https://togpvwfxmydgitkwqdgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y
VITE_API_URL=https://api.skillsparkhub.com
```

**Next Steps:**
1. Deploy FastAPI on VPS (see `HOSTINGER_VPS_FASTAPI_SETUP.md`)
2. Set up reverse proxy with Nginx
3. Configure SSL certificate
4. Set `VITE_API_URL` to your API subdomain

---

## How It Works

The frontend code automatically detects which backend to use:
- **If `VITE_API_URL` is set**: Uses FastAPI backend
- **If `VITE_API_URL` is NOT set**: Uses Supabase Edge Functions

This means you can switch between options just by setting/removing `VITE_API_URL`!

---

## Recommendation

**Use Option 1 (Supabase Edge Functions)** because:
- ✅ Simpler deployment
- ✅ No VPS management
- ✅ No separate backend server
- ✅ Automatic scaling
- ✅ Free tier available
- ✅ Everything in one place

