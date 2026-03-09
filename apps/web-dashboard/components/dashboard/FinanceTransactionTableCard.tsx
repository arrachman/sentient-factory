'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type FinanceTransactionRow = {
  voucherNo: string;
  date: string;
  account: string;
  branch: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export function FinanceTransactionTableCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: FinanceTransactionRow[];
}) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-[16px] font-medium leading-[26px]">{title}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        <div className="overflow-hidden rounded-xl border border-border/70">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.voucherNo}>
                  <TableCell className="font-medium">{row.voucherNo}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'destructive'}
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
      </CardContent>
    </Card>
  );
}
