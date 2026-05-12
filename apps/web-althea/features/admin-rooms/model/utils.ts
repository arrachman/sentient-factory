/**
 * Utility helpers untuk halaman Pemakaian Ruangan.
 *
 * - Date helpers: ISO date key (YYYY-MM-DD) supaya konsisten antara state &
 *   query param /clinic/booking?date=...
 * - shortName: render nama psikolog ringkas (untuk sel grid yang sempit)
 * - bookingForCell: cek overlap booking × slot × room
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { SlotDef } from './constants';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function shiftDate(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function formatDateLong(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Render nama psikolog yang ringkas:
 *   "Vina Aulia Saputra" → "Vina A."
 *   "Vina"               → "Vina"
 *   tidak ada fullName   → bagian sebelum @ pada email
 */
export function shortName(
  fullName: string | null | undefined,
  email: string,
): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return email.split('@')[0];
}

/**
 * Cari booking yang overlap dengan satu sel (room × slot) pada tanggal aktif.
 * Returns null kalau tidak ada (sel kosong = tampilkan placeholder dashed).
 */
export function bookingForCell(
  bookings: Booking[],
  roomId: number,
  dateKey: string,
  slot: SlotDef,
): Booking | null {
  const slotStart = new Date(`${dateKey}T${slot.start}:00`).getTime();
  const slotEnd = new Date(`${dateKey}T${slot.end}:00`).getTime();
  return (
    bookings.find((b) => {
      if (b.room.id !== roomId) return false;
      const bs = new Date(b.scheduledStart).getTime();
      const be = new Date(b.scheduledEnd).getTime();
      return bs < slotEnd && be > slotStart;
    }) ?? null
  );
}
