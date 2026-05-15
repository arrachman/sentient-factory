import { Banknote, CalendarCheck, DoorOpen, Users } from 'lucide-react';
import type { Kpi } from '../model/aggregate';
import { formatRupiahShort } from '../model/format';
import { KpiCard } from './kpi-card';

/**
 * Strip 4 KPI di header Owner Dashboard.
 * Responsive: 2 kolom di mobile, 4 kolom di tablet/desktop.
 */
export function KpiStrip({
  kpi,
  slotsPerDay,
}: {
  kpi: Kpi;
  slotsPerDay: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <KpiCard
        label="Sesi hari ini"
        value={kpi.sesiToday}
        sub={`${kpi.activePsikologCount} psikolog · ${kpi.usedRoomCount} ruangan terpakai`}
        icon={CalendarCheck}
        tone="sage"
      />
      <KpiCard
        label="Utilisasi psikolog"
        value={`${kpi.utilPsikolog}%`}
        sub={`${kpi.activePsikologCount} psikolog · rata-rata ${slotsPerDay} slot`}
        icon={Users}
        tone="info"
      />
      <KpiCard
        label="Utilisasi ruangan"
        value={`${kpi.utilRuangan}%`}
        sub={`${kpi.usedRoomCount} dari ${kpi.totalRoomCount} ruangan terpakai`}
        icon={DoorOpen}
        tone="amber"
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
        icon={Banknote}
        tone="rose"
      />
    </div>
  );
}
