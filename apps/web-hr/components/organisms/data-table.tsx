'use client';

import { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  RowActionsMenu,
  RowContextMenu,
  type RowActionItem,
} from '@/components/molecules/row-actions';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  /** Selection — pass all three to enable the checkbox column + select-all. */
  selectedKeys?: Set<string>;
  onToggleKey?: (key: string) => void;
  onToggleAll?: () => void;
  /** Kebab + right-click row actions (§2.11). */
  rowActions?: (row: T) => RowActionItem[];
  /** Keyboard focus highlight (driven by HrListLayout keyboardRows). */
  focusedIndex?: number;
  /** Row open (click / Enter). */
  onRowOpen?: (row: T) => void;
}

/** List table for HR screens with optional selection, kebab/right-click row
 *  actions, and keyboard focus highlight. Read-only when those props are
 *  omitted (backward compatible). */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectedKeys,
  onToggleKey,
  onToggleAll,
  rowActions,
  focusedIndex,
  onRowOpen,
}: DataTableProps<T>) {
  const selectable = !!(selectedKeys && onToggleKey && onToggleAll);
  const allSelected = selectable && rows.length > 0 && rows.every((r, i) => selectedKeys!.has(rowKey(r, i)));

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            {selectable && (
              <th className="w-9 px-3 py-2 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onToggleAll!()}
                  aria-label="Pilih semua"
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
            {rowActions && <th className="w-9 px-3 py-2" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = rowKey(row, i);
            const selected = selectable && selectedKeys!.has(key);
            const focused = focusedIndex === i;
            const actions = rowActions?.(row);

            const tr = (
              <tr
                key={key}
                className={cn(
                  'border-b last:border-0',
                  onRowOpen && 'cursor-pointer',
                  selected ? 'bg-primary/5' : 'hover:bg-muted/30',
                  focused && 'bg-accent/60 shadow-[inset_2px_0_0_var(--primary)]',
                )}
                onClick={onRowOpen ? () => onRowOpen(row) : undefined}
              >
                {selectable && (
                  <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => onToggleKey!(key)}
                      aria-label="Pilih baris"
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-3 py-2 align-middle', c.className)}>
                    {c.render
                      ? c.render(row)
                      : String((row as Record<string, unknown>)[c.key] ?? '—')}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    {actions && actions.length > 0 && <RowActionsMenu items={actions} />}
                  </td>
                )}
              </tr>
            );

            return actions && actions.length > 0 ? (
              <RowContextMenu key={key} items={actions}>
                {tr}
              </RowContextMenu>
            ) : (
              tr
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
