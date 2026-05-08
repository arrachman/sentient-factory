import { z } from 'zod';

export const GENDERS = ['L', 'P'] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABEL: Record<Gender, string> = { L: 'Laki-laki', P: 'Perempuan' };

export const clientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  gender: z.enum(GENDERS),
  age: z.number().int().nullable(),
  phoneWa: z.string(),
  medicalRecordNumber: z.string().nullable(),
  preferredServiceType: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  waOptedOut: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Client = z.infer<typeof clientSchema>;

export const createClientSchema = z.object({
  name: z.string().min(2).max(255),
  gender: z.enum(GENDERS),
  age: z.number().int().min(0).max(120).optional(),
  phoneWa: z.string().min(8).max(30),
  medicalRecordNumber: z.string().max(80).optional(),
  preferredServiceType: z.string().max(60).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  waOptedOut: z.boolean().optional(),
});
export type CreateClientInput = z.infer<typeof createClientSchema>;

export type ListResponse = {
  success: boolean;
  data: Client[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
