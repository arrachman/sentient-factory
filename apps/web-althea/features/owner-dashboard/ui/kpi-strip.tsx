import { Banknote, CalendarCheck, DoorOpen, Users } from 'lucide-react';
import type { Kpi } from '../model/aggregate';
import { formatRupiahShort } from '../model/format';
import { KpiCard } from './kpi-card';

/**
 * Strip 4 KPI di header Owner Dashboard. Label adaptif terhadap periode.
 */
export function KpiStrip({
  kpi,
  slotsPerDay,
  periodLabel,
  rangeDays,
}: {
  kpi: Kpi;
  slotsPerDay: number;
  periodLabel: string;
  rangeDays: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <KpiCard
        label={`Sesi ${periodLabel}`}
        value={kpi.sesiPeriod}
        sub={`${kpi.activePsikologCount} psikolog · ${kpi.usedRoomCount} ruangan terpakai`}
        icon={CalendarCheck}
        tone="sage"
      />
      <KpiCard
        label="Utilisasi psikolog"
        value={`${kpi.utilPsikolog}%`}
        sub={`${kpi.activePsikologCount} psikolog · ${slotsPerDay * Math.max(rangeDays, 1)} slot/orang`}
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
        label={`Revenue ${periodLabel}`}
        value={
          kpi.periodRevenue > 0 ? formatRupiahShort(kpi.periodRevenue) : '—'
        }
        sub={
          kpi.periodRevenue > 0
            ? 'dari sesi completed'
            : 'belum ada sesi completed'
        }
        icon={Banknote}
        tone="rose"
      />
    </div>
  );
}
