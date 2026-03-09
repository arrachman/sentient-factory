'use client';

import { ArrowDownToLine, ArrowUpFromLine, Boxes } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MovementMetric = {
  label: string;
  value: string;
  hint: string;
  tone: 'inbound' | 'outbound' | 'balance';
};

const toneMeta = {
  inbound: { icon: ArrowDownToLine, chip: 'bg-blue-100 text-blue-700' },
  outbound: { icon: ArrowUpFromLine, chip: 'bg-emerald-100 text-emerald-700' },
  balance: { icon: Boxes, chip: 'bg-amber-100 text-amber-700' },
};

export function InventoryMovementCard({
  title,
  subtitle,
  metrics,
}: {
  title: string;
  subtitle: string;
  metrics: MovementMetric[];
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="grid gap-3 px-5 pb-5 pt-1 md:grid-cols-3">
        {metrics.map((metric) => {
          const meta = toneMeta[metric.tone];
          const Icon = meta.icon;
          return (
            <div key={metric.label} className="rounded-xl border border-border/70 p-4">
              <div className={`mb-3 inline-flex rounded-full p-2 ${meta.chip}`}>
                <Icon className="size-4" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-xl font-bold tracking-tight">{metric.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{metric.hint}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
