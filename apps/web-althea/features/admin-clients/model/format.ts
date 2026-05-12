/**
 * Format helpers untuk halaman Klien.
 *   - formatNextSession: "Hari ini · 14:30", "Besok · 09:00", atau "12 Jun · 14:30"
 *   - formatDate: "12 Jun 2026"
 */
function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatNextSession(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (sameDay(d, today)) return `Hari ini · ${time}`;
  if (sameDay(d, tomorrow)) return `Besok · ${time}`;
  return (
    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ` · ${time}`
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
