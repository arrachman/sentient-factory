'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimelineRow = {
  line: string;
  prep: number;
  execution: number;
  pickup: number;
  finishLabel?: string;
};

export function ProductionTimelineCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: TimelineRow[];
}) {
  const totalMax = Math.max(...rows.map((row) => row.prep + row.execution + row.pickup), 1);

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {title}
        </CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        <div className="space-y-3">
          {rows.map((row) => {
            const total = row.prep + row.execution + row.pickup;
            return (
              <div key={row.line} className="grid grid-cols-[56px_1fr] items-center gap-3">
                <span className="text-sm text-muted-foreground">{row.line}</span>
                <div className="relative h-5 rounded-full bg-muted/40">
                  <div className="flex h-full overflow-hidden rounded-full" style={{ width: `${(total / totalMax) * 100}%` }}>
                    <div className="grid place-items-center bg-[#7AC943] text-[9px] font-semibold text-white" style={{ width: `${(row.prep / total) * 100}%` }}>
                      {row.prep ? 'Prep' : ''}
                    </div>
                    <div className="grid place-items-center bg-[#F39C3D] text-[9px] font-semibold text-white" style={{ width: `${(row.execution / total) * 100}%` }}>
                      {row.execution ? 'Prod' : ''}
                    </div>
                    <div className="grid place-items-center bg-[#B66BFF] text-[9px] font-semibold text-white" style={{ width: `${(row.pickup / total) * 100}%` }}>
                      {row.pickup ? 'Pickup' : ''}
                    </div>
                  </div>
                  {row.finishLabel ? (
                    <span className="absolute -top-5 right-0 rounded bg-foreground px-1.5 py-0.5 text-[9px] text-background">{row.finishLabel}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
