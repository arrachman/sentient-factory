'use client';

/**
 * Owner Dashboard — snapshot operasional dengan filter periode
 * (Harian/Mingguan/Bulanan). Grid jadwal psikolog & pemakaian ruangan
 * dipindah ke menu tersendiri (`/owner/jadwal`, `/owner/ruangan`).
 */
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { useOwnerPeriod } from '../hooks/use-owner-period';
import { periodLabelShort } from '../model/period';
import { KpiStrip } from './kpi-strip';
import { OwnerPeriodToolbar } from './owner-period-toolbar';
import { TrendCard } from './trend-card';

export function OwnerDashboardPage() {
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

      <KpiStrip
        kpi={page.kpi}
        slotsPerDay={page.slotsPerDay}
        periodLabel={periodLabel}
        rangeDays={page.range.days.length}
      />

      <TrendCard
        mode={period.mode}
        bars={page.trend}
        total={page.trendTotal}
        max={page.trendMax}
      />
    </div>
  );
}
