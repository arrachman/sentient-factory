export function rp(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="caption text-fg-muted w-32 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">{value}</div>
    </div>
  );
}
