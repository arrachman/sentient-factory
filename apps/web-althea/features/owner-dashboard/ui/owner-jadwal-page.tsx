'use client';

/**
 * Owner · Jadwal Psikolog — halaman dedicated berisi grid jadwal psikolog
 * (read-only mirror dari /admin/jadwal). State date+view di-handle oleh
 * `OwnerScheduleSection` sendiri (default hari ini, view Hari).
 */
import { OwnerScheduleSection } from './owner-schedule-section';

export function OwnerJadwalPage() {
  return (
    <div className="flex flex-col p-6 gap-4">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 19,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Daftar jadwal psikolog
        </h2>
        <span className="caption">
          Mirror grid admin · read-only · klik kartu untuk lihat detail
        </span>
      </div>
      <OwnerScheduleSection />
    </div>
  );
}
