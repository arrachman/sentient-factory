'use client';

import type { ProfileStats } from '../api/profile.api';

export function StatsCard({
  stats,
  isLoading,
}: {
  stats: ProfileStats | undefined;
  isLoading: boolean;
}) {
  // Derive display values
  const items: Array<{ value: string | number; label: string; note?: string }> =
    [
      {
        value: isLoading ? '—' : (stats?.sesi30Hari ?? 0),
        label: 'Sesi selesai (30 hari)',
      },
      {
        value: isLoading ? '—' : (stats?.klienAktif ?? 0),
        label: 'Klien aktif',
        note: '90 hari terakhir',
      },
      {
        value: isLoading
          ? '—'
          : stats?.kehadiran !== null && stats?.kehadiran !== undefined
            ? `${stats.kehadiran}%`
            : '—',
        label: 'Kehadiran',
        note: 'completed vs cancelled (30 hari)',
      },
      {
        value: isLoading ? '—' : (stats?.ratingKlien ?? '—'),
        label: 'Rating klien',
        note: 'endpoint belum tersedia',
      },
    ];

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
        {items.map((s) => (
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
            {s.note && (
              <span className="caption" style={{ fontSize: 10, marginTop: 1, opacity: 0.7 }}>
                {s.note}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
