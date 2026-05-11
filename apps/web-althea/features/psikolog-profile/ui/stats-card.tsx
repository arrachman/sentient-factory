'use client';

type Stat = {
  label: string;
  value: string | number;
};

export function StatsCard({ stats }: { stats: Stat[] }) {
  return (
    <div className="card-althea" style={{ padding: 18 }}>
      <span className="eyebrow">Statistik · 30 hari</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginTop: 10,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 24,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
              {s.value}
            </span>
            <span className="caption" style={{ fontSize: 11 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <p className="caption" style={{ marginTop: 10, fontSize: 10.5 }}>
        Stub — endpoint stats psikolog belum tersedia.
      </p>
    </div>
  );
}
