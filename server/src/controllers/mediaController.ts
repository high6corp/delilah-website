import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import fs from 'node:fs/promises';
import { createMedia, listMedia, getMediaById, deleteMedia } from '../services/mediaService.js';
import { uploadPhoto, uploadVideo, handleUploadError } from '../middleware/upload.js';
import { BadRequestError } from '../utils/errors.js';

const createMediaSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  uploaderName: z.string().min(1).max(50),
});

function parseMediaBody(body: unknown) {
  const parsed = createMediaSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }
  return parsed.data;
}

export function uploadPhotoHandler(req: Request, res: Response, next: NextFunction) {
  uploadPhoto(req, res, async (err) => {
    try {
      if (err) {
        throw handleUploadError(err);
      }

      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const body = parseMediaBody(req.body);

      const media = await createMedia({
        ...body,
        kind: 'photo',
        tempPath: req.file.path,
        originalName: req.file.originalname,
      });

      res.status(201).json(media);
    } catch (error) {
      // Clean up temp file on error
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  });
}

export function uploadVideoHandler(req: Request, res: Response, next: NextFunction) {
  uploadVideo(req, res, async (err) => {
    try {
      if (err) {
        throw handleUploadError(err);
      }

      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const body = parseMediaBody(req.body);

      const media = await createMedia({
        ...body,
        kind: 'video',
        tempPath: req.file.path,
        originalName: req.file.originalname,
      });

      res.status(201).json(media);
    } catch (error) {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  });
}

export async function listMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type as 'photo' | 'video' | undefined;
    const media = await listMedia(type);
    res.json(media);
  } catch (error) {
    next(error);
  }
}

export async function getMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const media = await getMediaById(String(req.params.id));
    res.json(media);
  } catch (error) {
    next(error);
  }
}

export async function deleteMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteMedia(String(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
