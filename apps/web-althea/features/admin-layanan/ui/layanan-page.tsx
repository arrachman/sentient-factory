'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useCreateService,
  useDeleteService,
  useServiceList,
  useUpdateService,
} from '../hooks/use-service';
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABEL,
  type CreateServiceInput,
  type Service,
} from '../model/types';

const EMPTY: CreateServiceInput = {
  name: '',
  category: 'konseling',
  sessionCount: 1,
  durationMinutes: 60,
  basePrice: 500000,
  description: '',
  isActive: true,
};

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function LayananPage() {
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateServiceInput>(EMPTY);

  const list = useServiceList({ limit: 100 });
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const deleteMut = useDeleteService();

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category,
      sessionCount: s.sessionCount,
      durationMinutes: s.durationMinutes,
      basePrice: s.basePrice,
      description: s.description ?? '',
      isActive: s.isActive,
    });
    setOpen(true);
  }
  function close() { setOpen(false); setEditing(null); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  }

  function handleDelete(s: Service) {
    if (!confirm(`Hapus layanan "${s.name}"?`)) return;
    deleteMut.mutate(s.id);
  }

  const items = list.data?.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Layanan</h1>
          <p className="caption mt-1">Catalog layanan klinik: konseling, terapi, tes psikologi.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {SERVICE_CATEGORIES.map((cat) => {
        const filtered = items.filter((i) => i.category === cat);
        if (filtered.length === 0) return null;
        return (
          <div key={cat} className="space-y-2">
            <h2 className="h2">{SERVICE_CATEGORY_LABEL[cat]}</h2>
            <div className="card-althea overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 border-b border-border text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Nama</th>
                    <th className="px-4 py-2 font-medium">Sesi</th>
                    <th className="px-4 py-2 font-medium">Durasi</th>
                    <th className="px-4 py-2 font-medium">Harga</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                      <td className="px-4 py-2 font-medium text-teal-800">{s.name}</td>
                      <td className="px-4 py-2">{s.sessionCount}x</td>
                      <td className="px-4 py-2">{s.durationMinutes} min</td>
                      <td className="px-4 py-2">{formatRp(s.basePrice)}</td>
                      <td className="px-4 py-2">
                        {s.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-neutral">Nonaktif</span>}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button type="button" onClick={() => openEdit(s)} className="btn btn-ghost btn-icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(s)} className="btn btn-ghost btn-icon text-danger" aria-label="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {items.length === 0 && !list.isLoading && (
        <div className="card-althea p-8 text-center text-fg-muted">Belum ada layanan.</div>
      )}

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-xl bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">{editing ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div>
                <label className="caption mb-1 block">Nama *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CreateServiceInput['category'] })} className="input-althea">
                    {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{SERVICE_CATEGORY_LABEL[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">Jumlah Sesi *</label>
                  <input type="number" min={1} value={form.sessionCount} onChange={(e) => setForm({ ...form, sessionCount: Number(e.target.value) })} className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Durasi (menit) *</label>
                  <input type="number" min={15} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Harga Total (Rp) *</label>
                  <input type="number" min={0} value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} className="input-althea" />
                </div>
              </div>
              <div>
                <label className="caption mb-1 block">Deskripsi</label>
                <textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-althea h-auto py-2" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                Aktif
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
