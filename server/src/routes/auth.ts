import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
