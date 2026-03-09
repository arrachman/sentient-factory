'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductionListRow = {
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant?: 'info' | 'warning' | 'destructive';
};

export function ProductionListCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: ProductionListRow[];
}) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium leading-6">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-4 pt-1">
        {rows.map((row) => (
          <div key={`${row.title}-${row.subtitle}`} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{row.title}</p>
              <p className="text-xs text-muted-foreground">{row.subtitle}</p>
            </div>
            <Badge variant={row.badgeVariant ?? 'info'} appearance="light" size="xs">{row.badge}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
