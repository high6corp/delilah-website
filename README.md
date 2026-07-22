# Delilah's World

A secure, family-friendly web app for sharing photos, videos, and stories. Built with **Vite + React** on the frontend and **Express + TypeScript + PostgreSQL** on the backend.

## Architecture

```
┌─────────────┐      ┌──────────────────────┐      ┌──────────────┐
│  Vite/React │◄────►│  Express + Prisma    │◄────►│  PostgreSQL  │
│   (app/)    │      │       (server/)      │      │              │
└─────────────┘      └──────────────────────┘      └──────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Local disk     │
                     │  uploads/       │
                     └─────────────────┘
```

## Quick Start (Development)

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker)

### 1. Install dependencies

```bash
# Frontend
cd app
npm install

# Backend
cd ../server
npm install
```

### 2. Set up PostgreSQL

**Option A: Docker (recommended for local dev)**

```bash
cd ..
docker compose up -d postgres
```

**Option B: Existing PostgreSQL**

Create a database and user, then copy the environment file:

```bash
cd server
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### 3. Configure backend environment

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://delilah:delilah_password@localhost:5432/delilah_db?schema=public
UPLOAD_DIR=/absolute/path/to/uploads
JWT_SECRET=generate-a-32-char-random-string
FAMILY_PASSWORD=your-family-password

# Optional: for Railway/serverless, set PASSWORD_HASH instead of seeding.
# Generate with: node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
# PASSWORD_HASH=$2b$12$...

# Contact form via SMTP2GO (optional)
# SMTP2GO_API_KEY=your-api-key
# SMTP2GO_SENDER=noreply@example.com
# CONTACT_RECIPIENT=miracle@example.com
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run database migrations and seed

```bash
cd server
npx prisma migrate dev
npm run db:seed
```

### 5. Start the servers

**Backend:**

```bash
cd server
npm run dev
```

**Frontend (in a new terminal):**

```bash
cd app
npm run dev
```

The frontend will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:3001`.

## Production Deployment

### 1. Build the frontend

```bash
cd app
npm run build
```

This creates a `dist/` folder with static assets.

### 2. Build the backend

```bash
cd server
npm run build
```

This compiles TypeScript to `dist/`.

### 3. Set production environment variables

```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.com
DATABASE_URL=postgresql://user:password@db-host:5432/delilah_db
UPLOAD_DIR=/var/lib/delilah/uploads
JWT_SECRET=your-very-long-random-secret
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# Password: set PASSWORD_HASH directly (recommended for Railway), or seed with FAMILY_PASSWORD
PASSWORD_HASH=$2b$12$...

# Contact form via SMTP2GO
SMTP2GO_API_KEY=your-api-key
SMTP2GO_SENDER=noreply@example.com
CONTACT_RECIPIENT=miracle@example.com
```

### 4. Serve static files from the backend

In production, configure your reverse proxy (Nginx, Caddy, Traefik) or serve the frontend build from the Express server by setting:

```env
STATIC_FILES_DIR=../app/dist
```

This tells the backend to serve the built frontend files and fall back to `index.html` for SPA routing. The path can be absolute or relative to the `server/` directory.

### 5. Run migrations

```bash
cd server
npx prisma migrate deploy
```

### 6. Start the backend

```bash
cd server
npm start
```

### 7. HTTPS

Always use HTTPS in production. Terminate TLS at your reverse proxy and set:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

## Security Features

- Password hashed with **bcrypt**
- Authentication via **JWT** in `httpOnly`, `Secure`, `SameSite=Strict` cookies
- **Helmet** HTTP security headers
- **CORS** restricted to the frontend origin
- **Rate limiting** on auth, upload, and general API endpoints
- **Zod** validation on all inputs
- **Prisma ORM** prevents SQL injection
- File uploads validated by **magic bytes** (not just extension)
- Files stored outside the web root and served through an authenticated endpoint
- UUID filenames prevent enumeration
- Path traversal protection on file serving

## API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Media

- `GET /api/media`
- `GET /api/media/:id`
- `POST /api/media/photo` (multipart, auth required)
- `POST /api/media/video` (multipart, auth required)
- `DELETE /api/media/:id` (auth required)

### Stories

- `GET /api/stories`
- `GET /api/stories/:id`
- `POST /api/stories` (auth required)
- `DELETE /api/stories/:id` (auth required)

### Comments

- `POST /api/comments/media/:id`
- `POST /api/comments/stories/:id`
- `DELETE /api/comments/:id` (auth required)

### Files

- `GET /api/files/:id` (auth required)
- `GET /api/files/:id/thumbnail` (auth required)

### Contact

- `POST /api/contact` — sends a message via SMTP2GO

## File Storage

Uploaded files are stored on local disk under `UPLOAD_DIR`:

```
UPLOAD_DIR/
├── photos/2026/07/<uuid>.jpg
├── videos/2026/07/<uuid>.mp4
└── thumbnails/2026/07/<uuid>.webp
```

**Important:** The upload directory must be:
- Outside the web root
- Writable by the Node.js process
- Backed up regularly

For horizontal scaling or cloud deployment, replace local disk storage with S3-compatible object storage (S3, R2, MinIO).

## Useful Commands

```bash
# Reset database
cd server
npm run db:reset

# Open Prisma Studio
cd server
npm run db:studio

# Type check backend
cd server
npm run typecheck

# Type check / build frontend
cd app
npm run build
```

## Notes

- The default family password is set via `FAMILY_PASSWORD` during seeding.
- To rotate the password, update the `passwordHash` value in the `SiteConfig` table.
- For Railway/serverless deployments, set `PASSWORD_HASH` directly and omit `FAMILY_PASSWORD`. This avoids running the seed script on every deploy.
- Video thumbnails are not generated in v1; videos display with a play overlay.
