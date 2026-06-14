import type { Booking } from '@/features/admin-booking/model/types';

export function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtDateLong(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function normalizeWa(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

/**
 * Hitung label relatif terhadap waktu sekarang.
 *   - "X mnt lagi"   → upcoming (<= 60 mnt sebelum mulai)
 *   - "Telat X mnt"  → checked_in tapi sudah lewat waktu mulai
 *   - "X mnt sisa"   → sedang berlangsung
 * Null jika tidak relevan (terlalu jauh / sudah selesai).
 */
export function computeRelative(
  b: Booking,
  now: Date | null,
): { text: string; tone: 'late' | 'soon' } | null {
  if (!now) return null;
  const start = new Date(b.scheduledStart).getTime();
  const end = new Date(b.scheduledEnd).getTime();
  const t = now.getTime();

  if (b.status === 'checked_in') {
    const diff = Math.round((start - t) / 60000);
    if (diff < 0) return { text: `Telat ${-diff} mnt`, tone: 'late' };
    if (diff <= 60) return { text: `${diff} mnt lagi`, tone: 'soon' };
    return null;
  }
  if (b.status === 'in_progress') {
    const remaining = Math.round((end - t) / 60000);
    if (remaining < 0)
      return { text: `Lewat ${-remaining} mnt`, tone: 'late' };
    return { text: `${remaining} mnt sisa`, tone: 'soon' };
  }
  return null;
}
