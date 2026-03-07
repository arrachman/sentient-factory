'use client';

import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { TimeseriesDatum, TimeseriesSeries } from './types';

export function TimeseriesCard({
  title,
  subtitle,
  filterLabel,
  data,
  series,
  variant = 'line',
  showYAxis = true,
  showGrid = true,
  yAxisDomain = [0, 1000],
  yAxisWidth = 36,
  chartHeightClass = 'h-[360px]',
  metricValue,
  metricDelta,
  metricDeltaLabel,
  showLegend = true,
  legendAlign = 'center',
  legendPaddingLeft,
  legendPaddingRight,
  legendClassName,
  chartMargin,
  cardClassName,
  headerClassName,
  contentClassName,
}: {
  title: string;
  subtitle: string;
  filterLabel?: string;
  data: TimeseriesDatum[];
  series: TimeseriesSeries[];
  variant?: 'line' | 'area';
  showYAxis?: boolean;
  showGrid?: boolean;
  yAxisDomain?: [number | 'dataMin' | 'dataMax', number | 'dataMin' | 'dataMax'];
  yAxisWidth?: number;
  chartHeightClass?: string;
  metricValue?: string;
  metricDelta?: number;
  metricDeltaLabel?: string;
  showLegend?: boolean;
  legendAlign?: 'center' | 'between' | 'start';
  legendPaddingLeft?: string;
  legendPaddingRight?: string;
  legendClassName?: string;
  chartMargin?: { top?: number; right?: number; bottom?: number; left?: number };
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}) {
  const resolvedChartMargin = {
    top: 8,
    right: 10,
    bottom: 12,
    left: 6,
    ...chartMargin,
  };
  const showMetric = typeof metricValue === 'string';
  const showDelta = typeof metricDelta === 'number' && metricDeltaLabel;

  return (
    <Card className={cn("lg:col-span-9 rounded-2xl border-border/80 shadow-xs", cardClassName)}>
      <CardHeader className={cn("px-5 py-4", headerClassName)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle
              className="text-[16px] font-medium leading-[26px] tracking-[0%]"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {title}
            </CardTitle>
            <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
          </div>
          {filterLabel ? (
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/80 px-3.5 text-sm font-medium text-muted-foreground"
            >
              {filterLabel}
              <ChevronDown className="size-4" />
            </button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4 px-5 pb-5 pt-3", contentClassName)}>
        {showMetric ? (
          <div className="flex flex-wrap items-center gap-3">
            <p
              className="text-[32px] font-semibold leading-[42px] tracking-[0%] text-center"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {metricValue}
            </p>
            {showDelta ? (
              <Badge
                variant={metricDelta > 0 ? 'success' : 'destructive'}
                appearance="light"
                size="sm"
                className="rounded-full px-2.5 text-xs font-semibold"
              >
                {metricDelta > 0 ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                {Math.abs(metricDelta)} ({metricDeltaLabel})
              </Badge>
            ) : null}
          </div>
        ) : null}
        <ChartContainer
          className={`${chartHeightClass} w-full`}
          config={Object.fromEntries(series.map((line) => [line.key, { label: line.label, color: line.color }]))}
        >
          {variant === 'area' ? (
            <AreaChart data={data} margin={resolvedChartMargin}>
              <defs>
                {series.map((line) => (
                  <linearGradient key={`area-${line.key}`} id={`area-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`var(--color-${line.key})`} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={`var(--color-${line.key})`} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              {showGrid ? <CartesianGrid vertical={false} /> : null}
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={yAxisDomain}
                width={yAxisWidth}
                hide={!showYAxis}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {series.map((line) => (
                <Area
                  key={line.key}
                  dataKey={line.key}
                  type="monotone"
                  stroke={`var(--color-${line.key})`}
                  strokeWidth={2.5}
                  fill={`url(#area-${line.key})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={data} margin={resolvedChartMargin}>
              {showGrid ? <CartesianGrid vertical={false} /> : null}
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={yAxisDomain}
                width={yAxisWidth}
                hide={!showYAxis}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {series.map((line) => (
                <Line
                  key={line.key}
                  dataKey={line.key}
                  type="monotone"
                  stroke={`var(--color-${line.key})`}
                  strokeWidth={2.5}
                  dot={false}
                />
              ))}
            </LineChart>
          )}
        </ChartContainer>

        {showLegend ? (
          <div
            className={cn(
              'flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-muted-foreground lg:gap-6 lg:text-sm',
              legendAlign === 'between'
                ? 'w-full justify-between'
                : legendAlign === 'start'
                  ? 'w-full justify-start'
                  : 'justify-center',
              legendClassName,
            )}
            style={{ paddingLeft: legendPaddingLeft, paddingRight: legendPaddingRight }}
          >
            {series.map((line) => (
              <span key={line.key} className="flex items-center gap-2">
                <span className="inline-block size-3.5 rounded-sm" style={{ backgroundColor: line.color }} />
                {line.label}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
