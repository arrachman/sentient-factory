'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PostingRow = {
  label: string;
  value: number;
  color: string;
};

export function FinancePostingStatusCard({ title, subtitle, rows }: { title: string; subtitle: string; rows: PostingRow[] }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-2">
        {rows.map((row) => (
          <div key={row.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/40">
              <div className="h-full rounded-full" style={{ width: `${(row.value / total) * 100}%`, backgroundColor: row.color }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
