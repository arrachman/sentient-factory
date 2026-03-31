'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Info, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  FinanceBankReconCard,
  FinanceChecklistCard,
  FinanceOverdueInvoiceCard,
  FinancePostingStatusCard,
  FinanceTransactionTableCard,
  OrderStatusCard,
  TimeseriesCard,
  TopAmountCard,
  type KpiCard,
  type StatusItem,
  type TimeseriesDatum,
  type TimeseriesSeries,
  type TopAmountRow,
} from '@/components/dashboard';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { FinanceEditableWidgetGrid, type WidgetDefinition } from './_components/finance-editable-widget-grid';

const periodOptions = ['March 2026', 'February 2026', 'January 2026'] as const;
const dashboardTabs = ['Finance', 'Accounting'] as const;

const kpiByPeriod: Record<typeof periodOptions[number], KpiCard[]> = {
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

const cashflowSeries: TimeseriesSeries[] = [
  { key: 'inflow', label: 'Inflow', color: '#22C55E' },
  { key: 'outflow', label: 'Outflow', color: '#EF4444' },
  { key: 'net', label: 'Net', color: '#2563EB' },
];

const cashflowData: TimeseriesDatum[] = [
  { date: '01/03', inflow: 620, outflow: 430, net: 190 },
  { date: '05/03', inflow: 710, outflow: 500, net: 210 },
  { date: '10/03', inflow: 680, outflow: 440, net: 240 },
  { date: '15/03', inflow: 750, outflow: 520, net: 230 },
  { date: '20/03', inflow: 790, outflow: 540, net: 250 },
  { date: '25/03', inflow: 730, outflow: 510, net: 220 },
  { date: '30/03', inflow: 810, outflow: 560, net: 250 },
];

const paymentStatus: StatusItem[] = [
  { key: 'paid', label: 'Paid', value: 48, color: '#22C55E' },
  { key: 'pending', label: 'Pending', value: 22, color: '#F59E0B' },
  { key: 'overdue', label: 'Overdue', value: 10, color: '#EF4444' },
  { key: 'draft', label: 'Draft', value: 12, color: '#60A5FA' },
];

const topAccounts: TopAmountRow[] = [
  { initials: 'CS', name: 'Cash & Bank', code: '1101', amount: 'Rp 2,1 M' },
  { initials: 'AR', name: 'Account Receivable', code: '1201', amount: 'Rp 1,8 M' },
  { initials: 'AP', name: 'Account Payable', code: '2101', amount: 'Rp 845 Jt' },
  { initials: 'OP', name: 'Operational Expense', code: '5101', amount: 'Rp 632 Jt' },
  { initials: 'TX', name: 'Tax Payable', code: '2201', amount: 'Rp 421 Jt' },
  { initials: 'PR', name: 'Payroll Expense', code: '5201', amount: 'Rp 398 Jt' },
];

const topBranches: TopAmountRow[] = [
  { initials: 'JK', name: 'Jakarta', code: 'BR-01', amount: 'Rp 1,9 M' },
  { initials: 'SB', name: 'Surabaya', code: 'BR-02', amount: 'Rp 1,3 M' },
  { initials: 'BD', name: 'Bandung', code: 'BR-03', amount: 'Rp 940 Jt' },
  { initials: 'SM', name: 'Semarang', code: 'BR-04', amount: 'Rp 775 Jt' },
  { initials: 'MD', name: 'Medan', code: 'BR-05', amount: 'Rp 650 Jt' },
];

const transactionRows = [
  { voucherNo: 'BM-240301', date: '01/03/2026', account: 'Cash & Bank', branch: 'Jakarta', amount: 'Rp 215.000.000', status: 'Paid' as const },
  { voucherNo: 'BK-240305', date: '05/03/2026', account: 'Operational Expense', branch: 'Surabaya', amount: 'Rp 86.500.000', status: 'Pending' as const },
  { voucherNo: 'JV-240310', date: '10/03/2026', account: 'Payroll Expense', branch: 'Bandung', amount: 'Rp 124.000.000', status: 'Paid' as const },
  { voucherNo: 'BK-240315', date: '15/03/2026', account: 'Tax Payable', branch: 'Jakarta', amount: 'Rp 66.250.000', status: 'Overdue' as const },
  { voucherNo: 'JV-240320', date: '20/03/2026', account: 'Account Payable', branch: 'Semarang', amount: 'Rp 142.000.000', status: 'Pending' as const },
  { voucherNo: 'BK-240328', date: '28/03/2026', account: 'Cash & Bank', branch: 'Medan', amount: 'Rp 94.500.000', status: 'Paid' as const },
];

const cashPositionRows: TopAmountRow[] = [
  { initials: 'BM', name: 'BCA Main Account', code: '1101-01', amount: 'Rp 1,15 M' },
  { initials: 'BR', name: 'BRI Operational', code: '1101-02', amount: 'Rp 725 Jt' },
  { initials: 'MN', name: 'Mandiri Payroll', code: '1101-03', amount: 'Rp 484 Jt' },
  { initials: 'CT', name: 'Cash on Hand', code: '1101-04', amount: 'Rp 42 Jt' },
];

const forecastSeries: TimeseriesSeries[] = [
  { key: 'incoming', label: 'Incoming', color: '#22C55E' },
  { key: 'outgoing', label: 'Outgoing', color: '#EF4444' },
];

const forecastData: TimeseriesDatum[] = [
  { date: 'W1', incoming: 920, outgoing: 680 },
  { date: 'W2', incoming: 840, outgoing: 710 },
  { date: 'W3', incoming: 980, outgoing: 760 },
  { date: 'W4', incoming: 890, outgoing: 720 },
];

const arAging: StatusItem[] = [
  { key: 'b0', label: '0-30 Days', value: 42, color: '#22C55E' },
  { key: 'b1', label: '31-60 Days', value: 18, color: '#60A5FA' },
  { key: 'b2', label: '61-90 Days', value: 9, color: '#F59E0B' },
  { key: 'b3', label: '90+ Days', value: 6, color: '#EF4444' },
];

const apAging: StatusItem[] = [
  { key: 'a0', label: '0-30 Days', value: 37, color: '#22C55E' },
  { key: 'a1', label: '31-60 Days', value: 16, color: '#60A5FA' },
  { key: 'a2', label: '61-90 Days', value: 11, color: '#F59E0B' },
  { key: 'a3', label: '90+ Days', value: 8, color: '#EF4444' },
];

const overdueInvoices = [
  { invoiceNo: 'INV-AR-00231', party: 'PT Sinar Makmur', dueDate: '12/03/2026', amount: 'Rp 145.000.000', daysLate: '8 days late', type: 'AR' as const },
  { invoiceNo: 'INV-AP-00112', party: 'CV Prima Abadi', dueDate: '10/03/2026', amount: 'Rp 86.500.000', daysLate: '10 days late', type: 'AP' as const },
  { invoiceNo: 'INV-AR-00248', party: 'PT Berkah Jaya', dueDate: '18/03/2026', amount: 'Rp 94.000.000', daysLate: '2 days late', type: 'AR' as const },
  { invoiceNo: 'INV-AP-00118', party: 'UD Karya Teknik', dueDate: '14/03/2026', amount: 'Rp 63.200.000', daysLate: '6 days late', type: 'AP' as const },
];

const bankReconRows = [
  { bank: 'BCA Main Account', matched: 128, unmatched: 6 },
  { bank: 'BRI Operational', matched: 94, unmatched: 11 },
  { bank: 'Mandiri Payroll', matched: 71, unmatched: 4 },
];

const pnlKpis: KpiCard[] = [
  { title: 'Revenue', subtitle: 'March 2026', value: 'Rp 8,2 M', delta: 5, deltaLabel: 'vs last month', status: 'good' },
  { title: 'COGS', subtitle: 'March 2026', value: 'Rp 4,7 M', delta: 3, deltaLabel: 'vs last month' },
  { title: 'Gross Profit', subtitle: 'March 2026', value: 'Rp 3,5 M', delta: 7, deltaLabel: 'vs last month', status: 'good' },
  { title: 'Net Profit', subtitle: 'March 2026', value: 'Rp 1,1 M', delta: 8, deltaLabel: 'vs last month', status: 'good' },
];

const budgetActualSeries: TimeseriesSeries[] = [
  { key: 'budget', label: 'Budget', color: '#D1D5DB' },
  { key: 'actual', label: 'Actual', color: '#2563EB' },
];

const budgetActualData: TimeseriesDatum[] = [
  { date: 'Jan', budget: 1200, actual: 1140 },
  { date: 'Feb', budget: 1280, actual: 1220 },
  { date: 'Mar', budget: 1320, actual: 1290 },
  { date: 'Apr', budget: 1250, actual: 1180 },
  { date: 'May', budget: 1380, actual: 1310 },
  { date: 'Jun', budget: 1420, actual: 1360 },
];

const postingStatusRows = [
  { label: 'Posted', value: 148, color: '#22C55E' },
  { label: 'Draft', value: 24, color: '#60A5FA' },
  { label: 'Pending Approval', value: 17, color: '#F59E0B' },
  { label: 'Reversed', value: 6, color: '#EF4444' },
];

const closingChecklistRows = [
  { label: 'Bank Reconciliation', status: 'done' as const },
  { label: 'AR/AP Reconciliation', status: 'done' as const },
  { label: 'Depreciation Posting', status: 'progress' as const },
  { label: 'Tax Accrual Review', status: 'progress' as const },
  { label: 'Management Review', status: 'pending' as const },
];

function KpiWidgetCard({ card, compact = false }: { card: KpiCard; compact?: boolean }) {
  const isUp = card.delta > 0;

  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs transition-shadow hover:shadow-sm">
      <CardHeader className={cn('px-6', compact ? 'py-4' : 'py-5')}>
        <div className="flex items-center gap-2">
          <CardTitle
            className={cn('font-medium tracking-[0%]', compact ? 'text-[13px] leading-6' : 'text-[14px] leading-[26px]')}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {card.title}
          </CardTitle>
          {card.status ? (
            <Badge
              variant={card.status === 'good' ? 'success' : card.status === 'warn' ? 'warning' : 'destructive'}
              appearance="light"
              size="xs"
            >
              {card.status === 'good' ? 'Baik' : card.status === 'warn' ? 'Waspada' : 'Kritis'}
            </Badge>
          ) : null}
          {card.info ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground"
                  aria-label="Info KPI"
                >
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px]">
                {card.info}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{card.subtitle}</p>
      </CardHeader>
      <CardContent className={cn('flex h-full flex-col gap-3 px-6', compact ? 'pb-4 pt-1' : 'pb-5 pt-2')}>
        <div className="mt-auto flex flex-wrap items-end gap-3">
          <p className={cn('font-bold leading-none tracking-tight', compact ? 'text-lg' : 'text-xl')}>{card.value}</p>
          <Badge
            variant={isUp ? 'success' : 'destructive'}
            appearance="light"
            size="sm"
            className="rounded-full px-2.5 text-xs font-semibold"
          >
            {isUp ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
            {Math.abs(card.delta)} ({card.deltaLabel})
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

type LayoutSuggestionItem = {
  id: string;
  w: number;
  h: number;
};

export default function FinanceDashboardPage() {
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>('March 2026');
  const [activeTab, setActiveTab] = useState<(typeof dashboardTabs)[number]>('Finance');
  const [financeResetVersion, setFinanceResetVersion] = useState(0);
  const [accountingResetVersion, setAccountingResetVersion] = useState(0);
  const [financeSuggestedLayout, setFinanceSuggestedLayout] = useState<LayoutSuggestionItem[] | null>(null);
  const [accountingSuggestedLayout, setAccountingSuggestedLayout] = useState<LayoutSuggestionItem[] | null>(null);
  const [financeSuggestionVersion, setFinanceSuggestionVersion] = useState(0);
  const [accountingSuggestionVersion, setAccountingSuggestionVersion] = useState(0);
  const [suggestingLayout, setSuggestingLayout] = useState(false);
  const kpis = useMemo(() => kpiByPeriod[period], [period]);
  const financeWidgets = useMemo<WidgetDefinition[]>(
    () => [
      ...kpis.map((card) => ({
        id: `kpi-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        minW: 1,
        maxW: 6,
        minH: 2,
        defaultSize: {
          mobile: { w: 1, h: 2 },
          tablet: { w: 3, h: 2 },
          desktop: { w: 3, h: 2 },
        },
        render: ({ height, width, columns }: { heightClass: string; width: number; height: number; columns: number }) => (
          <KpiWidgetCard card={card} compact={height <= 2 && (columns === 1 || width <= 3)} />
        ),
      })),
      {
        id: 'cash-position',
        minW: 1,
        maxW: 8,
        minH: 3,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 4, h: 4 },
        },
        render: () => <TopAmountCard title="Cash Position" subtitle={period} rows={cashPositionRows} />,
      },
      {
        id: 'cashflow-forecast',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 6, h: 5 },
          desktop: { w: 8, h: 4 },
        },
        render: ({ heightClass }) => (
          <TimeseriesCard
            title="Cashflow Forecast"
            subtitle="Next 4 Weeks"
            data={forecastData}
            series={forecastSeries}
            chartHeightClass={heightClass}
            yAxisDomain={[0, 1200]}
            legendAlign="start"
          />
        ),
      },
      {
        id: 'ar-aging',
        minW: 1,
        maxW: 8,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <OrderStatusCard title="AR Aging" subtitle={period} items={arAging} />,
      },
      {
        id: 'ap-aging',
        minW: 1,
        maxW: 8,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <OrderStatusCard title="AP Aging" subtitle={period} items={apAging} />,
      },
      {
        id: 'overdue-invoices',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <FinanceOverdueInvoiceCard title="Overdue Invoices" subtitle={period} rows={overdueInvoices} />,
      },
      {
        id: 'bank-reconciliation',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <FinanceBankReconCard title="Bank Reconciliation Status" subtitle={period} rows={bankReconRows} />,
      },
      {
        id: 'cashflow-trend',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 6, h: 5 },
          desktop: { w: 8, h: 5 },
        },
        render: ({ heightClass }) => (
          <TimeseriesCard
            title="Cashflow Trend"
            subtitle={period}
            data={cashflowData}
            series={cashflowSeries}
            chartHeightClass={heightClass}
            yAxisDomain={[0, 1000]}
            legendAlign="start"
          />
        ),
      },
      {
        id: 'payment-status',
        minW: 1,
        maxW: 8,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 3, h: 5 },
          desktop: { w: 4, h: 5 },
        },
        render: () => <OrderStatusCard title="Payment Status" subtitle={period} items={paymentStatus} />,
      },
      {
        id: 'top-accounts',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <TopAmountCard title="Top Accounts" subtitle={period} rows={topAccounts} />,
      },
      {
        id: 'top-branches',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 3, h: 4 },
          desktop: { w: 6, h: 4 },
        },
        render: () => <TopAmountCard title="Top Branch Cashflow" subtitle={period} rows={topBranches} />,
      },
      {
        id: 'recent-transactions',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 6, h: 5 },
          desktop: { w: 12, h: 5 },
        },
        render: () => <FinanceTransactionTableCard title="Recent Finance Transactions" subtitle={period} rows={transactionRows} />,
      },
    ],
    [kpis, period],
  );
  const accountingWidgets = useMemo<WidgetDefinition[]>(
    () => [
      ...pnlKpis.map((card) => ({
        id: `accounting-kpi-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        minW: 1,
        maxW: 6,
        minH: 2,
        defaultSize: {
          mobile: { w: 1, h: 2 },
          tablet: { w: 3, h: 2 },
          desktop: { w: 3, h: 2 },
        },
        render: ({ height, width, columns }: { heightClass: string; width: number; height: number; columns: number }) => (
          <KpiWidgetCard card={card} compact={height <= 2 && (columns === 1 || width <= 3)} />
        ),
      })),
      {
        id: 'budget-vs-actual',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 6, h: 5 },
          desktop: { w: 8, h: 5 },
        },
        render: ({ heightClass }) => (
          <TimeseriesCard
            title="Budget vs Actual"
            subtitle={period}
            data={budgetActualData}
            series={budgetActualSeries}
            chartHeightClass={heightClass}
            yAxisDomain={[0, 1600]}
            legendAlign="start"
          />
        ),
      },
      {
        id: 'journal-posting-status',
        minW: 1,
        maxW: 8,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 3, h: 5 },
          desktop: { w: 4, h: 5 },
        },
        render: () => <FinancePostingStatusCard title="Journal Posting Status" subtitle={period} rows={postingStatusRows} />,
      },
      {
        id: 'closing-checklist',
        minW: 1,
        maxW: 8,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 4 },
          tablet: { w: 2, h: 4 },
          desktop: { w: 4, h: 4 },
        },
        render: () => <FinanceChecklistCard title="Closing Checklist" subtitle="Month End" rows={closingChecklistRows} />,
      },
      {
        id: 'accounting-transactions',
        minW: 1,
        maxW: 12,
        minH: 4,
        defaultSize: {
          mobile: { w: 1, h: 5 },
          tablet: { w: 4, h: 5 },
          desktop: { w: 8, h: 4 },
        },
        render: () => <FinanceTransactionTableCard title="Recent Finance Transactions" subtitle={period} rows={transactionRows} />,
      },
    ],
    [period],
  );
  const activeWidgets = activeTab === 'Finance' ? financeWidgets : accountingWidgets;

  const handleSuggestLayout = async () => {
    setSuggestingLayout(true);

    try {
      const response = await fetch('/api/dashboard/finance/layout-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tab: activeTab,
          columns: typeof window === 'undefined' ? 12 : window.innerWidth < 768 ? 1 : window.innerWidth < 1280 ? 6 : 12,
          widgets: activeWidgets.map((widget) => ({
            id: widget.id,
            title: widget.id.replace(/[-_]/g, ' '),
            kind: widget.id.includes('kpi')
              ? 'kpi'
              : widget.id.includes('transaction')
                ? 'table'
                : widget.id.includes('top-') || widget.id.includes('checklist')
                  ? 'list'
                  : 'chart',
            minW: widget.minW,
            maxW: widget.maxW,
            minH: widget.minH,
            maxH: widget.maxH,
            defaultW: widget.defaultSize.desktop.w,
            defaultH: widget.defaultSize.desktop.h,
          })),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            source?: string;
            model?: string | null;
            provider?: string | null;
            layout?: LayoutSuggestionItem[];
            message?: string;
          }
        | null;

      if (!response.ok || !payload?.success || !Array.isArray(payload.layout) || !payload.layout.length) {
        throw new Error(payload?.message || 'AI layout suggestion gagal.');
      }

      if (activeTab === 'Finance') {
        setFinanceSuggestedLayout(payload.layout);
        setFinanceSuggestionVersion((value) => value + 1);
      } else {
        setAccountingSuggestedLayout(payload.layout);
        setAccountingSuggestionVersion((value) => value + 1);
      }

      toast.success(
        payload.source === 'ai'
          ? `AI suggestion applied${payload.provider || payload.model ? ` (${payload.provider ?? 'AI'}${payload.model ? ` • ${payload.model}` : ''})` : ''}.`
          : 'Fallback suggestion applied.',
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal meminta suggestion layout.');
    } finally {
      setSuggestingLayout(false);
    }
  };

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <ToolbarHeading>
          <div className="flex items-center gap-5">
            {dashboardTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer border-b-2 pb-2 text-sm font-medium ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="sr-only">
            <ToolbarPageTitle>Dashboard Finance</ToolbarPageTitle>
          </div>
          <ToolbarDescription>
            {activeTab === 'Finance'
              ? 'Ringkasan cashflow, likuiditas, aging, bank reconciliation, dan transaksi keuangan.'
              : 'Ringkasan laba rugi, budget vs actual, journal posting, dan closing checklist.'}
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button type="button" variant="outline" onClick={() => void handleSuggestLayout()} disabled={suggestingLayout}>
            {suggestingLayout ? <RefreshCw className="animate-spin" /> : <Sparkles />}
            {suggestingLayout ? 'Suggesting...' : 'AI Suggest'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (activeTab === 'Finance') {
                setFinanceResetVersion((value) => value + 1);
                return;
              }

              setAccountingResetVersion((value) => value + 1);
            }}
          >
            Reset Layout
          </Button>
          <Select value={period} onValueChange={(value) => setPeriod(value as (typeof periodOptions)[number])}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {periodOptions.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ToolbarActions>
      </Toolbar>

      {activeTab === 'Finance' ? (
        <FinanceEditableWidgetGrid
          storageKey="finance-dashboard-layout-finance"
          widgets={financeWidgets}
          resetVersion={financeResetVersion}
          suggestedLayout={financeSuggestedLayout}
          suggestedLayoutVersion={financeSuggestionVersion}
        />
      ) : (
        <FinanceEditableWidgetGrid
          storageKey="finance-dashboard-layout-accounting"
          widgets={accountingWidgets}
          resetVersion={accountingResetVersion}
          suggestedLayout={accountingSuggestedLayout}
          suggestedLayoutVersion={accountingSuggestionVersion}
        />
      )}

    </div>
  );
}
