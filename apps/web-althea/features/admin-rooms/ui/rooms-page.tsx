'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useCreateRoom,
  useDeleteRoom,
  useRoomList,
  useUpdateRoom,
} from '../hooks/use-room';
import {
  ROOM_TYPES,
  ROOM_TYPE_LABEL,
  type CreateRoomInput,
  type Room,
} from '../model/types';

const EMPTY: CreateRoomInput = { name: '', type: 'konseling', capacity: 1, description: '', isActive: true };

export function RoomsPage() {
  const [editing, setEditing] = useState<Room | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateRoomInput>(EMPTY);

  const list = useRoomList({ limit: 100 });
  const createMut = useCreateRoom();
  const updateMut = useUpdateRoom();
  const deleteMut = useDeleteRoom();

  function close() { setOpen(false); setEditing(null); }
  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(r: Room) {
    setEditing(r);
    setForm({ name: r.name, type: r.type, capacity: r.capacity, description: r.description ?? '', isActive: r.isActive });
    setOpen(true);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    else createMut.mutate(form, { onSuccess: close });
  }
  function handleDelete(r: Room) {
    if (!confirm(`Hapus ruang "${r.name}"?`)) return;
    deleteMut.mutate(r.id);
  }

  const items = list.data?.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Ruang</h1>
          <p className="caption mt-1">11 ruang klinik: konseling, terapi anak, tes, seminar.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {ROOM_TYPES.map((type) => {
        const filtered = items.filter((r) => r.type === type);
        if (filtered.length === 0) return null;
        return (
          <div key={type} className="space-y-2">
            <h2 className="h2">{ROOM_TYPE_LABEL[type]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((r) => (
                <div key={r.id} className="card-althea p-4 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-teal-800">{r.name}</div>
                    <div className="caption mt-1">Kapasitas {r.capacity} orang</div>
                    {r.description && <div className="caption mt-1 text-fg-muted">{r.description}</div>}
                    <div className="mt-2">
                      {r.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-neutral">Nonaktif</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(r)} className="btn btn-ghost btn-icon" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(r)} className="btn btn-ghost btn-icon text-danger" aria-label="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {items.length === 0 && !list.isLoading && (
        <div className="card-althea p-8 text-center text-fg-muted">Belum ada ruang.</div>
      )}

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-md bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">{editing ? 'Edit Ruang' : 'Tambah Ruang'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div>
                <label className="caption mb-1 block">Nama *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Tipe *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CreateRoomInput['type'] })} className="input-althea">
                    {ROOM_TYPES.map((t) => <option key={t} value={t}>{ROOM_TYPE_LABEL[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">Kapasitas</label>
                  <input type="number" min={1} value={form.capacity ?? 1} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="input-althea" />
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
