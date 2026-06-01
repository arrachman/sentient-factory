'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icons';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  LOOKUP_SOURCE_OPTIONS, sourceLabelOf, BUILTIN_SOURCE, getSourceSchema,
} from '@/lib/lookup-source-registry';
import type { FilterFieldDef } from '@/lib/lookup-source-registry';
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
  filterFields,
}: {
  entries: FilterEntry[];
  onChange: (e: FilterEntry[]) => void;
  filterFields?: FilterFieldDef[];
}) {
  const set = (i: number, patch: Partial<FilterEntry>) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e, i) => {
        const fieldDef = filterFields?.find((f) => f.key === e.key);
        return (
          <div key={i} className="flex items-center gap-1.5">
            {filterFields ? (
              <Select value={e.key || ''} onValueChange={(v) => set(i, { key: v, value: '' })}>
                <SelectTrigger className="h-7 text-xs w-[140px] shrink-0">
                  <SelectValue placeholder="Pilih field…" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map((f) => (
                    <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="h-7 px-2 text-xs w-[140px] shrink-0"
                placeholder="field"
                value={e.key}
                onChange={(ev) => set(i, { key: ev.target.value })}
              />
            )}
            <span className="text-xs text-muted-foreground shrink-0">=</span>
            {fieldDef?.type === 'boolean' ? (
              <Select value={e.value} onValueChange={(v) => set(i, { value: v })}>
                <SelectTrigger className="h-7 text-xs flex-1 min-w-0">
                  <SelectValue placeholder="nilai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">false</SelectItem>
                </SelectContent>
              </Select>
            ) : fieldDef?.type === 'enum' && fieldDef.options ? (
              <Select value={e.value} onValueChange={(v) => set(i, { value: v })}>
                <SelectTrigger className="h-7 text-xs flex-1 min-w-0">
                  <SelectValue placeholder="nilai" />
                </SelectTrigger>
                <SelectContent>
                  {fieldDef.options.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="h-7 px-2 text-xs flex-1"
                placeholder="value"
                value={e.value}
                onChange={(ev) => set(i, { value: ev.target.value })}
              />
            )}
            <button
              type="button"
              className="iconbtn text-muted-foreground hover:text-danger shrink-0"
              onClick={() => onChange(entries.filter((_, idx) => idx !== i))}
            >
              <Icon name="trash" size={12} />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="btn ghost text-xs h-7 px-2 self-start"
        onClick={() => onChange([...entries, { key: filterFields?.[0]?.key ?? '', value: '' }])}
      >
        <Icon name="plus" size={11} /> Tambah filter
      </button>
    </div>
  );
}

/** True when a lookup field has any source/sort/filter config set (for gear highlight). */
export function hasLookupConfig(field: ErpFormField): boolean {
  return (
    (!!field.lookupDefaultFilter && Object.keys(field.lookupDefaultFilter).length > 0) ||
    !!field.lookupDefaultSort
  );
}

/** Lookup source + default sort + default filter editor. Body only (no popover wrapper). */
export function LookupConfigSection({
  field,
  onUpdate,
}: {
  field: ErpFormField;
  onUpdate: (patch: Partial<ErpFormField>) => void;
}) {
  const isLookup = field.fieldType === 'LOOKUP';
  const builtinSource = BUILTIN_SOURCE[field.fieldType as FormFieldType];
  const effectiveSource = isLookup ? field.lookupSource : builtinSource;
  const schema = getSourceSchema(effectiveSource);

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

  return (
    <>
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
            <span className="flex h-7 items-center rounded-md border border-border bg-secondary/30 px-2 text-xs text-foreground">
              {sourceLabelOf(effectiveSource)}
            </span>
          )}
        </div>

        {/* Default Sort */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Urutan default</span>
          <div className="flex items-center gap-2">
            {schema ? (
              <Select
                value={sortField ?? ''}
                onValueChange={(v) => onUpdate({ lookupDefaultSort: `${v}:${sortDir ?? 'asc'}` })}
              >
                <SelectTrigger className="h-8 text-xs flex-1 min-w-0"><SelectValue placeholder="Pilih field…" /></SelectTrigger>
                <SelectContent>
                  {schema.sortFields.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label} · {f.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="h-8 px-2 text-xs flex-1"
                placeholder="field (e.g. name)"
                value={sortField ?? ''}
                onChange={(e) => onUpdate({ lookupDefaultSort: `${e.target.value}:${sortDir ?? 'asc'}` })}
              />
            )}
            <Select
              value={sortDir || 'asc'}
              onValueChange={(v) => onUpdate({ lookupDefaultSort: `${sortField ?? 'name'}:${v}` })}
            >
              <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
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
          {!schema && (
            <p className="text-[10px] text-muted-foreground/70">
              Nilai <code>true</code>/<code>false</code> = boolean; angka = number; lainnya = string.
            </p>
          )}
          <FilterTable entries={filterEntries} onChange={commitFilter} filterFields={schema?.filterFields} />
        </div>
    </>
  );
}
