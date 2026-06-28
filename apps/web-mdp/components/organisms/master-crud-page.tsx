'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import type { CrudResource, ListQuery } from '@/lib/api';

export type FieldType = 'text' | 'number' | 'time' | 'datetime' | 'select' | 'checkbox';

/** ISO timestamp → value for <input type="datetime-local"> (local tz, no seconds). */
function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export interface FieldDef {
  readonly key: string;
  readonly label: string;
  readonly type?: FieldType;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly options?: readonly { value: string; label: string }[];
  /** default for new records (checkbox → boolean, others → string). */
  readonly defaultValue?: string | boolean;
  /** grid span — `full` spans the row. */
  readonly span?: 'full';
}

export interface ColumnDef<T> {
  readonly key: string;
  readonly label: string;
  readonly align?: 'right';
  readonly render?: (row: T) => ReactNode;
}

export interface MasterCrudPageProps<T extends { id: string }> {
  readonly title: string;
  readonly subtitle?: string;
  readonly resource: CrudResource<T>;
  readonly columns: readonly ColumnDef<T>[];
  readonly fields: readonly FieldDef[];
  /** extra query params merged into list() (e.g. sort). */
  readonly listQuery?: ListQuery & Record<string, unknown>;
  /** label for the count line; defaults to "data". */
  readonly noun?: string;
}

type FormValues = Record<string, string | boolean>;

function emptyForm(fields: readonly FieldDef[]): FormValues {
  const out: FormValues = {};
  for (const f of fields) {
    out[f.key] = f.type === 'checkbox' ? (f.defaultValue ?? true) : (f.defaultValue ?? '');
  }
  return out;
}

function toPayload(fields: readonly FieldDef[], form: FormValues): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = form[f.key];
    if (f.type === 'checkbox') {
      out[f.key] = Boolean(raw);
      continue;
    }
    const str = String(raw ?? '').trim();
    if (str === '') {
      out[f.key] = f.required ? str : undefined;
    } else if (f.type === 'number') {
      out[f.key] = Number(str);
    } else if (f.type === 'datetime') {
      const d = new Date(str);
      out[f.key] = Number.isNaN(d.getTime()) ? str : d.toISOString();
    } else {
      out[f.key] = str;
    }
  }
  return out;
}

export function MasterCrudPage<T extends { id: string }>({
  title,
  subtitle,
  resource,
  columns,
  fields,
  listQuery,
  noun = 'data',
}: MasterCrudPageProps<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const baseQuery = useMemo(() => listQuery ?? {}, [listQuery]);

  const load = useCallback(
    async (term?: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await resource.list({ ...baseQuery, search: term?.trim() || undefined });
        setRows(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    },
    [resource, baseQuery]
  );

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm(fields));
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (row: T) => {
    const next: FormValues = {};
    for (const f of fields) {
      const v = (row as Record<string, unknown>)[f.key];
      if (f.type === 'checkbox') {
        next[f.key] = Boolean(v);
      } else if (f.type === 'datetime') {
        next[f.key] = v == null ? '' : isoToLocalInput(String(v));
      } else {
        next[f.key] = v == null ? '' : String(v);
      }
    }
    setEditingId(row.id);
    setForm(next);
    setFormError(null);
    setShowForm(true);
  };

  const setField = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSave = fields.every(
    (f) => !f.required || f.type === 'checkbox' || String(form[f.key] ?? '').trim() !== ''
  );

  const submit = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = toPayload(fields, form);
      if (editingId) await resource.update(editingId, payload);
      else await resource.create(payload);
      setShowForm(false);
      setEditingId(null);
      await load(search);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: T) => {
    if (!confirm(`Hapus ${noun} "${(row as Record<string, unknown>).code ?? row.id}"?`)) return;
    try {
      await resource.remove(row.id);
      await load(search);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          <p className="text-xs text-muted-foreground">{rows.length} {noun}.</p>
        </div>
        <div className="flex items-center gap-2">
          <form
            className="relative hidden sm:block"
            onSubmit={(e) => {
              e.preventDefault();
              load(search);
            }}
          >
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, 'h-8 w-48 pl-7')}
              placeholder="Cari kode / nama…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <Button variant="outline" size="sm" onClick={() => load(search)} disabled={loading}>
            <RefreshCw className={cn('size-4', loading && 'animate-spin')} /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" /> Tambah
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">
            {editingId ? `Ubah ${noun}` : `Tambah ${noun}`}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <FieldControl
                key={f.key}
                field={f}
                value={form[f.key]}
                onChange={(v) => setField(f.key, v)}
              />
            ))}
          </div>
          {formError && <p className="text-xs text-danger">{formError}</p>}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={submit} disabled={!canSave || saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn('px-3 py-2 font-medium', c.align === 'right' && 'text-right')}
                >
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <Spanner cols={columns.length + 1} className="text-muted-foreground">
                Memuat…
              </Spanner>
            )}
            {!loading && error && (
              <Spanner cols={columns.length + 1} className="text-danger">
                Gagal memuat data: {error}
              </Spanner>
            )}
            {!loading && !error && rows.length === 0 && (
              <Spanner cols={columns.length + 1} className="text-muted-foreground">
                Belum ada {noun}
              </Spanner>
            )}
            {!loading &&
              !error &&
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/40">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        'px-3 py-2',
                        c.align === 'right' && 'text-right tabular-nums',
                        c.key === 'code' && 'font-medium text-foreground'
                      )}
                    >
                      {c.render
                        ? c.render(row)
                        : String((row as Record<string, unknown>)[c.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Ubah" onClick={() => openEdit(row)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Hapus"
                        onClick={() => remove(row)}
                      >
                        <Trash2 className="size-4 text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Spanner({
  cols,
  className,
  children,
}: {
  cols: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={cols} className={cn('px-3 py-6 text-center', className)}>
        {children}
      </td>
    </tr>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
}) {
  const label = `${field.label}${field.required ? ' *' : ''}`;
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 self-end pb-1.5">
        <input
          type="checkbox"
          className="size-4 rounded border-input"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      </label>
    );
  }
  return (
    <label className={cn('flex flex-col gap-1', field.span === 'full' && 'sm:col-span-2 lg:col-span-3')}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {field.type === 'select' ? (
        <select className={inputCls} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={inputCls}
          type={
            field.type === 'number'
              ? 'number'
              : field.type === 'time'
                ? 'time'
                : field.type === 'datetime'
                  ? 'datetime-local'
                  : 'text'
          }
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

const inputCls =
  'h-8 w-full rounded-md border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';
