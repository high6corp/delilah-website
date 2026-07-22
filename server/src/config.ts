import 'dotenv/config';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

function isValidJwtExpiresIn(value: string): boolean {
  try {
    jwt.sign({}, 'dummy-secret', { expiresIn: value as jwt.SignOptions['expiresIn'] });
    return true;
  } catch {
    return false;
  }
}

const jwtExpirySchema = z.string().refine(isValidJwtExpiresIn, {
  message: 'must be a valid JWT expiresIn value (e.g. 24h, 7d, 30d)',
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1),
  UPLOAD_DIR: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: jwtExpirySchema.default('24h'),
  JWT_REMEMBER_ME_EXPIRES_IN: jwtExpirySchema.default('30d'),
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  PASSWORD_HASH: z.string().min(1).optional(),
  COOKIE_NAME: z.string().default('delilah_session'),
  COOKIE_MAX_AGE_MS: z.string().transform(Number).default(String(24 * 60 * 60 * 1000)),
  COOKIE_REMEMBER_ME_MAX_AGE_MS: z
    .string()
    .transform(Number)
    .default(String(30 * 24 * 60 * 60 * 1000)),
  COOKIE_SECURE: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('strict'),
  MAX_PHOTO_SIZE: z.string().transform(Number).default(String(10 * 1024 * 1024)),
  MAX_VIDEO_SIZE: z.string().transform(Number).default(String(100 * 1024 * 1024)),
  STATIC_FILES_DIR: z.string().optional(),
  SMTP2GO_API_KEY: z.string().min(1).optional(),
  SMTP2GO_SENDER: z.string().email().optional(),
  CONTACT_RECIPIENT: z.string().email().optional(),
});

const emptyToUndefined = (env: NodeJS.ProcessEnv) =>
  Object.fromEntries(
    Object.entries(env).map(([k, v]) => {
      const trimmed = v?.trim();
      return [k, trimmed === '' ? undefined : trimmed];
    })
  );

const parsed = envSchema.safeParse(emptyToUndefined(process.env));

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const CONFIG = parsed.data;

export const IS_PRODUCTION = CONFIG.NODE_ENV === 'production';

export const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

export const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
]);
