'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  fmt,
  fmtMoney,
  isIntegerColumn,
  isMonetaryColumn,
  isNumericLike,
} from './m2-types';

type M2TransactionTableProps = {
  tableTitle: string;
  emptyTableText: string;
  tableRows: Record<string, unknown>[];
};

export function M2TransactionTable({
  tableTitle,
  emptyTableText,
  tableRows,
}: M2TransactionTableProps) {
  const tableColumns =
    tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{tableTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {tableColumns.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyTableText}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.slice(0, 20).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {tableColumns.map((column) => (
                    <TableCell
                      key={`${rowIndex}-${column}`}
                      className={
                        isNumericLike(row[column])
                          ? 'text-right font-medium tabular-nums'
                          : 'max-w-[220px] truncate'
                      }
                      title={String(row[column] ?? '-')}
                    >
                      {isNumericLike(row[column])
                        ? isMonetaryColumn(column)
                          ? fmtMoney(row[column], 2)
                          : isIntegerColumn(column)
                            ? fmt(row[column], 0)
                            : fmt(row[column], 2)
                        : String(row[column] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
