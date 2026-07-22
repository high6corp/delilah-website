import path from 'node:path';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config.js';

export function getUploadBaseDir() {
  return path.resolve(CONFIG.UPLOAD_DIR);
}

export async function ensureUploadDirs() {
  const base = getUploadBaseDir();
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');

  await fs.mkdir(base, { recursive: true });
  await fs.mkdir(path.join(base, 'photos', year, month), { recursive: true });
  await fs.mkdir(path.join(base, 'videos', year, month), { recursive: true });
  await fs.mkdir(path.join(base, 'thumbnails', year, month), { recursive: true });
  await fs.mkdir(path.join(base, 'temp'), { recursive: true });

  return { base, year, month };
}

export function generateTempPath() {
  const base = getUploadBaseDir();
  return path.join(base, 'temp', `${uuidv4()}.tmp`);
}

export function generateStoragePath(type: 'photo' | 'video' | 'thumbnail', extension: string) {
  const base = getUploadBaseDir();
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const id = uuidv4();
  const subdir = type === 'thumbnail' ? 'thumbnails' : `${type}s`;
  const safeExt = extension.replace(/^\.+/, '').toLowerCase();
  const filename = safeExt ? `${id}.${safeExt}` : id;
  return {
    relativePath: path.posix.join(subdir, year, month, filename),
    absolutePath: path.join(base, subdir, year, month, filename),
    id,
  };
}

export function resolveStoragePath(relativePath: string) {
  const base = getUploadBaseDir();
  const resolved = path.resolve(base, relativePath);
  // Prevent path traversal
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error('Invalid storage path');
  }
  return resolved;
}
