import { z } from 'zod';

// ─── Create ────────────────────────────────────────────────────────────────
export const createBlogSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required'),
    coverImageUrl: z.string().url('Cover image URL must be a valid URL'),
    title: z.string().min(1, 'Title is required').max(300, 'Title must be less than 300 characters'),
    shortDescription: z.string().min(1, 'Short description is required'),
    content: z.string().min(1, 'Content is required'),
    authorName: z.string().min(1, 'Author name is required'),
    publishedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Published date must be in YYYY-MM-DD format')
      .optional(),
    readingTimeMinutes: z
      .number({ invalid_type_error: 'Reading time must be a number' })
      .int('Reading time must be an integer')
      .positive('Reading time must be a positive integer'),
  }),
});

// ─── Update ────────────────────────────────────────────────────────────────
export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid blog ID'),
  }),
  body: z
    .object({
      category: z.string().min(1).optional(),
      coverImageUrl: z.string().url().optional(),
      title: z.string().min(1).max(300).optional(),
      shortDescription: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      authorName: z.string().min(1).optional(),
      publishedDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Published date must be in YYYY-MM-DD format')
        .optional(),
      readingTimeMinutes: z.number().int().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

// ─── Delete / Get single ───────────────────────────────────────────────────
export const blogIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid blog ID'),
  }),
});

// ─── Get list ──────────────────────────────────────────────────────────────
export const getBlogsSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
  }),
});

// ─── Type exports ──────────────────────────────────────────────────────────
export type CreateBlogInput = z.infer<typeof createBlogSchema>['body'];
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>['body'];
export type GetBlogsQuery = z.infer<typeof getBlogsSchema>['query'];
