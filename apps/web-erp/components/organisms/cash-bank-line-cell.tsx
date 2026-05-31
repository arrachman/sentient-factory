'use client';

/**
 * One cell of the cash/bank contra-account grid, rendered from a GridCol
 * descriptor (Kustomisasi Grid). Default = SELECTED display cell (plain text);
 * only the edited cell renders its real control (SearchSelect / NumInput /
 * DateInput / Input), auto-focused.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { NumInput } from '@/components/molecules/num-input';
import { DateInput } from '@/components/ui/date-input';
import { SearchSelect } from '@/components/molecules/search-select';
import { TableCell } from '@/components/organisms/table';
import {
  loadAccountOptionsCoded, loadCostCenterOptions, loadDivisionOptions,
  loadSubDivisionOptions, loadProjectOptions,
} from '@/components/pages/items-form-lookups';
import { formatNumber } from '@/lib/format';
import { formatDate } from '@/lib/date-format';
import type { GridCol } from './cash-bank-line-model';

type Loader = (s: string, p: number, l: number) => Promise<{ data: { value: string; label: string; code?: unknown }[]; total: number }>;

const LOADERS: Record<string, Loader> = {
  account: loadAccountOptionsCoded as unknown as Loader,
  costCenter: loadCostCenterOptions as unknown as Loader,
  division: loadDivisionOptions as unknown as Loader,
  subdivision: loadSubDivisionOptions as unknown as Loader,
  project: loadProjectOptions as unknown as Loader,
};

// Resolve id→label for small master lookups (cost center / division / …) once,
// cached module-wide. Account labels come pre-enriched, so we skip fetching the
// (potentially huge) account list.
const labelCache = new Map<string, Promise<Map<string, string>>>();
function resolveLabelMap(source: string): Promise<Map<string, string>> {
  let p = labelCache.get(source);
  if (!p) {
    const loader = LOADERS[source];
    p = loader
      ? loader('', 1, 500).then((r) => new Map(r.data.map((o) => [o.value, o.label])))
      : Promise.resolve(new Map());
    labelCache.set(source, p);
  }
  return p;
}

function LookupLabel({ source, value, fallback }: { source?: string | null; value: string; fallback?: string }) {
  const [label, setLabel] = React.useState(fallback ?? '');
  React.useEffect(() => {
    if (fallback || !value || !source || source === 'account') return;
    let alive = true;
    resolveLabelMap(source).then((m) => { if (alive) setLabel(m.get(value) ?? ''); });
    return () => { alive = false; };
  }, [source, value, fallback]);
  return <>{label || value}</>;
}

export interface LineCellProps {
  col: GridCol;
  value: string;
  label?: string;
  selected: boolean;
  editing: boolean;
  seed?: string;
  selectOnFocus: boolean;
  onSet: (value: string, label?: string) => void;
  onSelect: () => void;
  onEdit: () => void;
  onEndEdit: (focusRoot: boolean) => void;
}

function EditControl({ col, value, label, seed, selectOnFocus, onSet, onEndEdit }: LineCellProps) {
  switch (col.dataType) {
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
          loadOptions={LOADERS[col.lookupSource ?? ''] ?? loadAccountOptionsCoded}
        />
      );
    case 'NUMBER':
      return (
        <NumInput
          autoFocus decimals={2} value={value}
          onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
          onChange={(raw) => onSet(raw)}
        />
      );
    case 'DATE':
      return <DateInput value={value} onChange={(v) => onSet(v)} />;
    default:
      return (
        <Input
          autoFocus value={value}
          onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
          onChange={(e) => onSet(e.target.value)}
        />
      );
  }
}

function displayCell(col: GridCol, value: string, label?: string): { node: React.ReactNode; muted: boolean } {
  if (!value) {
    const ph = col.dataType === 'LOOKUP' ? 'Pilih…' : col.dataType === 'NUMBER' ? '0,00' : '—';
    return { node: ph, muted: true };
  }
  switch (col.dataType) {
    case 'LOOKUP': return { node: <LookupLabel source={col.lookupSource} value={value} fallback={label} />, muted: false };
    case 'NUMBER': return { node: formatNumber(Number(value || 0), 2), muted: false };
    case 'DATE': return { node: formatDate(value), muted: false };
    default: return { node: value, muted: false };
  }
}

export function LineCell(props: LineCellProps) {
  const { col, value, label, selected, editing, onSelect, onEdit, onEndEdit } = props;
  const numeric = col.dataType === 'NUMBER';

  return (
    <TableCell
      className={cn('p-0 align-middle', selected && !editing && 'shadow-[inset_0_0_0_2px_var(--primary)]')}
    >
      {editing ? (
        <div
          className="px-[10px]"
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onEndEdit(false); }}
        >
          <EditControl {...props} />
        </div>
      ) : (
        <div
          role="button"
          tabIndex={-1}
          onClick={onSelect}
          onDoubleClick={onEdit}
          className={cn(
            'flex h-[var(--row-h)] w-full cursor-pointer select-none items-center truncate px-[10px]',
            numeric && 'justify-end tabular-nums',
          )}
        >
          {(() => {
            const { node, muted } = displayCell(col, value, label);
            return <span className={cn('truncate', muted && 'text-[var(--fg-subtle)]')}>{node}</span>;
          })()}
        </div>
      )}
    </TableCell>
  );
}
