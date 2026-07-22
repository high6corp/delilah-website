import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { prisma } from '../prisma/client.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthResult {
  token: string;
  sessionId: string;
  expiresIn: string;
  maxAge: number;
  expiresAt: string;
}

export async function authenticate(
  password: string,
  rememberMe = false
): Promise<AuthResult> {
  const passwordHash = CONFIG.PASSWORD_HASH;

  let valid: boolean;
  if (passwordHash) {
    valid = await bcrypt.compare(password, passwordHash);
  } else {
    const config = await prisma.siteConfig.findUnique({
      where: { key: 'passwordHash' },
    });

    if (!config) {
      throw new UnauthorizedError('Site is not configured');
    }

    valid = await bcrypt.compare(password, config.value);
  }
  if (!valid) {
    throw new UnauthorizedError('Invalid password');
  }

  const sessionId = crypto.randomUUID();
  const expiresIn = rememberMe
    ? CONFIG.JWT_REMEMBER_ME_EXPIRES_IN
    : CONFIG.JWT_EXPIRES_IN;
  const maxAge = rememberMe
    ? CONFIG.COOKIE_REMEMBER_ME_MAX_AGE_MS
    : CONFIG.COOKIE_MAX_AGE_MS;

  const token = jwt.sign({ sessionId }, CONFIG.JWT_SECRET, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });

  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000).toISOString();

  return { token, sessionId, expiresIn, maxAge, expiresAt };
}

export function clearAuthCookie(res: import('express').Response) {
  res.clearCookie(CONFIG.COOKIE_NAME, {
    httpOnly: true,
    secure: CONFIG.COOKIE_SECURE,
    sameSite: CONFIG.COOKIE_SAME_SITE,
    path: '/',
  });
}

export function setAuthCookie(
  res: import('express').Response,
  token: string,
  maxAge = CONFIG.COOKIE_MAX_AGE_MS
) {
  res.cookie(CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: CONFIG.COOKIE_SECURE,
    sameSite: CONFIG.COOKIE_SAME_SITE,
    maxAge,
    path: '/',
  });
}
