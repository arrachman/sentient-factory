'use client';

/**
 * Owner Analitik — halaman kedua dengan filter periode yang sama.
 * Memakai hook & state URL yang sama dengan dashboard utama (cache TanStack
 * Query di-share, URL ?period=&date= sinkron).
 */
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { useOwnerPeriod } from '../hooks/use-owner-period';
import { periodLabelShort } from '../model/period';
import { OwnerPeriodToolbar } from './owner-period-toolbar';
import { PsikologPerformanceCard } from './psikolog-performance-card';
import { RoomUtilizationCard } from './room-utilization-card';
import { TopServicesCard } from './top-services-card';

export function OwnerAnalitikPage() {
  const period = useOwnerPeriod();
  const page = useOwnerDashboard({
    period: period.mode,
    anchor: period.anchor,
  });
  const periodLabel = periodLabelShort(period.mode);

  return (
    <div className="flex flex-col p-6 gap-6">
      <OwnerPeriodToolbar
        anchor={period.anchor}
        mode={period.mode}
        rangeLabel={period.rangeLabel}
        onShiftPrev={period.onShiftPrev}
        onShiftNext={period.onShiftNext}
        onPickDate={period.setAnchor}
        onResetToToday={period.onResetToToday}
        onChangeMode={period.setMode}
      />

      <PsikologPerformanceCard
        isLoading={page.isLoadingPsikolog}
        rows={page.psikologPerf}
        totalCount={page.psikologs.length}
        slotsPerDay={page.slotsPerDay}
        rangeDays={page.range.days.length}
        periodLabel={periodLabel}
      />

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <RoomUtilizationCard
          roomGroups={page.roomGroups}
          periodLabel={periodLabel}
        />
        <TopServicesCard
          topServices={page.topServices}
          totalCatalogCount={page.services.length}
          periodLabel={periodLabel}
        />
      </div>
    </div>
  );
}
