'use client';

import { useMemo, useState } from 'react';
import {
  DeliveryBarChartCard,
  DeliveryLeadTimeCard,
  DeliveryOtifCard,
  DeliveryOverdueTableCard,
  KpiGrid,
  OrderStatusCard,
  TimeseriesCard,
  TopAmountCard,
  type KpiCard,
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

const periodOptions = ['Monthly', 'Weekly', 'Daily'] as const;
const monthOptions = ['January', 'February', 'March'] as const;
const customerOptions = ['All Customer', 'Customer A', 'Customer B', 'Customer C', 'Customer D'] as const;

const kpiByMonth: Record<typeof monthOptions[number], KpiCard[]> = {
  January: [
    { title: 'Total Delivery Order', subtitle: 'January', value: '1508', delta: -2, deltaLabel: 'vs Last Month' },
    { title: 'Total Delivery Notes', subtitle: '[Month Selected]', value: '1508', delta: -2, deltaLabel: 'vs Last Month' },
  ],
  February: [
    { title: 'Total Delivery Order', subtitle: 'February', value: '1624', delta: 3, deltaLabel: 'vs Last Month' },
    { title: 'Total Delivery Notes', subtitle: '[Month Selected]', value: '1591', delta: 2, deltaLabel: 'vs Last Month' },
  ],
  March: [
    { title: 'Total Delivery Order', subtitle: 'March', value: '1712', delta: 5, deltaLabel: 'vs Last Month' },
    { title: 'Total Delivery Notes', subtitle: '[Month Selected]', value: '1668', delta: 4, deltaLabel: 'vs Last Month' },
  ],
};

const deliveryStatus: StatusItem[] = [
  { key: 'open', label: 'Open', value: 10, color: '#5C93F5' },
  { key: 'inProcess', label: 'In Process', value: 10, color: '#E6CF4B' },
  { key: 'shipping', label: 'Shipping', value: 10, color: '#7C30E8' },
  { key: 'needDelivery', label: 'Need Delivery', value: 10, color: '#ED904B' },
  { key: 'onDelivery', label: 'On Delivery', value: 10, color: '#D94E9B' },
  { key: 'delivered', label: 'Delivered', value: 10, color: '#B78B4E' },
  { key: 'doCollected', label: 'DO Collected', value: 10, color: '#72D0C1' },
  { key: 'loading', label: 'Loading', value: 10, color: '#4E74D6' },
];

const leadTimeRows = [
  { label: '1 Month', value: 15, color: '#F6D9DE' },
  { label: '2 Week', value: 15, color: '#F8DDE2' },
  { label: '6 Day', value: 15, color: '#F2ECCF' },
  { label: '3 Day', value: 15, color: '#F7F2DF' },
  { label: '1 Day', value: 15, color: '#F3F4F6' },
  { label: '0', value: 15, color: '#F3F4F6' },
];

const deliveredPerCompany: TopAmountRow[] = [
  { initials: 'MV', name: 'Company Name A', code: 'CMP-A', amount: '1800 Order Delivered' },
  { initials: 'MV', name: 'Company Name B', code: 'CMP-B', amount: '1800 Order Delivered' },
  { initials: 'MV', name: 'Company Name C', code: 'CMP-C', amount: '1800 Order Delivered' },
  { initials: 'MV', name: 'Company Name D', code: 'CMP-D', amount: '1800 Order Delivered' },
  { initials: 'MV', name: 'Company Name E', code: 'CMP-E', amount: '1800 Order Delivered' },
  { initials: 'MV', name: 'Company Name F', code: 'CMP-F', amount: '1800 Order Delivered' },
];

const overdueRows = [
  { doId: '1234', customerCode: 'POC00124', customer: 'Customer A', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '2 days', status: 'Need Delivery' as const },
  { doId: '1234', customerCode: 'POC00125', customer: 'Customer A', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '1 days', status: 'On Delivery' as const },
  { doId: '1334', customerCode: 'POC00131', customer: 'Customer C', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '1 days', status: 'On Delivery' as const },
  { doId: '3456', customerCode: 'POC00128', customer: 'Customer D', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '2 days', status: 'Need Delivery' as const },
  { doId: '3456', customerCode: 'POC00132', customer: 'Customer D', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '2 days', status: 'Need Delivery' as const },
  { doId: '3456', customerCode: 'POC00133', customer: 'Customer I', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '1 days', status: 'On Delivery' as const },
  { doId: '3456', customerCode: 'POC00134', customer: 'Customer J', plannedDate: 'DD/MM/YYYY', actualDate: 'DD/MM/YYYY', daysLate: '2 days', status: 'On Delivery' as const },
];

const timeseriesSeries: TimeseriesSeries[] = [
  { key: 'customerA', label: 'Customer A', color: '#E2C94C' },
  { key: 'customerB', label: 'Customer B', color: '#77D2C8' },
  { key: 'customerC', label: 'Customer C', color: '#69C17D' },
  { key: 'customerD', label: 'Customer D', color: '#4E74D6' },
];

const timeseriesDataByCustomer: Record<string, TimeseriesDatum[]> = {
  'All Customer': [
    { date: '01/07', customerA: 180, customerB: 90, customerC: 200, customerD: 320 },
    { date: '02/07', customerA: 165, customerB: 65, customerC: 45, customerD: 410 },
    { date: '03/07', customerA: 220, customerB: 52, customerC: 260, customerD: 255 },
    { date: '04/07', customerA: 210, customerB: 38, customerC: 470, customerD: 240 },
    { date: '05/07', customerA: 180, customerB: 82, customerC: 78, customerD: 360 },
    { date: '06/07', customerA: 165, customerB: 62, customerC: 98, customerD: 235 },
    { date: '07/07', customerA: 150, customerB: 44, customerC: 68, customerD: 220 },
    { date: '08/07', customerA: 142, customerB: 92, customerC: 35, customerD: 225 },
    { date: '09/07', customerA: 260, customerB: 36, customerC: 290, customerD: 320 },
    { date: '10/07', customerA: 180, customerB: 88, customerC: 190, customerD: 255 },
    { date: '11/07', customerA: 145, customerB: 55, customerC: 420, customerD: 350 },
    { date: '12/07', customerA: 215, customerB: 62, customerC: 300, customerD: 270 },
    { date: '13/07', customerA: 70, customerB: 34, customerC: 180, customerD: 380 },
    { date: '14/07', customerA: 110, customerB: 28, customerC: 95, customerD: 380 },
    { date: '15/07', customerA: 260, customerB: 65, customerC: 190, customerD: 405 },
  ],
  'Customer A': Array.from({ length: 15 }, (_, index) => ({ date: `${String(index + 1).padStart(2, '0')}/07`, customerA: [180,165,220,210,180,165,150,142,260,180,145,215,70,110,260][index], customerB: 0, customerC: 0, customerD: 0 })),
  'Customer B': Array.from({ length: 15 }, (_, index) => ({ date: `${String(index + 1).padStart(2, '0')}/07`, customerA: 0, customerB: [90,65,52,38,82,62,44,92,36,88,55,62,34,28,65][index], customerC: 0, customerD: 0 })),
  'Customer C': Array.from({ length: 15 }, (_, index) => ({ date: `${String(index + 1).padStart(2, '0')}/07`, customerA: 0, customerB: 0, customerC: [200,45,260,470,78,98,68,35,290,190,420,300,180,95,190][index], customerD: 0 })),
  'Customer D': Array.from({ length: 15 }, (_, index) => ({ date: `${String(index + 1).padStart(2, '0')}/07`, customerA: 0, customerB: 0, customerC: 0, customerD: [320,410,255,240,360,235,220,225,320,255,350,270,380,380,405][index] })),
};

const deliveredChartData = [590, 770, 1015, 1220, 1015, 770, 590, 350, 170, 590, 770, 1220, 770, 170, 590, 770, 1015, 1220, 1015, 770, 1220, 1015, 590, 1015, 1220, 1015, 1220, 590, 1015, 770].map((value, index) => ({
  date: `${String(index + 1).padStart(2, '0')}/07`,
  delivered: value,
}));

export default function DeliveryDashboardPage() {
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>('Monthly');
  const [month, setMonth] = useState<(typeof monthOptions)[number]>('January');
  const [customer, setCustomer] = useState<(typeof customerOptions)[number]>('All Customer');

  const kpiCards = useMemo(() => kpiByMonth[month], [month]);
  const timeseriesData = useMemo(() => timeseriesDataByCustomer[customer], [customer]);
  const selectedSubtitle = useMemo(() => `${month} · ${period}`, [month, period]);

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <div>
          <ToolbarHeading>
            <ToolbarPageTitle>Dashboard Delivery</ToolbarPageTitle>
            <ToolbarDescription>Monitoring delivery order, OTIF, lead time, overdue, dan performa pengiriman.</ToolbarDescription>
          </ToolbarHeading>
        </div>
      </Toolbar>

      <div className="flex flex-wrap gap-3">
        <Select value={period} onValueChange={(value) => setPeriod(value as (typeof periodOptions)[number])}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{periodOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={month} onValueChange={(value) => setMonth(value as (typeof monthOptions)[number])}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{monthOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <KpiGrid cards={kpiCards} className="xl:grid-cols-2" />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <OrderStatusCard title="Delivery Order Status" subtitle={selectedSubtitle} items={deliveryStatus} />
        </div>
        <div className="lg:col-span-4">
          <DeliveryOtifCard title="OTIF (On Time In Full)" subtitle={selectedSubtitle} percentage={28} onTime={150} total={1000} />
        </div>
        <div className="lg:col-span-4">
          <DeliveryLeadTimeCard title="Lead Time Delivery" rows={leadTimeRows} maxValue={15} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <TopAmountCard title="Delivered Order per Company" subtitle={selectedSubtitle} rows={deliveredPerCompany} />
        </div>
        <div className="lg:col-span-8">
          <DeliveryOverdueTableCard title="Delivery Order Overdue" subtitle={selectedSubtitle} rows={overdueRows} />
        </div>
      </div>

      <TimeseriesCard
        title="Timeseries Delivery Order"
        subtitle={selectedSubtitle}
        data={timeseriesData}
        series={timeseriesSeries}
        yAxisDomain={[0, 1000]}
        chartHeightClass="h-[340px]"
        legendAlign="center"
        cardClassName="lg:col-span-12"
        headerClassName="pb-2"
        headerAction={(
          <Select value={customer} onValueChange={(value) => setCustomer(value as (typeof customerOptions)[number])}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{customerOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
        )}
      />

      <DeliveryBarChartCard title="Total Delivery Order (Delivered)" subtitle={selectedSubtitle} data={deliveredChartData} />
    </div>
  );
}
