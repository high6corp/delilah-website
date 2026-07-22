import { fileTypeFromFile } from 'file-type';
import { ALLOWED_PHOTO_TYPES, ALLOWED_VIDEO_TYPES, CONFIG } from '../config.js';
import { PayloadTooLargeError, UnsupportedMediaTypeError } from './errors.js';

export type FileKind = 'photo' | 'video';

export async function validateUploadedFile(filePath: string, kind: FileKind, size: number) {
  const maxSize = kind === 'photo' ? CONFIG.MAX_PHOTO_SIZE : CONFIG.MAX_VIDEO_SIZE;

  if (size > maxSize) {
    throw new PayloadTooLargeError(
      `${kind === 'photo' ? 'Photo' : 'Video'} exceeds maximum size of ${maxSize} bytes`
    );
  }

  const fileType = await fileTypeFromFile(filePath);
  if (!fileType) {
    throw new UnsupportedMediaTypeError('Could not determine file type');
  }

  const allowed = kind === 'photo' ? ALLOWED_PHOTO_TYPES : ALLOWED_VIDEO_TYPES;
  if (!allowed.has(fileType.mime)) {
    throw new UnsupportedMediaTypeError(`File type ${fileType.mime} is not allowed for ${kind}`);
  }

  return { mimeType: fileType.mime, ext: fileType.ext };
}

export function getFileKindFromMime(mimeType: string): FileKind {
  if (ALLOWED_PHOTO_TYPES.has(mimeType)) return 'photo';
  if (ALLOWED_VIDEO_TYPES.has(mimeType)) return 'video';
  throw new UnsupportedMediaTypeError(`Unsupported media type: ${mimeType}`);
}
