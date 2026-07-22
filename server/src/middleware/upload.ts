import multer from 'multer';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config.js';
import { getUploadBaseDir } from '../utils/paths.js';
import { ALLOWED_PHOTO_TYPES, ALLOWED_VIDEO_TYPES } from '../config.js';
import { BadRequestError } from '../utils/errors.js';

function createUploadHandler(kind: 'photo' | 'video') {
  const maxSize = kind === 'photo' ? CONFIG.MAX_PHOTO_SIZE : CONFIG.MAX_VIDEO_SIZE;

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(getUploadBaseDir(), 'temp'));
      },
      filename: (_req, _file, cb) => {
        cb(null, `${uuidv4()}.tmp`);
      },
    }),
    limits: {
      fileSize: maxSize,
      files: 1,
      fields: 10,
    },
    fileFilter: (_req, file, cb) => {
      const allowed = kind === 'photo' ? ALLOWED_PHOTO_TYPES : ALLOWED_VIDEO_TYPES;
      if (allowed.has(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError(`Invalid file type: ${file.mimetype}`));
      }
    },
  }).single('file');
}

export const uploadPhoto = createUploadHandler('photo');
export const uploadVideo = createUploadHandler('video');

// Reusable multer error handler wrapper
export function handleUploadError(err: unknown): Error {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new BadRequestError('File is too large');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return new BadRequestError('Unexpected file field');
    }
    return new BadRequestError(err.message);
  }
  if (err instanceof Error) {
    return err;
  }
  return new BadRequestError('Upload failed');
}
