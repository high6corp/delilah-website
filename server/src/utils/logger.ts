import pino from 'pino';
import { IS_PRODUCTION } from '../config.js';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: IS_PRODUCTION
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'password', 'req.body.password'],
    censor: '[REDACTED]',
  },
});
