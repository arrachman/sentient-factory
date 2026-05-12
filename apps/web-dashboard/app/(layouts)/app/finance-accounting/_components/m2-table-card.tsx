'use client';

/**
 * Detail table card — sample 20 transaksi terakhir. Kolom auto-detected
 * dari row pertama (slice 8 kolom). Numeric formatting per kolom.
 */
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
} from './m2-utils';
import type { M2FeatureCopy } from './m2-feature-copy';

export function M2TableCard({
  copy,
  tableRows,
}: {
  copy: M2FeatureCopy;
  tableRows: Record<string, unknown>[];
}) {
  const tableColumns =
    tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{copy.tableTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {tableColumns.length === 0 ? (
          <p className="text-sm text-muted-foreground">{copy.emptyTableText}</p>
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
