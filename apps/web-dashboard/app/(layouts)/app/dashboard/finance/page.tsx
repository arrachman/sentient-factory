'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
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
} from '@/components/dashboard';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinanceEditableWidgetGrid, type WidgetDefinition } from './_components/finance-editable-widget-grid';
import { KpiWidgetCard } from './_components/kpi-widget-card';
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
  dashboardTabs,
  forecastData,
  forecastSeries,
  kpiByPeriod,
  overdueInvoices,
  paymentStatus,
  periodOptions,
  pnlKpis,
  postingStatusRows,
  topAccounts,
  topBranches,
  transactionRows,
} from './_data';

type LayoutSuggestionItem = { id: string; w: number; h: number };

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
        minW: 1, maxW: 6, minH: 2,
        defaultSize: { mobile: { w: 1, h: 2 }, tablet: { w: 3, h: 2 }, desktop: { w: 3, h: 2 } },
        render: ({ height, width, columns }: { heightClass: string; width: number; height: number; columns: number }) => (
          <KpiWidgetCard card={card} compact={height <= 2 && (columns === 1 || width <= 3)} />
        ),
      })),
      {
        id: 'cash-position', minW: 1, maxW: 8, minH: 3,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 4, h: 4 } },
        render: () => <TopAmountCard title="Cash Position" subtitle={period} rows={cashPositionRows} />,
      },
      {
        id: 'cashflow-forecast', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 6, h: 5 }, desktop: { w: 8, h: 4 } },
        render: ({ heightClass }) => (
          <TimeseriesCard title="Cashflow Forecast" subtitle="Next 4 Weeks" data={forecastData} series={forecastSeries} chartHeightClass={heightClass} yAxisDomain={[0, 1200]} legendAlign="start" />
        ),
      },
      {
        id: 'ar-aging', minW: 1, maxW: 8, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <OrderStatusCard title="AR Aging" subtitle={period} items={arAging} />,
      },
      {
        id: 'ap-aging', minW: 1, maxW: 8, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <OrderStatusCard title="AP Aging" subtitle={period} items={apAging} />,
      },
      {
        id: 'overdue-invoices', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <FinanceOverdueInvoiceCard title="Overdue Invoices" subtitle={period} rows={overdueInvoices} />,
      },
      {
        id: 'bank-reconciliation', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <FinanceBankReconCard title="Bank Reconciliation Status" subtitle={period} rows={bankReconRows} />,
      },
      {
        id: 'cashflow-trend', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 6, h: 5 }, desktop: { w: 8, h: 5 } },
        render: ({ heightClass }) => (
          <TimeseriesCard title="Cashflow Trend" subtitle={period} data={cashflowData} series={cashflowSeries} chartHeightClass={heightClass} yAxisDomain={[0, 1000]} legendAlign="start" />
        ),
      },
      {
        id: 'payment-status', minW: 1, maxW: 8, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 3, h: 5 }, desktop: { w: 4, h: 5 } },
        render: () => <OrderStatusCard title="Payment Status" subtitle={period} items={paymentStatus} />,
      },
      {
        id: 'top-accounts', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <TopAmountCard title="Top Accounts" subtitle={period} rows={topAccounts} />,
      },
      {
        id: 'top-branches', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 3, h: 4 }, desktop: { w: 6, h: 4 } },
        render: () => <TopAmountCard title="Top Branch Cashflow" subtitle={period} rows={topBranches} />,
      },
      {
        id: 'recent-transactions', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 6, h: 5 }, desktop: { w: 12, h: 5 } },
        render: () => <FinanceTransactionTableCard title="Recent Finance Transactions" subtitle={period} rows={transactionRows} />,
      },
    ],
    [kpis, period],
  );

  const accountingWidgets = useMemo<WidgetDefinition[]>(
    () => [
      ...pnlKpis.map((card) => ({
        id: `accounting-kpi-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        minW: 1, maxW: 6, minH: 2,
        defaultSize: { mobile: { w: 1, h: 2 }, tablet: { w: 3, h: 2 }, desktop: { w: 3, h: 2 } },
        render: ({ height, width, columns }: { heightClass: string; width: number; height: number; columns: number }) => (
          <KpiWidgetCard card={card} compact={height <= 2 && (columns === 1 || width <= 3)} />
        ),
      })),
      {
        id: 'budget-vs-actual', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 6, h: 5 }, desktop: { w: 8, h: 5 } },
        render: ({ heightClass }) => (
          <TimeseriesCard title="Budget vs Actual" subtitle={period} data={budgetActualData} series={budgetActualSeries} chartHeightClass={heightClass} yAxisDomain={[0, 1600]} legendAlign="start" />
        ),
      },
      {
        id: 'journal-posting-status', minW: 1, maxW: 8, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 3, h: 5 }, desktop: { w: 4, h: 5 } },
        render: () => <FinancePostingStatusCard title="Journal Posting Status" subtitle={period} rows={postingStatusRows} />,
      },
      {
        id: 'closing-checklist', minW: 1, maxW: 8, minH: 4,
        defaultSize: { mobile: { w: 1, h: 4 }, tablet: { w: 2, h: 4 }, desktop: { w: 4, h: 4 } },
        render: () => <FinanceChecklistCard title="Closing Checklist" subtitle="Month End" rows={closingChecklistRows} />,
      },
      {
        id: 'accounting-transactions', minW: 1, maxW: 12, minH: 4,
        defaultSize: { mobile: { w: 1, h: 5 }, tablet: { w: 4, h: 5 }, desktop: { w: 8, h: 4 } },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab: activeTab,
          columns: typeof window === 'undefined' ? 12 : window.innerWidth < 768 ? 1 : window.innerWidth < 1280 ? 6 : 12,
          widgets: activeWidgets.map((widget) => ({
            id: widget.id,
            title: widget.id.replace(/[-_]/g, ' '),
            kind: widget.id.includes('kpi') ? 'kpi' : widget.id.includes('transaction') ? 'table' : widget.id.includes('top-') || widget.id.includes('checklist') ? 'list' : 'chart',
            minW: widget.minW, maxW: widget.maxW, minH: widget.minH, maxH: widget.maxH,
            defaultW: widget.defaultSize.desktop.w, defaultH: widget.defaultSize.desktop.h,
          })),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean; source?: string; model?: string | null; provider?: string | null;
        layout?: LayoutSuggestionItem[]; message?: string;
      } | null;
      if (!response.ok || !payload?.success || !Array.isArray(payload.layout) || !payload.layout.length) {
        throw new Error(payload?.message || 'AI layout suggestion gagal.');
      }
      if (activeTab === 'Finance') {
        setFinanceSuggestedLayout(payload.layout);
        setFinanceSuggestionVersion((v) => v + 1);
      } else {
        setAccountingSuggestedLayout(payload.layout);
        setAccountingSuggestionVersion((v) => v + 1);
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
              if (activeTab === 'Finance') { setFinanceResetVersion((v) => v + 1); return; }
              setAccountingResetVersion((v) => v + 1);
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
