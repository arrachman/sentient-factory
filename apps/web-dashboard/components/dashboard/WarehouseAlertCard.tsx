'use client';

import { BellRing, PackagePlus, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AlertRow = {
  title: string;
  warehouse: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
};

const severityMeta = {
  info: { icon: PackagePlus, variant: 'info' as const, label: 'Replenish' },
  warning: { icon: BellRing, variant: 'warning' as const, label: 'Monitor' },
  critical: { icon: ShieldAlert, variant: 'destructive' as const, label: 'Urgent' },
};

export function WarehouseAlertCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: AlertRow[];
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-2.5 px-5 pb-5 pt-1">
        {rows.map((row) => {
          const meta = severityMeta[row.severity];
          const Icon = meta.icon;

          return (
            <div key={`${row.title}-${row.warehouse}`} className="rounded-xl border border-border/70 px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-2 text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{row.title}</p>
                    <p className="text-xs font-medium text-muted-foreground">{row.warehouse}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
                  </div>
                </div>
                <Badge variant={meta.variant} appearance="light" size="xs">{meta.label}</Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
