import { z } from 'zod';

export const apiFailureSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.unknown().optional(),
});

export const paginatedMetaSchema = z.object({
  page: z.number().int().positive().optional(),
  totalPages: z.number().int().positive().optional(),
  total: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().optional(),
});

export function apiSuccessSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    message: z.string().optional(),
    data: dataSchema,
    meta: paginatedMetaSchema.optional(),
  });
}

export function apiEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([apiSuccessSchema(dataSchema), apiFailureSchema]);
}
