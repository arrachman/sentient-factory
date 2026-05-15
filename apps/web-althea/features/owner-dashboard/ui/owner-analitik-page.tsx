'use client';

/**
 * Owner Analitik — halaman kedua untuk widget berorientasi performa & tren.
 * Memakai hook yang sama dengan dashboard utama (cache TanStack Query di-share).
 */
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { PsikologPerformanceCard } from './psikolog-performance-card';
import { RoomUtilizationCard } from './room-utilization-card';
import { TopServicesCard } from './top-services-card';

export function OwnerAnalitikPage() {
  const page = useOwnerDashboard();

  return (
    <div className="flex flex-col p-6 gap-6">
      <PsikologPerformanceCard
        isLoading={page.isLoadingPsikolog}
        rows={page.psikologPerf}
        totalCount={page.psikologs.length}
        slotsPerDay={page.slotsPerDay}
      />

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <RoomUtilizationCard roomGroups={page.roomGroups} />
        <TopServicesCard
          topServices={page.topServices}
          totalCatalogCount={page.services.length}
        />
      </div>
    </div>
  );
}
