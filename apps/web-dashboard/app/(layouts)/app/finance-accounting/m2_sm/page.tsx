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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import {
  FEATURE_LABELS,
  fetchRows,
  fmt,
  fmtMoney,
  fmtMoneyCompact,
  isIntegerColumn,
  isMonetaryColumn,
  isNumericLike,
  oneYearAgoDateOnly,
  todayDateOnly,
  toNumber,
} from '../_shared/m2-types';
import type { InsightItem, InsightResponse, SummaryRow } from '../_shared/m2-types';
import { M2KpiCards } from '../_shared/m2-kpi-cards';
import { M2InsightPanel } from '../_shared/m2-insight-panel';

const FEATURE = 'm2_sm';
const INSIGHT_TERM_MAP = {
  totalDebit: 'total bank payment',
  totalKredit: 'total terealisasi',
  netCashflow: 'outstanding payment',
  cashIn: 'nilai payment',
  cashOut: 'nilai realisasi payment',
  arusKasAgregat: 'ringkasan payment bank',
  outlierNetCashflow: 'outlier bank payment',
};

export default function Page() {
  const featureLabel = FEATURE_LABELS[FEATURE] ?? `Finance Feature (${FEATURE})`;
  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [cashflow, setCashflow] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [topContacts, setTopContacts] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState<Record<string, unknown>[]>([]);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [contactDrilldown, setContactDrilldown] = useState<Record<string, unknown>[]>([]);
  const [activeKontakId, setActiveKontakId] = useState('');
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [loadingKontak, setLoadingKontak] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [anomalies, setAnomalies] = useState<InsightItem[]>([]);
  const [recommendations, setRecommendations] = useState<InsightItem[]>([]);
  const [insightModel, setInsightModel] = useState<{ provider?: string; version?: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate, feature: FEATURE });
      const [summaryRows, trendRows, breakdownRows, cashflowRows, branchRows, topContactRows, statusRows, detailRows] =
        await Promise.all([
          fetchRows<SummaryRow>(`/api/dashboard/m2/summary?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/trends?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown?${query}&groupBy=tsumber`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/cashflow?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/branch?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/sm/top-contacts?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/breakdown/status?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/table?${query}&page=1&pageSize=20&sortBy=tkredit&sortOrder=desc`),
        ]);
      const insightResponse = await fetch(`/api/dashboard/m2/insight?${new URLSearchParams({ fromDate, toDate, feature: FEATURE })}`, { cache: 'no-store' });
      const ip = (await insightResponse.json().catch(() => null)) as InsightResponse | null;
      if (insightResponse.ok && ip?.success) {
        setInsights(ip.data?.insights ?? []); setAnomalies(ip.data?.anomalies ?? []);
        setRecommendations(ip.data?.recommendations ?? []); setInsightModel(ip.data?.model ?? null);
      } else { setInsights([]); setAnomalies([]); setRecommendations([]); setInsightModel(null); }
      setSummary(summaryRows[0] ?? null); setTrends(trendRows); setBreakdown(breakdownRows);
      setCashflow(cashflowRows); setBranch(branchRows); setTopContacts(topContactRows);
      setStatus(statusRows); setTableRows(detailRows);
      setContactDrilldown([]); setActiveKontakId(''); setDrilldownOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trendChartData = useMemo(() =>
    trends.map((row) => ({ period: String(row.period_ym ?? '-'), debit: toNumber(row.total_debit), kredit: toNumber(row.total_kredit) })),
    [trends]);
  const sourceBreakdownData = useMemo(() =>
    breakdown.slice(0, 8).map((row) => ({ label: String(row.group_key ?? 'UNKNOWN'), value: toNumber(row.total_debit) + toNumber(row.total_kredit) })),
    [breakdown]);
  const cashflowChartData = useMemo(() =>
    cashflow.map((row) => ({ period: String(row.period_ym ?? '-'), cashIn: toNumber(row.cash_in), cashOut: toNumber(row.cash_out) })),
    [cashflow]);
  const kpiValues = useMemo(() => ({
    kpi1: toNumber(summary?.total_journal_rows), kpi2: toNumber(summary?.total_debit),
    kpi3: toNumber(summary?.total_kredit), kpi4: toNumber(summary?.net_cashflow),
  }), [summary]);
  const branchChartData = useMemo(() =>
    branch.slice(0, 8).map((row) => ({ cabang: String(row.cabang ?? 'UNKNOWN'), movement: toNumber(row.movement_amount) })),
    [branch]);

  const fallbackInsights = useMemo(() => {
    const total = toNumber(kpiValues.kpi2);
    const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
    const pct = total > 0 ? (outstanding / total) * 100 : 0;
    const src = sourceBreakdownData[0]; const brnch = branchChartData[0]; const stTop = status[0];
    const outlier = trendChartData.find((item) => toNumber(item.debit) > (total / Math.max(trendChartData.length, 1)) * 2.5);
    return {
      insights: [
        `Periode analisis mencatat ${fmt(kpiValues.kpi1)} transaksi bank payment dengan total ${fmtMoney(total, 2)}.`,
        `Total realisasi ${fmtMoney(kpiValues.kpi3, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(pct, 2)}%).`,
        src ? `Sumber payment terbesar: ${src.label} (${fmtMoney(src.value, 2)}).` : 'Belum ada sumber payment dominan.',
        brnch ? `Cabang tertinggi: ${brnch.cabang} (${fmtMoney(brnch.movement, 2)}).` : 'Belum ada cabang dengan payment dominan.',
      ],
      anomalies: [
        ...(pct > 30 ? [`Outstanding payment melebihi 30% dari total nilai payment (${fmt(pct, 2)}%).`] : []),
        ...(outlier ? [`Lonjakan bank payment terdeteksi pada periode ${outlier.period}.`] : []),
        ...(stTop && String(stTop.status_label ?? '').startsWith('unknown_') ? ['Terdapat status transaksi bank payment yang belum terpetakan (unknown_*).'] : []),
      ],
      recommendations: [
        'Prioritaskan review transaksi payment outstanding terbesar berdasarkan sumber dan cabang.',
        'Validasi transaksi outlier untuk memastikan akurasi nominal bank payment.',
        'Pantau rasio outstanding payment secara periodik untuk menjaga kesehatan cash outflow.',
      ],
    };
  }, [branchChartData, kpiValues, sourceBreakdownData, status, trendChartData]);

  const tableColumns = tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];

  const openContactDrilldown = async (kontakIdRaw: unknown) => {
    const kontakId = String(kontakIdRaw ?? '').trim();
    if (!kontakId) return;
    setActiveKontakId(kontakId); setDrilldownOpen(true); setLoadingKontak(kontakId);
    try {
      const rows = await fetchRows<Record<string, unknown>>(
        `/api/dashboard/m2/sm/contact-drilldown?${new URLSearchParams({ fromDate, toDate, feature: FEATURE, kontakId })}`,
      );
      setContactDrilldown(rows);
    } catch { setContactDrilldown([]); } finally { setLoadingKontak(null); }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{featureLabel}</ToolbarPageTitle>
          <ToolbarDescription>Dashboard Bank Payment (SM) untuk memantau pembayaran bank, tren pengeluaran, dan kualitas transaksi. ({FEATURE})</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[160px]" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[160px]" />
            <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw /> Refresh</Button>
          </div>
        </ToolbarActions>
      </Toolbar>

      {error ? <Card className="mb-4 border-destructive/30"><CardContent className="pt-6 text-sm text-destructive">{error}</CardContent></Card> : null}

      <M2KpiCards loading={loading} cards={[
        { title: 'Total Transaksi Bank Payment', value: kpiValues.kpi1, isMoney: false },
        { title: 'Total Nilai Pembayaran', value: kpiValues.kpi2, isMoney: true },
        { title: 'Total Terealisasi', value: kpiValues.kpi3, isMoney: true },
        { title: 'Outstanding Payment', value: kpiValues.kpi4, isMoney: true },
        { title: 'Total Cabang', value: summary?.total_cabang, isMoney: false },
        { title: 'Total Sumber', value: summary?.total_sumber, isMoney: false },
      ]} />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Trend Payment vs Realisasi</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Line dataKey="debit" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line dataKey="kredit" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Arus Payment Bank</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="cashIn" fill="#16a34a" /><Bar dataKey="cashOut" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Komposisi Sumber Payment</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Cabang Payment</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="cabang" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="movement" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ringkasan Status Bank Payment</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {status.slice(0, 6).map((row, i) => (
              <div key={`${String(row.status_label)}-${i}`} className="flex items-center justify-between text-sm">
                <span>{String(row.status_label ?? 'unknown')}</span>
                <span className="font-medium">{fmt(row.total_trx)}</span>
              </div>
            ))}
            {status.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada data status bank payment.</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Kontak Bank Payment</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topContacts.slice(0, 6).map((row, i) => (
              <button key={`${String(row.kontak_key)}-${i}`} type="button"
                className="flex w-full items-center justify-between rounded px-1 py-1 text-sm hover:bg-muted/50"
                onClick={() => void openContactDrilldown(row.kontak_key)}>
                <span>Kontak {String(row.kontak_key ?? '0')}</span>
                <span className="font-medium">{fmtMoney(row.total_payment, 2)}</span>
              </button>
            ))}
            {topContacts.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada kontak payment.</p> : null}
          </CardContent>
        </Card>
      </div>

      <M2InsightPanel insightTitle="AI Insight Bank Payment" insightModel={insightModel} insightTermMap={INSIGHT_TERM_MAP}
        groups={[
          { label: 'Ringkasan', items: insights, fallback: fallbackInsights.insights, empty: 'Belum ada insight bank payment.', prefix: 'ins' },
          { label: 'Anomali', items: anomalies, fallback: fallbackInsights.anomalies, empty: 'Belum ada anomali bank payment.', prefix: 'anom' },
          { label: 'Rekomendasi', items: recommendations, fallback: fallbackInsights.recommendations, empty: 'Belum ada rekomendasi bank payment.', prefix: 'rec' },
        ]}
      />

      <Card className="mt-4">
        <CardHeader><CardTitle>List Transaksi Bank Payment (Sample)</CardTitle></CardHeader>
        <CardContent>
          {tableColumns.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada data transaksi bank payment.</p> : (
            <Table>
              <TableHeader><TableRow>{tableColumns.map((col) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {tableRows.slice(0, 20).map((row, ri) => (
                  <TableRow key={ri}>
                    {tableColumns.map((col) => {
                      if (col === 'kontak_id') {
                        const kid = String(row[col] ?? '').trim();
                        const isLoading = loadingKontak === kid;
                        return (
                          <TableCell key={`${ri}-${col}`} className="text-right font-medium tabular-nums">
                            <div className="flex items-center justify-end gap-2">
                              <span>{fmt(row[col], 0)}</span>
                              {kid ? <Button variant="outline" size="sm" onClick={() => void openContactDrilldown(kid)} disabled={isLoading}>{isLoading ? 'Loading...' : 'Drill-down'}</Button> : null}
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={`${ri}-${col}`} className={isNumericLike(row[col]) ? 'text-right font-medium tabular-nums' : 'max-w-[220px] truncate'} title={String(row[col] ?? '-')}>
                          {isNumericLike(row[col]) ? isMonetaryColumn(col) ? fmtMoney(row[col], 2) : isIntegerColumn(col) ? fmt(row[col], 0) : fmt(row[col], 2) : String(row[col] ?? '-')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={drilldownOpen} onOpenChange={setDrilldownOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Follow-up Kontak Bank Payment {activeKontakId || '-'}</DialogTitle>
            <DialogDescription>Transaksi payment terbesar pada periode terpilih.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            {loadingKontak ? <p className="text-sm text-muted-foreground">Memuat detail kontak...</p>
              : contactDrilldown.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada detail kontak untuk periode ini.</p>
              : (
                <div className="space-y-2 text-sm">
                  {contactDrilldown.slice(0, 20).map((drill, i) => (
                    <div key={`drill-${i}`} className="flex items-center justify-between gap-2 rounded border p-2">
                      <span className="truncate">{String(drill.trx_date ?? '-')} • {String(drill.no_transaksi ?? '-')} • {String(drill.cabang ?? '-')}</span>
                      <span className="font-medium tabular-nums">{fmtMoney(drill.kredit, 2)}</span>
                    </div>
                  ))}
                </div>
              )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
