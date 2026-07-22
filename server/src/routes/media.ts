import { Router } from 'express';
import {
  uploadPhotoHandler,
  uploadVideoHandler,
  listMediaHandler,
  getMediaHandler,
  deleteMediaHandler,
} from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/', listMediaHandler);
router.get('/:id', getMediaHandler);
router.post('/photo', requireAuth, uploadRateLimiter, uploadPhotoHandler);
router.post('/video', requireAuth, uploadRateLimiter, uploadVideoHandler);
router.delete('/:id', requireAuth, deleteMediaHandler);

export default router;
