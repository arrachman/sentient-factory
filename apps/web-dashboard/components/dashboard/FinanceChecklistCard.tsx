'use client';

import { CheckCircle2, CircleDashed, Clock3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ChecklistRow = {
  label: string;
  status: 'done' | 'progress' | 'pending';
};

export function FinanceChecklistCard({ title, subtitle, rows }: { title: string; subtitle: string; rows: ChecklistRow[] }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2">
            {row.status === 'done' ? (
              <CheckCircle2 className="size-4 text-green-500" />
            ) : row.status === 'progress' ? (
              <Clock3 className="size-4 text-amber-500" />
            ) : (
              <CircleDashed className="size-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{row.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
