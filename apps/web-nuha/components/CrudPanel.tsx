'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClientEntity, ClientField, Row } from '@/lib/crud/types';

const inputValue = (field: ClientField, row?: Row) => {
  const raw = row?.[field.name];
  if (raw === null || raw === undefined) return '';
  if (field.type === 'date') return String(raw).slice(0, 10);
  return String(raw);
};

const IkonTambah = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>;
const IkonUbah = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>;
const IkonHapus = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /><path d="M10 11v6M14 11v6" /></svg>;

const display = (value: unknown, refOptions?: ClientField['refOptions']) => {
  if (value === null || value === undefined || value === '') return '—';
  if (refOptions) {
    const match = refOptions.find((option) => option.id === String(value));
    if (match) return match.label;
  }
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  const text = String(value);
  return /^\d{4}-\d{2}-\d{2}T/.test(text) ? new Date(text).toLocaleDateString('id-ID') : text;
};

export function CrudPanel({ entity, rows }: { entity: ClientEntity; rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refByField = new Map(entity.fields.filter((field) => field.refOptions).map((field) => [field.name, field.refOptions]));

  async function send(method: 'POST' | 'PATCH' | 'DELETE', payload: Record<string, unknown>) {
    setBusy(true);
    const response = await fetch(`/api/crud/${entity.key}`, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    setBusy(false);
    if (!result.success) return setMessage(result.error?.message ?? 'Operasi gagal.');
    setMessage(method === 'DELETE' ? 'Data dihapus.' : 'Data tersimpan.');
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of entity.fields) payload[field.name] = field.type === 'boolean' ? form.get(field.name) === 'on' : form.get(field.name);
    if (editing) payload.id = editing.id;
    await send(editing ? 'PATCH' : 'POST', payload);
  }

  return <div className="card" style={{ marginTop: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <h3 style={{ margin: 0 }}>{entity.label}</h3>
      <button className="btn btn-icon" type="button" onClick={() => { setEditing(null); setOpen(!open); setMessage(''); }} data-testid={`tambah-${entity.key}`} title={open && !editing ? 'Tutup form' : `Tambah ${entity.label.toLowerCase()}`} aria-label={`Tambah ${entity.label.toLowerCase()}`}><IkonTambah /></button>
    </div>
    {message && <p className="muted" role="status" style={{ marginTop: 8 }}>{message}</p>}

    {(open || editing) && <div className="modal-overlay" onClick={() => { setEditing(null); setOpen(false); }}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h3>{editing ? `Ubah ${entity.label.toLowerCase()}` : `Tambah ${entity.label.toLowerCase()}`}</h3>
          <button className="btn btn-sekunder" type="button" onClick={() => { setEditing(null); setOpen(false); }}>Tutup</button>
        </div>
        <form onSubmit={submit} data-testid={`form-${entity.key}`}>
          <div className="grid g3">
            {entity.fields.map((field) => <div className="field" key={field.name}>
              <label htmlFor={`${entity.key}-${field.name}`}>{field.label}</label>
              {field.refOptions
                ? <select id={`${entity.key}-${field.name}`} name={field.name} required={field.required} defaultValue={inputValue(field, editing ?? undefined)}>
                    <option value="">Pilih…</option>
                    {field.refOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                : field.type === 'textarea'
                  ? <textarea id={`${entity.key}-${field.name}`} name={field.name} required={field.required} defaultValue={inputValue(field, editing ?? undefined)} rows={3} />
                  : field.type === 'select'
                    ? <select id={`${entity.key}-${field.name}`} name={field.name} required={field.required} defaultValue={inputValue(field, editing ?? undefined)}>
                        <option value="">Pilih…</option>
                        {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    : field.type === 'boolean'
                      ? <input id={`${entity.key}-${field.name}`} name={field.name} type="checkbox" defaultChecked={editing ? Boolean(editing[field.name]) : true} />
                      : <input id={`${entity.key}-${field.name}`} name={field.name} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} step={field.step} required={field.required} defaultValue={inputValue(field, editing ?? undefined)} />}
            </div>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" disabled={busy} type="submit">{busy ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Simpan'}</button>
            <button className="btn btn-sekunder" type="button" onClick={() => { setEditing(null); setOpen(false); }}>Batal</button>
          </div>
        </form>
      </div>
    </div>}

    <div className="tabel-wrap">
      <table className="table-compact" style={{ marginTop: 12 }}>
        <thead><tr>{entity.columns.map((column) => <th key={column.name}>{column.label}</th>)}<th style={{ textAlign: 'center' }}>Aksi</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={entity.columns.length + 1} className="muted">Belum ada data.</td></tr>}
          {rows.map((row) => <tr key={row.id} data-testid={`row-${entity.key}`}>
            {entity.columns.map((column) => <td key={column.name}>{display(row[column.name], refByField.get(column.name))}</td>)}
            <td><div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="btn btn-sekunder btn-icon" type="button" disabled={busy} title="Ubah" aria-label="Ubah" onClick={() => { setEditing(row); setOpen(true); setMessage(''); }}><IkonUbah /></button>
              <button className="btn btn-sekunder btn-icon" type="button" disabled={busy} title="Hapus" aria-label="Hapus" onClick={() => { if (window.confirm(`Hapus ${entity.label.toLowerCase()} ini?`)) void send('DELETE', { id: row.id }); }}><IkonHapus /></button>
            </div></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>;
}
