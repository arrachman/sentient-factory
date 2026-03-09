'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type OverdueRow = {
  invoiceNo: string;
  party: string;
  dueDate: string;
  amount: string;
  daysLate: string;
  type: 'AR' | 'AP';
};

export function FinanceOverdueInvoiceCard({ title, subtitle, rows }: { title: string; subtitle: string; rows: OverdueRow[] }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-2">
        {rows.map((row) => (
          <div key={row.invoiceNo} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{row.invoiceNo}</p>
                <Badge variant={row.type === 'AR' ? 'info' : 'warning'} appearance="light" size="xs">{row.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{row.party} · Due {row.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{row.amount}</p>
              <p className="text-[11px] text-rose-500">{row.daysLate}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
