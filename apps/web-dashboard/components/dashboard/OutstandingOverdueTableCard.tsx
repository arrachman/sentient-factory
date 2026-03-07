'use client';

import { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { OutstandingTableRow } from './types';

function StatusBadge({ status }: { status: string }) {
  if (status === 'In Process') {
    return (
      <Badge variant="warning" appearance="light" size="sm">
        In Process
      </Badge>
    );
  }

  if (status === 'Partially Delivered') {
    return (
      <Badge variant="info" appearance="light" size="sm">
        Partially Delivered
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" appearance="light" size="sm">
      Close
    </Badge>
  );
}

export function OutstandingOverdueTableCard({
  title,
  subtitle,
  rows,
  actionLabel,
}: {
  title: string;
  subtitle: string;
  rows: OutstandingTableRow[];
  actionLabel: string;
}) {
  const [isCompact, setIsCompact] = useState(false);
  const overdueCount = rows.filter((row) => row.flags.includes('D1')).length;

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs transition-shadow hover:shadow-sm">
      <CardHeader className="px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
            <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCompact((value) => !value)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/80 px-3.5 text-sm font-medium text-muted-foreground"
            >
              {isCompact ? 'Comfortable' : 'Compact'}
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/80 px-3.5 text-sm font-medium text-muted-foreground"
            >
              {actionLabel}
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        {overdueCount > 0 ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-rose-200/70 bg-rose-50/60 px-3 py-2 text-xs text-rose-700">
            <Badge variant="destructive" appearance="light" size="xs">
              Overdue
            </Badge>
            {overdueCount} PO melewati jatuh tempo. Prioritaskan tindak lanjut.
          </div>
        ) : null}
        <div className="overflow-x-auto rounded-xl border border-border/70">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reference No</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quantity</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Flag</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isOverdue = row.flags.includes('D1');
                const cellClass = isCompact ? 'py-2 text-xs' : 'py-3 text-sm';

                return (
                  <TableRow
                    key={row.referenceNumber}
                    className={cn('transition-colors hover:bg-muted/40', isOverdue && 'bg-rose-50/60')}
                  >
                    <TableCell className={cellClass}>{row.location}</TableCell>
                    <TableCell className={cn(cellClass, 'font-medium')}>{row.referenceNumber}</TableCell>
                    <TableCell className={cellClass}>{row.orderDate}</TableCell>
                    <TableCell className={cellClass}>{row.dueDate}</TableCell>
                    <TableCell className={cellClass}>{row.quantity}</TableCell>
                    <TableCell className={cellClass}>{row.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {row.flags.map((flag) => {
                          const variant = flag === 'D1' ? 'destructive' : flag === 'R1' ? 'warning' : 'secondary';

                          return (
                            <Badge
                              key={`${row.referenceNumber}-${flag}`}
                              variant={variant}
                              appearance="light"
                              size="xs"
                              title={flag === 'D1' ? 'Overdue' : flag === 'R1' ? 'Risk' : 'Flag'}
                            >
                              {flag}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <button type="button" className="text-primary transition-opacity hover:opacity-80">
                        <Eye className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing 1 to {rows.length} of {rows.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-md border border-border px-2.5 py-1 text-xs font-medium">
              {'<'}
            </button>
            <button type="button" className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              1
            </button>
            <button type="button" className="rounded-md border border-border px-2.5 py-1 text-xs font-medium">
              {'>'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
