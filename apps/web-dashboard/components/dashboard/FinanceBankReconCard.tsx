'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReconRow = {
  bank: string;
  matched: number;
  unmatched: number;
};

export function FinanceBankReconCard({ title, subtitle, rows }: { title: string; subtitle: string; rows: ReconRow[] }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-2">
        {rows.map((row) => {
          const total = row.matched + row.unmatched || 1;
          return (
            <div key={row.bank} className="space-y-1.5 rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{row.bank}</span>
                <span className="text-muted-foreground">{row.matched}/{total} matched</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                <div className="h-full bg-[#22C55E]" style={{ width: `${(row.matched / total) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Matched: {row.matched}</span>
                <span>Unmatched: {row.unmatched}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
