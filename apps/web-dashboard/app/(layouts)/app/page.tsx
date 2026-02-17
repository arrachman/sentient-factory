'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type InboundRow = {
  uuid: string;
  transactionNo: string;
  transactionDate: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  supplier?: {
    name?: string | null;
  } | null;
  _count?: {
    details?: number;
  };
  totalBatches?: number;
};

type OutboundRow = {
  uuid: string;
  doNumber: string;
  doDate: string;
  status: 'DRAFT' | 'SHIPPED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';
  customer?: {
    name?: string | null;
  } | null;
  totalKg?: unknown;
  totalBatches?: number;
};

type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

type ListResponse<T> = {
  success?: boolean;
  data?: T[];
  meta?: {
    total?: number;
  };
  message?: string;
};

type PeriodFilter = 'today' | '7d' | '30d';

const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
  { value: 'today', label: 'Hari Ini' },
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
];

function getTokenFromCookie() {
  return (
    document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('sf_token='))
      ?.slice('sf_token='.length) || ''
  );
}

function fmtDate(value?: string | null) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function isDecimalLike(value: unknown): value is DecimalLike {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray((value as DecimalLike).d) &&
      typeof (value as DecimalLike).e === 'number',
  );
}

function decimalLikeToString(value: DecimalLike): string {
  const digits = Array.isArray(value.d) ? value.d.join('') : '';
  if (!digits) {
    return '0';
  }

  const sign = value.s === -1 ? '-' : '';
  const exponent = typeof value.e === 'number' ? value.e : digits.length - 1;
  const decimalPos = exponent + 1;

  if (decimalPos <= 0) {
    return `${sign}0.${'0'.repeat(Math.abs(decimalPos))}${digits}`.replace(/\.?0+$/, '') || '0';
  }
  if (decimalPos >= digits.length) {
    return `${sign}${digits}${'0'.repeat(decimalPos - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`.replace(/\.?0+$/, '') || '0';
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (isDecimalLike(value)) {
    const parsed = Number(decimalLikeToString(value));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function fmtKg(value: unknown) {
  return normalizeNumber(value).toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

function toDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function resolvePeriodRange(period: PeriodFilter) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const from = new Date(to);
  if (period === 'today') {
    from.setHours(0, 0, 0, 0);
  } else if (period === '7d') {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  } else {
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  }

  return {
    from: toDateOnly(from),
    to: toDateOnly(to),
  };
}

function outboundBadgeVariant(status?: OutboundRow['status']) {
  if (status === 'CLOSED' || status === 'RECEIVED') {
    return 'success';
  }
  if (status === 'CANCELLED') {
    return 'destructive';
  }
  if (status === 'SHIPPED') {
    return 'info';
  }
  return 'secondary';
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<PeriodFilter>('7d');

  const [inboundRows, setInboundRows] = useState<InboundRow[]>([]);
  const [outboundRows, setOutboundRows] = useState<OutboundRow[]>([]);
  const [inboundTotal, setInboundTotal] = useState(0);
  const [outboundTotal, setOutboundTotal] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const inboundPosted = useMemo(
    () => inboundRows.filter((row) => row.status === 'POSTED').length,
    [inboundRows],
  );
  const inboundCancelled = useMemo(
    () => inboundRows.filter((row) => row.status === 'CANCELLED').length,
    [inboundRows],
  );
  const outboundInProgress = useMemo(
    () =>
      outboundRows.filter((row) => row.status === 'SHIPPED' || row.status === 'DRAFT').length,
    [outboundRows],
  );
  const outboundClosed = useMemo(
    () => outboundRows.filter((row) => row.status === 'CLOSED').length,
    [outboundRows],
  );

  const fetchDashboardData = async (activePeriod: PeriodFilter = period) => {
    setLoading(true);
    setError('');
    try {
      const headers = token
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
        : undefined;
      const range = resolvePeriodRange(activePeriod);
      const inboundQuery = new URLSearchParams({
        page: '1',
        limit: '10',
        transactionDateFrom: range.from,
        transactionDateTo: range.to,
      });
      const outboundQuery = new URLSearchParams({
        page: '1',
        limit: '10',
        doDateFrom: range.from,
        doDateTo: range.to,
      });

      const [inboundRes, outboundRes] = await Promise.all([
        fetch(`/api/inbounds?${inboundQuery.toString()}`, {
          cache: 'no-store',
          headers,
        }),
        fetch(`/api/outbound?${outboundQuery.toString()}`, {
          cache: 'no-store',
          headers,
        }),
      ]);

      const [inboundPayload, outboundPayload] = await Promise.all([
        inboundRes.json().catch(() => null),
        outboundRes.json().catch(() => null),
      ]);

      if (!inboundRes.ok || !inboundPayload?.success) {
        throw new Error(inboundPayload?.message || 'Failed to load inbound data');
      }
      if (!outboundRes.ok || !outboundPayload?.success) {
        throw new Error(outboundPayload?.message || 'Failed to load outbound data');
      }

      const inboundData = inboundPayload as ListResponse<InboundRow>;
      const outboundData = outboundPayload as ListResponse<OutboundRow>;

      setInboundRows(Array.isArray(inboundData.data) ? inboundData.data : []);
      setOutboundRows(Array.isArray(outboundData.data) ? outboundData.data : []);
      setInboundTotal(Number(inboundData.meta?.total ?? 0));
      setOutboundTotal(Number(outboundData.meta?.total ?? 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Logistic Dashboard</ToolbarPageTitle>
          <ToolbarDescription>
            Ringkasan aktivitas inbound dan outbound ({PERIOD_OPTIONS.find((x) => x.value === period)?.label}).
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="w-[140px]">
            <AutocompleteSelect
              value={period}
              onValueChange={(value) => setPeriod(value as PeriodFilter)}
              options={PERIOD_OPTIONS}
              placeholder="Pilih periode"
              searchPlaceholder="Cari periode..."
              emptyText="Periode tidak ditemukan."
            />
          </div>
          <Button variant="outline" onClick={() => fetchDashboardData(period)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/app/logistic/inbound">
              Inbound
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/logistic/transaction">
              Outbound
              <ArrowRight />
            </Link>
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Inbound</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{inboundTotal}</p>
            <p className="text-xs text-muted-foreground">Total dokumen inbound</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Outbound</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{outboundTotal}</p>
            <p className="text-xs text-muted-foreground">Total dokumen outbound</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inbound Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Posted: {inboundPosted}</p>
            <p className="text-sm">Cancelled: {inboundCancelled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outbound Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">In Progress: {outboundInProgress}</p>
            <p className="text-sm">Closed: {outboundClosed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inbound Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Qty Batch</TableHead>
                  <TableHead className="text-right">Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : inboundRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>Belum ada data inbound.</TableCell>
                  </TableRow>
                ) : (
                  inboundRows.map((row, index) => (
                    <TableRow key={row.uuid || row.transactionNo || `inbound-${index}`}>
                      <TableCell className="font-medium">{row.transactionNo || '-'}</TableCell>
                      <TableCell>{fmtDate(row.transactionDate)}</TableCell>
                      <TableCell>{row.supplier?.name || '-'}</TableCell>
                      <TableCell className="text-right">
                        {Number(row.totalBatches ?? 0).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">{row._count?.details ?? 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outbound Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DO Number</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">KG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : outboundRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>Belum ada data outbound.</TableCell>
                  </TableRow>
                ) : (
                  outboundRows.map((row, index) => (
                    <TableRow key={row.uuid || row.doNumber || `outbound-${index}`}>
                      <TableCell className="font-medium">{row.doNumber || '-'}</TableCell>
                      <TableCell>{fmtDate(row.doDate)}</TableCell>
                      <TableCell>{row.customer?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={outboundBadgeVariant(row.status)}>{row.status || '-'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{fmtKg(row.totalKg)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
