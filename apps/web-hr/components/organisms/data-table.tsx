import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

/** Minimal read-only table for HR list screens. Richer grid (TanStack Table,
 *  bulk/keyboard nav) can be added per-screen as needs grow. */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${c.className ?? ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)} className="border-b last:border-0 hover:bg-muted/30">
              {columns.map((c) => (
                <td key={c.key} className={`px-3 py-2 align-middle ${c.className ?? ''}`}>
                  {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
