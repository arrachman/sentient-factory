'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClientEntity, ClientField, Keterkaitan, Row } from '@/lib/crud/types';
import { InputField } from '@/components/molecules/InputField';

const IkonTambah = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>;
const IkonUbah = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 20h4L19.5 8.5a2.12 2.12 0 0 0-3-3L5 17v3Z" /><path d="M14.5 6.5l3 3" /></svg>;
const IkonHapus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 7h16" /><path d="M10 4h4" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M10 11v6M14 11v6" /></svg>;
const IkonTutup = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>;

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

/** Kelompokkan field sesuai `group`; yang tanpa grup jatuh ke "Data utama". */
function kelompokkan(fields: ClientField[]): { judul: string; fields: ClientField[] }[] {
  const urutan: string[] = [];
  const peta = new Map<string, ClientField[]>();
  for (const field of fields) {
    const judul = field.group ?? 'Data utama';
    if (!peta.has(judul)) { peta.set(judul, []); urutan.push(judul); }
    peta.get(judul)!.push(field);
  }
  return urutan.map((judul) => ({ judul, fields: peta.get(judul)! }));
}

/** Peran lintas modul milik satu baris: badge + tautan ke modul asalnya. */
function PanelKeterkaitan({ kait }: { kait: Keterkaitan[] }) {
  return <div className="kait-panel">
    <p className="kait-judul">Terhubung ke modul lain</p>
    {kait.length === 0
      ? <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>Belum dipakai modul mana pun — identitas ini berdiri sendiri. Daftarkan lewat modul Santri atau Kepegawaian bila perlu.</p>
      : <ul className="kait-daftar">
          {kait.map((item, i) => <li key={`${item.label}-${i}`}>
            <span className={`badge badge-${item.nada ?? 'netral'}`}>{item.label}</span>
            <span className="kait-detail">{item.detail}</span>
            {item.href && <a className="kait-tautan" href={item.href}>Buka modul →</a>}
          </li>)}
        </ul>}
  </div>;
}

/** Nilai field yang men-drive `tampilBila` milik field lain. */
function nilaiPemicu(fields: ClientField[], dipilih: Record<string, string>): Record<string, string> {
  const hasil: Record<string, string> = {};
  for (const field of fields) {
    if (!field.tampilBila) continue;
    const pemicu = fields.find((item) => item.name === field.tampilBila!.field);
    if (!pemicu) continue;
    hasil[pemicu.name] = dipilih[pemicu.name] ?? '';
  }
  return hasil;
}

export function CrudPanel({ entity, rows }: { entity: ClientEntity; rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [pilihan, setPilihan] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refByField = new Map(entity.fields.filter((field) => field.refOptions).map((field) => [field.name, field.refOptions]));
  const adaKait = rows.some((row) => row._kait);
  const pemicu = nilaiPemicu(entity.fields, pilihan);

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

  /**
   * Field peran hanya relevan saat membuat baris baru, dan turunannya hanya
   * saat perannya cocok — sisanya bikin form panjang tanpa guna.
   */
  const terlihat = (field: ClientField) => {
    if (field.hanyaBaru && editing) return false;
    if (!field.tampilBila) return true;
    const nilai = pemicu[field.tampilBila.field] ?? '';
    return field.tampilBila.sama.includes(nilai);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of entity.fields) {
      if (!terlihat(field)) continue;
      payload[field.name] = field.type === 'boolean' ? form.get(field.name) === 'on' : form.get(field.name);
    }
    if (editing) payload.id = editing.id;
    await send(editing ? 'PATCH' : 'POST', payload);
  }

  return <div className="card" style={{ marginTop: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <h3 className="card-judul" style={{ margin: 0 }}>{entity.label}</h3>
      <button className="btn" type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px' }} onClick={() => { setEditing(null); setPilihan({}); setOpen(!open); setMessage(''); }} data-testid={`tambah-${entity.key}`} title={open && !editing ? 'Tutup form' : `Tambah ${entity.label.toLowerCase()}`}><IkonTambah /> Tambah</button>
    </div>
    {message && <p className="muted" role="status" style={{ marginTop: 8 }}>{message}</p>}

    {(open || editing) && <div className="modal-overlay" onClick={() => { setEditing(null); setOpen(false); }}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{ margin: 0 }}>{editing ? `Ubah ${entity.label.toLowerCase()}` : `Tambah ${entity.label.toLowerCase()}`}</h3>
            {editing && <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0' }}>{String(editing.nama ?? editing.label ?? `ID ${editing.id}`)}</p>}
          </div>
          <button className="btn btn-sekunder btn-icon" type="button" onClick={() => { setEditing(null); setOpen(false); }} title="Tutup" aria-label="Tutup"><IkonTutup /></button>
        </div>
        {entity.deskripsi && <p className="kait-deskripsi">{entity.deskripsi}</p>}
        {editing?._kait && <PanelKeterkaitan kait={editing._kait} />}
        <form onSubmit={submit} data-testid={`form-${entity.key}`}>
          {kelompokkan(entity.fields.filter(terlihat)).map((grup) => <fieldset className="grup-form" key={grup.judul}>
          <legend>{grup.judul}</legend>
          <div className="grid g3">
            {grup.fields.map((field) => <div className="field" key={field.name} style={field.span ? { gridColumn: `span ${field.span}` } : undefined}>
              <label id={`${entity.key}-${field.name}-label`} htmlFor={`${entity.key}-${field.name}`}>
                {field.label}
                {field.required && <span className="wajib" title="Wajib diisi"> *</span>}
              </label>
              <InputField
                field={field}
                id={`${entity.key}-${field.name}`}
                row={editing ?? undefined}
                onPilih={field.name in pemicu ? (value) => setPilihan((prev) => ({ ...prev, [field.name]: value })) : undefined}
              />
              {field.hint && <p className="petunjuk">{field.hint}</p>}
            </div>)}
          </div>
          </fieldset>)}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 12, marginRight: 'auto' }}><span className="wajib">*</span> wajib diisi</span>
            <button className="btn" disabled={busy} type="submit">{busy ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Simpan'}</button>
            <button className="btn btn-sekunder" type="button" onClick={() => { setEditing(null); setOpen(false); }}>Batal</button>
          </div>
        </form>
      </div>
    </div>}

    <div className="tabel-wrap">
      <table className="table-compact" style={{ marginTop: 12 }}>
        <thead><tr>
          {entity.columns.map((column) => <th key={column.name}>{column.label}</th>)}
          {adaKait && <th>Peran</th>}
          <th style={{ textAlign: 'center', width: 1, whiteSpace: 'nowrap' }}>Aksi</th>
        </tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={entity.columns.length + (adaKait ? 2 : 1)} className="empty">Tidak ada data yang cocok.</td></tr>}
          {rows.map((row) => <tr key={row.id} data-testid={`row-${entity.key}`}>
            {entity.columns.map((column) => <td key={column.name}>{display(row[column.name], refByField.get(column.name))}</td>)}
            {adaKait && <td><span className="kait-sel">
              {(row._kait ?? []).length === 0
                ? <span className="muted">—</span>
                : row._kait!.map((item, i) => <span key={`${item.label}-${i}`} className={`badge badge-${item.nada ?? 'netral'}`} title={item.detail}>{item.label}</span>)}
            </span></td>}
            <td style={{ width: 1, whiteSpace: 'nowrap' }}><div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              <button className="btn btn-sekunder btn-icon" type="button" disabled={busy} title="Ubah" aria-label="Ubah" onClick={() => { setEditing(row); setOpen(true); setMessage(''); }}><IkonUbah /></button>
              <button className="btn btn-sekunder btn-icon btn-icon-bahaya" type="button" disabled={busy} title="Hapus" aria-label="Hapus" onClick={() => { if (window.confirm(`Hapus ${entity.label.toLowerCase()} ini?`)) void send('DELETE', { id: row.id }); }}><IkonHapus /></button>
            </div></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>;
}
