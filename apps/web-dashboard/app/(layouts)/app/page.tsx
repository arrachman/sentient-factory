'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useLogisticDashboardPage } from '@/app/(layouts)/app/hooks/use-logistic-dashboard-page';
import {
  fmtDate,
  fmtKg,
  outboundBadgeVariant,
  PERIOD_OPTIONS,
  type PeriodFilter,
} from '@/app/(layouts)/app/model/logistic-dashboard';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Page() {
  const {
    loading,
    error,
    period,
    setPeriod,
    inboundRows,
    outboundRows,
    inboundTotal,
    outboundTotal,
    inboundPosted,
    inboundCancelled,
    outboundInProgress,
    outboundClosed,
    fetchDashboardData,
  } = useLogisticDashboardPage();

  useEffect(() => {
    void fetchDashboardData(period);
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
          <Button variant="outline" onClick={() => void fetchDashboardData(period)} disabled={loading}>
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
                      <TableCell className="text-right">{Number(row.totalBatches ?? 0).toLocaleString('id-ID')}</TableCell>
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
