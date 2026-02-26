'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
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

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

function oneYearAgoDateOnly() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchRows<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = (await response.json().catch(() => null)) as DashboardResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
  }
  return payload.data?.rows ?? [];
}

export default function Page() {
  const params = useParams<{ feature: string }>();
  const feature = String(params?.feature ?? 'm2_aj');
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

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate });
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
      })),
    [cashflow],
  );

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
            Dashboard Finance & Accounting ({feature}) dengan KPI, chart, breakdown, dan list transaksi.
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
          <CardHeader><CardTitle>Total Jurnal</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.total_journal_rows)}</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Debit</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.total_debit, 2)}</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Kredit</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.total_kredit, 2)}</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Net Cashflow</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.net_cashflow, 2)}</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Cabang</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.total_cabang)}</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Sumber</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-semibold">{fmt(summary?.total_sumber)}</p>}</CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Trend Debit vs Kredit</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => fmt(value, 2)} />
                <Line dataKey="debit" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line dataKey="kredit" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cash In vs Cash Out</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => fmt(value, 2)} />
                <Bar dataKey="cashIn" fill="#16a34a" />
                <Bar dataKey="cashOut" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Komposisi Sumber</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => fmt(value, 2)} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Cabang</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cabang" />
                <YAxis />
                <Tooltip formatter={(value) => fmt(value, 2)} />
                <Bar dataKey="movement" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ringkasan Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {status.slice(0, 6).map((row, index) => (
              <div key={`${row.status_label}-${index}`} className="flex items-center justify-between text-sm">
                <span>{String(row.status_label ?? 'unknown')}</span>
                <span className="font-medium">{fmt(row.total_trx)}</span>
              </div>
            ))}
            {status.length === 0 ? <p className="text-sm text-muted-foreground">No status data.</p> : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>List Transaksi (Sample)</CardTitle></CardHeader>
        <CardContent>
          {tableColumns.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data tabel.</p>
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
                      <TableCell key={`${rowIndex}-${column}`}>{String(row[column] ?? '-')}</TableCell>
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

