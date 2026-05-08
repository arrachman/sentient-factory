import { z } from 'zod';

export const CLINIC_ROLES = [
  'clinic-admin',
  'clinic-psikolog',
  'clinic-owner',
  'clinic-resepsionis',
  'clinic-marketing',
  'clinic-intern',
] as const;
export type ClinicRoleName = (typeof CLINIC_ROLES)[number];

export const ROLE_LABEL: Record<ClinicRoleName, string> = {
  'clinic-admin': 'Admin',
  'clinic-psikolog': 'Psikolog',
  'clinic-owner': 'Owner',
  'clinic-resepsionis': 'Resepsionis',
  'clinic-marketing': 'Marketing',
  'clinic-intern': 'Intern',
};

export const userSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  username: z.string(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  isActive: z.boolean(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  roles: z.array(z.object({ id: z.number().int(), name: z.string(), description: z.string().nullable() })),
});
export type ClinicUser = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(255),
  username: z.string().max(120).optional(),
  password: z.string().min(8).max(120).optional(),
  roles: z.array(z.string()).min(1),
  isActive: z.boolean().optional(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export type ListResponse = {
  success: boolean;
  data: ClinicUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
