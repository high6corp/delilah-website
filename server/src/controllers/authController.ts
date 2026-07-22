import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { CONFIG } from '../config.js';
import { authenticate, clearAuthCookie, setAuthCookie } from '../services/authService.js';
import { BadRequestError } from '../utils/errors.js';

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
    }

    const { token, maxAge, expiresAt } = await authenticate(
      parsed.data.password,
      parsed.data.rememberMe
    );
    setAuthCookie(res, token, maxAge);

    res.json({ success: true, expiresAt });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  res.json({ success: true });
}

export function me(req: Request, res: Response) {
  // If this endpoint is reached, requireAuth has already validated the JWT
  const token = req.cookies?.[CONFIG.COOKIE_NAME];
  const payload = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = payload?.exp
    ? new Date(payload.exp * 1000).toISOString()
    : undefined;

  res.json({ authenticated: true, expiresAt });
}
