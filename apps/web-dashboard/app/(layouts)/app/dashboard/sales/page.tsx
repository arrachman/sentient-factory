'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  KpiGrid,
  OutstandingOverdueTableCard,
  OrderStatusCard,
  TimeseriesCard,
  TopAgingCard,
} from '@/components/dashboard';
import {
  topFilters,
  kpiCardsByMonth,
  soStatus,
  revenueSeries,
  salesOrderSeries,
  revenueByMonth,
  salesOrderByMonth,
  salesOrderTableRows,
  topMaterials,
  topMaterialsAxisMax,
  topMaterialsTicks,
} from './_data';

export default function SalesDashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(topFilters.month[0]);
  const kpiCards = kpiCardsByMonth[selectedMonth] ?? kpiCardsByMonth['Month Selected'];
  const revenueMeta = revenueByMonth[selectedMonth] ?? revenueByMonth['Month Selected'];
  const salesOrderMeta = salesOrderByMonth[selectedMonth] ?? salesOrderByMonth['Month Selected'];

  return (
    <div className="container space-y-6 pb-10">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Sales Dashboard</ToolbarPageTitle>
          <ToolbarDescription>
            <span className="text-sm text-muted-foreground">Dummy slicing for dashboard preview.</span>
          </ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>

      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue={topFilters.period[0]}>
          <SelectTrigger className="h-10 w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {topFilters.period.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-10 w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {topFilters.month.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={topFilters.customer[0]}>
          <SelectTrigger className="h-10 w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {topFilters.customer.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <KpiGrid cards={kpiCards} />

      <div className="grid gap-4 lg:grid-cols-12">
        <OrderStatusCard title="Sales Order Status" subtitle={selectedMonth} items={soStatus} />
        <div className="space-y-4 lg:col-span-8">
          <TimeseriesCard
            title="Revenue"
            subtitle={selectedMonth}
            data={revenueMeta.series}
            series={revenueSeries}
            variant="area"
            showYAxis={false}
            showGrid={false}
            yAxisDomain={[0, 60]}
            chartHeightClass="h-[120px]"
            metricValue={revenueMeta.value}
            metricDelta={revenueMeta.delta}
            metricDeltaLabel={revenueMeta.deltaLabel}
            showLegend={false}
            cardClassName="flex h-[235px] w-[880px] flex-col items-start gap-3 rounded-md border border-[#EDEEF0] bg-[#FEFEFE] p-4 shadow-[0px_1px_2px_rgba(234,234,234,0.48)]"
            headerClassName="w-full p-0"
            contentClassName="w-full p-0 space-y-3"
          />
          <TimeseriesCard
            title="Sales Order"
            subtitle={selectedMonth}
            data={salesOrderMeta.series}
            series={salesOrderSeries}
            variant="area"
            showYAxis={false}
            showGrid={false}
            yAxisDomain={[0, 60]}
            chartHeightClass="h-[120px]"
            metricValue={salesOrderMeta.value}
            metricDelta={salesOrderMeta.delta}
            metricDeltaLabel={salesOrderMeta.deltaLabel}
            showLegend={false}
            cardClassName="flex h-[235px] w-[880px] flex-col items-start gap-3 rounded-md border border-[#EDEEF0] bg-[#FEFEFE] p-4 shadow-[0px_1px_2px_rgba(234,234,234,0.48)]"
            headerClassName="w-full p-0"
            contentClassName="w-full p-0 space-y-3"
          />
        </div>
      </div>

      <OutstandingOverdueTableCard
        title="Sales Order List"
        subtitle={selectedMonth}
        rows={salesOrderTableRows}
        actionLabel="Filter Flag"
        overdueLabel="SO"
        filterOptions={['All Flag', 'Link Only', 'Doc Only']}
      />

      <TopAgingCard
        title="Top 10 Ordered Material"
        subtitle={selectedMonth}
        rows={topMaterials}
        axisMax={topMaterialsAxisMax}
        ticks={topMaterialsTicks}
        valueColumnWidth="8.5rem"
        valueGap="0rem"
        headerAction={(
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-10 w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {topFilters.month.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <div className="hidden">
        <ChevronDown />
      </div>
    </div>
  );
}
