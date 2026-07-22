import type { Request, Response, NextFunction } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import { prisma } from '../prisma/client.js';
import { resolveStoragePath } from '../utils/paths.js';
import { NotFoundError } from '../utils/errors.js';

export async function serveFile(req: Request, res: Response, next: NextFunction) {
  try {
    const media = await prisma.media.findUnique({ where: { id: String(req.params.id) } });
    if (!media) {
      throw new NotFoundError('File not found');
    }

    const relativePath = req.path.endsWith('/thumbnail') ? media.thumbnailPath : media.storagePath;
    if (!relativePath) {
      throw new NotFoundError('File not found');
    }

    const filePath = resolveStoragePath(relativePath);

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundError('File not found');
    }

    const contentType = mime.lookup(filePath) || media.mimeType;
    const filename = path.basename(media.originalName);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'private, max-age=86400');

    const stream = await fs.open(filePath, 'r');
    try {
      const readable = stream.createReadStream();
      await new Promise<void>((resolve, reject) => {
        readable.pipe(res);
        readable.on('error', reject);
        res.on('finish', resolve);
      });
    } finally {
      await stream.close();
    }
  } catch (error) {
    next(error);
  }
}
