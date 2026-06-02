'use client';

/**
 * One cell of the cash/bank contra-account grid, rendered from a GridCol
 * descriptor (Kustomisasi Grid). Default = SELECTED display cell (plain text);
 * only the edited cell renders its real control (SearchSelect / NumInput /
 * DateInput / Input / DiscountInput / StepperInput / ComboboxInput / Textarea
 * / Checkbox), auto-focused.
 *
 * Editor selection priority: col.cellEditor (semantic) → col.dataType (storage).
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input, Textarea } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { NumInput } from '@/components/molecules/num-input';
import { DateInput } from '@/components/ui/date-input';
import { SearchSelect } from '@/components/molecules/search-select';
import { DiscountInput } from '@/components/molecules/discount-input';
import { StepperInput } from '@/components/molecules/stepper-input';
import { ComboboxInput } from '@/components/molecules/combobox-input';
import { TableCell } from '@/components/organisms/table';
import {
  loadAccountOptionsCoded,
  loadPartnerOptions,
} from '@/components/pages/items-form-lookups';
import {
  gridLookupLoader, canonicalSource, DEFAULT_LOOKUP_LOADER,
} from '@/lib/grid-lookup-loaders';
import { formatNumber } from '@/lib/format';
import { formatDate } from '@/lib/date-format';
import type { GridCol } from './cash-bank-line-model';

type Loader = (s: string, p: number, l: number) => Promise<{ data: { value: string; label: string; code?: unknown }[]; total: number }>;

// Lazy-fetch label maps for small lookups (not accounts — too large).
const labelCache = new Map<string, Promise<Map<string, string>>>();
function resolveLabelMap(source: string): Promise<Map<string, string>> {
  const key = canonicalSource(source);
  let p = labelCache.get(key);
  if (!p) {
    const loader = gridLookupLoader(source);
    p = loader
      ? loader('', 1, 500).then((r) => new Map(r.data.map((o) => [o.value, o.label])))
      : Promise.resolve(new Map());
    labelCache.set(key, p);
  }
  return p;
}

function LookupLabel({ source, value, fallback }: { source?: string | null; value: string; fallback?: string }) {
  const [label, setLabel] = React.useState(fallback ?? '');
  React.useEffect(() => {
    // Accounts use the stored label (catalog too large to map eagerly).
    if (fallback || !value || !source || canonicalSource(source) === 'accounts') return;
    let alive = true;
    resolveLabelMap(source).then((m) => { if (alive) setLabel(m.get(value) ?? ''); });
    return () => { alive = false; };
  }, [source, value, fallback]);
  return <>{label || value}</>;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LineCellProps {
  col: GridCol;
  value: string;
  label?: string;
  /** 0-based row position — rendered (1-based) by the ROWNUM column type. */
  rowIndex?: number;
  selected: boolean;
  editing: boolean;
  seed?: string;
  selectOnFocus: boolean;
  onSet: (value: string, label?: string) => void;
  onSelect: () => void;
  onEdit: () => void;
  onEndEdit: (focusRoot: boolean) => void;
}

// ─── Edit controls ────────────────────────────────────────────────────────────

function effectiveEditor(col: GridCol): string {
  if (col.cellEditor) return col.cellEditor;
  switch (col.dataType) {
    case 'NUMBER': return 'NUMBER';
    case 'DATE':   return 'DATE';
    case 'LOOKUP': return 'LOOKUP';
    default:       return 'TEXT';
  }
}

function EditControl({ col, value, label, rowIndex, seed, selectOnFocus, onSet, onEndEdit }: LineCellProps) {
  const editor = effectiveEditor(col);

  switch (editor) {
    case 'ROWNUM':
      // Auto sequence — read-only, never truly entered (column forced non-editable).
      return (
        <div className="flex h-[var(--row-h)] items-center justify-center tabular-nums text-[var(--fg-subtle)]">
          {(rowIndex ?? 0) + 1}
        </div>
      );

    case 'LOOKUP':
      return (
        <SearchSelect
          autoFocus
          initialQuery={seed}
          placeholder="Pilih…"
          value={value}
          initialLabel={label}
          onValueChange={(v) => onSet(v)}
          onPick={(o) => { onSet(o.value, o.label); onEndEdit(true); }}
          loadOptions={gridLookupLoader(col.lookupSource) ?? DEFAULT_LOOKUP_LOADER}
        />
      );

    case 'ACCOUNT_PICKER':
      return (
        <SearchSelect
          autoFocus
          initialQuery={seed}
          placeholder="Pilih akun…"
          value={value}
          initialLabel={label}
          onValueChange={(v) => onSet(v)}
          onPick={(o) => { onSet(o.value, o.label); onEndEdit(true); }}
          loadOptions={loadAccountOptionsCoded as unknown as Loader}
        />
      );

    case 'PARTNER_PICKER':
      return (
        <SearchSelect
          autoFocus
          initialQuery={seed}
          placeholder="Pilih partner…"
          value={value}
          initialLabel={label}
          onValueChange={(v) => onSet(v)}
          onPick={(o) => { onSet(o.value, o.label); onEndEdit(true); }}
          loadOptions={loadPartnerOptions as unknown as Loader}
        />
      );

    case 'NUMBER':
      return (
        <NumInput
          autoFocus
          decimals={2}
          value={value}
          onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
          onChange={(raw) => onSet(raw)}
        />
      );

    case 'DISCOUNT':
      return (
        <DiscountInput
          autoFocus
          value={value}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => { if (selectOnFocus) e.currentTarget.select(); }}
          onChange={(raw) => onSet(raw)}
        />
      );

    case 'STEPPER':
      return (
        <StepperInput
          autoFocus
          value={value}
          onChange={(raw) => onSet(raw)}
          decimals={0}
        />
      );

    case 'COMBOBOX':
      return (
        <ComboboxInput
          autoFocus
          value={value}
          options={col.options ?? []}
          onChange={(v) => onSet(v)}
          onCommit={() => onEndEdit(true)}
        />
      );

    case 'DATE':
      return <DateInput value={value} onChange={(v) => onSet(v)} />;

    case 'TEXTAREA':
      return (
        <Textarea
          autoFocus
          value={value}
          rows={2}
          onChange={(e) => onSet(e.target.value)}
          onBlur={() => onEndEdit(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onEndEdit(false);
          }}
        />
      );

    case 'CHECKBOX':
      return (
        <div className="flex h-[var(--row-h)] items-center justify-center">
          <Checkbox
            checked={value === 'true' || value === '1'}
            onCheckedChange={(v) => { onSet(v ? 'true' : 'false'); onEndEdit(true); }}
          />
        </div>
      );

    case 'NONE':
      return (
        <div className="flex h-[var(--row-h)] items-center px-[10px] text-[var(--fg-subtle)]">
          {value || '—'}
        </div>
      );

    default:
      return (
        <Input
          autoFocus
          value={value}
          onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
          onChange={(e) => onSet(e.target.value)}
        />
      );
  }
}

// ─── Display cell ─────────────────────────────────────────────────────────────

function displayCell(col: GridCol, value: string, label?: string, rowIndex?: number): { node: React.ReactNode; muted: boolean } {
  const editor = effectiveEditor(col);

  // Auto sequence — derived from row position, ignores the (empty) cell value.
  if (editor === 'ROWNUM') {
    return { node: (rowIndex ?? 0) + 1, muted: true };
  }

  if (!value) {
    const ph =
      editor === 'LOOKUP' || editor === 'ACCOUNT_PICKER' || editor === 'PARTNER_PICKER' ? 'Pilih…'
      : editor === 'NUMBER' || editor === 'DISCOUNT' || editor === 'STEPPER' ? '0'
      : editor === 'CHECKBOX' ? '—'
      : editor === 'NONE' ? ''
      : '—';
    return { node: ph, muted: true };
  }

  switch (editor) {
    case 'LOOKUP':
      return { node: <LookupLabel source={col.lookupSource} value={value} fallback={label} />, muted: false };
    case 'ACCOUNT_PICKER':
      return { node: label || value, muted: false };
    case 'PARTNER_PICKER':
      return { node: <LookupLabel source="partner" value={value} fallback={label} />, muted: false };
    case 'NUMBER':
    case 'STEPPER':
      return { node: formatNumber(Number(value || 0), 0), muted: false };
    case 'DISCOUNT':
      return { node: `${formatNumber(Number(value || 0), 2)} %`, muted: false };
    case 'DATE':
      return { node: formatDate(value), muted: false };
    case 'CHECKBOX':
      return {
        node: (
          <span style={{ color: (value === 'true' || value === '1') ? 'var(--primary)' : 'var(--fg-subtle)', fontWeight: 600 }}>
            {(value === 'true' || value === '1') ? '✓' : '—'}
          </span>
        ),
        muted: false,
      };
    case 'NONE':
      return { node: value, muted: false };
    default:
      return { node: value, muted: false };
  }
}

// ─── LineCell ─────────────────────────────────────────────────────────────────

export function LineCell(props: LineCellProps) {
  const { col, value, label, rowIndex, selected, editing, onSelect, onEdit, onEndEdit } = props;
  const editor = effectiveEditor(col);
  const numeric = editor === 'NUMBER' || editor === 'DISCOUNT' || editor === 'STEPPER';
  const isRownum = editor === 'ROWNUM';
  // "Skip" flag (Kustomisasi Grid) → cell can never be focused/selected/edited.
  const skippable = !!col.isSkippable;

  return (
    <TableCell
      className={cn('p-0 align-middle', selected && !editing && !skippable && 'shadow-[inset_0_0_0_2px_var(--primary)]')}
    >
      {editing && !skippable ? (
        <div
          className="px-[10px]"
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onEndEdit(false); }}
        >
          <EditControl {...props} />
        </div>
      ) : (
        <div
          role={skippable ? undefined : 'button'}
          tabIndex={-1}
          onClick={skippable ? undefined : onSelect}
          onDoubleClick={skippable ? undefined : onEdit}
          className={cn(
            'flex h-[var(--row-h)] w-full select-none items-center truncate px-[10px]',
            skippable ? 'cursor-default opacity-70' : 'cursor-pointer',
            numeric && 'justify-end tabular-nums',
            (isRownum || editor === 'CHECKBOX') && 'justify-center',
            isRownum && 'tabular-nums',
          )}
        >
          {(() => {
            const { node, muted } = displayCell(col, value, label, rowIndex);
            return <span className={cn('truncate', muted && 'text-[var(--fg-subtle)]')}>{node}</span>;
          })()}
        </div>
      )}
    </TableCell>
  );
}
