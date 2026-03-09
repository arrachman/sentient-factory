'use client';

import { Clock3, PackageSearch, PauseCircle, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  DeliveryOtifCard,
  KpiGrid,
  OrderStatusCard,
  ProductionBarCard,
  ProductionKpiRow,
  ProductionListCard,
  ProductionOperatorListCard,
  ProductionOperatorPerformanceCard,
  ProductionTimelineCard,
  TimeseriesCard,
  type KpiCard,
  type StatusItem,
  type TimeseriesDatum,
  type TimeseriesSeries,
} from '@/components/dashboard';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/components/layouts/app/components/toolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tabs = ['Monitoring Real Time', 'History'] as const;
const lineOptions = ['Line1', 'Line2', 'Line3'] as const;
const dateOptions = ['Production Date (Today)', 'Production Date (Week)'] as const;

const kpiCards: KpiCard[] = [
  { title: 'Completion Rate', subtitle: 'Today', value: '94%', delta: 1, deltaLabel: 'vs Yesterday', status: 'good' },
  { title: 'On Time Rate', subtitle: 'Today', value: '94%', delta: 1, deltaLabel: 'vs Yesterday', status: 'good' },
  { title: 'Average Lead Time', subtitle: 'Today', value: '105 m', delta: 0, deltaLabel: 'vs Yesterday' },
  { title: 'Rework Rate', subtitle: 'Today', value: '94%', delta: 1, deltaLabel: 'vs Yesterday', status: 'good' },
];

const totalProductionSeries: TimeseriesSeries[] = [{ key: 'orders', label: 'Total Production Order', color: '#4E74D6' }];
const totalProductionData: TimeseriesDatum[] = [
  { date: 'Line 1', orders: 56 },
  { date: 'Line 2', orders: 79 },
  { date: 'Line 3', orders: 49 },
  { date: 'Line 4', orders: 81 },
  { date: 'Line 5', orders: 102 },
  { date: 'Line 6', orders: 67 },
  { date: 'Line 7', orders: 79 },
  { date: 'Line 8', orders: 51 },
  { date: 'Line 9', orders: 82 },
];

const statusOverview: StatusItem[] = [
  { key: 'open', label: 'Open', value: 10, color: '#60A5FA' },
  { key: 'inProcess', label: 'In Process', value: 10, color: '#8B5CF6' },
  { key: 'material', label: 'Material Preparation', value: 10, color: '#F59E0B' },
  { key: 'cancelled', label: 'Cancelled', value: 10, color: '#EF4444' },
  { key: 'execution', label: 'Execution', value: 10, color: '#22C55E' },
  { key: 'pickupQc', label: 'Pickup by QC', value: 10, color: '#84CC16' },
  { key: 'qc', label: 'QC', value: 10, color: '#EAB308' },
  { key: 'rework', label: 'QC Report', value: 10, color: '#EC4899' },
];

const productionTimelineRows = [
  { line: 'Line 1', prep: 12, execution: 54, pickup: 9, finishLabel: 'Finish Date: 12:00' },
  { line: 'Line 2', prep: 10, execution: 58, pickup: 12 },
  { line: 'Line 3', prep: 11, execution: 55, pickup: 11 },
  { line: 'Line 4', prep: 9, execution: 50, pickup: 12 },
  { line: 'Line 5', prep: 12, execution: 62, pickup: 9 },
  { line: 'Line 6', prep: 10, execution: 56, pickup: 10 },
  { line: 'Line 7', prep: 11, execution: 52, pickup: 12 },
  { line: 'Line 8', prep: 10, execution: 48, pickup: 8 },
  { line: 'Line 9', prep: 8, execution: 0, pickup: 0 },
];

const queueRows = ['Station A', 'Station B', 'Station C', 'Station D', 'Station E'].map((name, index) => ({ title: name, subtitle: 'Line 1', badge: `${(index + 1) * 10} WO` }));
const pendingRows = ['WO1231', 'WO1232', 'WO1233', 'WO1234', 'WO1235'].map((name, index) => ({ title: name, subtitle: `Line ${index + 1} · 100/100 pcs`, badge: '14/09/2025 10:15', badgeVariant: 'warning' as const }));
const cancelledRows = ['WO12311', 'WO12322', 'WO12333', 'WO12344', 'WO12355'].map((name, index) => ({ title: name, subtitle: `Line ${index + 1} · 100/100 pcs`, badge: 'Not Passed', badgeVariant: 'destructive' as const }));
const operatorRows = Array.from({ length: 9 }, (_, index) => ({ name: 'Operator Name', line: `Line ${index + 1}` }));
const performanceRows = [9, 8, 5, 2, 8, 5, 1, 4, 7].map((value, index) => ({ name: 'Operator Name', line: `Line ${index + 1}`, value }));

const historyKpis = [
  { title: 'Avg Completion Rate', subtitle: 'Last 30 Days', value: '92%', delta: 2, deltaLabel: 'vs Previous Period' },
  { title: 'Avg On Time Rate', subtitle: 'Last 30 Days', value: '91%', delta: 1, deltaLabel: 'vs Previous Period' },
  { title: 'Avg Lead Time', subtitle: 'Last 30 Days', value: '98', suffixMuted: 'Minute' },
  { title: 'Avg Rework Rate', subtitle: 'Last 30 Days', value: '6.2%', delta: -1, deltaLabel: 'vs Previous Period' },
];

const outputHistorySeries: TimeseriesSeries[] = [
  { key: 'actual', label: 'Actual Output', color: '#4E74D6' },
  { key: 'plan', label: 'Plan Output', color: '#D1D5DB' },
];

const outputHistoryData: TimeseriesDatum[] = [
  { date: '01/07', actual: 820, plan: 900 },
  { date: '02/07', actual: 910, plan: 920 },
  { date: '03/07', actual: 760, plan: 890 },
  { date: '04/07', actual: 980, plan: 960 },
  { date: '05/07', actual: 1010, plan: 990 },
  { date: '06/07', actual: 940, plan: 970 },
  { date: '07/07', actual: 890, plan: 950 },
];

const reworkHistorySeries: TimeseriesSeries[] = [
  { key: 'rework', label: 'Rework Rate', color: '#EC4899' },
  { key: 'defect', label: 'Defect Rate', color: '#F59E0B' },
];

const reworkHistoryData: TimeseriesDatum[] = [
  { date: 'W1', rework: 6.5, defect: 4.1 },
  { date: 'W2', rework: 5.8, defect: 3.9 },
  { date: 'W3', rework: 6.2, defect: 4.3 },
  { date: 'W4', rework: 5.4, defect: 3.7 },
  { date: 'W5', rework: 5.1, defect: 3.5 },
];

const utilizationHistoryData = [
  { date: 'Line 1', orders: 88 },
  { date: 'Line 2', orders: 91 },
  { date: 'Line 3', orders: 84 },
  { date: 'Line 4', orders: 93 },
  { date: 'Line 5', orders: 89 },
  { date: 'Line 6', orders: 86 },
];

const historyPendingRows = ['WO2201', 'WO2202', 'WO2203', 'WO2204', 'WO2205'].map((name, index) => ({ title: name, subtitle: `Line ${index + 1} · 240 pcs · Finished`, badge: 'Passed', badgeVariant: 'info' as const }));
const historyCancelledRows = ['WO3301', 'WO3302', 'WO3303', 'WO3304', 'WO3305'].map((name, index) => ({ title: name, subtitle: `Line ${index + 1} · 180 pcs · Review`, badge: 'Need Check', badgeVariant: 'warning' as const }));

export default function ProductionDashboardPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Monitoring Real Time');
  const [line, setLine] = useState<(typeof lineOptions)[number]>('Line1');
  const [dateFilter, setDateFilter] = useState<(typeof dateOptions)[number]>('Production Date (Today)');
  const subtitle = useMemo(() => 'Today', []);

  return (
    <div className="container space-y-7 pb-6">
      <Toolbar className="pb-0">
        <ToolbarHeading>
          <div className="flex items-center gap-5">
            {tabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`cursor-pointer border-b-2 pb-2 text-sm font-medium ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="sr-only">
            <ToolbarPageTitle>Dashboard Production</ToolbarPageTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex gap-3">
            <Select value={line} onValueChange={(value) => setLine(value as (typeof lineOptions)[number])}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>{lineOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as (typeof dateOptions)[number])}>
              <SelectTrigger className="w-[190px]"><SelectValue /></SelectTrigger>
              <SelectContent>{dateOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </ToolbarActions>
      </Toolbar>

      {activeTab === 'Monitoring Real Time' ? (
        <>
          <KpiGrid cards={kpiCards} className="xl:grid-cols-4" />

          <div className="grid gap-4 lg:grid-cols-12">
            <TimeseriesCard
              title="Total Production Order"
              subtitle={subtitle}
              data={totalProductionData}
              series={totalProductionSeries}
              variant="area"
              chartHeightClass="h-[260px]"
              yAxisDomain={[0, 120]}
              showLegend
              cardClassName="lg:col-span-8"
              contentClassName="space-y-2"
              chartMargin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            />
            <div className="lg:col-span-4">
              <DeliveryOtifCard title="Actual vs Plan" subtitle={subtitle} percentage={15} onTime={150} total={1000} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <OrderStatusCard title="Status Overview" subtitle={subtitle} items={statusOverview} />
            </div>
            <div className="lg:col-span-8">
              <ProductionTimelineCard title="Production Timeline" subtitle={subtitle} rows={productionTimelineRows} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <ProductionListCard title="Production Order Queue (Backlog)" icon={<Clock3 className="size-4 text-sky-500" />} rows={queueRows} />
            </div>
            <div className="lg:col-span-4">
              <ProductionListCard title="Production Order Pending" icon={<PauseCircle className="size-4 text-amber-500" />} rows={pendingRows} />
            </div>
            <div className="lg:col-span-4">
              <ProductionListCard title="Production Order Canceled" icon={<XCircle className="size-4 text-rose-500" />} rows={cancelledRows} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <ProductionOperatorListCard title="Operator Active" rows={operatorRows} />
            </div>
            <div className="lg:col-span-8">
              <ProductionOperatorPerformanceCard title="Operator Performance" rows={performanceRows} />
            </div>
          </div>
        </>
      ) : (
        <>
          <ProductionKpiRow cards={historyKpis} />

          <div className="grid gap-4 lg:grid-cols-12">
            <TimeseriesCard
              title="Output Trend"
              subtitle="Last 7 Days"
              data={outputHistoryData}
              series={outputHistorySeries}
              chartHeightClass="h-[320px]"
              yAxisDomain={[0, 1200]}
              cardClassName="lg:col-span-8"
              legendAlign="start"
              contentClassName="space-y-2"
              chartMargin={{ left: 0, right: 8, top: 8, bottom: 0 }}
            />
            <div className="lg:col-span-4">
              <ProductionBarCard title="Line Utilization" subtitle="Average (%)" data={utilizationHistoryData} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <DeliveryOtifCard title="Plan Achievement" subtitle="Last 30 Days" percentage={92} onTime={920} total={1000} />
            </div>
            <div className="lg:col-span-8">
              <TimeseriesCard
                title="Quality Trend"
                subtitle="Rework & Defect Rate"
                data={reworkHistoryData}
                series={reworkHistorySeries}
                chartHeightClass="h-[320px]"
                yAxisDomain={[0, 10]}
                cardClassName="lg:col-span-12"
                legendAlign="start"
                contentClassName="space-y-2"
                chartMargin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ProductionListCard title="Completed Work Orders" icon={<PackageSearch className="size-4 text-sky-500" />} rows={historyPendingRows} />
            </div>
            <div className="lg:col-span-6">
              <ProductionListCard title="Need Review / Follow Up" icon={<PauseCircle className="size-4 text-amber-500" />} rows={historyCancelledRows} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <ProductionOperatorListCard title="Top Operators" rows={operatorRows.slice(0, 6)} />
            </div>
            <div className="lg:col-span-8">
              <ProductionOperatorPerformanceCard title="Operator Performance History" rows={performanceRows} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
