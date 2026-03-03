'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RefreshCw } from 'lucide-react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DashboardResponse<T> = {
  success?: boolean;
  data?: { rows?: T[] };
  message?: string;
};

type SummaryRow = {
  total_journal_rows?: number | string;
  total_debit?: number | string;
  total_kredit?: number | string;
  net_cashflow?: number | string;
  total_cabang?: number | string;
  total_sumber?: number | string;
};

type InsightResponse = {
  success?: boolean;
  data?: {
    insights?: InsightItem[];
    anomalies?: InsightItem[];
    recommendations?: InsightItem[];
    model?: {
      provider?: string;
      version?: string;
    };
  };
  message?: string;
};

type InsightItem =
  | string
  | {
      text?: string;
      confidence?: number;
    };

const FEATURE_LABELS: Record<string, string> = {
  m2_aj: 'Jurnal Penyesuaian (AJ)',
  m2_bd: 'Anggaran (BD)',
  m2_cb: 'Saldo Awal COA (CB)',
  m2_cr: 'Kas Masuk (CR)',
  m2_cd: 'Kas Keluar (CD)',
  m2_gj: 'Jurnal Umum (GJ)',
  m2_jm: 'Jurnal Memorial (JM)',
  m2_rg: 'Giro Masuk (RG)',
  m2_rgc: 'Giro Masuk Batal (RGC)',
  m2_rm: 'Bank Receipt (RM)',
  m2_sg: 'Giro Keluar (SG)',
  m2_sgc: 'Giro Keluar Batal (SGC)',
  m2_sm: 'Bank Payment (SM)',
  m2_template: 'Template Jurnal (TJ)',
};

const FEATURE_COPY: Record<
  string,
  {
    description: string;
    kpi1: string;
    kpi2: string;
    kpi3: string;
    kpi4: string;
    trendTitle: string;
    flowTitle: string;
    sourceTitle: string;
    branchTitle: string;
    statusTitle: string;
    tableTitle: string;
    insightTitle: string;
    insightHighlights: string;
    insightAnomalies: string;
    insightRecommendations: string;
    totalBranchTitle: string;
    totalSourceTitle: string;
    emptyStatusText: string;
    emptyInsightText: string;
    emptyAnomalyText: string;
    emptyRecommendationText: string;
    emptyTableText: string;
  }
> = {
  default: {
    description: 'Dashboard Finance & Accounting dengan KPI, chart, breakdown, dan list transaksi.',
    kpi1: 'Total Jurnal',
    kpi2: 'Total Debit',
    kpi3: 'Total Kredit',
    kpi4: 'Net Cashflow',
    trendTitle: 'Trend Debit vs Kredit',
    flowTitle: 'Cash In vs Cash Out',
    sourceTitle: 'Komposisi Sumber',
    branchTitle: 'Top Cabang',
    statusTitle: 'Ringkasan Status',
    tableTitle: 'List Transaksi (Sample)',
    insightTitle: 'AI Insight',
    insightHighlights: 'Highlights',
    insightAnomalies: 'Anomaly Alerts',
    insightRecommendations: 'Recommendations',
    totalBranchTitle: 'Total Cabang',
    totalSourceTitle: 'Total Sumber',
    emptyStatusText: 'No status data.',
    emptyInsightText: 'No insight generated.',
    emptyAnomalyText: 'No anomaly detected.',
    emptyRecommendationText: 'No recommendation.',
    emptyTableText: 'Tidak ada data tabel.',
  },
  m2_bd: {
    description: 'Dashboard Anggaran (BD) untuk memantau nilai anggaran, realisasi pergerakan, dan status dokumen.',
    kpi1: 'Total Dokumen Anggaran',
    kpi2: 'Total Nilai Anggaran',
    kpi3: 'Total Realisasi Anggaran',
    kpi4: 'Selisih Anggaran',
    trendTitle: 'Trend Nilai Anggaran vs Realisasi',
    flowTitle: 'Alokasi Anggaran vs Realisasi',
    sourceTitle: 'Komposisi Sumber Anggaran',
    branchTitle: 'Top Cabang Berdasarkan Anggaran',
    statusTitle: 'Ringkasan Status Anggaran',
    tableTitle: 'List Dokumen Anggaran (Sample)',
    insightTitle: 'AI Insight Anggaran',
    insightHighlights: 'Sorotan Anggaran',
    insightAnomalies: 'Anomali Anggaran',
    insightRecommendations: 'Rekomendasi Anggaran',
    totalBranchTitle: 'Total Cabang Anggaran',
    totalSourceTitle: 'Total Sumber Anggaran',
    emptyStatusText: 'Tidak ada data status anggaran.',
    emptyInsightText: 'Belum ada insight anggaran.',
    emptyAnomalyText: 'Belum ada anomali anggaran.',
    emptyRecommendationText: 'Belum ada rekomendasi anggaran.',
    emptyTableText: 'Tidak ada data dokumen anggaran.',
  },
};

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function fmt(value: unknown, maximumFractionDigits = 0) {
  return toNumber(value).toLocaleString('id-ID', { maximumFractionDigits });
}

function fmtCompact(value: unknown, maximumFractionDigits = 1) {
  return toNumber(value).toLocaleString('id-ID', {
    notation: 'compact',
    maximumFractionDigits,
  });
}

function fmtMoney(value: unknown, maximumFractionDigits = 2) {
  return `Rp ${fmt(value, maximumFractionDigits)}`;
}

function fmtMoneyCompact(value: unknown, maximumFractionDigits = 1) {
  return `Rp ${fmtCompact(value, maximumFractionDigits)}`;
}

function isNumericLike(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (typeof value === 'string') {
    return value.trim() !== '' && Number.isFinite(Number(value));
  }
  return false;
}

function isMonetaryColumn(column: string) {
  const lower = column.toLowerCase();
  return (
    lower.includes('debit') ||
    lower.includes('kredit') ||
    lower.includes('cash') ||
    lower.includes('amount') ||
    lower.includes('total') ||
    lower.includes('net')
  );
}

function isIntegerColumn(column: string) {
  const lower = column.toLowerCase();
  return lower.endsWith('id') || lower.includes('_id') || lower.includes('status') || lower.includes('row');
}

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

function oneYearAgoDateOnly() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

function normalizeInsightText(item: InsightItem): string {
  if (typeof item === 'string') {
    return item;
  }
  if (item && typeof item === 'object' && typeof item.text === 'string') {
    return item.text;
  }
  return '-';
}

function normalizeInsightConfidence(item: InsightItem): string | null {
  if (!item || typeof item === 'string') {
    return null;
  }
  if (typeof item.confidence !== 'number' || !Number.isFinite(item.confidence)) {
    return null;
  }
  return `${Math.round(item.confidence * 100)}%`;
}

function contextualizeInsightText(text: string, feature: string): string {
  if (feature !== 'm2_bd') {
    return text;
  }

  return text
    .replace(/total debit/gi, 'total nilai anggaran')
    .replace(/total kredit/gi, 'total realisasi anggaran')
    .replace(/net cashflow/gi, 'selisih anggaran')
    .replace(/cash in/gi, 'alokasi anggaran')
    .replace(/cash out/gi, 'realisasi anggaran')
    .replace(/arus kas agregat/gi, 'ringkasan alokasi vs realisasi')
    .replace(/outlier net cashflow/gi, 'outlier selisih anggaran');
}

async function fetchRows<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = (await response.json().catch(() => null)) as DashboardResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
  }
  return payload.data?.rows ?? [];
}

const feature: string = 'm2_sm';

export default function Page() {
  const featureLabel = FEATURE_LABELS[feature] ?? `Finance Feature (${feature})`;
  const featureCopy = FEATURE_COPY[feature] ?? FEATURE_COPY.default;
  const isBudgetFeature = feature === 'm2_bd';

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
  const [insightModel, setInsightModel] = useState<{ provider?: string; version?: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate, feature });
      const [summaryRows, trendRows, breakdownRows, cashflowRows, branchRows, statusRows, detailRows] =
        await Promise.all([
          fetchRows<SummaryRow>(`/api/dashboard/m2/summary?${query.toString()}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/trends?${query.toString()}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown?${query.toString()}&groupBy=tsumber`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/cashflow?${query.toString()}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/branch?${query.toString()}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/status?${query.toString()}`),
          fetchRows<Record<string, unknown>>(
            `/api/dashboard/m2/table?${query.toString()}&page=1&pageSize=20&sortBy=ttgl&sortOrder=desc`,
          ),
        ]);

      const insightQuery = new URLSearchParams({ fromDate, toDate, feature });
      const insightResponse = await fetch(`/api/dashboard/m2/insight?${insightQuery.toString()}`, {
        cache: 'no-store',
      });
      const insightPayload = (await insightResponse.json().catch(() => null)) as InsightResponse | null;
      if (insightResponse.ok && insightPayload?.success) {
        setInsights(insightPayload.data?.insights ?? []);
        setAnomalies(insightPayload.data?.anomalies ?? []);
        setRecommendations(insightPayload.data?.recommendations ?? []);
        setInsightModel(insightPayload.data?.model ?? null);
      } else {
        setInsights([]);
        setAnomalies([]);
        setRecommendations([]);
        setInsightModel(null);
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
        net: toNumber(row.net_cashflow),
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
    const totalRows = toNumber(summary?.total_journal_rows);
    const totalDebit = toNumber(summary?.total_debit);
    const totalKredit = toNumber(summary?.total_kredit);
    const net = toNumber(summary?.net_cashflow);

    if (!isBudgetFeature) {
      return { kpi1: totalRows, kpi2: totalDebit, kpi3: totalKredit, kpi4: net };
    }

    return {
      kpi1: totalRows,
      kpi2: totalDebit,
      kpi3: totalKredit,
      kpi4: totalDebit - totalKredit,
    };
  }, [isBudgetFeature, summary]);

  const branchChartData = useMemo(
    () =>
      branch.slice(0, 8).map((row) => ({
        cabang: String(row.cabang ?? 'UNKNOWN'),
        movement: toNumber(row.movement_amount),
      })),
    [branch],
  );

  const tableColumns = tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{featureLabel}</ToolbarPageTitle>
          <ToolbarDescription>
            {featureCopy.description} ({feature})
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="w-[160px]" />
            <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="w-[160px]" />
            <Button variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw />
              Refresh
            </Button>
          </div>
        </ToolbarActions>
      </Toolbar>

      {error ? (
        <Card className="mb-4 border-destructive/30">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Card>
          <CardHeader><CardTitle>{featureCopy.kpi1}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmt(kpiValues.kpi1)}>
                  {fmtCompact(kpiValues.kpi1)}
                </p>
                <p className="text-xs text-muted-foreground">{fmt(kpiValues.kpi1)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{featureCopy.kpi2}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmtMoney(kpiValues.kpi2, 2)}>
                  {fmtMoneyCompact(kpiValues.kpi2, 2)}
                </p>
                <p className="text-xs text-muted-foreground">{fmtMoney(kpiValues.kpi2, 2)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{featureCopy.kpi3}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmtMoney(kpiValues.kpi3, 2)}>
                  {fmtMoneyCompact(kpiValues.kpi3, 2)}
                </p>
                <p className="text-xs text-muted-foreground">{fmtMoney(kpiValues.kpi3, 2)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{featureCopy.kpi4}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmtMoney(kpiValues.kpi4, 2)}>
                  {fmtMoneyCompact(kpiValues.kpi4, 2)}
                </p>
                <p className="text-xs text-muted-foreground">{fmtMoney(kpiValues.kpi4, 2)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{featureCopy.totalBranchTitle}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmt(summary?.total_cabang)}>
                  {fmtCompact(summary?.total_cabang)}
                </p>
                <p className="text-xs text-muted-foreground">{fmt(summary?.total_cabang)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{featureCopy.totalSourceTitle}</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-xl font-semibold leading-tight" title={fmt(summary?.total_sumber)}>
                  {fmtCompact(summary?.total_sumber)}
                </p>
                <p className="text-xs text-muted-foreground">{fmt(summary?.total_sumber)}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{featureCopy.trendTitle}</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => fmtMoneyCompact(value, 1)} width={96} />
                <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
                <Line dataKey={isBudgetFeature ? 'budget' : 'debit'} stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line dataKey={isBudgetFeature ? 'realization' : 'kredit'} stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{featureCopy.flowTitle}</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => fmtMoneyCompact(value, 1)} width={96} />
                <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
                <Bar dataKey={isBudgetFeature ? 'allocation' : 'cashIn'} fill="#16a34a" />
                <Bar dataKey={isBudgetFeature ? 'realization' : 'cashOut'} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{featureCopy.sourceTitle}</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => fmtMoneyCompact(value, 1)} width={96} />
                <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{featureCopy.branchTitle}</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cabang" />
                <YAxis tickFormatter={(value) => fmtMoneyCompact(value, 1)} width={96} />
                <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
                <Bar dataKey="movement" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{featureCopy.statusTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {status.slice(0, 6).map((row, index) => (
              <div key={`${row.status_label}-${index}`} className="flex items-center justify-between text-sm">
                <span>{String(row.status_label ?? 'unknown')}</span>
                <span className="font-medium">{fmt(row.total_trx)}</span>
              </div>
            ))}
            {status.length === 0 ? <p className="text-sm text-muted-foreground">{featureCopy.emptyStatusText}</p> : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{featureCopy.insightTitle}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {insightModel ? `${insightModel.provider ?? 'n/a'} • ${insightModel.version ?? 'n/a'}` : 'No model metadata'}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-sm font-semibold">{featureCopy.insightHighlights}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {insights.length === 0 ? <li>{featureCopy.emptyInsightText}</li> : null}
              {insights.map((item, idx) => (
                <li key={`ins-${idx}`}>
                  - {contextualizeInsightText(normalizeInsightText(item), feature)}
                  {normalizeInsightConfidence(item) ? ` (${normalizeInsightConfidence(item)})` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{featureCopy.insightAnomalies}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {anomalies.length === 0 ? <li>{featureCopy.emptyAnomalyText}</li> : null}
              {anomalies.map((item, idx) => (
                <li key={`anom-${idx}`}>
                  - {contextualizeInsightText(normalizeInsightText(item), feature)}
                  {normalizeInsightConfidence(item) ? ` (${normalizeInsightConfidence(item)})` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{featureCopy.insightRecommendations}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {recommendations.length === 0 ? <li>{featureCopy.emptyRecommendationText}</li> : null}
              {recommendations.map((item, idx) => (
                <li key={`rec-${idx}`}>
                  - {contextualizeInsightText(normalizeInsightText(item), feature)}
                  {normalizeInsightConfidence(item) ? ` (${normalizeInsightConfidence(item)})` : ''}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>{featureCopy.tableTitle}</CardTitle></CardHeader>
        <CardContent>
          {tableColumns.length === 0 ? (
            <p className="text-sm text-muted-foreground">{featureCopy.emptyTableText}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.slice(0, 20).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {tableColumns.map((column) => (
                      <TableCell
                        key={`${rowIndex}-${column}`}
                        className={isNumericLike(row[column]) ? 'text-right font-medium tabular-nums' : 'max-w-[220px] truncate'}
                        title={String(row[column] ?? '-')}
                      >
                        {isNumericLike(row[column])
                          ? isMonetaryColumn(column)
                            ? fmtMoney(row[column], 2)
                            : isIntegerColumn(column)
                              ? fmt(row[column], 0)
                              : fmt(row[column], 2)
                          : String(row[column] ?? '-')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
