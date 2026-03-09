'use client';

import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CoverageRow = {
  label: string;
  coverageDays: number;
  stockLevel: string;
  status: 'safe' | 'warning' | 'critical';
};

const statusMeta = {
  safe: {
    icon: CheckCircle2,
    badge: 'Aman',
    variant: 'success' as const,
    bar: 'bg-emerald-500',
  },
  warning: {
    icon: Clock3,
    badge: 'Perlu Monitor',
    variant: 'warning' as const,
    bar: 'bg-amber-500',
  },
  critical: {
    icon: AlertTriangle,
    badge: 'Kritis',
    variant: 'destructive' as const,
    bar: 'bg-rose-500',
  },
};

export function InventoryCoverageCard({
  title,
  subtitle,
  rows,
  maxDays = 30,
}: {
  title: string;
  subtitle: string;
  rows: CoverageRow[];
  maxDays?: number;
}) {
  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-1">
        {rows.map((row) => {
          const meta = statusMeta[row.status];
          const Icon = meta.icon;
          const width = Math.max(12, Math.min(100, (row.coverageDays / maxDays) * 100));

          return (
            <div key={row.label} className="rounded-xl border border-border/70 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.stockLevel}</p>
                </div>
                <Badge variant={meta.variant} appearance="light" size="xs">
                  <Icon className="size-3.5" />
                  {meta.badge}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 rounded-full bg-muted/60">
                  <div className={`h-2.5 rounded-full ${meta.bar}`} style={{ width: `${width}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Coverage</span>
                  <span className="font-medium text-foreground">{row.coverageDays} hari</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
