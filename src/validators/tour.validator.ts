import { z } from 'zod';

// Allowed values for tour properties
export const REGIONS = ['Ladakh', 'Spiti', 'Kashmir', 'Himachal'] as const;
export const TYPES = ['Cultural', 'Photography', 'Heritage', 'Village', 'Festival'] as const;
export const SEASONS = ['Summer', 'Winter', 'Monsoon', 'Festival'] as const;

// Create tour schema
export const createTourSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(1, 'Description is required'),
    region: z.enum(REGIONS, { errorMap: () => ({ message: `Region must be one of: ${REGIONS.join(', ')}` }) }),
    types: z.array(z.enum(TYPES, { errorMap: () => ({ message: `Each type must be one of: ${TYPES.join(', ')}` }) }))
      .min(1, 'At least one tour type is required'),
    season: z.enum(SEASONS, { errorMap: () => ({ message: `Season must be one of: ${SEASONS.join(', ')}` }) }),
    durationDays: z.number().int().positive('Duration days must be positive'),
    durationNights: z.number().int().min(0, 'Duration nights must be non-negative'),
    photoUrl: z.string().url('Photo URL must be a valid URL').min(1, 'Photo URL is required'),
    isCustom: z.boolean().optional().default(false),
  }),
});

// Update tour schema (all fields optional except at least one must be provided)
export const updateTourSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tour ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    region: z.enum(REGIONS).optional(),
    types: z.array(z.enum(TYPES)).min(1).optional(),
    season: z.enum(SEASONS).optional(),
    durationDays: z.number().int().positive().optional(),
    durationNights: z.number().int().min(0).optional(),
    photoUrl: z.string().url().min(1).optional(),
    isCustom: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

// Delete tour schema
export const deleteTourSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tour ID'),
  }),
});

// Get single tour schema
export const getTourSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tour ID'),
  }),
});

// Get tours list schema (with filters)
export const getToursSchema = z.object({
  query: z.object({
    region: z.enum(REGIONS).optional(),
    season: z.enum(SEASONS).optional(),
    types: z.string().optional(), // Comma-separated string, validated in controller
    isCustom: z.enum(['true', 'false']).optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
  }),
});

// Type exports
export type CreateTourInput = z.infer<typeof createTourSchema>['body'];
export type UpdateTourInput = z.infer<typeof updateTourSchema>['body'];
export type GetToursQuery = z.infer<typeof getToursSchema>['query'];
