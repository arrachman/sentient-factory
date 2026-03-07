'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TopAmountRow } from './types';

export function TopAmountCard({
  title,
  subtitle,
  rows,
  minimal = false,
}: {
  title: string;
  subtitle: string;
  rows: TopAmountRow[];
  minimal?: boolean;
}) {
  return (
    <Card className="lg:col-span-4 h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        {minimal ? null : <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className={cn('px-5 pb-3 pt-2.5 flex flex-col', minimal ? 'gap-1' : 'gap-1.5')}>
        <div className={cn('flex flex-1 flex-col', minimal ? 'gap-1 justify-between' : 'gap-1.5')}>
          {rows.map((supplier) => (
            <div
              key={supplier.code}
              className="flex items-center justify-between rounded-xl border border-border/80 px-2.5 py-2 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-600">
                  {supplier.initials}
                </div>
                <div>
                  <p className="text-[13px] font-medium">{supplier.name}</p>
                  {minimal ? null : <p className="text-[11px] text-muted-foreground">{supplier.code}</p>}
                </div>
              </div>
              <Badge variant="info" appearance="outline" size="xs">
                {supplier.amount}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
