/**
 * Mock dataset untuk Purchase Dashboard. Diisolasi di sini supaya
 * page.tsx fokus ke composition / layout.
 */
import type {
  AgingRow,
  KpiCard,
  OutstandingTableRow,
  StatusItem,
  TimeseriesDatum,
  TimeseriesSeries,
  TopAmountRow,
} from '@/components/dashboard';

export const periodOptions = [
  'Maret 2026',
  'Februari 2026',
  'Januari 2026',
] as const;

export type PurchasePeriod = (typeof periodOptions)[number];

const deltaLabel = 'vs bulan lalu';

export const kpiByPeriod: Record<PurchasePeriod, KpiCard[]> = {
  'Maret 2026': [
    { title: 'Total Purchase Order', subtitle: 'Maret 2026', value: '988', delta: -2, deltaLabel, info: 'Total PO yang dibuat pada periode terpilih.' },
    { title: 'PO Closed', subtitle: 'Maret 2026', value: '900', delta: 30, deltaLabel, status: 'good', info: 'PO dengan status selesai/closed.' },
    { title: 'PO Overdue (Kritis)', subtitle: 'Maret 2026', value: '150', delta: 2, deltaLabel, status: 'bad', info: 'PO melewati jatuh tempo dan butuh eskalasi.' },
    { title: 'PO Additional', subtitle: 'Maret 2026', value: '109', delta: 2, deltaLabel, status: 'warn', info: 'PO tambahan di luar rencana awal.' },
    { title: 'PO Outstanding', subtitle: 'Maret 2026', value: '90', delta: 30, deltaLabel, status: 'warn', info: 'PO aktif yang belum selesai.' },
    { title: 'PO Tepat Waktu', subtitle: 'Maret 2026', value: '90%', delta: -2, deltaLabel, status: 'good', info: 'Persentase PO yang selesai sesuai target waktu.' },
  ],
  'Februari 2026': [
    { title: 'Total Purchase Order', subtitle: 'Februari 2026', value: '912', delta: 4, deltaLabel, info: 'Total PO yang dibuat pada periode terpilih.' },
    { title: 'PO Closed', subtitle: 'Februari 2026', value: '865', delta: 6, deltaLabel, status: 'good', info: 'PO dengan status selesai/closed.' },
    { title: 'PO Overdue (Kritis)', subtitle: 'Februari 2026', value: '130', delta: -3, deltaLabel, status: 'warn', info: 'PO melewati jatuh tempo dan butuh eskalasi.' },
    { title: 'PO Additional', subtitle: 'Februari 2026', value: '118', delta: 5, deltaLabel, status: 'warn', info: 'PO tambahan di luar rencana awal.' },
    { title: 'PO Outstanding', subtitle: 'Februari 2026', value: '102', delta: -4, deltaLabel, status: 'warn', info: 'PO aktif yang belum selesai.' },
    { title: 'PO Tepat Waktu', subtitle: 'Februari 2026', value: '88%', delta: -1, deltaLabel, status: 'good', info: 'Persentase PO yang selesai sesuai target waktu.' },
  ],
  'Januari 2026': [
    { title: 'Total Purchase Order', subtitle: 'Januari 2026', value: '870', delta: 1, deltaLabel, info: 'Total PO yang dibuat pada periode terpilih.' },
    { title: 'PO Closed', subtitle: 'Januari 2026', value: '790', delta: 3, deltaLabel, status: 'good', info: 'PO dengan status selesai/closed.' },
    { title: 'PO Overdue (Kritis)', subtitle: 'Januari 2026', value: '160', delta: 1, deltaLabel, status: 'bad', info: 'PO melewati jatuh tempo dan butuh eskalasi.' },
    { title: 'PO Additional', subtitle: 'Januari 2026', value: '95', delta: -2, deltaLabel, status: 'warn', info: 'PO tambahan di luar rencana awal.' },
    { title: 'PO Outstanding', subtitle: 'Januari 2026', value: '120', delta: 4, deltaLabel, status: 'warn', info: 'PO aktif yang belum selesai.' },
    { title: 'PO Tepat Waktu', subtitle: 'Januari 2026', value: '86%', delta: -2, deltaLabel, status: 'good', info: 'Persentase PO yang selesai sesuai target waktu.' },
  ],
};

export const purchaseOrderStatus: StatusItem[] = [
  { key: 'created', label: 'Created', value: 40, color: '#48bb78' },
  { key: 'sent', label: 'Sent', value: 30, color: '#8bc34a' },
  { key: 'inProcess', label: 'In Process', value: 10, color: '#f1d54e' },
  { key: 'confirmedDI', label: 'Confirmed DI', value: 10, color: '#d946ef' },
  { key: 'onDelivery', label: 'On Delivery', value: 10, color: '#52c7dc' },
  { key: 'canceled', label: 'Canceled', value: 10, color: '#f2002d' },
  { key: 'partiallyDelivered', label: 'Partially Delivered', value: 40, color: '#5445e5' },
  { key: 'close', label: 'Close', value: 10, color: '#d1d5db' },
];

export const timeseriesPo: TimeseriesDatum[] = [
  { date: '01/07', supplierA: 180, supplierB: 90, supplierC: 200, supplierD: 320 },
  { date: '02/07', supplierA: 165, supplierB: 65, supplierC: 45, supplierD: 410 },
  { date: '03/07', supplierA: 150, supplierB: 52, supplierC: 260, supplierD: 255 },
  { date: '04/07', supplierA: 220, supplierB: 38, supplierC: 470, supplierD: 240 },
  { date: '05/07', supplierA: 180, supplierB: 82, supplierC: 78, supplierD: 225 },
  { date: '06/07', supplierA: 165, supplierB: 62, supplierC: 108, supplierD: 355 },
  { date: '07/07', supplierA: 152, supplierB: 44, supplierC: 78, supplierD: 238 },
  { date: '08/07', supplierA: 195, supplierB: 92, supplierC: 35, supplierD: 210 },
  { date: '09/07', supplierA: 220, supplierB: 35, supplierC: 280, supplierD: 225 },
  { date: '10/07', supplierA: 102, supplierB: 88, supplierC: 190, supplierD: 320 },
  { date: '11/07', supplierA: 240, supplierB: 55, supplierC: 410, supplierD: 360 },
  { date: '12/07', supplierA: 155, supplierB: 64, supplierC: 320, supplierD: 272 },
  { date: '13/07', supplierA: 220, supplierB: 50, supplierC: 200, supplierD: 380 },
  { date: '14/07', supplierA: 75, supplierB: 36, supplierC: 95, supplierD: 380 },
  { date: '15/07', supplierA: 268, supplierB: 68, supplierC: 185, supplierD: 408 },
];

export const timeseriesPoSeries: TimeseriesSeries[] = [
  { key: 'supplierA', label: 'Sup A', color: '#e6c739' },
  { key: 'supplierB', label: 'Sup B', color: '#1ea8bf' },
  { key: 'supplierC', label: 'Sup C', color: '#49b97a' },
  { key: 'supplierD', label: 'Sup D', color: '#4572d4' },
];

export const materialOpenClose = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const open = day % 3 === 0 ? 600 : day % 5 === 0 ? 420 : day % 2 === 0 ? 520 : 290;
  const closed = day % 4 === 0 ? 530 : day % 7 === 0 ? 420 : 450;
  return { day: `${String(day).padStart(2, '0')}/07`, open, closed };
});

export const outstandingRows: OutstandingTableRow[] = [
  { location: 'Warehouse004', referenceNumber: 'PONumber004', orderDate: '04/07/2026', dueDate: '18/07/2026', quantity: 65, unit: 'Pcs', flags: ['D1', 'A'], status: 'In Process' },
  { location: 'Warehouse005', referenceNumber: 'PONumber005', orderDate: '05/07/2026', dueDate: '17/07/2026', quantity: 89, unit: 'Pcs', flags: ['D1', 'A'], status: 'In Process' },
  { location: 'Warehouse007', referenceNumber: 'PONumber007', orderDate: '07/07/2026', dueDate: '21/07/2026', quantity: 100, unit: 'Pcs', flags: ['R1', 'A'], status: 'Partially Delivered' },
  { location: 'Warehouse009', referenceNumber: 'PONumber009', orderDate: '09/07/2026', dueDate: '24/07/2026', quantity: 89, unit: 'Pcs', flags: ['R1', 'A'], status: 'Close' },
  { location: 'Warehouse010', referenceNumber: 'PONumber010', orderDate: '10/07/2026', dueDate: '25/07/2026', quantity: 89, unit: 'Pcs', flags: ['D1', 'A'], status: 'Close' },
];

export const topSuppliersByAmount: TopAmountRow[] = [
  { initials: 'MV', name: 'Supplier Name A', code: 'SPA001', amount: '74,3 Juta' },
  { initials: 'MV', name: 'Supplier Name B', code: 'SPA002', amount: '70 Juta' },
  { initials: 'MV', name: 'Supplier Name C', code: 'SPA003', amount: '65,7 Juta' },
  { initials: 'MV', name: 'Supplier Name D', code: 'SPA004', amount: '65,1 Juta' },
  { initials: 'MV', name: 'Supplier Name E', code: 'SPA005', amount: '60,4 Juta' },
  { initials: 'MV', name: 'Supplier Name F', code: 'SPA006', amount: '54,3 Juta' },
  { initials: 'MV', name: 'Supplier Name G', code: 'SPA007', amount: '52,9 Juta' },
  { initials: 'MV', name: 'Supplier Name H', code: 'SPA008', amount: '51 Juta' },
];

export const poAgingTop10: AgingRow[] = [
  { label: 'Material A - P0001 - Supplier Z', days: 130 },
  { label: 'Material B - P0002 - Supplier Y', days: 129 },
  { label: 'Material C - P0003 - Supplier X', days: 118 },
  { label: 'Material D - P0004 - Supplier Z', days: 117 },
  { label: 'Material E - P0005 - Supplier Y', days: 101 },
  { label: 'Material F - P0006 - Supplier X', days: 95 },
  { label: 'Material G - P0007 - Supplier Z', days: 91 },
  { label: 'Material H - P0008 - Supplier Y', days: 89 },
  { label: 'Material I - P0009 - Supplier X', days: 86 },
  { label: 'Material J - P0010 - Supplier Z', days: 80 },
];

export const poAgingAxisMax = 140;
export const poAgingTicks = Array.from({ length: 8 }, (_, index) => index * 20);
