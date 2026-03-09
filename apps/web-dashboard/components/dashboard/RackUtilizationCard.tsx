'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RackRow = {
  zone: string;
  utilization: number;
};

function getRackColor(utilization: number) {
  if (utilization >= 90) return 'bg-rose-500';
  if (utilization >= 75) return 'bg-amber-500';
  if (utilization >= 50) return 'bg-blue-500';
  return 'bg-emerald-500';
}

export function RackUtilizationCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: RackRow[];
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-1">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {rows.map((row) => (
            <div key={row.zone} className="rounded-xl border border-border/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">{row.zone}</p>
                <span className="text-xs font-medium text-muted-foreground">{row.utilization}%</span>
              </div>
              <div className="h-16 rounded-lg bg-muted/50 p-2">
                <div className={`h-full rounded-md ${getRackColor(row.utilization)}`} style={{ opacity: Math.min(1, Math.max(0.28, row.utilization / 100)) }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
