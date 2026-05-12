'use client';

/**
 * Builders untuk widget definitions Finance & Accounting tabs.
 * Dipisah dari `page.tsx` agar halaman tetap fokus pada orchestration
 * (state, toolbar, suggestion handler).
 */
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
} from '@/components/dashboard';
import {
  apAging,
  arAging,
  bankReconRows,
  budgetActualData,
  budgetActualSeries,
  cashPositionRows,
  cashflowData,
  cashflowSeries,
  closingChecklistRows,
  forecastData,
  forecastSeries,
  overdueInvoices,
  paymentStatus,
  pnlKpis,
  postingStatusRows,
  topAccounts,
  topBranches,
  transactionRows,
} from '../_data';
import type { WidgetDefinition } from './finance-editable-widget-grid';
import { KpiWidgetCard } from './kpi-widget-card';

type RenderArgs = {
  heightClass: string;
  width: number;
  height: number;
  columns: number;
};

function buildKpiWidget(card: KpiCard, prefix = 'kpi'): WidgetDefinition {
  return {
    id: `${prefix}-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    minW: 1,
    maxW: 6,
    minH: 2,
    defaultSize: {
      mobile: { w: 1, h: 2 },
      tablet: { w: 3, h: 2 },
      desktop: { w: 3, h: 2 },
    },
    render: ({ height, width, columns }: RenderArgs) => (
      <KpiWidgetCard
        card={card}
        compact={height <= 2 && (columns === 1 || width <= 3)}
      />
    ),
  };
}

export function buildFinanceWidgets(
  kpis: KpiCard[],
  period: string,
): WidgetDefinition[] {
  return [
    ...kpis.map((card) => buildKpiWidget(card)),
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
      render: () => (
        <TopAmountCard
          title="Cash Position"
          subtitle={period}
          rows={cashPositionRows}
        />
      ),
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
      render: () => (
        <OrderStatusCard title="AR Aging" subtitle={period} items={arAging} />
      ),
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
      render: () => (
        <OrderStatusCard title="AP Aging" subtitle={period} items={apAging} />
      ),
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
      render: () => (
        <FinanceOverdueInvoiceCard
          title="Overdue Invoices"
          subtitle={period}
          rows={overdueInvoices}
        />
      ),
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
      render: () => (
        <FinanceBankReconCard
          title="Bank Reconciliation Status"
          subtitle={period}
          rows={bankReconRows}
        />
      ),
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
      render: () => (
        <OrderStatusCard
          title="Payment Status"
          subtitle={period}
          items={paymentStatus}
        />
      ),
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
      render: () => (
        <TopAmountCard
          title="Top Accounts"
          subtitle={period}
          rows={topAccounts}
        />
      ),
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
      render: () => (
        <TopAmountCard
          title="Top Branch Cashflow"
          subtitle={period}
          rows={topBranches}
        />
      ),
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
      render: () => (
        <FinanceTransactionTableCard
          title="Recent Finance Transactions"
          subtitle={period}
          rows={transactionRows}
        />
      ),
    },
  ];
}

export function buildAccountingWidgets(period: string): WidgetDefinition[] {
  return [
    ...pnlKpis.map((card) => buildKpiWidget(card, 'accounting-kpi')),
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
      render: () => (
        <FinancePostingStatusCard
          title="Journal Posting Status"
          subtitle={period}
          rows={postingStatusRows}
        />
      ),
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
      render: () => (
        <FinanceChecklistCard
          title="Closing Checklist"
          subtitle="Month End"
          rows={closingChecklistRows}
        />
      ),
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
      render: () => (
        <FinanceTransactionTableCard
          title="Recent Finance Transactions"
          subtitle={period}
          rows={transactionRows}
        />
      ),
    },
  ];
}
