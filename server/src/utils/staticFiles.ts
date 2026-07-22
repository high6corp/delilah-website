import fs from 'node:fs/promises';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';

export function serveSpa(staticDir: string) {
  const resolvedDir = path.resolve(staticDir);

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
      next();
      return;
    }

    const safePath = path.posix.normalize(req.path).replace(/^(\.\.(\/|$))+/, '');
    const filePath = path.join(resolvedDir, safePath);

    // Prevent path traversal
    if (!filePath.startsWith(resolvedDir + path.sep) && filePath !== resolvedDir) {
      res.sendFile(path.join(resolvedDir, 'index.html'));
      return;
    }

    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        res.sendFile(filePath);
        return;
      }
    } catch {
      // File doesn't exist, fall through to index.html
    }

    res.sendFile(path.join(resolvedDir, 'index.html'));
  };
}
