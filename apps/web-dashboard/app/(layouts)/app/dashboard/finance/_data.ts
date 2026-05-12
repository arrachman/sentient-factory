/**
 * Mock data untuk Finance Dashboard.
 * Dipisah dari `page.tsx` untuk menjaga halaman tetap < 400 LOC dan mudah swap
 * ke data nyata di masa depan.
 */
import type {
  KpiCard,
  StatusItem,
  TimeseriesDatum,
  TimeseriesSeries,
  TopAmountRow,
} from '@/components/dashboard';

export const periodOptions = ['March 2026', 'February 2026', 'January 2026'] as const;
export const dashboardTabs = ['Finance', 'Accounting'] as const;

export type FinancePeriod = (typeof periodOptions)[number];
export type FinanceTab = (typeof dashboardTabs)[number];

export const kpiByPeriod: Record<FinancePeriod, KpiCard[]> = {
  'March 2026': [
    { title: 'Total Inflow', subtitle: 'March 2026', value: 'Rp 5,4 M', delta: 6, deltaLabel: 'vs last month', status: 'good' },
    { title: 'Total Outflow', subtitle: 'March 2026', value: 'Rp 3,8 M', delta: 4, deltaLabel: 'vs last month' },
    { title: 'Net Cashflow', subtitle: 'March 2026', value: 'Rp 1,6 M', delta: 9, deltaLabel: 'vs last month', status: 'good' },
    { title: 'Outstanding Payable', subtitle: 'March 2026', value: 'Rp 845 Jt', delta: -3, deltaLabel: 'vs last month', status: 'warn' },
  ],
  'February 2026': [
    { title: 'Total Inflow', subtitle: 'February 2026', value: 'Rp 5,1 M', delta: 3, deltaLabel: 'vs previous month', status: 'good' },
    { title: 'Total Outflow', subtitle: 'February 2026', value: 'Rp 3,6 M', delta: 2, deltaLabel: 'vs previous month' },
    { title: 'Net Cashflow', subtitle: 'February 2026', value: 'Rp 1,5 M', delta: 5, deltaLabel: 'vs previous month', status: 'good' },
    { title: 'Outstanding Payable', subtitle: 'February 2026', value: 'Rp 871 Jt', delta: 1, deltaLabel: 'vs previous month', status: 'warn' },
  ],
  'January 2026': [
    { title: 'Total Inflow', subtitle: 'January 2026', value: 'Rp 4,8 M', delta: 2, deltaLabel: 'vs previous month', status: 'good' },
    { title: 'Total Outflow', subtitle: 'January 2026', value: 'Rp 3,5 M', delta: 1, deltaLabel: 'vs previous month' },
    { title: 'Net Cashflow', subtitle: 'January 2026', value: 'Rp 1,3 M', delta: 2, deltaLabel: 'vs previous month', status: 'good' },
    { title: 'Outstanding Payable', subtitle: 'January 2026', value: 'Rp 862 Jt', delta: 2, deltaLabel: 'vs previous month', status: 'warn' },
  ],
};

export const cashflowSeries: TimeseriesSeries[] = [
  { key: 'inflow', label: 'Inflow', color: '#22C55E' },
  { key: 'outflow', label: 'Outflow', color: '#EF4444' },
  { key: 'net', label: 'Net', color: '#2563EB' },
];

export const cashflowData: TimeseriesDatum[] = [
  { date: '01/03', inflow: 620, outflow: 430, net: 190 },
  { date: '05/03', inflow: 710, outflow: 500, net: 210 },
  { date: '10/03', inflow: 680, outflow: 440, net: 240 },
  { date: '15/03', inflow: 750, outflow: 520, net: 230 },
  { date: '20/03', inflow: 790, outflow: 540, net: 250 },
  { date: '25/03', inflow: 730, outflow: 510, net: 220 },
  { date: '30/03', inflow: 810, outflow: 560, net: 250 },
];

export const paymentStatus: StatusItem[] = [
  { key: 'paid', label: 'Paid', value: 48, color: '#22C55E' },
  { key: 'pending', label: 'Pending', value: 22, color: '#F59E0B' },
  { key: 'overdue', label: 'Overdue', value: 10, color: '#EF4444' },
  { key: 'draft', label: 'Draft', value: 12, color: '#60A5FA' },
];

export const topAccounts: TopAmountRow[] = [
  { initials: 'CS', name: 'Cash & Bank', code: '1101', amount: 'Rp 2,1 M' },
  { initials: 'AR', name: 'Account Receivable', code: '1201', amount: 'Rp 1,8 M' },
  { initials: 'AP', name: 'Account Payable', code: '2101', amount: 'Rp 845 Jt' },
  { initials: 'OP', name: 'Operational Expense', code: '5101', amount: 'Rp 632 Jt' },
  { initials: 'TX', name: 'Tax Payable', code: '2201', amount: 'Rp 421 Jt' },
  { initials: 'PR', name: 'Payroll Expense', code: '5201', amount: 'Rp 398 Jt' },
];

export const topBranches: TopAmountRow[] = [
  { initials: 'JK', name: 'Jakarta', code: 'BR-01', amount: 'Rp 1,9 M' },
  { initials: 'SB', name: 'Surabaya', code: 'BR-02', amount: 'Rp 1,3 M' },
  { initials: 'BD', name: 'Bandung', code: 'BR-03', amount: 'Rp 940 Jt' },
  { initials: 'SM', name: 'Semarang', code: 'BR-04', amount: 'Rp 775 Jt' },
  { initials: 'MD', name: 'Medan', code: 'BR-05', amount: 'Rp 650 Jt' },
];

export const transactionRows = [
  { voucherNo: 'BM-240301', date: '01/03/2026', account: 'Cash & Bank', branch: 'Jakarta', amount: 'Rp 215.000.000', status: 'Paid' as const },
  { voucherNo: 'BK-240305', date: '05/03/2026', account: 'Operational Expense', branch: 'Surabaya', amount: 'Rp 86.500.000', status: 'Pending' as const },
  { voucherNo: 'JV-240310', date: '10/03/2026', account: 'Payroll Expense', branch: 'Bandung', amount: 'Rp 124.000.000', status: 'Paid' as const },
  { voucherNo: 'BK-240315', date: '15/03/2026', account: 'Tax Payable', branch: 'Jakarta', amount: 'Rp 66.250.000', status: 'Overdue' as const },
  { voucherNo: 'JV-240320', date: '20/03/2026', account: 'Account Payable', branch: 'Semarang', amount: 'Rp 142.000.000', status: 'Pending' as const },
  { voucherNo: 'BK-240328', date: '28/03/2026', account: 'Cash & Bank', branch: 'Medan', amount: 'Rp 94.500.000', status: 'Paid' as const },
];

export const cashPositionRows: TopAmountRow[] = [
  { initials: 'BM', name: 'BCA Main Account', code: '1101-01', amount: 'Rp 1,15 M' },
  { initials: 'BR', name: 'BRI Operational', code: '1101-02', amount: 'Rp 725 Jt' },
  { initials: 'MN', name: 'Mandiri Payroll', code: '1101-03', amount: 'Rp 484 Jt' },
  { initials: 'CT', name: 'Cash on Hand', code: '1101-04', amount: 'Rp 42 Jt' },
];

export const forecastSeries: TimeseriesSeries[] = [
  { key: 'incoming', label: 'Incoming', color: '#22C55E' },
  { key: 'outgoing', label: 'Outgoing', color: '#EF4444' },
];

export const forecastData: TimeseriesDatum[] = [
  { date: 'W1', incoming: 920, outgoing: 680 },
  { date: 'W2', incoming: 840, outgoing: 710 },
  { date: 'W3', incoming: 980, outgoing: 760 },
  { date: 'W4', incoming: 890, outgoing: 720 },
];

export const arAging: StatusItem[] = [
  { key: 'b0', label: '0-30 Days', value: 42, color: '#22C55E' },
  { key: 'b1', label: '31-60 Days', value: 18, color: '#60A5FA' },
  { key: 'b2', label: '61-90 Days', value: 9, color: '#F59E0B' },
  { key: 'b3', label: '90+ Days', value: 6, color: '#EF4444' },
];

export const apAging: StatusItem[] = [
  { key: 'a0', label: '0-30 Days', value: 37, color: '#22C55E' },
  { key: 'a1', label: '31-60 Days', value: 16, color: '#60A5FA' },
  { key: 'a2', label: '61-90 Days', value: 11, color: '#F59E0B' },
  { key: 'a3', label: '90+ Days', value: 8, color: '#EF4444' },
];

export const overdueInvoices = [
  { invoiceNo: 'INV-AR-00231', party: 'PT Sinar Makmur', dueDate: '12/03/2026', amount: 'Rp 145.000.000', daysLate: '8 days late', type: 'AR' as const },
  { invoiceNo: 'INV-AP-00112', party: 'CV Prima Abadi', dueDate: '10/03/2026', amount: 'Rp 86.500.000', daysLate: '10 days late', type: 'AP' as const },
  { invoiceNo: 'INV-AR-00248', party: 'PT Berkah Jaya', dueDate: '18/03/2026', amount: 'Rp 94.000.000', daysLate: '2 days late', type: 'AR' as const },
  { invoiceNo: 'INV-AP-00118', party: 'UD Karya Teknik', dueDate: '14/03/2026', amount: 'Rp 63.200.000', daysLate: '6 days late', type: 'AP' as const },
];

export const bankReconRows = [
  { bank: 'BCA Main Account', matched: 128, unmatched: 6 },
  { bank: 'BRI Operational', matched: 94, unmatched: 11 },
  { bank: 'Mandiri Payroll', matched: 71, unmatched: 4 },
];

export const pnlKpis: KpiCard[] = [
  { title: 'Revenue', subtitle: 'March 2026', value: 'Rp 8,2 M', delta: 5, deltaLabel: 'vs last month', status: 'good' },
  { title: 'COGS', subtitle: 'March 2026', value: 'Rp 4,7 M', delta: 3, deltaLabel: 'vs last month' },
  { title: 'Gross Profit', subtitle: 'March 2026', value: 'Rp 3,5 M', delta: 7, deltaLabel: 'vs last month', status: 'good' },
  { title: 'Net Profit', subtitle: 'March 2026', value: 'Rp 1,1 M', delta: 8, deltaLabel: 'vs last month', status: 'good' },
];

export const budgetActualSeries: TimeseriesSeries[] = [
  { key: 'budget', label: 'Budget', color: '#D1D5DB' },
  { key: 'actual', label: 'Actual', color: '#2563EB' },
];

export const budgetActualData: TimeseriesDatum[] = [
  { date: 'Jan', budget: 1200, actual: 1140 },
  { date: 'Feb', budget: 1280, actual: 1220 },
  { date: 'Mar', budget: 1320, actual: 1290 },
  { date: 'Apr', budget: 1250, actual: 1180 },
  { date: 'May', budget: 1380, actual: 1310 },
  { date: 'Jun', budget: 1420, actual: 1360 },
];

export const postingStatusRows = [
  { label: 'Posted', value: 148, color: '#22C55E' },
  { label: 'Draft', value: 24, color: '#60A5FA' },
  { label: 'Pending Approval', value: 17, color: '#F59E0B' },
  { label: 'Reversed', value: 6, color: '#EF4444' },
];

export const closingChecklistRows = [
  { label: 'Bank Reconciliation', status: 'done' as const },
  { label: 'AR/AP Reconciliation', status: 'done' as const },
  { label: 'Depreciation Posting', status: 'progress' as const },
  { label: 'Tax Accrual Review', status: 'progress' as const },
  { label: 'Management Review', status: 'pending' as const },
];
