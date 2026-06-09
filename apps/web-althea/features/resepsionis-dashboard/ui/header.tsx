'use client';

import { fmtDateLong } from './resepsionis-dashboard.helpers';

export function Header({
  now,
  total,
  loading,
}: {
  now: Date | null;
  total: number;
  loading: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <span className="caption" suppressHydrationWarning>
          {now ? fmtDateLong(now) : ' '}
        </span>
        <div
          className="caption"
          style={{ marginTop: 2, color: 'var(--fg-muted)' }}
        >
          {loading
            ? 'Memuat jadwal…'
            : total === 0
              ? 'Belum ada booking untuk hari ini.'
              : `${total} sesi dijadwalkan hari ini`}
        </div>
      </div>
    </header>
  );
}
