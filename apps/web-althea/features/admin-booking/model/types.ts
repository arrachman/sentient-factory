import { z } from 'zod';

export const BOOKING_STATUSES = [
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  checked_in: 'Check-in',
  in_progress: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Batal',
};

export const STATUS_BADGE_CLASS: Record<BookingStatus, string> = {
  checked_in: 'badge-terapi',
  in_progress: 'badge-rose',
  completed: 'badge-success',
  cancelled: 'badge-neutral',
};

export type Booking = {
  id: number;
  clientId: number;
  serviceId: number;
  psikologUserId: number;
  roomId: number;
  scheduledStart: string;
  scheduledEnd: string;
  sessionN: number;
  sessionTotal: number;
  packageGroupId: string | null;
  status: BookingStatus;
  bufferOverride: boolean;
  createdViaWalkIn: boolean;
  notes: string | null;
  client: { id: number; name: string; gender: string; phoneWa: string };
  service: { id: number; name: string; category: string; sessionCount: number; durationMinutes: number; basePrice: string | number };
  psikolog: {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    clinicPsikologProfile: { title: string | null; color: string | null } | null;
  };
  room: { id: number; name: string; type: string };
};

export type ListResponse = {
  success: boolean;
  data: Booking[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const createBookingSchema = z.object({
  clientId: z.number().int(),
  serviceId: z.number().int(),
  psikologUserId: z.number().int(),
  roomId: z.number().int(),
  scheduledStart: z.string(),
  scheduledEnd: z.string(),
  sessionN: z.number().int().optional(),
  sessionTotal: z.number().int().optional(),
  bufferOverride: z.boolean().optional(),
  createdViaWalkIn: z.boolean().optional(),
  notes: z.string().optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
