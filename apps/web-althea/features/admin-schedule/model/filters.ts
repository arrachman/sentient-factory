/**
 * Logic filter & lookup booking untuk halaman Admin · Penjadwalan.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { Filters, SlotDef, TimeOfDay } from './types';

/**
 * Cari booking yang overlap dengan satu sel grid (psikolog × slot × tanggal).
 * Returns null kalau tidak ada — sel kosong = tampilkan EmptySlot.
 */
export function findBookingForSlot(
  bookings: Booking[],
  psikologUserId: number,
  dateKey: string,
  slot: SlotDef,
): Booking | null {
  const slotStart = new Date(`${dateKey}T${slot.start}:00`);
  const slotEnd = new Date(`${dateKey}T${slot.end}:00`);
  return (
    bookings.find((b) => {
      if (b.psikologUserId !== psikologUserId) return false;
      const bStart = new Date(b.scheduledStart);
      const bEnd = new Date(b.scheduledEnd);
      return bStart < slotEnd && bEnd > slotStart;
    }) || null
  );
}

export function timeOfDayOf(b: Booking): TimeOfDay {
  const hour = new Date(b.scheduledStart).getHours();
  if (hour < 13) return 'pagi'; // 08–12
  if (hour < 17) return 'siang'; // 13–16
  return 'sore'; // 17–21
}

export function applyFilters(
  bookings: Booking[],
  filters: Filters,
): Booking[] {
  const {
    psikologIds,
    categories,
    roomIds,
    statuses,
    clientQuery,
    timeOfDay,
    serviceIds,
    sesiType,
  } = filters;
  const q = clientQuery.trim().toLowerCase();
  const hasAny =
    psikologIds.size > 0 ||
    categories.size > 0 ||
    roomIds.size > 0 ||
    statuses.size > 0 ||
    q.length > 0 ||
    timeOfDay.size > 0 ||
    serviceIds.size > 0 ||
    sesiType !== 'all';
  if (!hasAny) return bookings;
  return bookings.filter((b) => {
    if (psikologIds.size > 0 && !psikologIds.has(b.psikologUserId)) return false;
    if (categories.size > 0 && !categories.has(b.service.category)) return false;
    if (roomIds.size > 0 && !roomIds.has(b.room.id)) return false;
    if (statuses.size > 0 && !statuses.has(b.status)) return false;
    if (q && !b.client.name.toLowerCase().includes(q)) return false;
    if (timeOfDay.size > 0 && !timeOfDay.has(timeOfDayOf(b))) return false;
    if (serviceIds.size > 0 && !serviceIds.has(b.service.id)) return false;
    if (sesiType === 'tunggal' && b.sessionTotal > 1) return false;
    if (sesiType === 'multi' && b.sessionTotal <= 1) return false;
    if (sesiType === 'last' && b.sessionN !== b.sessionTotal) return false;
    return true;
  });
}

export function filterCount(filters: Filters): number {
  return (
    filters.psikologIds.size +
    filters.categories.size +
    filters.roomIds.size +
    filters.statuses.size +
    (filters.clientQuery.trim() ? 1 : 0) +
    filters.timeOfDay.size +
    filters.serviceIds.size +
    (filters.sesiType !== 'all' ? 1 : 0)
  );
}

/**
 * Helper kecil untuk toggle item di Set (immutable).
 */
export function toggleSet<T>(set: Set<T>, v: T): Set<T> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next;
}
