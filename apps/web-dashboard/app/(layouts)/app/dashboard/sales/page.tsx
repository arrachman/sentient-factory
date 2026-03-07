'use client';

import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Link2, Paperclip } from 'lucide-react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  KpiGrid,
  OrderStatusCard,
  TimeseriesCard,
  TopAgingCard,
  type AgingRow,
  type KpiCard,
  type StatusItem,
  type TimeseriesDatum,
  type TimeseriesSeries,
} from '@/components/dashboard';

type SalesOrderRow = {
  soNumber: string;
  poCustomer: string;
  orderDate: string;
  createdDate: string;
  deliveryDate: string;
  codeCustomer: string;
  customer: string;
  totalPrice: string;
  flagLink: number;
  flagDoc: number;
  status: 'DO Created' | 'Close';
};

const topFilters = {
  period: ['Monthly', 'Weekly', 'Daily'],
  month: ['Month Selected', 'Last Month', 'This Quarter'],
  customer: ['All Customer', 'Top 10 Customer', 'Corporate'],
};

const kpiCardsByMonth: Record<string, KpiCard[]> = {
  'Month Selected': [
    {
      title: 'Total Revenue',
      subtitle: 'Month Selected',
      value: 'Rp 54,3 juta',
      delta: -2,
      deltaLabel: 'vs Last Month',
    },
    {
      title: 'Total Sales Order',
      subtitle: 'Month Selected',
      value: '1508',
      delta: 2,
      deltaLabel: 'vs Last Month',
    },
    {
      title: 'Order Fill Rate',
      subtitle: 'Month Selected',
      value: '72 %',
      delta: 2,
      deltaLabel: 'vs Last Month',
    },
  ],
  'Last Month': [
    {
      title: 'Total Revenue',
      subtitle: 'Last Month',
      value: 'Rp 55,4 juta',
      delta: 1,
      deltaLabel: 'vs Prior Month',
    },
    {
      title: 'Total Sales Order',
      subtitle: 'Last Month',
      value: '1492',
      delta: -1,
      deltaLabel: 'vs Prior Month',
    },
    {
      title: 'Order Fill Rate',
      subtitle: 'Last Month',
      value: '71 %',
      delta: -1,
      deltaLabel: 'vs Prior Month',
    },
  ],
  'This Quarter': [
    {
      title: 'Total Revenue',
      subtitle: 'This Quarter',
      value: 'Rp 162,8 juta',
      delta: 4,
      deltaLabel: 'vs Last Quarter',
    },
    {
      title: 'Total Sales Order',
      subtitle: 'This Quarter',
      value: '4520',
      delta: 3,
      deltaLabel: 'vs Last Quarter',
    },
    {
      title: 'Order Fill Rate',
      subtitle: 'This Quarter',
      value: '73 %',
      delta: 1,
      deltaLabel: 'vs Last Quarter',
    },
  ],
};

const soStatus: StatusItem[] = [
  { key: 'open', label: 'Open', value: 10, color: '#4A74CF' },
  { key: 'finishPlan', label: 'Finish Plan', value: 10, color: '#5E47E8' },
  { key: 'doCreated', label: 'DO Created', value: 10, color: '#53C5D8' },
  { key: 'inProcess', label: 'In Process', value: 10, color: '#E6CC45' },
  { key: 'close', label: 'Close', value: 10, color: '#C9CBCF' },
  { key: 'soCollected', label: 'SO Collected', value: 10, color: '#F68A41' },
  { key: 'readyToInvoice', label: 'Ready to Invoice', value: 10, color: '#E5469D' },
];

const salesTrend = [
  { day: '1', value: 28 },
  { day: '2', value: 28 },
  { day: '3', value: 34 },
  { day: '4', value: 40 },
  { day: '5', value: 40 },
  { day: '6', value: 33 },
  { day: '7', value: 30 },
  { day: '8', value: 30 },
  { day: '9', value: 24 },
  { day: '10', value: 24 },
  { day: '11', value: 30 },
  { day: '12', value: 38 },
  { day: '13', value: 38 },
  { day: '14', value: 45 },
  { day: '15', value: 45 },
];

const revenueSeries: TimeseriesSeries[] = [{ key: 'revenue', label: 'Revenue', color: '#0A63FF' }];
const salesOrderSeries: TimeseriesSeries[] = [{ key: 'salesOrder', label: 'Sales Order', color: '#0A63FF' }];

const revenueTimeseries: TimeseriesDatum[] = salesTrend.map((row) => ({
  date: row.day,
  revenue: row.value,
}));

const salesOrderTimeseries: TimeseriesDatum[] = salesTrend.map((row) => ({
  date: row.day,
  salesOrder: row.value,
}));

const revenueByMonth: Record<string, { value: string; delta: number; deltaLabel: string; series: TimeseriesDatum[] }> = {
  'Month Selected': {
    value: 'Rp 54,3 juta',
    delta: -2,
    deltaLabel: 'vs Last Month',
    series: revenueTimeseries,
  },
  'Last Month': {
    value: 'Rp 55,4 juta',
    delta: 1,
    deltaLabel: 'vs Prior Month',
    series: salesTrend.map((row) => ({
      date: row.day,
      revenue: Math.max(0, row.value - 3),
    })),
  },
  'This Quarter': {
    value: 'Rp 162,8 juta',
    delta: 4,
    deltaLabel: 'vs Last Quarter',
    series: salesTrend.map((row) => ({
      date: row.day,
      revenue: row.value + 4,
    })),
  },
};

const salesOrderByMonth: Record<string, { value: string; delta: number; deltaLabel: string; series: TimeseriesDatum[] }> = {
  'Month Selected': {
    value: '1508',
    delta: 2,
    deltaLabel: 'vs Last Month',
    series: salesOrderTimeseries,
  },
  'Last Month': {
    value: '1492',
    delta: -1,
    deltaLabel: 'vs Prior Month',
    series: salesTrend.map((row) => ({
      date: row.day,
      salesOrder: Math.max(0, row.value - 4),
    })),
  },
  'This Quarter': {
    value: '4520',
    delta: 3,
    deltaLabel: 'vs Last Quarter',
    series: salesTrend.map((row) => ({
      date: row.day,
      salesOrder: row.value + 6,
    })),
  },
};

const salesOrderRows: SalesOrderRow[] = [
  {
    soNumber: 'SONumID001',
    poCustomer: 'POC00124',
    orderDate: 'DD/MM/YYY',
    createdDate: 'DD/MM/YYY',
    deliveryDate: '-',
    codeCustomer: 'POC00124',
    customer: 'Customer A',
    totalPrice: 'Rp. 3.000.000',
    flagLink: 3,
    flagDoc: 0,
    status: 'DO Created',
  },
  {
    soNumber: 'SONumID002',
    poCustomer: 'POC00125',
    orderDate: 'DD/MM/YYY',
    createdDate: 'DD/MM/YYY',
    deliveryDate: '-',
    codeCustomer: 'POC00125',
    customer: 'Customer A',
    totalPrice: 'Rp. 3.000.000',
    flagLink: 3,
    flagDoc: 0,
    status: 'DO Created',
  },
  {
    soNumber: 'SONumID003',
    poCustomer: 'POC00131',
    orderDate: 'DD/MM/YYY',
    createdDate: 'DD/MM/YYY',
    deliveryDate: 'DD/MM/YYY',
    codeCustomer: 'POC00131',
    customer: 'Customer C',
    totalPrice: 'Rp. 3.000.000',
    flagLink: 3,
    flagDoc: 0,
    status: 'DO Created',
  },
  {
    soNumber: 'SONumID004',
    poCustomer: 'POC00128',
    orderDate: 'DD/MM/YYY',
    createdDate: 'DD/MM/YYY',
    deliveryDate: 'DD/MM/YYY',
    codeCustomer: 'POC00128',
    customer: 'Customer D',
    totalPrice: 'Rp. 3.000.000',
    flagLink: 0,
    flagDoc: 1,
    status: 'Close',
  },
  {
    soNumber: 'SONumID005',
    poCustomer: 'POC00132',
    orderDate: 'DD/MM/YYY',
    createdDate: 'DD/MM/YYY',
    deliveryDate: 'DD/MM/YYY',
    codeCustomer: 'POC00132',
    customer: 'Customer D',
    totalPrice: 'Rp. 3.000.000',
    flagLink: 0,
    flagDoc: 1,
    status: 'Close',
  },
];

const topMaterialsRaw = [
  { material: 'MaterialA001 - Material Name with 1000 {pcs} stock available', amount: 1320 },
  { material: 'MaterialA002 - Material Name with 1000 {pcs} stock available', amount: 1299 },
  { material: 'MaterialA003 - Material Name with 1000 {pcs} stock available', amount: 1180 },
  { material: 'MaterialA004 - Material Name with 1000 {pcs} stock available', amount: 1173 },
  { material: 'MaterialA005 - Material Name with 1000 {pcs} stock available', amount: 1101 },
  { material: 'MaterialA006 - Material Name with 1000 {pcs} stock available', amount: 951 },
  { material: 'MaterialA007 - Material Name with 1000 {pcs} stock available', amount: 910 },
  { material: 'MaterialA008 - Material Name with 1000 {pcs} stock available', amount: 892 },
  { material: 'MaterialA009 - Material Name with 1000 {pcs} stock available', amount: 862 },
  { material: 'MaterialA0010 - Material Name with 1000 {pcs} stock available', amount: 802 },
];

const topMaterials: AgingRow[] = topMaterialsRaw.map((row) => ({ label: row.material, days: row.amount }));

const topMaterialsAxisMax = 1400;
const topMaterialsTicks = Array.from({ length: 8 }, (_, index) => index * 200);

function StatusBadge({ status }: { status: SalesOrderRow['status'] }) {
  if (status === 'DO Created') {
    return (
      <Badge variant="info" appearance="light" className="rounded-md px-2 py-0.5 text-sm font-semibold">
        DO Created
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" appearance="light" className="rounded-md px-2 py-0.5 text-sm font-semibold">
      Close
    </Badge>
  );
}

function FlagBadges({ linkCount, docCount }: { linkCount: number; docCount: number }) {
  return (
    <div className="flex items-center gap-2">
      {linkCount > 0 && (
        <Badge variant="success" appearance="light" className="rounded-full px-2 py-0.5 text-xs font-semibold">
          <Link2 className="size-3.5" />
          {linkCount}
        </Badge>
      )}
      {docCount > 0 && (
        <Badge variant="destructive" appearance="light" className="rounded-full px-2 py-0.5 text-xs font-semibold">
          <Paperclip className="size-3.5" />
          {docCount}
        </Badge>
      )}
      <Badge variant="info" appearance="light" className="rounded-full p-1">
        <Paperclip className="size-3.5" />
      </Badge>
    </div>
  );
}

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
          <SelectTrigger className="h-10 w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topFilters.period.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-10 w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topFilters.month.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={topFilters.customer[0]}>
          <SelectTrigger className="h-10 w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topFilters.customer.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
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

      <Card className="rounded-xl border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-3xl font-semibold lg:text-4xl">Sales Order List</CardTitle>
              <p className="text-lg text-muted-foreground">{selectedMonth}</p>
            </div>
            <Select defaultValue="allFlag">
              <SelectTrigger className="h-10 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allFlag">All Flag</SelectItem>
                <SelectItem value="linkOnly">Link Only</SelectItem>
                <SelectItem value="docOnly">Doc Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">SO Number</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">PO Customer</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Order Date</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Created Date</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Delivery Date</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Code Cust.</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Customer</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Total Price</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Flag</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-[13px] font-semibold uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrderRows.map((row) => (
                  <TableRow key={row.soNumber}>
                    <TableCell>{row.soNumber}</TableCell>
                    <TableCell className={row.poCustomer === 'POC00131' ? 'font-semibold text-violet-600 underline' : ''}>
                      {row.poCustomer}
                    </TableCell>
                    <TableCell>{row.orderDate}</TableCell>
                    <TableCell>{row.createdDate}</TableCell>
                    <TableCell>{row.deliveryDate}</TableCell>
                    <TableCell>{row.codeCustomer}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.totalPrice}</TableCell>
                    <TableCell>
                      <FlagBadges linkCount={row.flagLink} docCount={row.flagDoc} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <button type="button" className="text-primary">
                        <Eye className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
            <p>Showing 1 to 5 of 100 entries</p>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded border border-border px-2 py-1">
                <ChevronLeft className="size-4" />
              </button>
              <button type="button" className="rounded bg-primary px-3 py-1 text-primary-foreground">
                1
              </button>
              <button type="button" className="rounded px-2 py-1">
                2
              </button>
              <button type="button" className="rounded px-2 py-1">
                3
              </button>
              <button type="button" className="rounded px-2 py-1">
                4
              </button>
              <button type="button" className="rounded px-2 py-1">
                5
              </button>
              <button type="button" className="rounded border border-border px-2 py-1">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <SelectTrigger className="h-10 w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {topFilters.month.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
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
