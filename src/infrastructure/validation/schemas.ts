import { z } from 'zod';

export const getNewsQuerySchema = z.object({
  q: z.string().optional(),
  fromDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        return new Date(val);
      } catch {
        throw new Error('Invalid fromDate format');
      }
    })
    .refine((val) => val === undefined || !isNaN(val.getTime()), {
      message: 'fromDate must be a valid date',
    }),
  toDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        return new Date(val);
      } catch {
        throw new Error('Invalid toDate format');
      }
    })
    .refine((val) => val === undefined || !isNaN(val.getTime()), {
      message: 'toDate must be a valid date',
    }),
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
}).refine(
  (data) => {
    if (data.fromDate && data.toDate) {
      return data.fromDate <= data.toDate;
    }
    return true;
  },
  {
    message: 'fromDate must be less than or equal to toDate',
    path: ['fromDate'],
  }
);

export type GetNewsQuery = z.infer<typeof getNewsQuerySchema>;

