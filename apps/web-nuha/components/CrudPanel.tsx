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

const display = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';
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
      <button className="btn" type="button" onClick={() => { setEditing(null); setOpen(!open); setMessage(''); }} data-testid={`tambah-${entity.key}`}>{open && !editing ? 'Tutup form' : `Tambah ${entity.label.toLowerCase()}`}</button>
    </div>
    {message && <p className="muted" role="status" style={{ marginTop: 8 }}>{message}</p>}

    {(open || editing) && <form onSubmit={submit} style={{ marginTop: 12 }} data-testid={`form-${entity.key}`}>
      <div className="grid g3">
        {entity.fields.map((field) => <div className="field" key={field.name}>
          <label htmlFor={`${entity.key}-${field.name}`}>{field.label}</label>
          {field.type === 'textarea'
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
    </form>}

    <table style={{ marginTop: 12 }}>
      <thead><tr>{entity.columns.map((column) => <th key={column.name}>{column.label}</th>)}<th>Aksi</th></tr></thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={entity.columns.length + 1} className="muted">Belum ada data.</td></tr>}
        {rows.map((row) => <tr key={row.id} data-testid={`row-${entity.key}`}>
          {entity.columns.map((column) => <td key={column.name}>{display(row[column.name])}</td>)}
          <td><div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sekunder" type="button" disabled={busy} onClick={() => { setEditing(row); setOpen(true); setMessage(''); }}>Ubah</button>
            <button className="btn btn-sekunder" type="button" disabled={busy} onClick={() => { if (window.confirm(`Hapus ${entity.label.toLowerCase()} ini?`)) void send('DELETE', { id: row.id }); }}>Hapus</button>
          </div></td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}
