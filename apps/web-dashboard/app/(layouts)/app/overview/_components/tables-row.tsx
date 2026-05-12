import {
  fmtCompactNumber,
  fmtDate,
  fmtNumber,
} from '@/app/(layouts)/app/model/logistic-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * 2 tabel sample: Trend rows + Breakdown rows.
 */
export function OverviewTablesRow({
  loading,
  trends,
  breakdown,
}: {
  loading: boolean;
  trends: Array<Record<string, unknown>>;
  breakdown: Array<Record<string, unknown>>;
}) {
  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trend Rows (sample)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead className="text-right">Metric</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : trends.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>Belum ada data tren.</TableCell>
                </TableRow>
              ) : (
                trends.slice(0, 12).map((row, index) => (
                  <TableRow
                    key={`${(row.period_date as string) ?? 'period'}-${index}`}
                  >
                    <TableCell>{fmtDate(row.period_date as string)}</TableCell>
                    <TableCell className="text-right">
                      {fmtNumber(row.total_rows, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmtCompactNumber(row.total_metric, 2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown Rows (sample)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead className="text-right">Metric</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : breakdown.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>Belum ada data breakdown.</TableCell>
                </TableRow>
              ) : (
                breakdown.slice(0, 12).map((row, index) => (
                  <TableRow
                    key={`${(row.group_key as string) ?? 'group'}-${index}`}
                  >
                    <TableCell>
                      {(row.group_key as string) || 'UNKNOWN'}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmtNumber(row.total_rows, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmtCompactNumber(row.total_metric, 2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * "Sample Records (Top 10)" — generic table dengan kolom auto-detected.
 */
export function SampleRecordsTable({
  loading,
  tableRows,
}: {
  loading: boolean;
  tableRows: Array<Record<string, unknown>>;
}) {
  const tableColumns =
    tableRows.length > 0 ? Object.keys(tableRows[0]).slice(0, 8) : [];
  const colspan = Math.max(tableColumns.length, 1);

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Sample Records (Top 10)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colspan}>Loading...</TableCell>
              </TableRow>
            ) : tableRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colspan}>
                  Belum ada data tabel.
                </TableCell>
              </TableRow>
            ) : (
              tableRows.map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {tableColumns.map((column) => (
                    <TableCell key={`${rowIndex}-${column}`}>
                      {String(row[column] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
