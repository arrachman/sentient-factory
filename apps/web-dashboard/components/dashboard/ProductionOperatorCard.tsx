'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type OperatorRow = {
  name: string;
  line: string;
  value?: number;
};

export function ProductionOperatorListCard({ title, rows }: { title: string; rows: OperatorRow[] }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-4 pt-1">
        {rows.map((row) => (
          <div key={`${row.name}-${row.line}`} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-full bg-orange-100 text-orange-500">👷</div>
              <div>
                <p className="text-sm font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.line}</p>
              </div>
            </div>
            <span className="rounded bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">{row.line}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProductionOperatorPerformanceCard({ title, rows }: { title: string; rows: OperatorRow[] }) {
  const max = Math.max(...rows.map((row) => row.value ?? 0), 1);

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-1">
        {rows.map((row) => (
          <div key={`${row.name}-${row.line}`} className="grid grid-cols-[88px_1fr] items-center gap-3">
            <div>
              <p className="text-xs font-medium">{row.name}</p>
              <p className="text-[11px] text-muted-foreground">{row.line}</p>
            </div>
            <div className="relative h-5 rounded bg-muted/40">
              <div className="grid h-full place-items-center rounded bg-[#2563EB] text-[10px] font-semibold text-white" style={{ width: `${((row.value ?? 0) / max) * 100}%` }}>
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
