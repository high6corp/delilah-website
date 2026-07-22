import type { MediaItem } from '@/types';
import { API_BASE_URL } from './client';
import { apiDelete, apiGet, uploadWithProgress } from './client';

export async function listMedia(type?: 'photo' | 'video'): Promise<MediaItem[]> {
  const query = type ? `?type=${type}` : '';
  return apiGet<MediaItem[]>(`/api/media${query}`);
}

export async function getMedia(id: string): Promise<MediaItem> {
  return apiGet<MediaItem>(`/api/media/${id}`);
}

export async function uploadPhoto(
  file: File,
  title: string,
  uploaderName: string,
  description: string,
  onProgress: (progress: number) => void
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('uploaderName', uploaderName);
  if (description) formData.append('description', description);

  const xhr = await uploadWithProgress('/api/media/photo', formData, onProgress);
  return JSON.parse(xhr.responseText) as MediaItem;
}

export async function uploadVideo(
  file: File,
  title: string,
  uploaderName: string,
  description: string,
  onProgress: (progress: number) => void
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('uploaderName', uploaderName);
  if (description) formData.append('description', description);

  const xhr = await uploadWithProgress('/api/media/video', formData, onProgress);
  return JSON.parse(xhr.responseText) as MediaItem;
}

export async function deleteMedia(id: string): Promise<void> {
  await apiDelete(`/api/media/${id}`);
}

export function getFileUrl(id: string, thumbnail = false): string {
  return `${API_BASE_URL}/api/files/${id}${thumbnail ? '/thumbnail' : ''}`;
}
