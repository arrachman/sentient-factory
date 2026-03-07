'use client';

import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { StatusItem } from './types';

const RADIAN = Math.PI / 180;

export function OrderStatusCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: StatusItem[];
}) {
  const total = items.reduce((sum, row) => sum + row.value, 0);

  return (
    <Card className="lg:col-span-3 h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="flex h-full flex-col px-5 pb-4 pt-3">
        <div className="flex flex-1 items-center justify-center">
          <div className="relative mx-auto h-full w-full max-w-[220px] min-h-[200px]">
          <ChartContainer
            className="h-full w-full"
            config={Object.fromEntries(items.map((item) => [item.key, { label: item.label, color: item.color }]))}
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
              <Pie
                data={items}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={92}
                paddingAngle={3}
                strokeWidth={4}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  if (typeof value !== 'number' || value <= 0) return null;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white text-[10px] font-semibold"
                    >
                      {value}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {items.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-3xl font-semibold leading-none lg:text-4xl">{total}</p>
          </div>
        </div>
        </div>

        <div className="mt-auto pt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] lg:text-xs">
          {items.map((status) => (
            <div key={status.key} className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-xs" style={{ backgroundColor: status.color }} />
              <span className="text-muted-foreground">{status.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
