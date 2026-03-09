'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type QueueRow = {
  dock: string;
  warehouse: string;
  eta: string;
  job: string;
  status: 'queued' | 'loading' | 'ready';
};

const statusMeta = {
  queued: { variant: 'secondary' as const, label: 'Queued' },
  loading: { variant: 'warning' as const, label: 'Loading' },
  ready: { variant: 'success' as const, label: 'Ready' },
};

export function DockQueueCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: QueueRow[];
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-2.5 px-5 pb-5 pt-1">
        {rows.map((row) => {
          const meta = statusMeta[row.status];
          return (
            <div key={`${row.dock}-${row.eta}`} className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-3">
              <div>
                <p className="text-sm font-semibold">{row.dock} · {row.job}</p>
                <p className="text-xs text-muted-foreground">{row.warehouse} · ETA {row.eta}</p>
              </div>
              <Badge variant={meta.variant} appearance="light" size="xs">{meta.label}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
