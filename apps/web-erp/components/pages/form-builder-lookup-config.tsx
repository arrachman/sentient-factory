'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icons';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '@/components/ui/popover';
import {
  LOOKUP_SOURCE_OPTIONS, sourceLabelOf, BUILTIN_SOURCE,
} from '@/lib/lookup-source-registry';
import type { ErpFormField, FormFieldType } from '@/lib/api/form-fields';

const SORT_DIR_OPTIONS = [
  { value: 'asc',  label: 'A → Z' },
  { value: 'desc', label: 'Z → A' },
];

type FilterEntry = { key: string; value: string };

function filterToEntries(filter?: Record<string, unknown> | null): FilterEntry[] {
  if (!filter) return [];
  return Object.entries(filter).map(([key, value]) => ({ key, value: String(value) }));
}

function entriesToFilter(entries: FilterEntry[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const { key, value } of entries) {
    if (!key.trim()) continue;
    if (value === 'true')  { out[key] = true;  continue; }
    if (value === 'false') { out[key] = false; continue; }
    const n = Number(value);
    out[key] = Number.isNaN(n) ? value : n;
  }
  return out;
}

function FilterTable({
  entries,
  onChange,
}: {
  entries: FilterEntry[];
  onChange: (e: FilterEntry[]) => void;
}) {
  const set = (i: number, patch: Partial<FilterEntry>) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  return (
    <div className="flex flex-col gap-1">
      {entries.map((e, i) => (
        <div key={i} className="flex items-center gap-1">
          <Input
            className="h-6 px-1.5 py-0 text-xs w-28"
            placeholder="field"
            value={e.key}
            onChange={(ev) => set(i, { key: ev.target.value })}
          />
          <span className="text-xs text-muted-foreground">=</span>
          <Input
            className="h-6 px-1.5 py-0 text-xs w-28"
            placeholder="value"
            value={e.value}
            onChange={(ev) => set(i, { value: ev.target.value })}
          />
          <button
            type="button"
            className="iconbtn text-danger"
            onClick={() => onChange(entries.filter((_, idx) => idx !== i))}
          >
            <Icon name="trash" size={10} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn ghost text-xs h-6 px-2 self-start mt-0.5"
        onClick={() => onChange([...entries, { key: '', value: '' }])}
      >
        <Icon name="plus" size={11} /> Tambah filter
      </button>
    </div>
  );
}

export function LookupConfigPopover({
  field,
  onUpdate,
}: {
  field: ErpFormField;
  onUpdate: (patch: Partial<ErpFormField>) => void;
}) {
  const isLookup = field.fieldType === 'LOOKUP';
  const builtinSource = BUILTIN_SOURCE[field.fieldType as FormFieldType];
  const effectiveSource = isLookup ? field.lookupSource : builtinSource;

  const [sortField, sortDir] = (field.lookupDefaultSort ?? ':asc').split(':');
  const [filterEntries, setFilterEntries] = React.useState<FilterEntry[]>(
    () => filterToEntries(field.lookupDefaultFilter),
  );

  React.useEffect(() => {
    setFilterEntries(filterToEntries(field.lookupDefaultFilter));
  }, [field.fieldKey]);

  const commitFilter = (entries: FilterEntry[]) => {
    setFilterEntries(entries);
    onUpdate({ lookupDefaultFilter: entriesToFilter(entries) });
  };

  const hasConfig =
    (field.lookupDefaultFilter && Object.keys(field.lookupDefaultFilter).length > 0) ||
    !!field.lookupDefaultSort;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`iconbtn ${hasConfig ? 'text-primary' : 'text-muted-foreground'}`}
          title="Konfigurasi Lookup"
        >
          <Icon name="gear" size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 flex flex-col gap-4">
        <p className="text-xs font-semibold text-foreground">Konfigurasi Lookup</p>

        {/* Source selector — only editable for LOOKUP type */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Sumber data (MD)</span>
          {isLookup ? (
            <Select
              value={field.lookupSource ?? ''}
              onValueChange={(v) => onUpdate({ lookupSource: v || null })}
            >
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Pilih sumber…" /></SelectTrigger>
              <SelectContent>
                {LOOKUP_SOURCE_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs text-foreground px-2 py-0.5 bg-secondary/40 rounded">
              {sourceLabelOf(effectiveSource)}
            </span>
          )}
        </div>

        {/* Default Sort */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Urutan default</span>
          <div className="flex items-center gap-1">
            <Input
              className="h-7 px-2 text-xs flex-1"
              placeholder="field (e.g. name)"
              value={sortField ?? ''}
              onChange={(e) => onUpdate({ lookupDefaultSort: `${e.target.value}:${sortDir ?? 'asc'}` })}
            />
            <Select
              value={sortDir || 'asc'}
              onValueChange={(v) => onUpdate({ lookupDefaultSort: `${sortField ?? 'name'}:${v}` })}
            >
              <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORT_DIR_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Default Filter */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Filter default</span>
          <p className="text-[10px] text-muted-foreground/70">
            Nilai <code>true</code>/<code>false</code> = boolean; angka = number; lainnya = string.
          </p>
          <FilterTable entries={filterEntries} onChange={commitFilter} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
