import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const ffmpegStatic: string | null = require('ffmpeg-static');

function getFfmpegPath(): string | null {
  // Prefer static binary; fall back to system ffmpeg
  return ffmpegStatic || 'ffmpeg';
}

export async function generateVideoThumbnail(
  videoPath: string,
  outputPath: string,
  options: { width?: number; height?: number; quality?: number } = {}
): Promise<boolean> {
  const { width = 400, height = 400, quality = 80 } = options;
  const ffmpegPath = getFfmpegPath();
  const tmpPng = `${outputPath}.tmp.png`;

  if (!ffmpegPath) {
    return false;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(ffmpegPath, [
        '-i', videoPath,
        '-ss', '00:00:00.500',
        '-vframes', '1',
        '-f', 'image2',
        '-pix_fmt', 'rgba',
        tmpPng,
      ]);

      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
        }
      });

      ffmpeg.on('error', reject);
    });

    await sharp(tmpPng)
      .resize({ width, height, fit: 'cover' })
      .webp({ quality })
      .toFile(outputPath);

    return true;
  } catch {
    return false;
  } finally {
    await fs.unlink(tmpPng).catch(() => {});
  }
}
