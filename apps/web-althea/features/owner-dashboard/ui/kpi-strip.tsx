import type { Kpi } from '../model/aggregate';
import { formatRupiahShort } from '../model/format';
import { KpiCard } from './kpi-card';

/**
 * Strip 4 KPI di header Owner Dashboard.
 */
export function KpiStrip({
  kpi,
  slotsPerDay,
}: {
  kpi: Kpi;
  slotsPerDay: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }}
    >
      <KpiCard
        label="Sesi hari ini"
        value={kpi.sesiToday}
        sub={`${kpi.activePsikologCount} psikolog · ${kpi.usedRoomCount} ruangan terpakai`}
      />
      <KpiCard
        label="Utilisasi psikolog"
        value={`${kpi.utilPsikolog}%`}
        sub={`${kpi.activePsikologCount} psikolog · rata-rata ${slotsPerDay} slot`}
      />
      <KpiCard
        label="Utilisasi ruangan"
        value={`${kpi.utilRuangan}%`}
        sub={`${kpi.usedRoomCount} dari ${kpi.totalRoomCount} ruangan terpakai`}
      />
      <KpiCard
        label="Revenue bulan ini"
        value={
          kpi.monthRevenue > 0 ? formatRupiahShort(kpi.monthRevenue) : '—'
        }
        sub={
          kpi.monthRevenue > 0
            ? 'dari sesi completed'
            : 'belum ada sesi completed'
        }
      />
    </div>
  );
}
