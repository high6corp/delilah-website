import type { BlogPost } from '@/types';
import { apiDelete, apiGet, apiPost } from './client';

export async function listStories(category?: string): Promise<BlogPost[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiGet<BlogPost[]>(`/api/stories${query}`);
}

export async function getStory(id: string): Promise<BlogPost> {
  return apiGet<BlogPost>(`/api/stories/${id}`);
}

export async function createStory(input: {
  title: string;
  category: string;
  content: string;
  authorName: string;
}): Promise<BlogPost> {
  return apiPost<BlogPost>('/api/stories', input);
}

export async function deleteStory(id: string): Promise<void> {
  await apiDelete(`/api/stories/${id}`);
}
