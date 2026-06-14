/**
 * Period helpers untuk Owner Dashboard & Analitik.
 *
 * `Harian`   → 1 hari (anchor)
 * `Mingguan` → Senin–Minggu yang memuat anchor
 * `Bulanan`  → tanggal 1 s/d akhir bulan dari anchor
 */
import { dateKey, pad2 } from './format';

export type PeriodMode = 'Harian' | 'Mingguan' | 'Bulanan';

export type PeriodRange = {
  mode: PeriodMode;
  anchor: string;
  from: string;
  to: string;
  days: string[];
};

export function todayKey(): string {
  return dateKey(new Date());
}

export function addDaysKey(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

export function addMonthsKey(key: string, months: number): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + months);
  return dateKey(d);
}

export function weekStartMonday(key: string): string {
  const d = new Date(key);
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return dateKey(d);
}

export function monthStartKey(key: string): string {
  const d = new Date(key);
  d.setDate(1);
  return dateKey(d);
}

export function monthEndKey(key: string): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + 1, 0);
  return dateKey(d);
}

export function resolveRange(mode: PeriodMode, anchor: string): PeriodRange {
  if (!anchor) {
    return { mode, anchor: '', from: '', to: '', days: [] };
  }
  if (mode === 'Harian') {
    return { mode, anchor, from: anchor, to: anchor, days: [anchor] };
  }
  if (mode === 'Mingguan') {
    const from = weekStartMonday(anchor);
    const days = Array.from({ length: 7 }, (_, i) => addDaysKey(from, i));
    return { mode, anchor, from, to: days[6], days };
  }
  const from = monthStartKey(anchor);
  const to = monthEndKey(anchor);
  const days: string[] = [];
  const start = new Date(from);
  const end = new Date(to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(dateKey(d));
  }
  return { mode, anchor, from, to, days };
}

export function shiftAnchor(
  mode: PeriodMode,
  anchor: string,
  dir: -1 | 1,
): string {
  if (mode === 'Harian') return addDaysKey(anchor, dir);
  if (mode === 'Mingguan') return addDaysKey(anchor, dir * 7);
  return addMonthsKey(anchor, dir);
}

export function formatRangeLabel(range: PeriodRange): string {
  if (!range.anchor) return '';
  if (range.mode === 'Harian') {
    return new Date(range.anchor).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  if (range.mode === 'Mingguan') {
    const s = new Date(range.from);
    const e = new Date(range.to);
    const sameMonth = s.getMonth() === e.getMonth();
    const startStr = sameMonth
      ? s.toLocaleDateString('id-ID', { day: '2-digit' })
      : s.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const endStr = e.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${startStr} – ${endStr}`;
  }
  return new Date(range.anchor).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

export function periodLabelShort(mode: PeriodMode): string {
  if (mode === 'Harian') return 'hari ini';
  if (mode === 'Mingguan') return 'minggu ini';
  return 'bulan ini';
}

export function isMonthKey(key: string, monthAnchor: string): boolean {
  const m = `${monthAnchor.slice(0, 4)}-${pad2(Number(monthAnchor.slice(5, 7)))}`;
  return key.startsWith(m);
}
