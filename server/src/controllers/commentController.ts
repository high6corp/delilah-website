import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createComment, deleteComment } from '../services/commentService.js';
import { BadRequestError } from '../utils/errors.js';

const createCommentSchema = z.object({
  name: z.string().min(1).max(50),
  text: z.string().min(1).max(1000),
});

function parseCommentBody(body: unknown) {
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }
  return parsed.data;
}

export async function createMediaCommentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = parseCommentBody(req.body);
    const comment = await createComment({
      ...body,
      isDelilah: false,
      mediaId: String(req.params.id),
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

export async function createStoryCommentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = parseCommentBody(req.body);
    const comment = await createComment({
      ...body,
      isDelilah: false,
      storyId: String(req.params.id),
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteComment(String(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
