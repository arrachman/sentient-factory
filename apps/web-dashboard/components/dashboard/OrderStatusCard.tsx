'use client';

import { memo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { StatusItem } from './types';
import { useLazyChartVisibility } from './use-lazy-chart-visibility';

const DONUT_THRESHOLD = 6;

export const OrderStatusCard = memo(function OrderStatusCard({
  title,
  subtitle,
  items,
  valueFormatter,
}: {
  title: string;
  subtitle: string;
  items: StatusItem[];
  valueFormatter?: (value: number) => string;
}) {
  const total = items.reduce((sum, row) => sum + row.value, 0);
  const safeItems = items.filter((item) => item.value > 0);
  const useCompactDonut = safeItems.length >= DONUT_THRESHOLD;
  const [chartRef, chartVisible] = useLazyChartVisibility({ enabled: useCompactDonut });

  return (
    <div ref={chartRef}>
      <Card className="lg:col-span-3 h-full rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="px-5 py-4">
        <CardTitle className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {title}
        </CardTitle>
        <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{subtitle}</p>
      </CardHeader>
        <CardContent className="flex h-full flex-col gap-4 px-5 pb-5 pt-2">
        {useCompactDonut ? (
          <>
            <div className="flex justify-center">
              <div className="relative h-[220px] w-full max-w-[220px]">
                {chartVisible ? (
                  <ChartContainer
                    className="h-full w-full"
                    config={Object.fromEntries(
                      safeItems.map((item) => [item.key, { label: item.label, color: item.color }]),
                    )}
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                      <Pie
                        data={safeItems}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={54}
                        outerRadius={80}
                        paddingAngle={2}
                        strokeWidth={3}
                        label={false}
                        labelLine={false}
                      >
                        {safeItems.map((slice) => (
                          <Cell key={slice.key} fill={slice.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="h-full w-full rounded-full border border-dashed border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30" />
                )}

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Total
                  </div>
                  <div className="mt-2 max-w-[7ch] break-words text-center text-[24px] font-semibold leading-none tracking-tight text-slate-800 tabular-nums dark:text-slate-100">
                    {valueFormatter ? valueFormatter(total) : total}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {safeItems.map((status) => {
                const percentage = total > 0 ? (status.value / total) * 100 : 0;

                return (
                  <div
                    key={status.key}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className="mt-1 inline-block size-2.5 shrink-0 rounded-xs"
                        style={{ backgroundColor: status.color }}
                      />
                      <div className="min-w-0">
                        <div className="break-words text-[11px] font-medium leading-5 text-slate-700 dark:text-slate-200">
                          {status.label}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
                          <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                            {valueFormatter ? valueFormatter(status.value) : status.value}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Total
              </div>
              <div className="mt-2 break-words text-[28px] font-semibold leading-none tracking-tight text-slate-800 tabular-nums dark:text-slate-100">
                {valueFormatter ? valueFormatter(total) : total}
              </div>
            </div>

            <div className="space-y-3">
              {safeItems.map((status) => {
                const percentage = total > 0 ? (status.value / total) * 100 : 0;

                return (
                  <div key={status.key} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <span
                          className="mt-1 inline-block size-2.5 shrink-0 rounded-xs"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="break-words text-[12px] font-medium leading-5 text-slate-700 dark:text-slate-200">
                          {status.label}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[12px] font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                          {valueFormatter ? valueFormatter(status.value) : status.value}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(0, percentage))}%`,
                          backgroundColor: status.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        </CardContent>
      </Card>
    </div>
  );
});
