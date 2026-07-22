import { createApp } from './app.js';
import { CONFIG } from './config.js';
import { prisma } from './prisma/client.js';
import { logger } from './utils/logger.js';

async function main() {
  const app = await createApp();

  const server = app.listen(CONFIG.PORT, () => {
    logger.info(`Server running on http://localhost:${CONFIG.PORT} in ${CONFIG.NODE_ENV} mode`);
  });

  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async (err) => {
      if (err) {
        logger.error(err, 'Error closing server');
      }
      await prisma.$disconnect().catch((disconnectErr) => {
        logger.error(disconnectErr, 'Error disconnecting from database');
      });
      process.exit(err ? 1 : 0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
