import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createStory, listStories, getStoryById, deleteStory } from '../services/storyService.js';
import { BadRequestError } from '../utils/errors.js';

const createStorySchema = z.object({
  title: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  content: z.string().min(10).max(5000),
  authorName: z.string().min(1).max(50),
});

function parseStoryBody(body: unknown) {
  const parsed = createStorySchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }
  return parsed.data;
}

export async function createStoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = parseStoryBody(req.body);
    const story = await createStory(body);
    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
}

export async function listStoriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const stories = await listStories(category);
    res.json(stories);
  } catch (error) {
    next(error);
  }
}

export async function getStoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const story = await getStoryById(String(req.params.id));
    res.json(story);
  } catch (error) {
    next(error);
  }
}

export async function deleteStoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteStory(String(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
