import { Router } from 'express';
import {
  createStoryHandler,
  listStoriesHandler,
  getStoryHandler,
  deleteStoryHandler,
} from '../controllers/storyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listStoriesHandler);
router.get('/:id', getStoryHandler);
router.post('/', requireAuth, createStoryHandler);
router.delete('/:id', requireAuth, deleteStoryHandler);

export default router;
