'use client';

import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LeadTimeRow = {
  label: string;
  value: number;
  color: string;
};

export function DeliveryLeadTimeCard({
  title,
  rows,
  maxValue,
}: {
  title: string;
  rows: LeadTimeRow[];
  maxValue: number;
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </CardTitle>
          <Info className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-2">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="rounded-md bg-muted/40 p-2.5">
              <div
                className="flex h-10 items-center rounded-md px-4 text-sm font-semibold"
                style={{ width: `${Math.max((row.value / maxValue) * 100, 20)}%`, backgroundColor: row.color, color: row.color === '#F3F4F6' ? '#6B7280' : '#111827' }}
              >
                {row.value} Orders
              </div>
            </div>
            <span className="text-right text-[15px] font-medium text-foreground">{row.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
