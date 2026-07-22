export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: 'PHOTO' | 'VIDEO';
  originalName: string;
  storagePath: string;
  thumbnailPath: string | null;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  createdAt: string;
  updatedAt: string;
  uploaderName: string;
  _count?: { comments: number };
  comments?: Comment[];
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  _count?: { comments: number };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  mediaId?: string | null;
  storyId?: string | null;
  name: string;
  text: string;
  isDelilah: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type UploadTab = 'photo' | 'video' | 'story';
export type GalleryFilter = 'all' | 'photos' | 'videos';

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
