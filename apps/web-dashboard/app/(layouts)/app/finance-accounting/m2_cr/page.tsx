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
import type { InsightItem, InsightResponse } from '../_shared/m2-types';
import { M2KpiCards } from '../_shared/m2-kpi-cards';
import { M2InsightPanel } from '../_shared/m2-insight-panel';

type CrSummaryRow = {
  total_trx?: number | string;
  total_kas_masuk?: number | string;
  total_terbayar?: number | string;
  outstanding?: number | string;
  total_cabang?: number | string;
  total_sumber?: number | string;
};

const FEATURE = 'm2_cr';
const INSIGHT_TERM_MAP = {
  totalDebit: 'total kas masuk',
  totalKredit: 'total terbayar',
  netCashflow: 'net penerimaan',
  cashIn: 'kas masuk',
  cashOut: 'kas keluar',
  arusKasAgregat: 'ringkasan arus kas',
  outlierNetCashflow: 'outlier nilai kas masuk',
};

export default function Page() {
  const featureLabel = FEATURE_LABELS[FEATURE] ?? `Finance Feature (${FEATURE})`;
  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<CrSummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [topOutstandingContacts, setTopOutstandingContacts] = useState<Record<string, unknown>[]>([]);
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
    setLoading(true); setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate, feature: FEATURE });
      const [summaryRows, trendRows, breakdownRows, statusRows, topBranchRows, topOutstandingRows, detailRows] =
        await Promise.all([
          fetchRows<CrSummaryRow>(`/api/dashboard/m2/cr/summary?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/trends?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/breakdown/source?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/breakdown/status-bayar?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/top-branches?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/top-outstanding-contacts?${query}`),
          fetchRows<Record<string, unknown>>(`/api/dashboard/m2/cr/table?${query}&page=1&pageSize=20&sortBy=outstanding&sortOrder=desc`),
        ]);
      const ir = await fetch(`/api/dashboard/m2/cr/insight?${new URLSearchParams({ fromDate, toDate, feature: FEATURE })}`, { cache: 'no-store' });
      const ip = (await ir.json().catch(() => null)) as InsightResponse | null;
      if (ir.ok && ip?.success) {
        setInsights(ip.data?.insights ?? []); setAnomalies(ip.data?.anomalies ?? []);
        setRecommendations(ip.data?.recommendations ?? []); setInsightModel(ip.data?.model ?? null);
      } else { setInsights([]); setAnomalies([]); setRecommendations([]); setInsightModel(null); }
      setSummary(summaryRows[0] ?? null); setTrends(trendRows); setBreakdown(breakdownRows);
      setBranch(topBranchRows); setTopOutstandingContacts(topOutstandingRows);
      setStatus(statusRows); setTableRows(detailRows);
      setContactDrilldown([]); setActiveKontakId(''); setDrilldownOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trendChartData = useMemo(() =>
    trends.map((row) => ({ period: String(row.period_ym ?? '-'), debit: toNumber(row.total_kas_masuk), kredit: toNumber(row.total_terbayar) })),
    [trends]);
  const sourceBreakdownData = useMemo(() =>
    breakdown.slice(0, 8).map((row) => ({ label: String(row.source_key ?? 'UNKNOWN'), value: toNumber(row.total_kas_masuk) })),
    [breakdown]);
  const kpiValues = useMemo(() => ({
    kpi1: toNumber(summary?.total_trx), kpi2: toNumber(summary?.total_kas_masuk),
    kpi3: toNumber(summary?.total_terbayar), kpi4: toNumber(summary?.outstanding),
  }), [summary]);
  const branchChartData = useMemo(() =>
    branch.slice(0, 8).map((row) => ({ cabang: String(row.cabang ?? 'UNKNOWN'), movement: toNumber(row.total_kas_masuk) })),
    [branch]);

  const fallbackInsights = useMemo(() => {
    const total = toNumber(kpiValues.kpi2);
    const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
    const pct = total > 0 ? (outstanding / total) * 100 : 0;
    const src = sourceBreakdownData[0]; const brnch = branchChartData[0]; const stTop = status[0];
    const outlier = trendChartData.find((item) => toNumber(item.debit) > (total / Math.max(trendChartData.length, 1)) * 2.5);
    return {
      insights: [
        `Periode analisis mencatat ${fmt(kpiValues.kpi1)} transaksi kas masuk dengan total ${fmtMoney(total, 2)}.`,
        `Total terbayar ${fmtMoney(kpiValues.kpi3, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(pct, 2)}%).`,
        src ? `Sumber transaksi terbesar: ${src.label} (${fmtMoney(src.value, 2)}).` : 'Belum ada sumber transaksi dominan.',
        brnch ? `Cabang movement tertinggi: ${brnch.cabang} (${fmtMoney(brnch.movement, 2)}).` : 'Belum ada cabang dengan movement dominan.',
      ],
      anomalies: [
        ...(pct > 30 ? [`Outstanding kas masuk melebihi 30% dari total penerimaan (${fmt(pct, 2)}%).`] : []),
        ...(outlier ? [`Lonjakan kas masuk terdeteksi pada periode ${outlier.period}.`] : []),
        ...(stTop && String(stTop.status_label ?? '').startsWith('unknown_') ? ['Terdapat status transaksi belum terpetakan (unknown_*).'] : []),
      ],
      recommendations: [
        'Prioritaskan follow-up transaksi outstanding terbesar berdasarkan kontak dan cabang.',
        'Lakukan validasi transaksi outlier untuk memastikan tidak ada salah input nominal.',
        'Tetapkan monitoring mingguan untuk rasio outstanding agar cash conversion lebih sehat.',
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
        `/api/dashboard/m2/cr/contact-drilldown?${new URLSearchParams({ fromDate, toDate, feature: FEATURE, kontakId })}`,
      );
      setContactDrilldown(rows);
    } catch { setContactDrilldown([]); } finally { setLoadingKontak(null); }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{featureLabel}</ToolbarPageTitle>
          <ToolbarDescription>Dashboard Kas Masuk (CR) untuk memantau nilai penerimaan, status pelunasan, dan distribusi sumber transaksi. ({FEATURE})</ToolbarDescription>
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
        { title: 'Jumlah Transaksi Kas Masuk', value: kpiValues.kpi1, isMoney: false },
        { title: 'Total Kas Masuk', value: kpiValues.kpi2, isMoney: true },
        { title: 'Total Terbayar', value: kpiValues.kpi3, isMoney: true },
        { title: 'Outstanding Belum Lunas', value: kpiValues.kpi4, isMoney: true },
        { title: 'Total Cabang Aktif', value: summary?.total_cabang, isMoney: false },
        { title: 'Total Sumber Aktif', value: summary?.total_sumber, isMoney: false },
      ]} />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Trend Kas Masuk per Periode</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Cash In vs Cash Out (Konteks m2)</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => fmtMoneyCompact(v, 1)} width={96} />
                <Tooltip formatter={(v) => fmtMoneyCompact(v, 2)} />
                <Bar dataKey="debit" fill="#16a34a" /><Bar dataKey="kredit" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Komposisi Sumber Kas Masuk</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Top Cabang Kas Masuk</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Ringkasan Status Bayar</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {status.slice(0, 6).map((row, i) => (
              <div key={`${String(row.status_label)}-${i}`} className="flex items-center justify-between text-sm">
                <span>{String(row.status_bayar_label ?? 'unknown')}</span>
                <span className="font-medium">{fmt(row.total_trx)}</span>
              </div>
            ))}
            {status.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada data status kas masuk.</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Kontak Outstanding</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topOutstandingContacts.slice(0, 6).map((row, i) => (
              <div key={`${String(row.kontak_key)}-${i}`} className="flex items-center justify-between text-sm">
                <span>Kontak {String(row.kontak_key ?? '0')}</span>
                <span className="font-medium">{fmtMoney(row.total_outstanding, 2)}</span>
              </div>
            ))}
            {topOutstandingContacts.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada outstanding kontak.</p> : null}
          </CardContent>
        </Card>
      </div>

      <M2InsightPanel insightTitle="AI Insight Kas Masuk" insightModel={insightModel} insightTermMap={INSIGHT_TERM_MAP}
        groups={[
          { label: 'Ringkasan', items: insights, fallback: fallbackInsights.insights, empty: 'Belum ada insight kas masuk.', prefix: 'ins' },
          { label: 'Anomali', items: anomalies, fallback: fallbackInsights.anomalies, empty: 'Belum ada anomali kas masuk.', prefix: 'anom' },
          { label: 'Rekomendasi', items: recommendations, fallback: fallbackInsights.recommendations, empty: 'Belum ada rekomendasi kas masuk.', prefix: 'rec' },
        ]}
      />

      <Card className="mt-4">
        <CardHeader><CardTitle>List Transaksi Kas Masuk (Sample)</CardTitle></CardHeader>
        <CardContent>
          {tableColumns.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada data transaksi kas masuk.</p> : (
            <Table>
              <TableHeader><TableRow>{tableColumns.map((col) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {tableRows.slice(0, 20).map((row, ri) => (
                  <TableRow key={String(row.crid ?? ri)}>
                    {tableColumns.map((col) => {
                      if (col === 'kontak_id') {
                        const kid = String(row[col] ?? '').trim();
                        const hasOutstanding = toNumber(row.outstanding) > 0;
                        const isLoading = loadingKontak === kid;
                        return (
                          <TableCell key={`${ri}-${col}`} className="text-right font-medium tabular-nums">
                            <div className="flex items-center justify-end gap-2">
                              <span>{fmt(row[col], 0)}</span>
                              {kid && hasOutstanding ? <Button variant="outline" size="sm" onClick={() => void openContactDrilldown(kid)} disabled={isLoading}>{isLoading ? 'Loading...' : 'Drill-down'}</Button> : null}
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
            <DialogTitle>Detail Follow-up Outstanding Kontak {activeKontakId || '-'}</DialogTitle>
            <DialogDescription>Transaksi outstanding terbesar pada periode terpilih.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            {loadingKontak ? <p className="text-sm text-muted-foreground">Memuat detail kontak...</p>
              : contactDrilldown.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada detail kontak untuk periode ini.</p>
              : (
                <div className="space-y-2 text-sm">
                  {contactDrilldown.slice(0, 20).map((drill, i) => (
                    <div key={`drill-${i}`} className="flex items-center justify-between gap-2 rounded border p-2">
                      <span className="truncate">{String(drill.trx_date ?? '-')} • {String(drill.no_transaksi ?? '-')} • {String(drill.cabang ?? '-')}</span>
                      <span className="font-medium tabular-nums">{fmtMoney(drill.outstanding, 2)}</span>
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
