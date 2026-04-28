'use client';

import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useLazyChartVisibility } from './use-lazy-chart-visibility';

export const DeliveryBarChartCard = memo(function DeliveryBarChartCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Array<{ date: string; delivered: number }>;
}) {
  const [chartRef, chartVisible] = useLazyChartVisibility({});

  return (
    <div ref={chartRef}>
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {title}
        </CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
        <CardContent className="px-5 pb-5 pt-3">
        {chartVisible ? (
          <ChartContainer className="h-[420px] w-full" config={{ delivered: { label: 'Delivered', color: '#4F7AE0' } }}>
            <BarChart data={data} margin={{ top: 8, right: 12, bottom: 10, left: 6 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} interval={0} />
              <YAxis tickLine={false} axisLine={false} width={44} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="delivered" fill="var(--color-delivered)" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[420px] w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30" />
        )}
        </CardContent>
      </Card>
    </div>
  );
});
