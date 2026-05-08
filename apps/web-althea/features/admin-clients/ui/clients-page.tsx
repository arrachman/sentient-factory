'use client';

import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  useClientList,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from '../hooks/use-client';
import { GENDERS, GENDER_LABEL, type Client, type CreateClientInput } from '../model/types';

const EMPTY: CreateClientInput = {
  name: '',
  gender: 'L',
  age: undefined,
  phoneWa: '+62',
  medicalRecordNumber: '',
  preferredServiceType: '',
  email: '',
  address: '',
  notes: '',
  waOptedOut: false,
};

export function ClientsPage() {
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput>(EMPTY);
  const [search, setSearch] = useState('');

  const list = useClientList({ search: search.trim() || undefined, limit: 100 });
  const createMut = useCreateClient();
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  function close() { setOpen(false); setEditing(null); }
  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(c: Client) {
    setEditing(c);
    setForm({
      name: c.name,
      gender: c.gender,
      age: c.age ?? undefined,
      phoneWa: c.phoneWa,
      medicalRecordNumber: c.medicalRecordNumber ?? '',
      preferredServiceType: c.preferredServiceType ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      notes: c.notes ?? '',
      waOptedOut: c.waOptedOut,
    });
    setOpen(true);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    else createMut.mutate(form, { onSuccess: close });
  }
  function handleDelete(c: Client) {
    if (!confirm(`Hapus klien "${c.name}"?`)) return;
    deleteMut.mutate(c.id);
  }

  const items = list.data?.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Klien</h1>
          <p className="caption mt-1">Daftar pasien klinik (intake form). Pasien tidak login ke app, hanya recipient WA.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input type="search" placeholder="Cari nama, phone, MRN, email..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input-althea pl-9" />
      </div>

      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">Gender</th>
              <th className="px-4 py-2 font-medium">Umur</th>
              <th className="px-4 py-2 font-medium">WA</th>
              <th className="px-4 py-2 font-medium">MRN</th>
              <th className="px-4 py-2 font-medium">Layanan</th>
              <th className="px-4 py-2 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2 font-medium text-teal-800">{c.name}</td>
                <td className="px-4 py-2">{GENDER_LABEL[c.gender]}</td>
                <td className="px-4 py-2">{c.age ?? '—'}</td>
                <td className="px-4 py-2 font-mono text-xs">{c.phoneWa}</td>
                <td className="px-4 py-2">{c.medicalRecordNumber ?? '—'}</td>
                <td className="px-4 py-2">{c.preferredServiceType ?? '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button type="button" onClick={() => openEdit(c)} className="btn btn-ghost btn-icon" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(c)} className="btn btn-ghost btn-icon text-danger" aria-label="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !list.isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-fg-muted">Belum ada klien.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="caption text-right">Total: {list.data?.meta?.total ?? 0} klien</div>

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">{editing ? 'Edit Klien' : 'Tambah Klien'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Nama *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">WhatsApp *</label>
                  <input value={form.phoneWa} onChange={(e) => setForm({ ...form, phoneWa: e.target.value })} required placeholder="+6281234567890" className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="caption mb-1 block">Gender *</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'L' | 'P' })} className="input-althea">
                    {GENDERS.map((g) => <option key={g} value={g}>{GENDER_LABEL[g]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">Umur</label>
                  <input type="number" min={0} max={120} value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">MRN</label>
                  <input value={form.medicalRecordNumber ?? ''} onChange={(e) => setForm({ ...form, medicalRecordNumber: e.target.value })} placeholder="MR-2026-XXXX" className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Email</label>
                  <input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Layanan diminati</label>
                  <input value={form.preferredServiceType ?? ''} onChange={(e) => setForm({ ...form, preferredServiceType: e.target.value })} placeholder="konseling / terapi / tes" className="input-althea" />
                </div>
              </div>
              <div>
                <label className="caption mb-1 block">Alamat</label>
                <input value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-althea" />
              </div>
              <div>
                <label className="caption mb-1 block">Catatan</label>
                <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input-althea h-auto py-2" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.waOptedOut ?? false} onChange={(e) => setForm({ ...form, waOptedOut: e.target.checked })} className="h-4 w-4" />
                Klien opt-out dari notifikasi WA
              </label>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={close} className="btn btn-outline">Batal</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
