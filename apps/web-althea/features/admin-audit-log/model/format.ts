/**
 * Format helpers untuk halaman Audit Log.
 *
 * - initials: render avatar text "VI" dari "Vina A.", "S" dari "Sinta", "?" jika tidak ada
 * - formatDateGroup: divider tanggal di timeline ("Hari ini · Jumat, 03 Mei 2026")
 * - isToday: cek apakah ISO timestamp jatuh di hari ini
 * - renderValue: ringkas value JSON (string/number/object) untuk diff preview
 */
export function initials(name: string): string {
  if (!name) return '?';
  const trimmed = name.trim();
  if (trimmed === '?') return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatDateGroup(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const fmt = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  if (sameDay(d, today)) return `Hari ini · ${fmt}`;
  if (sameDay(d, yesterday)) return `Kemarin · ${fmt}`;
  return fmt;
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export function renderValue(v: unknown): string {
  if (v === null || v === undefined) return '∅';
  if (typeof v === 'string') return v.length > 64 ? `${v.slice(0, 63)}…` : v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    const s = JSON.stringify(v);
    return s.length > 64 ? `${s.slice(0, 63)}…` : s;
  } catch {
    return String(v);
  }
}
