/**
 * Helper: resolve effective availability psikolog di tanggal tertentu
 * berdasarkan weeklyAvailability + dateOverrides.
 *
 * Mirror logic backend `assertPsikologAvailable` — single source of truth
 * untuk visualisasi slot di /psikolog/schedule.
 */
import type { Booking } from '@/features/admin-booking/model/types';

export type DayAvailability = {
  isOpen: boolean;
  slotIndices: number[] | null; // null = semua slot
  source: 'override' | 'weekly' | 'unset';
  reason?: string | null;
};

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function resolveDayAvailability(
  date: Date,
  weeklyAvailability: Record<
    string,
    { isOpen: boolean; slotIndices?: number[] }
  > | null
  | undefined,
  overrides: Array<{
    date: string;
    isOpen: boolean;
    slotIndices: number[] | null;
    reason: string | null;
  }>,
): DayAvailability {
  // 1. Cek override per-tanggal (PRIORITAS)
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const override = overrides.find((o) => o.date.slice(0, 10) === dateKey);
  if (override) {
    return {
      isOpen: override.isOpen,
      slotIndices: override.isOpen ? override.slotIndices : null,
      source: 'override',
      reason: override.reason,
    };
  }

  // 2. Fallback weekly availability
  const wa = weeklyAvailability ?? {};
  if (Object.keys(wa).length === 0) {
    return { isOpen: false, slotIndices: null, source: 'unset' };
  }
  const dayCfg = wa[DAY_KEYS[date.getDay()]];
  if (!dayCfg || !dayCfg.isOpen) {
    return { isOpen: false, slotIndices: null, source: 'weekly' };
  }
  return {
    isOpen: true,
    slotIndices: Array.isArray(dayCfg.slotIndices) ? dayCfg.slotIndices : null,
    source: 'weekly',
  };
}

/**
 * Tone untuk slot cell yang BELUM ada bookingnya.
 *  - 'available'  → psikolog open + slot in range (dashed sage)
 *  - 'libur'      → psikolog tutup di hari ini atau slot di luar window
 *  - 'past'       → tanggal/slot sudah lewat
 */
export type SlotCellTone = 'available' | 'libur' | 'past';

export function emptySlotTone(args: {
  date: Date;
  slotIdx: number;
  slotEnd: string; // 'HH:MM'
  availability: DayAvailability;
  now?: Date;
}): SlotCellTone {
  const now = args.now ?? new Date();
  // Cek past: cek slotEnd di tanggal tsb < now
  const slotEndDate = new Date(args.date);
  const [eh, em] = args.slotEnd.split(':').map(Number);
  slotEndDate.setHours(eh, em, 0, 0);
  if (slotEndDate < now) return 'past';

  if (!args.availability.isOpen) return 'libur';

  const allowed = args.availability.slotIndices;
  if (allowed && !allowed.includes(args.slotIdx)) return 'libur';

  return 'available';
}

/**
 * Tone untuk slot cell yang SUDAH ada booking.
 */
export type BookedTone = 'now' | 'next' | 'done' | 'cancelled';

export function bookedTone(b: Booking, now: Date = new Date()): BookedTone {
  if (b.status === 'cancelled') return 'cancelled';
  if (b.status === 'completed') return 'done';
  if (b.status === 'in_progress') return 'now';
  // confirmed/checked_in/awaiting_dp: cek waktu — kalau slot udah lewat, treat as past-due
  const end = new Date(b.scheduledEnd);
  if (end < now) return 'done';
  return 'next';
}

/**
 * Cari booking yang occupy slot tertentu di tanggal tertentu.
 * Return null kalau slot kosong.
 */
export function bookingForSlot(
  bookings: Booking[],
  date: Date,
  slotStart: string,
  slotEnd: string,
): Booking | null {
  const slotStartDate = new Date(date);
  const [sh, sm] = slotStart.split(':').map(Number);
  slotStartDate.setHours(sh, sm, 0, 0);
  const slotEndDate = new Date(date);
  const [eh, em] = slotEnd.split(':').map(Number);
  slotEndDate.setHours(eh, em, 0, 0);

  return (
    bookings.find((b) => {
      const bs = new Date(b.scheduledStart);
      const be = new Date(b.scheduledEnd);
      return bs < slotEndDate && be > slotStartDate;
    }) ?? null
  );
}
