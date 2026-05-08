import { z } from 'zod';

export const SERVICE_CATEGORIES = ['konseling', 'terapi', 'tes'] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const SERVICE_CATEGORY_LABEL: Record<ServiceCategory, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  tes: 'Tes Psikologi',
};

export const serviceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.enum(SERVICE_CATEGORIES),
  sessionCount: z.number().int(),
  durationMinutes: z.number().int(),
  basePrice: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Service = z.infer<typeof serviceSchema>;

export const createServiceSchema = z.object({
  name: z.string().min(2).max(255),
  category: z.enum(SERVICE_CATEGORIES),
  sessionCount: z.number().int().min(1).max(100),
  durationMinutes: z.number().int().min(15).max(480),
  basePrice: z.number().min(0),
  description: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

export type ListResponse = {
  success: boolean;
  data: Service[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
