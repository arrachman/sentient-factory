/**
 * Format helpers untuk dashboard psikolog.
 */
import type { Booking } from '@/features/admin-booking/model/types';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDayLong(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

export function bookingTone(b: Booking): 'done' | 'now' | 'next' {
  if (b.status === 'completed') return 'done';
  if (b.status === 'in_progress') return 'now';
  return 'next';
}

export function shortService(
  svcName: string,
  sessionN: number,
  sessionTotal: number,
): string {
  if (sessionTotal > 1) {
    return `${svcName} · Sesi ${sessionN}/${sessionTotal}`;
  }
  return svcName;
}
