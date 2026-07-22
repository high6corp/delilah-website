import { API_BASE_URL } from '@/api/client';
import type { MediaItem } from '@/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getFileUrl(id: string): string {
  return `${API_BASE_URL}/api/files/${id}`;
}

function videoPlaceholder(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#EDE5F5"/>
    <circle cx="200" cy="180" r="60" fill="#7B5FB5" opacity="0.2"/>
    <polygon points="180,150 240,180 180,210" fill="#7B5FB5"/>
    <text x="200" y="290" font-family="Arial, sans-serif" font-size="20" fill="#7B5FB5" text-anchor="middle">Video</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getThumbnailUrl(item: MediaItem): string {
  if (item.thumbnailPath) {
    return `${API_BASE_URL}/api/files/${item.id}/thumbnail`;
  }
  if (item.type === 'VIDEO') {
    return videoPlaceholder();
  }
  return getFileUrl(item.id);
}

export function mediaTypeLabel(type: MediaItem['type']): string {
  return type === 'PHOTO' ? 'Photo' : 'Video';
}

export function filterToApiType(filter: 'all' | 'photos' | 'videos'): 'photo' | 'video' | undefined {
  if (filter === 'photos') return 'photo';
  if (filter === 'videos') return 'video';
  return undefined;
}
