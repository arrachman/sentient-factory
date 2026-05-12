'use client';

/**
 * Owner Dashboard — orchestrator. Tipis composer dari sub-cards.
 */
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { KpiStrip } from './kpi-strip';
import { OwnerNotesCard } from './owner-notes-card';
import { PsikologPerformanceCard } from './psikolog-performance-card';
import { RoomUsageSection } from './room-usage-section';
import { RoomUtilizationCard } from './room-utilization-card';
import { TopServicesCard } from './top-services-card';
import { WeekTrendCard } from './week-trend-card';

export function OwnerDashboardPage() {
  const page = useOwnerDashboard();

  return (
    <div className="flex flex-col" style={{ padding: 28, gap: 22 }}>
      <KpiStrip kpi={page.kpi} slotsPerDay={page.slotsPerDay} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 20,
        }}
      >
        <PsikologPerformanceCard
          isLoading={page.isLoadingPsikolog}
          rows={page.psikologPerf}
          totalCount={page.psikologs.length}
          slotsPerDay={page.slotsPerDay}
        />
        <div className="flex flex-col gap-3">
          <WeekTrendCard
            weekTrend={page.weekTrend}
            weekTotal={page.weekTotal}
            weekMax={page.weekMax}
          />
          <OwnerNotesCard note={page.ownerNote} />
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
      >
        <RoomUtilizationCard roomGroups={page.roomGroups} />
        <TopServicesCard
          topServices={page.topServices}
          totalCatalogCount={page.services.length}
        />
      </div>

      <RoomUsageSection
        rooms={page.rooms}
        todayBookings={page.todayBookings}
        psikologs={page.psikologs}
      />
    </div>
  );
}
