'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function OpenCloseBarCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: { day: string; open: number; closed: number }[];
}) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs transition-shadow hover:shadow-sm">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3">
        <ChartContainer
          className="h-[260px] w-full"
          config={{
            open: { label: 'Open (Outstanding)', color: '#4776d8' },
            closed: { label: 'Closed', color: '#f05454' },
          }}
        >
          <BarChart data={data} margin={{ left: 6, right: 8, top: 8, bottom: 6 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} interval={1} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="open" stackId="material" fill="var(--color-open)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="closed" stackId="material" fill="var(--color-closed)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
