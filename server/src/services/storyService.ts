import { prisma } from '../prisma/client.js';
import { NotFoundError } from '../utils/errors.js';

interface CreateStoryInput {
  title: string;
  category: string;
  content: string;
  authorName: string;
}

export async function createStory(input: CreateStoryInput) {
  return prisma.story.create({
    data: {
      title: input.title.trim(),
      category: input.category.trim(),
      content: input.content.trim(),
      authorName: input.authorName.trim(),
    },
  });
}

export async function listStories(category?: string) {
  return prisma.story.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
}

export async function getStoryById(id: string) {
  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!story) {
    throw new NotFoundError('Story not found');
  }

  return story;
}

export async function deleteStory(id: string) {
  const story = await prisma.story.findUnique({ where: { id } });
  if (!story) {
    throw new NotFoundError('Story not found');
  }

  await prisma.story.delete({ where: { id } });
}
