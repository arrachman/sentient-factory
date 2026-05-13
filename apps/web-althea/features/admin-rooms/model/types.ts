import { z } from 'zod';

export const ROOM_TYPES = ['konseling', 'anak', 'tes', 'seminar'] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  konseling: 'Konseling',
  anak: 'Anak',
  tes: 'Tes Psikologi',
  seminar: 'Seminar',
};

export const roomSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  type: z.enum(ROOM_TYPES),
  capacity: z.number().int(),
  /** Daftar fasilitas terstruktur (default []) — fallback ke DEFAULT_FACILITIES kalau kosong */
  facilities: z.array(z.string()).default([]),
  /** Catatan freeform admin (notes only — bukan lagi facilities source) */
  description: z.string().nullable(),
  isActive: z.boolean(),
  hasBookings: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Room = z.infer<typeof roomSchema>;

export const createRoomSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(ROOM_TYPES),
  capacity: z.number().int().min(1).max(50).optional(),
  facilities: z.array(z.string().max(60)).max(30).optional(),
  description: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});
export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export type ListResponse = {
  success: boolean;
  data: Room[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
