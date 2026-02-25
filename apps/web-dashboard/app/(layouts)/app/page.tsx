'use client';

import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Check, ExternalLink, Link2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLogisticDashboardPage } from '@/app/(layouts)/app/hooks/use-logistic-dashboard-page';
import {
  type DashboardDomain,
  fmtCompactNumber,
  fmtDate,
  fmtNumber,
  PERIOD_OPTIONS,
  type PeriodFilter,
  toNumber,
} from '@/app/(layouts)/app/model/logistic-dashboard';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export default function Page() {
  const [isSharing, setIsSharing] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const {
    loading,
    error,
    domain,
    setDomain,
    domainOptions,
    period,
    setPeriod,
    groupBy,
    setGroupBy,
    sortBy,
    setSortBy,
    groupByOptions,
    sortByOptions,
    metricView,
    setMetricView,
    resetFilters,
    trends,
    breakdown,
    tableRows,
    fetchDashboardData,
    totalRows,
    totalMetric,
    avgMetric,
    minMetric,
    maxMetric,
  } = useLogisticDashboardPage();

  useEffect(() => {
    void fetchDashboardData(period, groupBy, domain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, period, groupBy, sortBy]);

  const tableColumns = tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];

  const trendChartData = useMemo(
    () =>
      trends.slice(-30).map((row) => ({
        dateLabel: row.period_date ? row.period_date.slice(5) : '-',
        totalMetric: toNumber(row.total_metric),
        totalRows: toNumber(row.total_rows),
      })),
    [trends],
  );

  const breakdownChartData = useMemo(
    () =>
      breakdown.slice(0, 10).map((row) => ({
        groupKey: String(row.group_key || 'UNKNOWN'),
        totalMetric: toNumber(row.total_metric),
        totalRows: toNumber(row.total_rows),
      })),
    [breakdown],
  );

  const metricViewOptions = [
    { value: 'totalMetric', label: 'Metric' },
    { value: 'totalRows', label: 'Rows' },
  ];

  const handleShareLink = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('/api/share-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: window.location.href }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: { shortUrl?: string }; message?: string }
        | null;

      if (!response.ok || !payload?.success || !payload.data?.shortUrl) {
        throw new Error(payload?.message || 'Failed to generate short link');
      }

      copyToClipboard(payload.data.shortUrl);
      toast.success('Short link copied');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to share link');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{`Dashboard MyERPPlus (${domain.toUpperCase()})`}</ToolbarPageTitle>
          <ToolbarDescription>
            Ringkasan KPI, tren, breakdown, dan sample data dari dashboard mapping SQL templates.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="w-[120px]">
            <AutocompleteSelect
              value={domain}
              onValueChange={(value) => {
                setDomain(value as DashboardDomain);
                setGroupBy('');
                setSortBy('');
              }}
              options={domainOptions}
              placeholder="Domain"
              searchPlaceholder="Cari domain..."
              emptyText="Domain tidak ditemukan."
            />
          </div>
          <div className="w-[140px]">
            <AutocompleteSelect
              value={period}
              onValueChange={(value) => setPeriod(value as PeriodFilter)}
              options={PERIOD_OPTIONS}
              placeholder="Periode"
              searchPlaceholder="Cari periode..."
              emptyText="Periode tidak ditemukan."
            />
          </div>
          <div className="w-[220px]">
            <AutocompleteSelect
              value={groupBy}
              onValueChange={setGroupBy}
              options={groupByOptions}
              placeholder="Group by"
              searchPlaceholder="Cari kolom..."
              emptyText="Kolom tidak ditemukan."
            />
          </div>
          <div className="w-[220px]">
            <AutocompleteSelect
              value={sortBy}
              onValueChange={setSortBy}
              options={sortByOptions}
              placeholder="Sort by"
              searchPlaceholder="Cari kolom..."
              emptyText="Kolom tidak ditemukan."
            />
          </div>
          <div className="w-[120px]">
            <AutocompleteSelect
              value={metricView}
              onValueChange={(value) => setMetricView(value as 'totalMetric' | 'totalRows')}
              options={metricViewOptions}
              placeholder="Metric"
              searchPlaceholder="Pilih metric..."
              emptyText="Metric tidak ditemukan."
            />
          </div>
          <Button variant="outline" onClick={() => void fetchDashboardData(period, groupBy, domain)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleShareLink} disabled={isSharing}>
            {isCopied ? <Check /> : <Link2 />}
            {isCopied ? 'Copied' : isSharing ? 'Sharing...' : 'Share Link'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(window.location.href, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <ExternalLink />
            Open Tab
          </Button>
          <Button variant="outline" onClick={resetFilters} disabled={loading}>
            Reset Filter
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmtNumber(totalRows, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Metric</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmtCompactNumber(totalMetric, 2)}</p>
            <p className="text-xs text-muted-foreground">{totalMetric}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Metric</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmtCompactNumber(avgMetric, 2)}</p>
            <p className="text-xs text-muted-foreground">{avgMetric}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Min Metric</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmtCompactNumber(minMetric, 2)}</p>
            <p className="text-xs text-muted-foreground">{minMetric}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Max Metric</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmtCompactNumber(maxMetric, 2)}</p>
            <p className="text-xs text-muted-foreground">{maxMetric}</p>
          </CardContent>
        </Card>
      </div>

      {!loading && totalRows === 0 ? (
        <Card className="mt-5 border-dashed">
          <CardHeader>
            <CardTitle>Data Belum Tersedia untuk Domain {domain.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tidak ada data pada rentang periode saat ini. Coba ubah domain, gunakan periode lebih lebar, atau verifikasi
              tabel sumber pada template SQL domain tersebut.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend {metricView === 'totalMetric' ? 'Metric' : 'Rows'} (30 titik terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : trendChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data tren.</p>
            ) : (
              <ChartContainer
                config={{
                  totalMetric: { label: 'Total Metric', color: 'hsl(var(--chart-1))' },
                  totalRows: { label: 'Rows', color: 'hsl(var(--chart-3))' },
                }}
                className="h-[260px] w-full"
              >
                <LineChart data={trendChartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} minTickGap={20} />
                  <YAxis tickLine={false} axisLine={false} width={56} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey={metricView}
                    stroke={metricView === 'totalMetric' ? 'var(--color-totalMetric)' : 'var(--color-totalRows)'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Breakdown {metricView === 'totalMetric' ? 'Metric' : 'Rows'} by {groupBy || '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : breakdownChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data breakdown.</p>
            ) : (
              <ChartContainer
                config={{
                  totalMetric: { label: 'Total Metric', color: 'hsl(var(--chart-2))' },
                  totalRows: { label: 'Rows', color: 'hsl(var(--chart-4))' },
                }}
                className="h-[260px] w-full"
              >
                <BarChart data={breakdownChartData} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis dataKey="groupKey" type="category" tickLine={false} axisLine={false} width={70} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey={metricView}
                    fill={metricView === 'totalMetric' ? 'var(--color-totalMetric)' : 'var(--color-totalRows)'}
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend Rows (sample)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Metric</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>Loading...</TableCell>
                  </TableRow>
                ) : trends.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>Belum ada data tren.</TableCell>
                  </TableRow>
                ) : (
                  trends.slice(0, 12).map((row, index) => (
                    <TableRow key={`${row.period_date ?? 'period'}-${index}`}>
                      <TableCell>{fmtDate(row.period_date)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.total_rows, 0)}</TableCell>
                      <TableCell className="text-right">{fmtCompactNumber(row.total_metric, 2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breakdown Rows (sample)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Metric</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>Loading...</TableCell>
                  </TableRow>
                ) : breakdown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>Belum ada data breakdown.</TableCell>
                  </TableRow>
                ) : (
                  breakdown.slice(0, 12).map((row, index) => (
                    <TableRow key={`${row.group_key ?? 'group'}-${index}`}>
                      <TableCell>{row.group_key || 'UNKNOWN'}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.total_rows, 0)}</TableCell>
                      <TableCell className="text-right">{fmtCompactNumber(row.total_metric, 2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Sample Records (Top 10)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={Math.max(tableColumns.length, 1)}>Loading...</TableCell>
                </TableRow>
              ) : tableRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Math.max(tableColumns.length, 1)}>Belum ada data tabel.</TableCell>
                </TableRow>
              ) : (
                tableRows.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    {tableColumns.map((column) => (
                      <TableCell key={`${rowIndex}-${column}`}>{String(row[column] ?? '-')}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
