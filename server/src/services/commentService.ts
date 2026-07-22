import { prisma } from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

interface CreateCommentInput {
  name: string;
  text: string;
  isDelilah?: boolean;
  mediaId?: string;
  storyId?: string;
}

export async function createComment(input: CreateCommentInput) {
  if (!input.mediaId && !input.storyId) {
    throw new BadRequestError('Comment must be attached to media or story');
  }
  if (input.mediaId && input.storyId) {
    throw new BadRequestError('Comment can only be attached to one item');
  }

  if (input.mediaId) {
    const media = await prisma.media.findUnique({ where: { id: input.mediaId } });
    if (!media) {
      throw new NotFoundError('Media not found');
    }
  }

  if (input.storyId) {
    const story = await prisma.story.findUnique({ where: { id: input.storyId } });
    if (!story) {
      throw new NotFoundError('Story not found');
    }
  }

  return prisma.comment.create({
    data: {
      name: input.name.trim(),
      text: input.text.trim(),
      isDelilah: input.isDelilah ?? false,
      mediaId: input.mediaId || null,
      storyId: input.storyId || null,
    },
  });
}

export async function deleteComment(id: string) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  await prisma.comment.delete({ where: { id } });
}
