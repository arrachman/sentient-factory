import { z } from 'zod';

export const SERVICE_CATEGORIES = ['konseling', 'terapi', 'tes'] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const SERVICE_CATEGORY_LABEL: Record<ServiceCategory, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  tes: 'Tes Psikologi',
};

/**
 * Display group untuk UI (sesuai mockup AdminLayanan.jsx). Lebih kaya dari
 * `category` (enum DB) karena memisah "anak" sebagai grup tersendiri walaupun
 * service-nya bisa kategori konseling / terapi / tes di backend.
 */
export const SERVICE_GROUPS = ['konseling', 'terapi', 'anak', 'tes'] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

export const SERVICE_GROUP_INFO: Record<
  ServiceGroup,
  { label: string; desc: string; color: string; soft: string }
> = {
  konseling: { label: 'Konseling', desc: 'Sesi tunggal dengan psikolog', color: '#5b8a66', soft: '#e1ebe2' },
  terapi:    { label: 'Terapi', desc: 'Paket sesi terstruktur', color: '#7894a8', soft: '#cfd9e0' },
  anak:      { label: 'Layanan Anak', desc: 'Konseling, terapi, dan tes khusus anak', color: '#c97a5d', soft: '#f7e9e3' },
  tes:       { label: 'Tes Psikologi', desc: 'Asesmen individu maupun korporat', color: '#b89249', soft: '#e6dfb8' },
};

export function serviceGroupOf(s: Pick<Service, 'category' | 'name'>): ServiceGroup {
  if (/anak|playground/i.test(s.name)) return 'anak';
  if (s.category === 'konseling') return 'konseling';
  if (s.category === 'terapi') return 'terapi';
  return 'tes';
}

export const serviceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.enum(SERVICE_CATEGORIES),
  sessionCount: z.number().int(),
  durationMinutes: z.number().int(),
  basePrice: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  description: z.string().nullable(),
  isActive: z.boolean(),
  bookedThisMonth: z.number().int().optional().default(0),
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
