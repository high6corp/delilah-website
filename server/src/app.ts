import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { CONFIG, IS_PRODUCTION } from './config.js';
import { apiRateLimiter } from './middleware/rateLimiters.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ensureUploadDirs } from './utils/paths.js';
import { serveSpa } from './utils/staticFiles.js';
import { prisma } from './prisma/client.js';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import filesRoutes from './routes/files.js';
import storiesRoutes from './routes/stories.js';
import commentsRoutes from './routes/comments.js';
import contactRoutes from './routes/contact.js';

export async function createApp() {
  await ensureUploadDirs();

  const app = express();

  if (IS_PRODUCTION) {
    app.set('trust proxy', 1);
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'blob:', 'data:'],
          connectSrc: ["'self'"],
        },
      },
    })
  );
  app.use(
    cors({
      origin: CONFIG.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(apiRateLimiter);

  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', env: CONFIG.NODE_ENV });
    } catch {
      res.status(503).json({ error: { code: 'UNHEALTHY', message: 'Database unavailable' } });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/files', filesRoutes);
  app.use('/api/stories', storiesRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api/contact', contactRoutes);

  // Serve frontend static files in production
  if (CONFIG.STATIC_FILES_DIR) {
    app.use(serveSpa(CONFIG.STATIC_FILES_DIR));
  }

  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
  });

  app.use(errorHandler);

  return app;
}
