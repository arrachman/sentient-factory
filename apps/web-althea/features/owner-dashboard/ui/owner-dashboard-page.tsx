'use client';

/**
 * Owner Dashboard — snapshot operasional hari ini.
 * Widget berorientasi performa & tren bulanan dipindah ke /owner/analitik.
 */
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { KpiStrip } from './kpi-strip';
import { OwnerNotesCard } from './owner-notes-card';
import { RoomUsageSection } from './room-usage-section';
import { WeekTrendCard } from './week-trend-card';

export function OwnerDashboardPage() {
  const page = useOwnerDashboard();

  return (
    <div className="flex flex-col p-6 gap-6">
      <KpiStrip kpi={page.kpi} slotsPerDay={page.slotsPerDay} />

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
        <WeekTrendCard
          weekTrend={page.weekTrend}
          weekTotal={page.weekTotal}
          weekMax={page.weekMax}
        />
        <OwnerNotesCard note={page.ownerNote} />
      </div>

      <RoomUsageSection
        rooms={page.rooms}
        todayBookings={page.todayBookings}
        psikologs={page.psikologs}
      />
    </div>
  );
}
