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
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {title}
        </CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="flex flex-col px-5 pb-5 pt-3">
        <ChartContainer className="mx-auto h-[280px] w-full max-w-[320px]" config={{ otif: { label: 'On Time', color: '#2F5FE8' } }}>
          <RadialBarChart
            data={[{ name: 'otif', value, fill: '#2F5FE8' }]}
            startAngle={210}
            endAngle={-30}
            innerRadius="72%"
            outerRadius="92%"
            barSize={28}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" background cornerRadius={999} />
            <text x="50%" y="46%" textAnchor="middle" className="fill-muted-foreground text-[14px] font-medium">
              On time vs Total Delivered
            </text>
            <text x="50%" y="60%" textAnchor="middle" className="fill-foreground text-[22px] font-semibold lg:text-[28px]">
              {onTime}/{total}
            </text>
            <text x="28%" y="27%" textAnchor="middle" className="fill-white text-[12px] font-semibold">
              {value}%
            </text>
          </RadialBarChart>
        </ChartContainer>

        <div className="mt-3 flex items-center justify-center gap-6 text-sm text-muted-foreground">
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
