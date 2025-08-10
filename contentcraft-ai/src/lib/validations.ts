import { z } from 'zod';

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL').optional(),
});

// User Settings Schema
export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
  preferences: z.object({
    defaultTone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']).default('professional'),
    defaultStyle: z.enum(['informative', 'storytelling', 'how-to', 'listicle', 'case-study']).default('informative'),
    defaultLength: z.enum(['short', 'medium', 'long']).default('medium'),
  }),
});

// Blog Creation Schema
export const blogCreationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  topic: z.string().min(10, 'Topic must be at least 10 characters').max(500, 'Topic must be less than 500 characters'),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']),
  style: z.enum(['informative', 'storytelling', 'how-to', 'listicle', 'case-study']),
  length: z.enum(['short', 'medium', 'long']),
  brandVoice: z.string().optional(),
  targetAudience: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Blog Update Schema
export const blogUpdateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters').optional(),
  topic: z.string().min(10, 'Topic must be at least 10 characters').max(500, 'Topic must be less than 500 characters').optional(),
  content: z.string().optional(),
  outline: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  tags: z.array(z.string()).optional(),
});

// Blog Publish Schema
export const blogPublishSchema = z.object({
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  tags: z.array(z.string()).optional(),
  publishDate: z.date().optional(),
  featured: z.boolean().default(false),
});

// AI Generation Schema
export const aiGenerationSchema = z.object({
  type: z.enum(['outline', 'full-blog', 'enhance', 'seo-optimize']),
  blogId: z.string().optional(),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt must be less than 1000 characters'),
  options: z.object({
    tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']).optional(),
    style: z.enum(['informative', 'storytelling', 'how-to', 'listicle', 'case-study']).optional(),
    length: z.enum(['short', 'medium', 'long']).optional(),
    language: z.string().default('en'),
  }).optional(),
});

// Image Generation Schema
export const imageGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500, 'Prompt must be less than 500 characters'),
  style: z.enum(['realistic', 'artistic', 'minimal', 'vintage', 'modern']).default('realistic'),
  aspectRatio: z.enum(['1:1', '16:9', '4:3', '3:2']).default('16:9'),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Media Upload Schema
export const mediaUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'video', 'document']),
  blogId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Blog Search Schema
export const blogSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.object({
    status: z.enum(['draft', 'published', 'archived']).optional(),
    tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']).optional(),
    style: z.enum(['informative', 'storytelling', 'how-to', 'listicle', 'case-study']).optional(),
    dateRange: z.object({
      start: z.date().optional(),
      end: z.date().optional(),
    }).optional(),
  }).optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Export Options Schema
export const exportOptionsSchema = z.object({
  format: z.enum(['markdown', 'html', 'pdf', 'docx']),
  includeMetadata: z.boolean().default(true),
  includeImages: z.boolean().default(true),
  customCSS: z.string().optional(),
});

// Usage Event Schema
export const usageEventSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  details: z.record(z.any()).optional(),
  timestamp: z.date().default(() => new Date()),
});

// Form Validation Helper
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Sanitization Functions
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '');
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Type exports
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type BlogCreation = z.infer<typeof blogCreationSchema>;
export type BlogUpdate = z.infer<typeof blogUpdateSchema>;
export type BlogPublish = z.infer<typeof blogPublishSchema>;
export type AIGeneration = z.infer<typeof aiGenerationSchema>;
export type ImageGeneration = z.infer<typeof imageGenerationSchema>;
export type MediaUpload = z.infer<typeof mediaUploadSchema>;
export type BlogSearch = z.infer<typeof blogSearchSchema>;
export type ExportOptions = z.infer<typeof exportOptionsSchema>;
export type UsageEvent = z.infer<typeof usageEventSchema>;
