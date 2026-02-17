# Deploy FastAPI on Hostinger VPS

If you prefer to keep the FastAPI backend, here's how to deploy it on your Hostinger VPS.

## Prerequisites

- Hostinger VPS with SSH access
- Python 3.9+ installed
- Nginx (for reverse proxy)

## Setup Steps

### 1. SSH into Your VPS

```bash
ssh root@your-vps-ip
```

### 2. Install Python and Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Python and pip
apt install python3 python3-pip python3-venv -y

# Install nginx
apt install nginx -y
```

### 3. Create Application Directory

```bash
mkdir -p /var/www/skillspark-api
cd /var/www/skillspark-api
```

### 4. Upload Backend Code

Upload your `backend/` folder to `/var/www/skillspark-api/`

### 5. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 6. Create Systemd Service

Create `/etc/systemd/system/skillspark-api.service`:

```ini
[Unit]
Description=SkillSpark FastAPI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/skillspark-api
Environment="PATH=/var/www/skillspark-api/venv/bin"
Environment="ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533"
ExecStart=/var/www/skillspark-api/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### 7. Start Service

```bash
systemctl daemon-reload
systemctl enable skillspark-api
systemctl start skillspark-api
systemctl status skillspark-api
```

### 8. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/skillspark-api`:

```nginx
server {
    listen 80;
    server_name api.skillsparkhub.com;  # or your subdomain

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/skillspark-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 9. Set Up SSL (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.skillsparkhub.com
```

### 10. Update Frontend Environment Variable

In Hostinger, set:

```
VITE_API_URL=https://api.skillsparkhub.com
```

## Maintenance

### View Logs

```bash
journalctl -u skillspark-api -f
```

### Restart Service

```bash
systemctl restart skillspark-api
```

### Update Code

```bash
cd /var/www/skillspark-api
git pull  # or upload new files
source venv/bin/activate
pip install -r requirements.txt
systemctl restart skillspark-api
```

## Troubleshooting

- **Service won't start**: Check logs with `journalctl -u skillspark-api`
- **Port already in use**: Change port in service file and nginx config
- **API not accessible**: Check firewall rules and nginx config

