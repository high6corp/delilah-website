import { Router } from 'express';
import {
  createMediaCommentHandler,
  createStoryCommentHandler,
  deleteCommentHandler,
} from '../controllers/commentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/media/:id', createMediaCommentHandler);
router.post('/stories/:id', createStoryCommentHandler);
router.delete('/:id', requireAuth, deleteCommentHandler);

export default router;
