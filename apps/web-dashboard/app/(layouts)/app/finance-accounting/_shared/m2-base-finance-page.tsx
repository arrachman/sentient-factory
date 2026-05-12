'use client';

import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import {
  type FeatureCopy,
  type InsightItem,
  type InsightTermMap,
  type SummaryRow,
  FEATURE_LABELS,
  fetchRows,
  fmt,
  fmtMoneyCompact,
  oneYearAgoDateOnly,
  todayDateOnly,
  toNumber,
} from './m2-types';
import type { InsightResponse } from './m2-types';
import { M2KpiCards } from './m2-kpi-cards';
import { M2InsightPanel } from './m2-insight-panel';
import { M2TransactionTable } from './m2-transaction-table';

export type FallbackInsightsFn = (params: {
  kpiValues: { kpi1: number; kpi2: number; kpi3: number; kpi4: number };
  sourceBreakdownData: { label: string; value: number }[];
  branchChartData: { cabang: string; movement: number }[];
  trendChartData: { period: string; debit: number; kredit: number }[];
  status: Record<string, unknown>[];
}) => {
  insights: string[];
  anomalies: string[];
  recommendations: string[];
};

export type M2BaseFinancePageProps = {
  feature: string;
  copy: FeatureCopy;
  insightTermMap?: InsightTermMap;
  fallbackInsightsFn?: FallbackInsightsFn;
  /** When true, KPI4 = KPI2 - KPI3 instead of net_cashflow */
  kpi4IsDelta?: boolean;
};

export function M2BaseFinancePage({
  feature,
  copy,
  insightTermMap,
  fallbackInsightsFn,
  kpi4IsDelta = false,
}: M2BaseFinancePageProps) {
  const featureLabel = FEATURE_LABELS[feature] ?? `Finance Feature (${feature})`;

  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [cashflow, setCashflow] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState<Record<string, unknown>[]>([]);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [anomalies, setAnomalies] = useState<InsightItem[]>([]);
  const [recommendations, setRecommendations] = useState<InsightItem[]>([]);
  const [insightModel, setInsightModel] = useState<{
    provider?: string;
    version?: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate, feature });
      const [summaryRows, trendRows, breakdownRows, cashflowRows, branchRows, statusRows, detailRows] =
        await Promise.all([
          fetchRows<SummaryRow>(`/api/dashboard/m2/summary?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/trends?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown?${query}&groupBy=tsumber`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/cashflow?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/branch?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/status?${query}`),
          fetchRows<Record<string, unknown>>(
            `/api/dashboard/m2/table?${query}&page=1&pageSize=20&sortBy=ttgl&sortOrder=desc`,
          ),
        ]);

      const insightResponse = await fetch(
        `/api/dashboard/m2/insight?${new URLSearchParams({ fromDate, toDate, feature })}`,
        { cache: 'no-store' },
      );
      const insightPayload = (await insightResponse.json().catch(() => null)) as InsightResponse | null;
      if (insightResponse.ok && insightPayload?.success) {
        setInsights(insightPayload.data?.insights ?? []);
        setAnomalies(insightPayload.data?.anomalies ?? []);
        setRecommendations(insightPayload.data?.recommendations ?? []);
        setInsightModel(insightPayload.data?.model ?? null);
      } else {
        setInsights([]); setAnomalies([]); setRecommendations([]); setInsightModel(null);
      }

      setSummary(summaryRows[0] ?? null);
      setTrends(trendRows);
      setBreakdown(breakdownRows);
      setCashflow(cashflowRows);
      setBranch(branchRows);
      setStatus(statusRows);
      setTableRows(detailRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature]);

  const trendChartData = useMemo(
    () =>
      trends.map((row) => ({
        period: String(row.period_ym ?? '-'),
        debit: toNumber(row.total_debit),
        kredit: toNumber(row.total_kredit),
        budget: toNumber(row.total_debit),
        realization: toNumber(row.total_kredit),
      })),
    [trends],
  );

  const sourceBreakdownData = useMemo(
    () =>
      breakdown.slice(0, 8).map((row) => ({
        label: String(row.group_key ?? 'UNKNOWN'),
        value: toNumber(row.total_debit) + toNumber(row.total_kredit),
      })),
    [breakdown],
  );

  const cashflowChartData = useMemo(
    () =>
      cashflow.map((row) => ({
        period: String(row.period_ym ?? '-'),
        cashIn: toNumber(row.cash_in),
        cashOut: toNumber(row.cash_out),
        allocation: toNumber(row.cash_in),
        realization: toNumber(row.cash_out),
      })),
    [cashflow],
  );

  const kpiValues = useMemo(() => {
    const totalDebit = toNumber(summary?.total_debit);
    const totalKredit = toNumber(summary?.total_kredit);
    return {
      kpi1: toNumber(summary?.total_journal_rows),
      kpi2: totalDebit,
      kpi3: totalKredit,
      kpi4: kpi4IsDelta ? totalDebit - totalKredit : toNumber(summary?.net_cashflow),
    };
  }, [kpi4IsDelta, summary]);

  const branchChartData = useMemo(
    () =>
      branch.slice(0, 8).map((row) => ({
        cabang: String(row.cabang ?? 'UNKNOWN'),
        movement: toNumber(row.movement_amount),
      })),
    [branch],
  );

  const fallbackInsights = useMemo(() => {
    if (!fallbackInsightsFn) {
      return { insights: [] as string[], anomalies: [] as string[], recommendations: [] as string[] };
    }
    return fallbackInsightsFn({ kpiValues, sourceBreakdownData, branchChartData, trendChartData, status });
  }, [fallbackInsightsFn, kpiValues, sourceBreakdownData, branchChartData, trendChartData, status]);

  const kpiCards = [
    { title: copy.kpi1, value: kpiValues.kpi1, isMoney: false },
    { title: copy.kpi2, value: kpiValues.kpi2, isMoney: true },
    { title: copy.kpi3, value: kpiValues.kpi3, isMoney: true },
    { title: copy.kpi4, value: kpiValues.kpi4, isMoney: true },
    { title: copy.totalBranchTitle, value: summary?.total_cabang, isMoney: false },
    { title: copy.totalSourceTitle, value: summary?.total_sumber, isMoney: false },
  ];

  const insightGroups = [
    { label: copy.insightHighlights, items: insights, fallback: fallbackInsights.insights, empty: copy.emptyInsightText, prefix: 'ins' },
    { label: copy.insightAnomalies, items: anomalies, fallback: fallbackInsights.anomalies, empty: copy.emptyAnomalyText, prefix: 'anom' },
    { label: copy.insightRecommendations, items: recommendations, fallback: fallbackInsights.recommendations, empty: copy.emptyRecommendationText, prefix: 'rec' },
  ];

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{featureLabel}</ToolbarPageTitle>
          <ToolbarDescription>{copy.description} ({feature})</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[160px]" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[160px]" />
            <Button variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw /> Refresh
            </Button>
          </div>
        </ToolbarActions>
      </Toolbar>

      {error ? (
        <Card className="mb-4 border-destructive/30">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <M2KpiCards cards={kpiCards} loading={loading} />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{copy.trendTitle}</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Line dataKey={kpi4IsDelta ? 'budget' : 'debit'} stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line dataKey={kpi4IsDelta ? 'realization' : 'kredit'} stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{copy.flowTitle}</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey={kpi4IsDelta ? 'allocation' : 'cashIn'} fill="#16a34a" />
                <Bar dataKey={kpi4IsDelta ? 'realization' : 'cashOut'} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{copy.sourceTitle}</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{copy.branchTitle}</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cabang" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="movement" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{copy.statusTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {status.slice(0, 6).map((row, i) => (
              <div key={`${String(row.status_label)}-${i}`} className="flex items-center justify-between text-sm">
                <span>{String(row.status_label ?? 'unknown')}</span>
                <span className="font-medium">{fmt(row.total_trx)}</span>
              </div>
            ))}
            {status.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.emptyStatusText}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <M2InsightPanel
        insightTitle={copy.insightTitle}
        insightModel={insightModel}
        groups={insightGroups}
        insightTermMap={insightTermMap}
      />

      <M2TransactionTable
        tableTitle={copy.tableTitle}
        emptyTableText={copy.emptyTableText}
        tableRows={tableRows}
      />
    </div>
  );
}
