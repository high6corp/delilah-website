# Deploy to Hostinger VPS

This guide deploys the **Delilah Website** to a Hostinger VPS using Docker, Docker Compose, and Nginx with free SSL.

## What you need

- A Hostinger VPS plan
- A domain name (or use the Hostinger free subdomain)
- SSH client (PuTTY, Terminal, or Windows Terminal)
- Your project files pushed to GitHub or available locally

## 1. Create the VPS

1. Log in to Hostinger → **VPS** → **Create new VPS**
2. Choose **Ubuntu 22.04 LTS** as the operating system
3. Choose a plan (2 vCPU / 4 GB RAM is enough to start)
4. Set a strong root password or add an SSH key
5. Finish creation and copy the VPS IP address

## 2. Connect via SSH

```bash
ssh root@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with the actual IP from Hostinger.

## 3. Update the server

```bash
apt update && apt upgrade -y
```

## 4. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Start and enable Docker
systemctl enable --now docker

# Install Docker Compose plugin
apt install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

## 5. Add a non-root user (recommended)

```bash
adduser delilah
usermod -aG sudo delilah
usermod -aG docker delilah
```

Then switch to the new user:

```bash
su - delilah
```

## 6. Clone the project

```bash
cd ~
git clone https://github.com/high6corp/delilah-website.git
cd delilah-website
```

## 7. Configure environment variables

```bash
cd server
cp .env.example .env
nano .env
```

Edit `.env` with these production values:

```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.com
DATABASE_URL=postgresql://delilah:STRONG_DB_PASSWORD@postgres:5432/delilah_db?schema=public
UPLOAD_DIR=/var/lib/delilah/uploads
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_32_CHAR_STRING
BCRYPT_ROUNDS=12
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
COOKIE_NAME=delilah_session
COOKIE_MAX_AGE_MS=900000
COOKIE_REMEMBER_ME_MAX_AGE_MS=2592000000
STATIC_FILES_DIR=../app/dist
MAX_PHOTO_SIZE=10485760
MAX_VIDEO_SIZE=104857600

# Password: generate a bcrypt hash and set it directly
PASSWORD_HASH=YOUR_BCRYPT_HASH

# Optional: contact form email via SMTP2GO
# SMTP2GO_API_KEY=your-api-key
# SMTP2GO_SENDER=noreply@example.com
# CONTACT_RECIPIENT=miracle@example.com
```

> Replace `STRONG_DB_PASSWORD` and `JWT_SECRET` with secure random strings.

Generate a bcrypt hash for the family password:

```bash
cd /home/delilah/delilah-website/server
docker run --rm node:20-alpine node -e "console.log(require('bcrypt').hashSync('your-family-password', 12))"
```

Copy the output into `PASSWORD_HASH`.

## 8. Update docker-compose.yml for production

The included `docker-compose.yml` already defines the server and postgres services with a persistent upload volume. Make sure it looks like this:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: delilah-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: delilah
      POSTGRES_PASSWORD: STRONG_DB_PASSWORD
      POSTGRES_DB: delilah_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U delilah -d delilah_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  server:
    build:
      context: ./server
    container_name: delilah-server
    restart: unless-stopped
    env_file:
      - ./server/.env
    environment:
      DATABASE_URL: postgresql://delilah:STRONG_DB_PASSWORD@postgres:5432/delilah_db?schema=public
    ports:
      - "127.0.0.1:3001:3001"
    volumes:
      - delilah_uploads:/var/lib/delilah/uploads
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  delilah_uploads:
```

> `STRONG_DB_PASSWORD` must match the value in `server/.env`.

## 9. Build the frontend

```bash
cd /home/delilah/delilah-website/app
npm install
npm run build
```

This creates the `app/dist/` folder that the backend will serve.

## 10. Start the application

```bash
cd /home/delilah/delilah-website
docker compose up -d --build
```

This will:
- Build the backend Docker image
- Start PostgreSQL
- Run database migrations inside the container
- Start the backend server
- Create a persistent Docker volume for uploads

Check logs:

```bash
docker compose logs -f server
```

Run migrations manually if they did not run automatically:

```bash
docker compose exec server npx prisma migrate deploy
```

## 11. Install and configure Nginx + SSL

Install Nginx and Certbot:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create the Nginx config:

```bash
sudo nano /etc/nginx/sites-available/delilah
```

Paste this (replace `your-domain.com`):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 100M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/delilah /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Get SSL certificate:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure HTTPS and redirect HTTP to HTTPS.

## 12. Point your domain to the VPS

1. Go to your domain registrar or DNS provider
2. Add an **A record**:
   - Host: `@`
   - Value: `YOUR_VPS_IP`
3. Wait a few minutes for DNS propagation

## 13. Verify everything works

- Open `https://your-domain.com` in a browser
- Log in with the family password
- Upload a photo and refresh the page to confirm files persist
- Check the upload volume:

```bash
docker volume inspect delilah-website_delilah_uploads
```

## 14. Update the site after code changes

When you make code changes:

```bash
cd /home/delilah/delilah-website
git pull

# Rebuild frontend if changed
cd app
npm install
npm run build

# Rebuild and restart backend
cd ..
docker compose up -d --build
```

## 15. Backup (important)

Back up the database and uploads regularly.

**Database backup:**

```bash
docker compose exec -T postgres pg_dump -U delilah delilah_db > delilah_backup_$(date +%F).sql
```

**Uploads backup:**

```bash
sudo tar -czf uploads_backup_$(date +%F).tar.gz /var/lib/docker/volumes/delilah-website_delilah_uploads/_data
```

Store these backups in a safe place (S3, another server, or your local machine).

## Troubleshooting

### Containers fail to start

```bash
docker compose logs
```

### Nginx shows 502 Bad Gateway

- Make sure the server container is running: `docker compose ps`
- Check the server logs: `docker compose logs server`
- Verify the port binding: `curl http://127.0.0.1:3001`

### Uploads disappear after redeploy

Make sure the volume is mounted:

```bash
docker inspect delilah-server | grep -A 10 Mounts
```

You should see `/var/lib/delilah/uploads` mapped to the Docker volume.

### SSL certificate renewal

Certbot auto-renews, but test it:

```bash
sudo certbot renew --dry-run
```

## Summary

- **OS:** Ubuntu 22.04 LTS
- **Runtime:** Docker + Docker Compose
- **Database:** PostgreSQL (persistent Docker volume)
- **Uploads:** Persistent Docker volume at `/var/lib/delilah/uploads`
- **Reverse proxy:** Nginx with free SSL from Let's Encrypt
- **Domain:** A record pointing to your VPS IP

This setup gives you full control over the server and keeps uploads safe across redeploys.
