import { z } from 'zod';

export const getNewsQuerySchema = z.object({
  sourceId: z.string().optional(),
  q: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && val <= 100), {
      message: 'Limit must be between 1 and 100',
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: 'Offset must be >= 0',
    }),
});

export type GetNewsQuery = z.infer<typeof getNewsQuerySchema>;

