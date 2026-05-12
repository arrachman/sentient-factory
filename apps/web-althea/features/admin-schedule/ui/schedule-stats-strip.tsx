/**
 * Strip 4 stat cards di bawah toolbar.
 * Label "Sesi" berubah berdasarkan view aktif (Hari/Minggu/Bulan).
 */
import type { ViewMode } from '../model/types';
import { StatCard } from './components/stat-card';

export type ScheduleStats = {
  sesi: { value: number; sub: string };
  psikolog: { value: number; sub: string };
  ruangan: { value: string; sub: string };
  wa: { value: string; sub: string };
};

const SESI_LABEL: Record<ViewMode, string> = {
  Hari: 'Sesi terjadwal',
  Minggu: 'Sesi minggu ini',
  Bulan: 'Sesi bulan ini',
};

export function ScheduleStatsStrip({
  view,
  stats,
}: {
  view: ViewMode;
  stats: ScheduleStats;
}) {
  return (
    <div
      style={{
        padding: '0 28px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }}
    >
      <StatCard
        label={SESI_LABEL[view]}
        value={stats.sesi.value}
        sub={stats.sesi.sub}
      />
      <StatCard
        label="Psikolog aktif"
        value={stats.psikolog.value}
        sub={stats.psikolog.sub}
      />
      <StatCard
        label="Ruangan terpakai"
        value={stats.ruangan.value}
        sub={stats.ruangan.sub}
      />
      <StatCard
        label="Notifikasi WA"
        value={stats.wa.value}
        sub={stats.wa.sub}
      />
    </div>
  );
}
