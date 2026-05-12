/**
 * Format helpers untuk halaman Klien saya (psikolog).
 */
function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Format "next session" relative ke hari ini:
 *   Hari ini · HH:mm
 *   Besok · HH:mm
 *   else: "DD MMM · HH:mm"
 */
export function formatNext(start: Date): string {
  const today = new Date();
  const time = start.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (isSameDay(start, today)) return `Hari ini · ${time}`;
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(start, tomorrow)) return `Besok · ${time}`;
  return (
    start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ` · ${time}`
  );
}

export function categoryLabel(cat: string): string {
  if (!cat) return 'Dewasa';
  const c = cat.toLowerCase();
  if (c === 'anak' || c === 'kanak-kanak') return 'Anak';
  if (c === 'remaja') return 'Remaja';
  if (c === 'pasangan') return 'Pasangan';
  if (c === 'keluarga') return 'Keluarga';
  return 'Dewasa';
}

export function clientInitial(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
