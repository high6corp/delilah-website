import type { Comment } from '@/types';
import { apiPost } from './client';

export async function addMediaComment(
  mediaId: string,
  name: string,
  text: string
): Promise<Comment> {
  return apiPost<Comment>(`/api/comments/media/${mediaId}`, { name, text });
}

export async function addStoryComment(
  storyId: string,
  name: string,
  text: string
): Promise<Comment> {
  return apiPost<Comment>(`/api/comments/stories/${storyId}`, { name, text });
}
