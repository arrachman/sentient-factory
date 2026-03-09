'use client';

import { useMemo, useState } from 'react';
import {
  DockQueueCard,
  InventoryCoverageCard,
  InventoryMovementCard,
  KpiGrid,
  OpenCloseBarCard,
  OrderStatusCard,
  RackUtilizationCard,
  OutstandingOverdueTableCard,
  TimeseriesCard,
  TopAgingCard,
  TopAmountCard,
  WarehouseAlertCard,
  type AgingRow,
  type KpiCard,
  type OutstandingTableRow,
  type StatusItem,
  type TimeseriesDatum,
  type TimeseriesSeries,
  type TopAmountRow,
} from '@/components/dashboard';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const periodOptions = ['Maret 2026', 'Februari 2026', 'Januari 2026'] as const;
const regionOptions = ['Semua Region', 'Jabodetabek', 'Jawa Timur', 'Sumatera'] as const;
const warehouseOptions = ['Semua Warehouse', 'WH Medan', 'WH Bekasi', 'WH Surabaya', 'WH Makassar'] as const;

const kpiByPeriod: Record<typeof periodOptions[number], KpiCard[]> = {
  'Maret 2026': [
    {
      title: 'Total Warehouse Active',
      subtitle: 'Maret 2026',
      value: '24',
      delta: 2,
      deltaLabel: 'vs bulan lalu',
      status: 'good',
      info: 'Jumlah warehouse aktif yang melayani inbound, outbound, dan penyimpanan.',
    },
    {
      title: 'Stock On Hand',
      subtitle: 'Maret 2026',
      value: '18.420 box',
      delta: 4,
      deltaLabel: 'vs bulan lalu',
      status: 'good',
      info: 'Akumulasi stok tersedia di seluruh warehouse.',
    },
    {
      title: 'Warehouse Utilization',
      subtitle: 'Maret 2026',
      value: '81%',
      delta: 3,
      deltaLabel: 'vs bulan lalu',
      status: 'warn',
      info: 'Rasio penggunaan kapasitas gudang terhadap total kapasitas tersedia.',
    },
    {
      title: 'Inbound Today',
      subtitle: 'Maret 2026',
      value: '138 truck',
      delta: -2,
      deltaLabel: 'vs kemarin',
      status: 'good',
    },
    {
      title: 'Outbound Today',
      subtitle: 'Maret 2026',
      value: '121 truck',
      delta: 5,
      deltaLabel: 'vs kemarin',
      status: 'good',
    },
    {
      title: 'Aging Risk Batch',
      subtitle: 'Maret 2026',
      value: '46 batch',
      delta: 6,
      deltaLabel: 'vs bulan lalu',
      status: 'bad',
      info: 'Batch dengan risiko mendekati expired atau slow moving.',
    },
  ],
  'Februari 2026': [
    { title: 'Total Warehouse Active', subtitle: 'Februari 2026', value: '23', delta: 1, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Stock On Hand', subtitle: 'Februari 2026', value: '17.650 box', delta: 2, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Warehouse Utilization', subtitle: 'Februari 2026', value: '78%', delta: -1, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Inbound Today', subtitle: 'Februari 2026', value: '126 truck', delta: 1, deltaLabel: 'vs kemarin', status: 'good' },
    { title: 'Outbound Today', subtitle: 'Februari 2026', value: '115 truck', delta: 2, deltaLabel: 'vs kemarin', status: 'good' },
    { title: 'Aging Risk Batch', subtitle: 'Februari 2026', value: '39 batch', delta: -2, deltaLabel: 'vs bulan lalu', status: 'warn' },
  ],
  'Januari 2026': [
    { title: 'Total Warehouse Active', subtitle: 'Januari 2026', value: '22', delta: 0, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Stock On Hand', subtitle: 'Januari 2026', value: '16.980 box', delta: -1, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Warehouse Utilization', subtitle: 'Januari 2026', value: '76%', delta: -2, deltaLabel: 'vs bulan lalu', status: 'good' },
    { title: 'Inbound Today', subtitle: 'Januari 2026', value: '118 truck', delta: -1, deltaLabel: 'vs kemarin', status: 'good' },
    { title: 'Outbound Today', subtitle: 'Januari 2026', value: '110 truck', delta: 1, deltaLabel: 'vs kemarin', status: 'good' },
    { title: 'Aging Risk Batch', subtitle: 'Januari 2026', value: '42 batch', delta: 1, deltaLabel: 'vs bulan lalu', status: 'warn' },
  ],
};

const warehouseStatus: StatusItem[] = [
  { key: 'healthy', label: 'Healthy', value: 10, color: '#56C288' },
  { key: 'busy', label: 'Busy', value: 6, color: '#4A74CF' },
  { key: 'overload', label: 'Overload', value: 3, color: '#E6CC45' },
  { key: 'agingRisk', label: 'Aging Risk', value: 2, color: '#E54646' },
  { key: 'inactive', label: 'Inactive', value: 3, color: '#C9CBCF' },
];

const occupancyRows = [
  { label: '0-40%', days: 4 },
  { label: '41-60%', days: 5 },
  { label: '61-80%', days: 7 },
  { label: '81-95%', days: 5 },
  { label: '>95%', days: 3 },
];

const topWarehouseRows: TopAmountRow[] = [
  { initials: 'WB', name: 'WH Bekasi', code: 'WH-BKS', amount: '92% Utilization' },
  { initials: 'WS', name: 'WH Surabaya', code: 'WH-SBY', amount: '88% Utilization' },
  { initials: 'WM', name: 'WH Medan', code: 'WH-MDN', amount: '86% Utilization' },
  { initials: 'WK', name: 'WH Makassar', code: 'WH-MKS', amount: '84% Utilization' },
  { initials: 'WC', name: 'WH Cikarang', code: 'WH-CKR', amount: '82% Utilization' },
];

const agingRows: AgingRow[] = [
  { label: '< 30 Hari', days: 18 },
  { label: '30-60 Hari', days: 12 },
  { label: '61-90 Hari', days: 8 },
  { label: '> 90 Hari', days: 6 },
];

const inventoryCoverageRows = [
  { label: 'Frozen Shrimp', coverageDays: 21, stockLevel: '1.240 box tersedia', status: 'safe' as const },
  { label: 'Packaging Box', coverageDays: 9, stockLevel: '320 roll tersedia', status: 'warning' as const },
  { label: 'Seasoning Mix', coverageDays: 5, stockLevel: '88 pack tersedia', status: 'critical' as const },
  { label: 'Inner Carton', coverageDays: 14, stockLevel: '640 pcs tersedia', status: 'warning' as const },
];

const warehouseAlerts = [
  {
    title: 'Replenishment Needed',
    warehouse: 'WH Bekasi',
    detail: 'Safety stock Frozen Shrimp turun ke bawah threshold 15%.',
    severity: 'warning' as const,
  },
  {
    title: 'Near Expiry Batch',
    warehouse: 'WH Surabaya',
    detail: '6 batch bahan baku akan expired dalam 21 hari.',
    severity: 'critical' as const,
  },
  {
    title: 'Putaway Completed',
    warehouse: 'WH Medan',
    detail: '48 pallet inbound pagi ini sudah selesai dipindahkan ke rack cold storage.',
    severity: 'info' as const,
  },
  {
    title: 'Cycle Count Scheduled',
    warehouse: 'WH Makassar',
    detail: 'Cycle count zona dry warehouse dijadwalkan pukul 14:00.',
    severity: 'info' as const,
  },
];

const rackUtilizationRows = [
  { zone: 'Cold A1', utilization: 94 },
  { zone: 'Cold A2', utilization: 88 },
  { zone: 'Dry B1', utilization: 73 },
  { zone: 'Dry B2', utilization: 61 },
  { zone: 'Frozen C1', utilization: 97 },
  { zone: 'Buffer D1', utilization: 42 },
];

const inventoryMovementMetrics = [
  { label: 'Inbound Units', value: '4.820 box', hint: 'Penerimaan 24 jam terakhir', tone: 'inbound' as const },
  { label: 'Outbound Units', value: '4.160 box', hint: 'Pengeluaran 24 jam terakhir', tone: 'outbound' as const },
  { label: 'Net Movement', value: '+660 box', hint: 'Perubahan bersih stok harian', tone: 'balance' as const },
];

const dockQueueRows = [
  { dock: 'Dock 01', warehouse: 'WH Bekasi', eta: '08:30', job: 'Inbound Frozen Shrimp', status: 'loading' as const },
  { dock: 'Dock 03', warehouse: 'WH Surabaya', eta: '09:10', job: 'Outbound Retail Order', status: 'queued' as const },
  { dock: 'Dock 02', warehouse: 'WH Medan', eta: '09:45', job: 'Replenishment Dry Goods', status: 'ready' as const },
  { dock: 'Dock 05', warehouse: 'WH Makassar', eta: '10:15', job: 'Transfer Inter-WH', status: 'queued' as const },
];

const activityRows: OutstandingTableRow[] = [
  { location: 'WH Bekasi', referenceNumber: 'STK-240301', orderDate: '01/03/2026', dueDate: '03/03/2026', quantity: 2400, unit: 'Box', flags: ['R1'], status: 'In Process' },
  { location: 'WH Medan', referenceNumber: 'STK-240302', orderDate: '01/03/2026', dueDate: '02/03/2026', quantity: 1800, unit: 'Box', flags: ['D1'], status: 'Partially Delivered' },
  { location: 'WH Surabaya', referenceNumber: 'STK-240303', orderDate: '02/03/2026', dueDate: '04/03/2026', quantity: 1250, unit: 'Kg', flags: ['R1'], status: 'In Process' },
  { location: 'WH Makassar', referenceNumber: 'STK-240304', orderDate: '02/03/2026', dueDate: '05/03/2026', quantity: 920, unit: 'Pallet', flags: [], status: 'In Process' },
  { location: 'WH Bekasi', referenceNumber: 'STK-240305', orderDate: '03/03/2026', dueDate: '03/03/2026', quantity: 480, unit: 'Box', flags: ['D1'], status: 'Partially Delivered' },
];

const timeseriesSeries: TimeseriesSeries[] = [
  { key: 'inbound', label: 'Inbound', color: '#4A74CF' },
  { key: 'outbound', label: 'Outbound', color: '#56C288' },
  { key: 'stock', label: 'Stock', color: '#E6CC45' },
];

const timeseriesByWarehouse: Record<typeof warehouseOptions[number], TimeseriesDatum[]> = {
  'Semua Warehouse': [
    { date: '01/03', inbound: 112, outbound: 96, stock: 71 },
    { date: '02/03', inbound: 108, outbound: 91, stock: 72 },
    { date: '03/03', inbound: 118, outbound: 104, stock: 74 },
    { date: '04/03', inbound: 121, outbound: 109, stock: 77 },
    { date: '05/03', inbound: 126, outbound: 111, stock: 80 },
    { date: '06/03', inbound: 130, outbound: 116, stock: 82 },
    { date: '07/03', inbound: 138, outbound: 121, stock: 81 },
  ],
  'WH Medan': [
    { date: '01/03', inbound: 18, outbound: 16, stock: 64 },
    { date: '02/03', inbound: 20, outbound: 18, stock: 66 },
    { date: '03/03', inbound: 19, outbound: 17, stock: 67 },
    { date: '04/03', inbound: 22, outbound: 19, stock: 69 },
    { date: '05/03', inbound: 23, outbound: 20, stock: 70 },
    { date: '06/03', inbound: 24, outbound: 21, stock: 72 },
    { date: '07/03', inbound: 25, outbound: 20, stock: 71 },
  ],
  'WH Bekasi': [
    { date: '01/03', inbound: 32, outbound: 28, stock: 84 },
    { date: '02/03', inbound: 30, outbound: 27, stock: 85 },
    { date: '03/03', inbound: 34, outbound: 31, stock: 86 },
    { date: '04/03', inbound: 35, outbound: 30, stock: 88 },
    { date: '05/03', inbound: 36, outbound: 33, stock: 90 },
    { date: '06/03', inbound: 38, outbound: 34, stock: 92 },
    { date: '07/03', inbound: 39, outbound: 36, stock: 92 },
  ],
  'WH Surabaya': [
    { date: '01/03', inbound: 24, outbound: 22, stock: 78 },
    { date: '02/03', inbound: 23, outbound: 20, stock: 77 },
    { date: '03/03', inbound: 25, outbound: 22, stock: 79 },
    { date: '04/03', inbound: 27, outbound: 24, stock: 80 },
    { date: '05/03', inbound: 28, outbound: 25, stock: 82 },
    { date: '06/03', inbound: 29, outbound: 27, stock: 85 },
    { date: '07/03', inbound: 30, outbound: 28, stock: 88 },
  ],
  'WH Makassar': [
    { date: '01/03', inbound: 15, outbound: 13, stock: 58 },
    { date: '02/03', inbound: 16, outbound: 12, stock: 59 },
    { date: '03/03', inbound: 17, outbound: 14, stock: 61 },
    { date: '04/03', inbound: 18, outbound: 15, stock: 62 },
    { date: '05/03', inbound: 19, outbound: 16, stock: 63 },
    { date: '06/03', inbound: 20, outbound: 17, stock: 65 },
    { date: '07/03', inbound: 21, outbound: 18, stock: 66 },
  ],
};

const inboundOutboundStatus = {
  title: 'Inbound vs Outbound',
  series: [
    { day: '01', open: 112, closed: 96 },
    { day: '02', open: 108, closed: 91 },
    { day: '03', open: 118, closed: 104 },
    { day: '04', open: 121, closed: 109 },
    { day: '05', open: 126, closed: 111 },
    { day: '06', open: 130, closed: 116 },
    { day: '07', open: 138, closed: 121 },
  ],
};

export default function WarehouseDashboardPage() {
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>('Maret 2026');
  const [region, setRegion] = useState<(typeof regionOptions)[number]>('Semua Region');
  const [warehouse, setWarehouse] = useState<(typeof warehouseOptions)[number]>('Semua Warehouse');

  const kpiCards = useMemo(() => kpiByPeriod[period], [period]);
  const trendRows = useMemo(() => timeseriesByWarehouse[warehouse], [warehouse]);
  const subtitle = useMemo(() => `${period} · ${region}`, [period, region]);

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <div>
          <ToolbarHeading>
            <ToolbarPageTitle>Dashboard Warehouse</ToolbarPageTitle>
            <ToolbarDescription>
              Monitoring kapasitas gudang, stok, aging batch, inbound, dan outbound per warehouse.
            </ToolbarDescription>
          </ToolbarHeading>
        </div>
      </Toolbar>

      <div className="flex flex-wrap gap-3">
        <Select value={period} onValueChange={(value) => setPeriod(value as (typeof periodOptions)[number])}>
          <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>{periodOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={region} onValueChange={(value) => setRegion(value as (typeof regionOptions)[number])}>
          <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>{regionOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={warehouse} onValueChange={(value) => setWarehouse(value as (typeof warehouseOptions)[number])}>
          <SelectTrigger className="w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>{warehouseOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <KpiGrid cards={kpiCards} />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <OrderStatusCard title="Warehouse Health Status" subtitle={subtitle} items={warehouseStatus} />
        </div>
        <div className="lg:col-span-4">
          <OpenCloseBarCard
            title={inboundOutboundStatus.title}
            subtitle={subtitle}
            data={inboundOutboundStatus.series}
          />
        </div>
        <div className="lg:col-span-4">
          <TopAgingCard title="Occupancy Distribution" subtitle={subtitle} rows={occupancyRows} axisMax={8} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TimeseriesCard
            title="Warehouse Flow & Stock Trend"
            subtitle={subtitle}
            data={trendRows}
            series={timeseriesSeries}
            chartHeightClass="h-[320px]"
            legendAlign="center"
          />
        </div>
        <div className="lg:col-span-4">
          <TopAmountCard title="Top Warehouse Utilization" subtitle={subtitle} rows={topWarehouseRows} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <InventoryCoverageCard title="Inventory Coverage" subtitle={subtitle} rows={inventoryCoverageRows} maxDays={30} />
        </div>
        <div className="lg:col-span-7">
          <WarehouseAlertCard title="Warehouse Alerts & Actions" subtitle={subtitle} rows={warehouseAlerts} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RackUtilizationCard title="Rack Utilization Heatmap" subtitle={subtitle} rows={rackUtilizationRows} />
        </div>
        <div className="lg:col-span-7">
          <InventoryMovementCard title="Inventory Movement Summary" subtitle={subtitle} metrics={inventoryMovementMetrics} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <DockQueueCard title="Inbound / Outbound Dock Queue" subtitle={subtitle} rows={dockQueueRows} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <TopAgingCard title="Batch Aging Risk" subtitle={subtitle} rows={agingRows} axisMax={20} ticks={[0, 5, 10, 15, 20]} />
        </div>
        <div className="lg:col-span-8">
          <OutstandingOverdueTableCard
            title="Warehouse Activity Watchlist"
            subtitle={subtitle}
            rows={activityRows}
            actionLabel="Lihat Detail"
            overdueLabel="aktivitas"
          />
        </div>
      </div>
    </div>
  );
}
