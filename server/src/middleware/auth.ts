import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthRequest extends Request {
  user?: { sessionId: string };
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[CONFIG.COOKIE_NAME];

  if (!token || typeof token !== 'string') {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  try {
    const payload = jwt.verify(token, CONFIG.JWT_SECRET) as { sessionId: string };
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired session'));
  }
}
