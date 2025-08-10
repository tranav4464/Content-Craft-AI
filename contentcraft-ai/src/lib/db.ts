import { prisma } from './prisma';
import { Blog, Media, UsageEvent, User } from '@prisma/client';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function createBlog(data: {
  userId: string;
  title: string;
  topic: string;
  tone: string;
  style: string;
  length: string;
  content?: string;
  outline?: string;
}) {
  try {
    const blog = await prisma.blog.create({
      data: {
        ...data,
        content: data.content || '',
        outline: data.outline || '[]',
        status: 'draft'
      }
    });
    return blog;
  } catch (error) {
    throw new DatabaseError(
      `Failed to create blog: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'BLOG_CREATE_ERROR'
    );
  }
}

export async function getBlogById(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        media: true
      }
    });
    return blog;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get blog: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'BLOG_GET_ERROR'
    );
  }
}

export async function getUserBlogs(userId: string) {
  try {
    const blogs = await prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        media: true
      }
    });
    return blogs;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get user blogs: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'BLOG_LIST_ERROR'
    );
  }
}

export async function updateBlog(id: string, data: Partial<Blog>) {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return blog;
  } catch (error) {
    throw new DatabaseError(
      `Failed to update blog: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'BLOG_UPDATE_ERROR'
    );
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    throw new DatabaseError(
      `Failed to delete blog: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'BLOG_DELETE_ERROR'
    );
  }
}

export async function createMedia(data: {
  userId: string;
  blogId?: string;
  type: 'image' | 'video' | 'document';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}) {
  try {
    const media = await prisma.media.create({
      data: {
        ...data,
        metadata: {}
      }
    });
    return media;
  } catch (error) {
    throw new DatabaseError(
      `Failed to create media: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'MEDIA_CREATE_ERROR'
    );
  }
}

export async function getUserMedia(userId: string) {
  try {
    const media = await prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return media;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get user media: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'MEDIA_LIST_ERROR'
    );
  }
}

export async function deleteMedia(id: string) {
  try {
    await prisma.media.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    throw new DatabaseError(
      `Failed to delete media: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'MEDIA_DELETE_ERROR'
    );
  }
}

export async function trackUsage(data: {
  userId: string;
  action: string;
  details?: Record<string, any>;
}) {
  try {
    const usage = await prisma.usageEvent.create({
      data: {
        ...data,
        timestamp: new Date()
      }
    });
    return usage;
  } catch (error) {
    throw new DatabaseError(
      `Failed to track usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'USAGE_TRACK_ERROR'
    );
  }
}

export async function getUserUsageStats(userId: string, days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const usage = await prisma.usageEvent.groupBy({
      by: ['action'],
      where: {
        userId,
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        action: true
      }
    });
    
    return usage;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get usage stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'USAGE_STATS_ERROR'
    );
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'USER_GET_ERROR'
    );
  }
}

export async function checkDatabaseHealth() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get basic stats
    const userCount = await prisma.user.count();
    const blogCount = await prisma.blog.count();
    const mediaCount = await prisma.media.count();
    
    return {
      status: 'healthy',
      connection: 'connected',
      stats: {
        users: userCount,
        blogs: blogCount,
        media: mediaCount
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connection: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}
