'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

export type TrendChartRow = {
  dateLabel: string;
  totalMetric: number;
  totalRows: number;
};

export type BreakdownChartRow = {
  groupKey: string;
  totalMetric: number;
  totalRows: number;
};

/**
 * Trend (LineChart) + Breakdown (BarChart) — 2-column grid.
 */
export function OverviewChartsRow({
  loading,
  metricView,
  groupBy,
  trendData,
  breakdownData,
}: {
  loading: boolean;
  metricView: 'totalMetric' | 'totalRows';
  groupBy: string;
  trendData: TrendChartRow[];
  breakdownData: BreakdownChartRow[];
}) {
  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            Trend {metricView === 'totalMetric' ? 'Metric' : 'Rows'} (30
            titik terakhir)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart
            loading={loading}
            metricView={metricView}
            data={trendData}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Breakdown {metricView === 'totalMetric' ? 'Metric' : 'Rows'} by{' '}
            {groupBy || '-'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BreakdownChart
            loading={loading}
            metricView={metricView}
            data={breakdownData}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function TrendChart({
  loading,
  metricView,
  data,
}: {
  loading: boolean;
  metricView: 'totalMetric' | 'totalRows';
  data: TrendChartRow[];
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-[220px] w-full" />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Belum ada data tren.</p>
    );
  }
  return (
    <ChartContainer
      config={{
        totalMetric: { label: 'Total Metric', color: 'hsl(var(--chart-1))' },
        totalRows: { label: 'Rows', color: 'hsl(var(--chart-3))' },
      }}
      className="h-[260px] w-full"
    >
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="dateLabel"
          tickLine={false}
          axisLine={false}
          minTickGap={20}
        />
        <YAxis tickLine={false} axisLine={false} width={56} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey={metricView}
          stroke={
            metricView === 'totalMetric'
              ? 'var(--color-totalMetric)'
              : 'var(--color-totalRows)'
          }
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function BreakdownChart({
  loading,
  metricView,
  data,
}: {
  loading: boolean;
  metricView: 'totalMetric' | 'totalRows';
  data: BreakdownChartRow[];
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-[220px] w-full" />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada data breakdown.
      </p>
    );
  }
  return (
    <ChartContainer
      config={{
        totalMetric: { label: 'Total Metric', color: 'hsl(var(--chart-2))' },
        totalRows: { label: 'Rows', color: 'hsl(var(--chart-4))' },
      }}
      className="h-[260px] w-full"
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          dataKey="groupKey"
          type="category"
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey={metricView}
          fill={
            metricView === 'totalMetric'
              ? 'var(--color-totalMetric)'
              : 'var(--color-totalRows)'
          }
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
