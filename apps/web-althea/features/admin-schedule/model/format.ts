/**
 * Date helpers untuk halaman Admin · Penjadwalan.
 *   - ISO-key style: YYYY-MM-DD (locale-agnostic)
 *   - week start = Monday (sesuai mockup)
 *   - format helpers untuk UI label (long, week range, month name)
 */
function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

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

export function weekStartMonday(key: string): string {
  const d = new Date(key);
  const dow = d.getDay(); // 0=Sun, 1=Mon, …
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
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

export function formatWeekRange(start: string): string {
  const s = new Date(start);
  const e = new Date(start);
  e.setDate(e.getDate() + 6);
  const sameMonth = s.getMonth() === e.getMonth();
  const startStr = s.toLocaleDateString('id-ID', { day: '2-digit' });
  const endStr = e.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return sameMonth
    ? `${startStr} – ${endStr}`
    : `${s.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} – ${endStr}`;
}

export function formatMonth(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Pad helper untuk 2-digit day (08 vs 8). Diekspos kalau view butuh.
 */
export const pad2 = pad;
