'use client';

import { useMemo, useState } from 'react';
import {
  KpiGrid,
  OpenCloseBarCard,
  OrderStatusCard,
  OutstandingOverdueTableCard,
  TimeseriesCard,
  TopAgingCard,
  TopAmountCard,
} from '@/components/dashboard';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  kpiByPeriod,
  materialOpenClose,
  outstandingRows,
  periodOptions,
  poAgingAxisMax,
  poAgingTicks,
  poAgingTop10,
  purchaseOrderStatus,
  timeseriesPo,
  timeseriesPoSeries,
  topSuppliersByAmount,
} from './_data';
import type { PurchasePeriod } from './_data';

export default function PurchaseDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PurchasePeriod>('Maret 2026');
  const kpiCards = useMemo(() => kpiByPeriod[selectedPeriod], [selectedPeriod]);

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Dashboard Purchase</ToolbarPageTitle>
          <ToolbarDescription>
            <span className="text-sm leading-6 text-muted-foreground lg:text-base">
              Ringkasan KPI, tren, status PO, dan tabel operasional pembelian.
            </span>
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PurchasePeriod)}>
            <SelectTrigger className="h-10 w-[160px] text-sm">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((period) => (
                <SelectItem key={period} value={period}>{period}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ToolbarActions>
      </Toolbar>

      <KpiGrid cards={kpiCards} />

      <div className="grid gap-6 lg:grid-cols-12">
        <OrderStatusCard title="Status Purchase Order" subtitle={selectedPeriod} items={purchaseOrderStatus} />
        <TimeseriesCard
          title="Tren Purchase Order"
          subtitle={selectedPeriod}
          filterLabel="Filter Supplier"
          data={timeseriesPo}
          series={timeseriesPoSeries}
          yAxisDomain={[0, 'dataMax']}
          chartHeightClass="h-[300px]"
          showGrid
          legendAlign="start"
          legendPaddingLeft="36px"
          legendPaddingRight="20px"
          chartMargin={{ bottom: 0 }}
          contentClassName="space-y-2 px-5 pb-0 pt-2"
          legendClassName="pb-0 pt-0"
        />
      </div>

      <OpenCloseBarCard
        title="Material Open (Outstanding) vs Close"
        subtitle={selectedPeriod}
        data={materialOpenClose}
      />

      <OutstandingOverdueTableCard
        title="PO Outstanding & Overdue"
        subtitle={selectedPeriod}
        actionLabel="Filter Flag"
        rows={outstandingRows}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <TopAmountCard
          title="Top 10 Supplier Berdasarkan Nilai"
          subtitle={selectedPeriod}
          rows={topSuppliersByAmount}
          minimal
        />
        <TopAgingCard
          title="Top 10 PO Aging"
          subtitle="Tahun Berjalan"
          ctaLabel="Lihat Semua"
          rows={poAgingTop10}
          axisMax={poAgingAxisMax}
          ticks={poAgingTicks}
          minimal
        />
      </div>
    </div>
  );
}
