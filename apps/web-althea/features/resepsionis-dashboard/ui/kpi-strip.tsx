'use client';

export function KpiStrip({
  total,
  waiting,
  live,
  done,
  cancelled,
}: {
  total: number;
  waiting: number;
  live: number;
  done: number;
  cancelled: number;
}) {
  const items = [
    { label: 'Total hari ini', value: total, accent: 'var(--teal-800)' },
    { label: 'Menunggu', value: waiting, accent: 'var(--sage-700)' },
    { label: 'Berlangsung', value: live, accent: '#c97a5d' },
    { label: 'Selesai', value: done, accent: 'var(--teal-700)' },
    { label: 'Batal', value: cancelled, accent: 'var(--fg-muted)' },
  ];
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="card-althea"
          style={{ padding: '12px 14px' }}
        >
          <div className="caption" style={{ fontSize: 11 }}>
            {it.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              fontWeight: 500,
              color: it.accent,
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
