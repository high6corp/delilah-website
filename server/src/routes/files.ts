import { Router } from 'express';
import { serveFile } from '../controllers/filesController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:id', requireAuth, serveFile);
router.get('/:id/thumbnail', requireAuth, serveFile);

export default router;
