// Small display formatters shared across MDP pages.

/** ISO timestamp → short local datetime (Asia/Jakarta business tz at app layer). */
export function fmtDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Decimal-string qty → trimmed display (drops trailing .0000). */
export function fmtQty(v?: string | number | null): string {
  if (v == null || v === '') return '—';
  const n = typeof v === 'number' ? v : Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString('id-ID', { maximumFractionDigits: 4 });
}

/** Seconds → compact h/m/s duration. */
export function fmtDuration(seconds?: string | number | null): string {
  if (seconds == null || seconds === '') return '—';
  const s = Math.round(typeof seconds === 'number' ? seconds : Number(seconds));
  if (Number.isNaN(s)) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h ? `${h}j` : '', m ? `${m}m` : '', `${sec}d`].filter(Boolean).join(' ');
}
