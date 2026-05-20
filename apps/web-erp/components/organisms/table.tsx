import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Dense data-grid table primitives. Mirrors prototype `.lines table` /
 * `.tbl` — 12px text, sticky muted header, hover row tint, compact
 * cell padding. Use `numeric` on Th/Td for right-aligned mono numbers.
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      'w-full border-separate border-spacing-0 text-xs text-foreground',
      className,
    )}
    {...props}
  />
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      '[&_td]:border-t [&_td]:border-border [&_td]:bg-secondary [&_td]:font-medium',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors hover:[&>td]:bg-[color-mix(in_oklab,var(--panel-hover)_60%,transparent)]',
      'data-[selected=true]:[&>td]:!bg-[var(--primary-soft)]',
      // focused row: full 1px primary outline only (no bg tint)
      'data-[focused=true]:[&>td]:shadow-[inset_0_1px_0_var(--primary),inset_0_-1px_0_var(--primary)]',
      // focused + hover → primary-soft bg (override gray hover)
      'data-[focused=true]:hover:[&>td]:!bg-[var(--primary-soft)]',
      'data-[focused=true]:[&>td:first-child]:shadow-[inset_1px_1px_0_var(--primary),inset_0_-1px_0_var(--primary),inset_1px_-1px_0_var(--primary)]',
      'data-[focused=true]:[&>td:last-child]:shadow-[inset_0_1px_0_var(--primary),inset_-1px_0_0_var(--primary),inset_-1px_-1px_0_var(--primary)]',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }
>(({ className, numeric, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'sticky top-0 z-10 border-b border-border bg-secondary px-2.5 py-0 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground',
      numeric && 'text-right',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }
>(({ className, numeric, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'border-b border-border px-2.5 py-0',
      numeric &&
        'text-right font-mono tabular-nums',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

/** Checkbox header cell for the select-all column. */
export function CheckboxHead({
  checked,
  onCheckedChange,
}: {
  checked: boolean | 'indeterminate';
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <TableHead className="w-8 align-middle">
      <div className="flex items-center justify-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          aria-label="Pilih semua"
        />
      </div>
    </TableHead>
  );
}

/** Checkbox data cell for a selectable row. */
export function CheckboxCell({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <TableCell className="w-8 align-middle" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          aria-label="Pilih baris"
        />
      </div>
    </TableCell>
  );
}

/**
 * Code cell rendered as a clickable blue link. Canonical pattern per
 * `apps/web-erp/CLAUDE.md` — KODE column is the entity's primary link
 * to open detail/edit. Stops row-click propagation.
 */
export function CodeLinkCell({
  code,
  onOpen,
  className,
}: {
  code: string;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <TableCell className={cn('mono', className)}>
      <button
        type="button"
        className="bg-transparent border-0 p-0 m-0 text-primary font-[inherit] hover:underline focus:underline focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {code}
      </button>
    </TableCell>
  );
}

/** Full-width empty-state cell. Mirrors prototype `.tbl-empty`. */
export function TableEmpty({
  colSpan,
  children = 'Tidak ditemukan',
  className,
}: {
  colSpan: number;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(
          'border-b border-border px-2.5 py-8 text-center text-muted-foreground',
          className,
        )}
      >
        {children}
      </td>
    </tr>
  );
}
