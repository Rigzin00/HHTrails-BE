import { z } from 'zod';
import { REGIONS } from './tour.validator';

export const searchToursSchema = z.object({
  query: z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from must be a valid date in YYYY-MM-DD format'),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to must be a valid date in YYYY-MM-DD format'),
    destination: z.enum(REGIONS, {
      errorMap: () => ({ message: `Destination must be one of: ${REGIONS.join(', ')}` }),
    }),
  }),
});

export type SearchToursQuery = z.infer<typeof searchToursSchema>['query'];
