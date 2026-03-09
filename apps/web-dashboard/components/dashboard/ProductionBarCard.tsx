'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function ProductionBarCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Array<{ date: string; orders: number }>;
}) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1">
        <ChartContainer className="h-[235px] w-full" config={{ orders: { label: 'Total Production Order', color: '#4E74D6' } }}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} width={24} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} barSize={22} />
          </BarChart>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <span className="inline-block size-2.5 rounded-sm bg-[#4E74D6]" />
          Total Production Order
        </div>
      </CardContent>
    </Card>
  );
}
