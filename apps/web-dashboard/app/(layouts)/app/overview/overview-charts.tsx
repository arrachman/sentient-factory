'use client';

import { CartesianGrid, Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtCompactNumber, fmtDate, fmtNumber } from '@/app/(layouts)/app/model/logistic-dashboard';

type TrendChartRow = {
  dateLabel: string;
  totalMetric: number;
  totalRows: number;
};

type BreakdownChartRow = {
  groupKey: string;
  totalMetric: number;
  totalRows: number;
};

type TrendRawRow = {
  period_date?: string | null;
  total_rows?: number | string | null;
  total_metric?: number | string | null;
};

type BreakdownRawRow = {
  group_key?: string | null;
  total_rows?: number | string | null;
  total_metric?: number | string | null;
};

export function OverviewTrendChart({
  loading,
  trendChartData,
  metricView,
}: {
  loading: boolean;
  trendChartData: TrendChartRow[];
  metricView: 'totalMetric' | 'totalRows';
}) {
  return (
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
  );
}

export function OverviewBreakdownChart({
  loading,
  breakdownChartData,
  metricView,
  groupBy,
}: {
  loading: boolean;
  breakdownChartData: BreakdownChartRow[];
  metricView: 'totalMetric' | 'totalRows';
  groupBy: string;
}) {
  return (
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
  );
}

export function OverviewTrendTable({
  loading,
  trends,
}: {
  loading: boolean;
  trends: TrendRawRow[];
}) {
  return (
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
  );
}

export function OverviewBreakdownTable({
  loading,
  breakdown,
}: {
  loading: boolean;
  breakdown: BreakdownRawRow[];
}) {
  return (
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
  );
}
