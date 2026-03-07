'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DeliveryOverdueRow = {
  doId: string;
  customerCode: string;
  customer: string;
  plannedDate: string;
  actualDate: string;
  daysLate: string;
  status: 'Need Delivery' | 'On Delivery';
};

export function DeliveryOverdueTableCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: DeliveryOverdueRow[];
}) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {title}
        </CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3">
        <div className="overflow-hidden rounded-xl border border-border/70">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DO ID</TableHead>
                <TableHead>Code Cust.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Planned Date</TableHead>
                <TableHead>Actual Date</TableHead>
                <TableHead>Days Late</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.doId}-${row.customerCode}`}>
                  <TableCell>{row.doId}</TableCell>
                  <TableCell>{row.customerCode}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.plannedDate}</TableCell>
                  <TableCell>{row.actualDate}</TableCell>
                  <TableCell>{row.daysLate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === 'Need Delivery' ? 'warning' : 'secondary'}
                      appearance="light"
                      size="xs"
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing 1 to {rows.length} of {rows.length} entries</p>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-md border border-border px-2.5 py-1 text-xs font-medium">{'<'}</button>
            <button type="button" className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">1</button>
            <button type="button" className="rounded-md border border-border px-2.5 py-1 text-xs font-medium">{'>'}</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
