/**
 * Date helpers + booking position util untuk Jadwal Saya.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { SLOTS, SLOT_BASE_HOUR, type ScheduleFilters } from './constants';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** Senin (start) of week containing date. */
export function weekStart(dateKey: string): Date {
  const d = new Date(dateKey);
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function shiftWeek(dateKey: string, weeks: number): string {
  const d = new Date(dateKey);
  d.setDate(d.getDate() + weeks * 7);
  return toDateKey(d);
}

export function formatWeekLabel(dateKey: string): string {
  const start = weekStart(dateKey);
  const end = new Date(start);
  end.setDate(end.getDate() + 5);
  const startStr = start.toLocaleDateString('id-ID', { day: '2-digit' });
  const endStr = end.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}

export function bookingPositionInDay(
  b: Booking,
  dayDate: Date,
): { slotIdx: number; span: number } | null {
  const start = new Date(b.scheduledStart);
  const end = new Date(b.scheduledEnd);
  if (
    start.getFullYear() !== dayDate.getFullYear() ||
    start.getMonth() !== dayDate.getMonth() ||
    start.getDate() !== dayDate.getDate()
  ) {
    return null;
  }
  const slotIdx = start.getHours() - SLOT_BASE_HOUR;
  const durationHours = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000)),
  );
  const span = durationHours;
  if (slotIdx < 0 || slotIdx >= SLOTS.length) return null;
  return { slotIdx, span };
}

export function bookingTone(b: Booking): 'done' | 'now' | 'next' {
  if (b.status === 'completed') return 'done';
  if (b.status === 'in_progress') return 'now';
  return 'next';
}

export const padDay = pad;

// ============================================================================
// Day / month helpers
// ============================================================================

export function addDays(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function addMonths(key: string, months: number): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + months);
  return toDateKey(d);
}

export function monthStart(key: string): string {
  const d = new Date(key);
  d.setDate(1);
  return toDateKey(d);
}

export function monthEnd(key: string): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + 1, 0);
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

export function formatMonth(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

// ============================================================================
// Filter logic
// ============================================================================

export function applyFilters(
  bookings: Booking[],
  filters: ScheduleFilters,
): Booking[] {
  const { status, category, sesiType, clientQuery } = filters;
  const q = clientQuery.trim().toLowerCase();
  if (
    status === 'all' &&
    category === 'all' &&
    sesiType === 'all' &&
    !q
  ) {
    return bookings;
  }
  return bookings.filter((b) => {
    if (status !== 'all') {
      const tone = bookingTone(b);
      if (tone !== status) return false;
    }
    if (category !== 'all' && b.service.category !== category) return false;
    if (sesiType === 'tunggal' && b.sessionTotal > 1) return false;
    if (sesiType === 'multi' && b.sessionTotal <= 1) return false;
    if (sesiType === 'last' && b.sessionN !== b.sessionTotal) return false;
    if (q && !b.client.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function filterCount(filters: ScheduleFilters): number {
  return (
    (filters.status !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.sesiType !== 'all' ? 1 : 0) +
    (filters.clientQuery.trim() ? 1 : 0)
  );
}
