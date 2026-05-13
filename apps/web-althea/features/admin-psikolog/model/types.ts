import { z } from 'zod';

/**
 * Psikolog response shape from api-gateway `/clinic/psikolog`.
 * Mirror of `ClinicPsikologService.mapToResponse()`.
 */
export const dayAvailabilitySchema = z.object({
  isOpen: z.boolean(),
  slotIndices: z.array(z.number().int()).optional(),
});
export type DayAvailability = z.infer<typeof dayAvailabilitySchema>;

export const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABEL: Record<DayKey, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

/** Helper: cek apakah jadwal mingguan sudah pernah di-set (non-empty). */
export function hasWeeklyAvailability(
  wa: Record<string, DayAvailability> | null | undefined,
): boolean {
  return !!wa && Object.keys(wa).length > 0;
}

export const psikologSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  email: z.string().email(),
  username: z.string(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  phone: z.string().nullable().optional(),
  isActive: z.boolean(),
  title: z.string().nullable(),
  specialty: z.array(z.string()),
  color: z.string().nullable(),
  license: z.string().nullable(),
  defaultSlots: z.number().int(),
  weeklyAvailability: z.record(z.string(), dayAvailabilitySchema).default({}),
  /** Layanan yang ditangani psikolog. Kosong = handle semua (default). */
  serviceIds: z.array(z.number().int()).default([]),
  bio: z.string().nullable(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hasBookings: z.boolean().default(false),
});

export type Psikolog = z.infer<typeof psikologSchema>;

/**
 * Form schema untuk create.
 * - Required: email, fullName
 * - Optional pakai `.optional()` (input/output sama → compat react-hook-form)
 * - Tidak pakai `.default()` (kasih default di form `defaultValues`)
 */
export const createPsikologSchema = z.object({
  email: z.string().email('Email tidak valid'),
  fullName: z.string().min(2, 'Nama minimal 2 karakter').max(255),
  phone: z
    .string()
    .max(32, 'No WhatsApp maksimal 32 karakter')
    .optional()
    .or(z.literal('')),
  username: z.string().max(120).optional(),
  // Password wajib saat tambah psikolog baru — minimal 8 karakter.
  // Update schema (lihat updatePsikologSchema below) drop field ini, jadi
  // edit mode tidak butuh isi ulang password.
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(120, 'Password maksimal 120 karakter'),
  title: z.string().max(80).optional(),
  specialty: z.array(z.string()).max(10).optional(),
  color: z.string().max(20).optional(),
  license: z.string().max(80).optional(),
  defaultSlots: z.number().int().min(0).max(20).optional(),
  weeklyAvailability: z.record(z.string(), dayAvailabilitySchema).optional(),
  /** Layanan yang ditangani. Kosong/undefined = handle semua. */
  serviceIds: z.array(z.number().int()).optional(),
  bio: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePsikologInput = z.infer<typeof createPsikologSchema>;

/**
 * Update schema = create minus immutable fields, semua optional.
 */
export const updatePsikologSchema = createPsikologSchema
  .omit({ email: true, username: true, password: true })
  .partial();

export type UpdatePsikologInput = z.infer<typeof updatePsikologSchema>;

/**
 * Specialty options (sesuai mockup althea-data.jsx).
 */
export const SPECIALTY_OPTIONS = [
  'klinis_dewasa',
  'anak_remaja',
  'pasangan',
  'keluarga',
  'tes_psikologi',
  'terapi_anak',
  'tumbuh_kembang',
] as const;

/**
 * Specialty label dalam Bahasa Indonesia.
 */
export const SPECIALTY_LABEL: Record<string, string> = {
  klinis_dewasa: 'Klinis Dewasa',
  anak_remaja: 'Anak & Remaja',
  pasangan: 'Pasangan',
  keluarga: 'Keluarga',
  tes_psikologi: 'Tes Psikologi',
  terapi_anak: 'Terapi Anak',
  tumbuh_kembang: 'Tumbuh Kembang',
};

/**
 * Default avatar color palette (sage spectrum).
 */
export const COLOR_PALETTE = [
  '#5b8a66',
  '#7aa382',
  '#c97a5d',
  '#6f8aa3',
  '#9c7c3c',
  '#3a4f4f',
  '#e3a895',
];

export type ListResponse = {
  success: boolean;
  data: Psikolog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SingleResponse = {
  success: boolean;
  data: Psikolog;
  message?: string;
};
