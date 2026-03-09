'use client';

import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

export function DeliveryOtifCard({
  title,
  subtitle,
  percentage,
  onTime,
  total,
}: {
  title: string;
  subtitle: string;
  percentage: number;
  onTime: number;
  total: number;
}) {
  const value = Math.max(0, Math.min(percentage, 100));

  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col px-5 pb-5 pt-4">
        <ChartContainer className="h-[360px] w-full" config={{ otif: { label: 'On Time', color: '#2F5FE8' } }}>
          <RadialBarChart
            data={[{ name: 'otif', value, fill: '#2F5FE8' }]}
            cx="50%"
            cy="52%"
            startAngle={210}
            endAngle={-30}
            innerRadius="68%"
            outerRadius="96%"
            barSize={32}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" background cornerRadius={999} />
            <text x="50%" y="49%" textAnchor="middle" className="fill-muted-foreground text-[13px] font-bold font-medium">
              On time vs Total Delivered
            </text>
            <text x="50%" y="62%" textAnchor="middle" className="fill-foreground text-[22px] font-semibold lg:text-[28px]">
              {onTime}/{total}
            </text>
            <text x="23%" y="29%" textAnchor="middle" className="fill-white text-[12px] font-semibold">
              {value}%
            </text>
          </RadialBarChart>
        </ChartContainer>

        <div className="mt-1 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block size-5 rounded-md bg-[#2F5FE8]" />
            On Time
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-5 rounded-md bg-[#D1D5DB]" />
            Total Delivered
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
