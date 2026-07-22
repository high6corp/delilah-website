import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { prisma } from '../prisma/client.js';
import { validateUploadedFile } from '../utils/fileValidation.js';
import { generateStoragePath, resolveStoragePath } from '../utils/paths.js';
import { NotFoundError } from '../utils/errors.js';
import { generateVideoThumbnail } from '../utils/videoThumbnail.js';
import type { MediaType } from '@prisma/client';

interface CreateMediaInput {
  title: string;
  description?: string;
  uploaderName: string;
  tempPath: string;
  originalName: string;
  kind: 'photo' | 'video';
}

export async function createMedia(input: CreateMediaInput) {
  const { title, description, uploaderName, tempPath, originalName, kind } = input;

  const stats = await fs.stat(tempPath);

  const { mimeType, ext } = await validateUploadedFile(tempPath, kind, stats.size);

  const storage = generateStoragePath(kind, ext);
  let thumbnail = generateStoragePath('thumbnail', 'webp');

  // Ensure destination directory exists
  await fs.mkdir(path.dirname(storage.absolutePath), { recursive: true });
  await fs.mkdir(path.dirname(thumbnail.absolutePath), { recursive: true });

  // Move temp file to final location
  await fs.rename(tempPath, storage.absolutePath);

  let width: number | undefined;
  let height: number | undefined;
  let thumbnailPath: string | null = thumbnail.relativePath;

  if (kind === 'photo') {
    const metadata = await sharp(storage.absolutePath).metadata();
    width = metadata.width ?? undefined;
    height = metadata.height ?? undefined;

    await sharp(storage.absolutePath)
      .resize({ width: 400, height: 400, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbnail.absolutePath);
  } else {
    // Generate video thumbnail from first frame (best-effort)
    const ok = await generateVideoThumbnail(storage.absolutePath, thumbnail.absolutePath, {
      width: 400,
      height: 400,
      quality: 80,
    });
    if (!ok) {
      thumbnailPath = null;
    }
  }

  const media = await prisma.media.create({
    data: {
      type: kind.toUpperCase() as MediaType,
      title: title.trim(),
      description: description?.trim() || null,
      uploaderName: uploaderName.trim(),
      originalName: originalName.trim(),
      storagePath: storage.relativePath,
      thumbnailPath,
      mimeType,
      size: stats.size,
      width,
      height,
      duration: undefined,
    },
  });

  return media;
}

export async function listMedia(type?: 'photo' | 'video') {
  return prisma.media.findMany({
    where: type ? { type: type.toUpperCase() as MediaType } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
}

export async function getMediaById(id: string) {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!media) {
    throw new NotFoundError('Media not found');
  }

  return media;
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    throw new NotFoundError('Media not found');
  }

  await prisma.media.delete({ where: { id } });

  // Best-effort file cleanup
  try {
    await fs.unlink(resolveStoragePath(media.storagePath));
    if (media.thumbnailPath) {
      await fs.unlink(resolveStoragePath(media.thumbnailPath));
    }
  } catch {
    // Ignore cleanup errors; files can be orphaned and cleaned up later
  }
}
