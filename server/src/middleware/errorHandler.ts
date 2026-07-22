import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors.js';
import { IS_PRODUCTION } from '../config.js';
import { logger } from '../utils/logger.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Multer file size error
  if (err?.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'File is too large',
      },
    });
    return;
  }

  // Multer unsupported file type / other limits
  if (err?.code?.startsWith('LIMIT_')) {
    res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: err.message ?? 'Upload limit exceeded',
      },
    });
    return;
  }

  logger.error({ err }, 'Unhandled error');

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: IS_PRODUCTION ? 'Internal server error' : err?.message ?? 'Unknown error',
      ...(IS_PRODUCTION ? {} : { stack: err?.stack }),
    },
  });
};
