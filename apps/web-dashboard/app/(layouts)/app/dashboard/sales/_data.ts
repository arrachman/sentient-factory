/**
 * Mock data untuk Sales Dashboard. Diisolasi supaya page.tsx fokus
 * ke composition.
 */
import type {
  AgingRow,
  KpiCard,
  OutstandingTableRow,
  StatusItem,
  TimeseriesDatum,
  TimeseriesSeries,
} from '@/components/dashboard';

export type SalesOrderRow = {
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

export const topFilters = {
  period: ['Monthly', 'Weekly', 'Daily'],
  month: ['Month Selected', 'Last Month', 'This Quarter'],
  customer: ['All Customer', 'Top 10 Customer', 'Corporate'],
};

export const kpiCardsByMonth: Record<string, KpiCard[]> = {
  'Month Selected': [
    { title: 'Total Revenue', subtitle: 'Month Selected', value: 'Rp 54,3 juta', delta: -2, deltaLabel: 'vs Last Month' },
    { title: 'Total Sales Order', subtitle: 'Month Selected', value: '1508', delta: 2, deltaLabel: 'vs Last Month' },
    { title: 'Order Fill Rate', subtitle: 'Month Selected', value: '72 %', delta: 2, deltaLabel: 'vs Last Month' },
  ],
  'Last Month': [
    { title: 'Total Revenue', subtitle: 'Last Month', value: 'Rp 55,4 juta', delta: 1, deltaLabel: 'vs Prior Month' },
    { title: 'Total Sales Order', subtitle: 'Last Month', value: '1492', delta: -1, deltaLabel: 'vs Prior Month' },
    { title: 'Order Fill Rate', subtitle: 'Last Month', value: '71 %', delta: -1, deltaLabel: 'vs Prior Month' },
  ],
  'This Quarter': [
    { title: 'Total Revenue', subtitle: 'This Quarter', value: 'Rp 162,8 juta', delta: 4, deltaLabel: 'vs Last Quarter' },
    { title: 'Total Sales Order', subtitle: 'This Quarter', value: '4520', delta: 3, deltaLabel: 'vs Last Quarter' },
    { title: 'Order Fill Rate', subtitle: 'This Quarter', value: '73 %', delta: 1, deltaLabel: 'vs Last Quarter' },
  ],
};

export const soStatus: StatusItem[] = [
  { key: 'open', label: 'Open', value: 10, color: '#4A74CF' },
  { key: 'finishPlan', label: 'Finish Plan', value: 10, color: '#5E47E8' },
  { key: 'doCreated', label: 'DO Created', value: 10, color: '#53C5D8' },
  { key: 'inProcess', label: 'In Process', value: 10, color: '#E6CC45' },
  { key: 'close', label: 'Close', value: 10, color: '#C9CBCF' },
  { key: 'soCollected', label: 'SO Collected', value: 10, color: '#F68A41' },
  { key: 'readyToInvoice', label: 'Ready to Invoice', value: 10, color: '#E5469D' },
];

const salesTrend = [
  { day: '1', value: 28 }, { day: '2', value: 28 }, { day: '3', value: 34 }, { day: '4', value: 40 },
  { day: '5', value: 40 }, { day: '6', value: 33 }, { day: '7', value: 30 }, { day: '8', value: 30 },
  { day: '9', value: 24 }, { day: '10', value: 24 }, { day: '11', value: 30 }, { day: '12', value: 38 },
  { day: '13', value: 38 }, { day: '14', value: 45 }, { day: '15', value: 45 },
];

export const revenueSeries: TimeseriesSeries[] = [
  { key: 'revenue', label: 'Revenue', color: '#0A63FF' },
];
export const salesOrderSeries: TimeseriesSeries[] = [
  { key: 'salesOrder', label: 'Sales Order', color: '#0A63FF' },
];

const revenueTimeseries: TimeseriesDatum[] = salesTrend.map((row) => ({
  date: row.day,
  revenue: row.value,
}));

const salesOrderTimeseries: TimeseriesDatum[] = salesTrend.map((row) => ({
  date: row.day,
  salesOrder: row.value,
}));

export const revenueByMonth: Record<
  string,
  { value: string; delta: number; deltaLabel: string; series: TimeseriesDatum[] }
> = {
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

export const salesOrderByMonth: Record<
  string,
  { value: string; delta: number; deltaLabel: string; series: TimeseriesDatum[] }
> = {
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
  { soNumber: 'SONumID001', poCustomer: 'POC00124', orderDate: 'DD/MM/YYY', createdDate: 'DD/MM/YYY', deliveryDate: '-', codeCustomer: 'POC00124', customer: 'Customer A', totalPrice: 'Rp. 3.000.000', flagLink: 3, flagDoc: 0, status: 'DO Created' },
  { soNumber: 'SONumID002', poCustomer: 'POC00125', orderDate: 'DD/MM/YYY', createdDate: 'DD/MM/YYY', deliveryDate: '-', codeCustomer: 'POC00125', customer: 'Customer A', totalPrice: 'Rp. 3.000.000', flagLink: 3, flagDoc: 0, status: 'DO Created' },
  { soNumber: 'SONumID003', poCustomer: 'POC00131', orderDate: 'DD/MM/YYY', createdDate: 'DD/MM/YYY', deliveryDate: 'DD/MM/YYY', codeCustomer: 'POC00131', customer: 'Customer C', totalPrice: 'Rp. 3.000.000', flagLink: 3, flagDoc: 0, status: 'DO Created' },
  { soNumber: 'SONumID004', poCustomer: 'POC00128', orderDate: 'DD/MM/YYY', createdDate: 'DD/MM/YYY', deliveryDate: 'DD/MM/YYY', codeCustomer: 'POC00128', customer: 'Customer D', totalPrice: 'Rp. 3.000.000', flagLink: 0, flagDoc: 1, status: 'Close' },
  { soNumber: 'SONumID005', poCustomer: 'POC00132', orderDate: 'DD/MM/YYY', createdDate: 'DD/MM/YYY', deliveryDate: 'DD/MM/YYY', codeCustomer: 'POC00132', customer: 'Customer D', totalPrice: 'Rp. 3.000.000', flagLink: 0, flagDoc: 1, status: 'Close' },
];

export const salesOrderTableRows: OutstandingTableRow[] = salesOrderRows.map(
  (row, index) => {
    const flags: string[] = [];
    if (row.flagLink > 0) flags.push('R1');
    if (row.flagDoc > 0) flags.push('D1');
    if (flags.length === 0) flags.push('N1');
    return {
      location: row.customer,
      referenceNumber: row.soNumber,
      orderDate: row.orderDate,
      dueDate: row.deliveryDate === '-' ? row.createdDate : row.deliveryDate,
      quantity: 120 + index * 4,
      unit: 'pcs',
      flags,
      status: row.status === 'Close' ? 'Close' : 'In Process',
    };
  },
);

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

export const topMaterials: AgingRow[] = topMaterialsRaw.map((row) => ({
  label: row.material,
  days: row.amount,
}));

export const topMaterialsAxisMax = 1400;
export const topMaterialsTicks = Array.from(
  { length: 8 },
  (_, index) => index * 200,
);
