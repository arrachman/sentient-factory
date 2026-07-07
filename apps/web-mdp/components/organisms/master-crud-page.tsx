'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Download, MoreHorizontal, Plus, RefreshCw, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CrudResource, ListQuery } from '@/lib/api';

export type FieldType = 'text' | 'number' | 'time' | 'datetime' | 'select' | 'checkbox';

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
  readonly defaultValue?: string | boolean;
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
  readonly listQuery?: ListQuery & Record<string, unknown>;
  readonly noun?: string;
}

type FormValues = Record<string, string | boolean>;
type SortDir = 'asc' | 'desc';

function emptyForm(fields: readonly FieldDef[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.key, f.type === 'checkbox' ? (f.defaultValue ?? true) : (f.defaultValue ?? '')]));
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
    if (str === '') out[f.key] = f.required ? str : undefined;
    else if (f.type === 'number') out[f.key] = Number(str);
    else if (f.type === 'datetime') {
      const d = new Date(str);
      out[f.key] = Number.isNaN(d.getTime()) ? str : d.toISOString();
    } else out[f.key] = str;
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
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const baseQuery = useMemo(() => listQuery ?? {}, [listQuery]);
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortBy];
      const bv = (b as Record<string, unknown>)[sortBy];
      const aa = av == null ? '' : String(av);
      const bb = bv == null ? '' : String(bv);
      return sortDir === 'asc' ? aa.localeCompare(bb, 'id', { numeric: true }) : bb.localeCompare(aa, 'id', { numeric: true });
    });
    return copy;
  }, [rows, sortBy, sortDir]);

  const load = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await resource.list({ ...baseQuery, search: debouncedSearch || undefined });
      setRows(res.data);
      setSelectedIds((prev) => new Set([...prev].filter((id) => res.data.some((r) => r.id === id))));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [resource, baseQuery, debouncedSearch]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 280);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm(fields));
    setFormError(null);
    setShowForm(true);
  }, [fields]);

  const openEdit = useCallback((row: T) => {
    const next: FormValues = {};
    for (const f of fields) {
      const v = (row as Record<string, unknown>)[f.key];
      next[f.key] = f.type === 'checkbox' ? Boolean(v) : f.type === 'datetime' && v ? isoToLocalInput(String(v)) : String(v ?? '');
    }
    setEditingId(row.id);
    setForm(next);
    setFormError(null);
    setShowForm(true);
  }, [fields]);

  const setField = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const canSave = fields.every((f) => !f.required || f.type === 'checkbox' || String(form[f.key] ?? '').trim() !== '');
  const allSelected = sortedRows.length > 0 && sortedRows.every((r) => selectedIds.has(r.id));
  const someSelected = !allSelected && sortedRows.some((r) => selectedIds.has(r.id));

  const toggleRow = useCallback((id: string) => setSelectedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }), []);

  const toggleAll = () => setSelectedIds((prev) => (sortedRows.every((r) => prev.has(r.id)) ? new Set() : new Set(sortedRows.map((r) => r.id))));
  const sort = (key: string) => {
    setSortDir((d) => (sortBy === key && d === 'asc' ? 'desc' : 'asc'));
    setSortBy(key);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if (e.key === '/' && !inField) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if ((e.key === 'n' || e.key === 'N') && !inField) {
        e.preventDefault();
        openCreate();
      } else if ((e.key === 'j' || e.key === 'ArrowDown') && !inField && sortedRows.length) {
        e.preventDefault();
        setFocusedIndex((i) => Math.min((i < 0 ? 0 : i + 1), sortedRows.length - 1));
      } else if ((e.key === 'k' || e.key === 'ArrowUp') && !inField && sortedRows.length) {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i <= 0 ? 0 : i - 1, 0));
      } else if ((e.key === 'x' || e.key === ' ' || e.key === 'X') && !inField && focusedIndex >= 0) {
        e.preventDefault();
        toggleRow(sortedRows[focusedIndex].id);
      } else if (e.key === 'Enter' && !inField && focusedIndex >= 0) {
        e.preventDefault();
        openEdit(sortedRows[focusedIndex]);
      } else if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusedIndex, openCreate, openEdit, sortedRows, showForm, toggleRow]);

  const submit = async (keepOpen = false) => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = toPayload(fields, form);
      if (editingId) await resource.update(editingId, payload);
      else await resource.create(payload);
      if (keepOpen && !editingId) setForm(emptyForm(fields));
      else setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const bulkDelete = async () => {
    const ids = [...selectedIds];
    if (!ids.length || !confirm(`Hapus ${ids.length} ${noun} yang dipilih?`)) return;
    await Promise.all(ids.map((id) => resource.remove(id)));
    setSelectedIds(new Set());
    await load();
  };

  const colSpan = columns.length + 2;

  return (
    <>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">
            {title}
            <span className="code-tag">MDP</span>
          </h1>
          <div className="page-actions">
            <div className="search-input">
              <Search size={12} />
              <input ref={searchRef} placeholder="Cari semua..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="kbd">/</span>
            </div>
            <button className="btn" type="button" title="Export data"><Download size={12} />Export</button>
            <button className="btn" type="button" onClick={load} disabled={fetching}><RefreshCw size={12} className={cn(fetching && 'animate-spin')} /></button>
            <button className="btn primary" type="button" onClick={openCreate}><Plus size={12} />Tambah<span className="kbd">N</span></button>
          </div>
        </div>
        <div className="filter-bar">
          <button className="iconbtn" type="button" title="Filter"><SlidersHorizontal size={13} /></button>
          {subtitle && <span className="filter-summary">{subtitle}</span>}
          <div style={{ flex: 1 }} />
          <span className="filter-summary"><strong>{sortedRows.length}</strong> {noun}</span>
        </div>
        <div className="page-body">
          <div className="tbl-wrap scrollbar">
          {error && <div className="tbl-empty" style={{ color: 'var(--danger)' }}>Gagal memuat data: {error}</div>}
          {!error && (
            <table className="tbl">
              <thead>
                <tr>
                  <th className="col-check"><input className="checkbox" type="checkbox" checked={allSelected} ref={(el) => { if (el) el.indeterminate = someSelected; }} onChange={toggleAll} /></th>
                  {columns.map((c) => (
                    <th key={c.key} className={cn('sortable', c.align === 'right' && 'col-num')} onClick={() => sort(c.key)}>
                      {c.label}{sortBy === c.key && <span className="sort-ind">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading && <Spanner cols={colSpan}>Memuat...</Spanner>}
                {!loading && sortedRows.length === 0 && <Spanner cols={colSpan}>Belum ada {noun}</Spanner>}
                {!loading && sortedRows.map((row, idx) => (
                  <tr key={row.id} className={cn(selectedIds.has(row.id) && 'selected', focusedIndex === idx && 'focused')} onClick={() => setFocusedIndex(idx)} onDoubleClick={() => openEdit(row)}>
                    <td className="col-check"><input className="checkbox" type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} onClick={(e) => e.stopPropagation()} /></td>
                    {columns.map((c) => (
                      <td key={c.key} className={cn(c.align === 'right' && 'num', c.key === 'code' && 'mono')}>
                        {c.key === 'code' ? (
                          <button className="link-cell" type="button" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>{String((row as Record<string, unknown>)[c.key] ?? '')}</button>
                        ) : c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '-')}
                      </td>
                    ))}
                    <td style={{ width: 42, textAlign: 'right' }}>
                      <button className="iconbtn" type="button" title="Aksi" onClick={(e) => { e.stopPropagation(); openEdit(row); }}><MoreHorizontal size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
        <div className="kbd-footer">
          <span><span className="kbd">/</span> cari</span>
          <span><span className="kbd">N</span> tambah</span>
          <span><span className="kbd">J</span>/<span className="kbd">K</span> navigasi</span>
          <span><span className="kbd">X</span> pilih</span>
          <span><span className="kbd">Enter</span> buka</span>
        </div>
      </div>

      {showForm && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}>
          <aside className="drawer" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="drawer-hd">
              <div className="ti">{editingId ? `Edit ${title}` : `Tambah ${title}`}</div>
              <div style={{ flex: 1 }} />
              <button className="iconbtn" type="button" onClick={() => setShowForm(false)}><X size={14} /></button>
            </div>
            <div className="drawer-bd">
              {fields.map((f) => <FieldControl key={f.key} field={f} value={form[f.key]} onChange={(v) => setField(f.key, v)} />)}
              {formError && <div className="confirm-msg" style={{ color: 'var(--danger)' }}>{formError}</div>}
            </div>
            <div className="drawer-ft">
              <button className="btn ghost" type="button" onClick={() => setShowForm(false)}>Batal</button>
              {!editingId && <button className="btn" type="button" onClick={() => submit(true)} disabled={!canSave || saving}>Simpan & Tambah Baru</button>}
              <button className="btn primary" type="button" onClick={() => submit(false)} disabled={!canSave || saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </aside>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <span className="count">{selectedIds.size} dipilih</span>
          <span className="divider" />
          <button className="ba-btn danger" type="button" onClick={bulkDelete}><Trash2 size={13} />Hapus</button>
          <button className="ba-btn" type="button" onClick={() => setSelectedIds(new Set())}>Batal</button>
        </div>
      )}
    </>
  );
}

function Spanner({ cols, children }: { cols: number; children: ReactNode }) {
  return <tr><td colSpan={cols} className="tbl-empty">{children}</td></tr>;
}

function FieldControl({ field, value, onChange }: { field: FieldDef; value: string | boolean; onChange: (v: string | boolean) => void }) {
  if (field.type === 'checkbox') {
    return (
      <label className="drawer-field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input className="checkbox" type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  }
  const inputType = field.type === 'number' ? 'number' : field.type === 'time' ? 'time' : field.type === 'datetime' ? 'datetime-local' : 'text';
  return (
    <label className="drawer-field">
      <span>{field.required && <span className="req">*</span>}{field.label}</span>
      {field.type === 'select' ? (
        <select value={String(value)} onChange={(e) => onChange(e.target.value)}>
          <option value="">-</option>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={inputType} value={String(value)} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
