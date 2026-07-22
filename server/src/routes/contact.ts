import { Router } from 'express';
import { sendContactHandler } from '../controllers/contactController.js';
import { contactRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', contactRateLimiter, sendContactHandler);

export default router;
