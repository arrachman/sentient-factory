import { z } from 'zod';

export const GENDERS = ['L', 'P'] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABEL: Record<Gender, string> = { L: 'Laki-laki', P: 'Perempuan' };

export const CLIENT_CATEGORIES = ['dewasa', 'remaja', 'anak', 'pasangan', 'keluarga'] as const;
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];
export const CATEGORY_LABEL: Record<ClientCategory, string> = {
  dewasa: 'Dewasa',
  remaja: 'Remaja',
  anak: 'Anak',
  pasangan: 'Pasangan',
  keluarga: 'Keluarga',
};

export const CLIENT_STATUSES = ['baru', 'aktif', 'selesai'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];
export const STATUS_LABEL: Record<ClientStatus, string> = {
  baru: 'Baru',
  aktif: 'Aktif',
  selesai: 'Selesai',
};

export const STATUS_BADGE: Record<ClientStatus, string> = {
  aktif: 'badge-sage',
  baru: 'badge-warn',
  selesai: 'badge-neutral',
};

export const CATEGORY_PALETTE: Record<ClientCategory, { bg: string; fg: string }> = {
  dewasa:   { bg: '#e1ebe2', fg: '#385a43' }, // sage-100 / sage-700
  remaja:   { bg: '#d4e3ee', fg: '#2c4a60' }, // info-soft
  anak:     { bg: '#f7e9e3', fg: '#8b3d2a' }, // rose-100
  pasangan: { bg: '#cfd9e0', fg: '#3d556d' }, // blue-grey
  keluarga: { bg: '#e6dfb8', fg: '#6b5320' }, // amber-soft
};

export type SessionRef = {
  date: string;
  serviceName: string | null;
  psikologName: string | null;
};

export type CurrentService = {
  name: string;
  psikologName: string | null;
  sessionN: number;
  sessionTotal: number;
};

export const clientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  gender: z.enum(GENDERS),
  age: z.number().int().nullable(),
  category: z.enum(CLIENT_CATEGORIES).nullable(),
  phoneWa: z.string(),
  medicalRecordNumber: z.string().nullable(),
  preferredServiceType: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  waOptedOut: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Derived from backend enrichment
  derivedStatus: z.enum(CLIENT_STATUSES),
  totalBookings: z.number().int(),
  lastSession: z
    .object({
      date: z.string(),
      serviceName: z.string().nullable(),
      psikologName: z.string().nullable(),
    })
    .nullable(),
  nextSession: z
    .object({
      date: z.string(),
      serviceName: z.string().nullable(),
      psikologName: z.string().nullable(),
    })
    .nullable(),
  currentService: z
    .object({
      name: z.string(),
      psikologName: z.string().nullable(),
      sessionN: z.number().int(),
      sessionTotal: z.number().int(),
    })
    .nullable(),
});
export type Client = z.infer<typeof clientSchema>;

export type ClientWithHistory = Client & {
  recentSessions: Array<{
    id: number;
    date: string;
    serviceName: string | null;
    psikologName: string | null;
    status: string;
  }>;
};

export const createClientSchema = z.object({
  name: z.string().min(2).max(255),
  gender: z.enum(GENDERS),
  age: z.number().int().min(0).max(120).optional(),
  category: z.enum(CLIENT_CATEGORIES).optional(),
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
