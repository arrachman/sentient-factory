'use client';

import type { QueryResult } from '../_types';

export function TableRenderer({ result }: { result: QueryResult }) {
  if (!result.columns.length || !result.rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Table data is not available yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90">
            <tr>
              {result.columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
            {result.rows.slice(0, 12).map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="bg-white dark:bg-slate-950">
                {result.columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="whitespace-nowrap px-3 py-2 text-slate-700 dark:text-slate-200"
                  >
                    {String(row[column] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
