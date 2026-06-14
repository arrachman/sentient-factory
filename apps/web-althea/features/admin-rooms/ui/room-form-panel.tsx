'use client';

import { X } from 'lucide-react';
import { ROOM_TYPES, ROOM_TYPE_LABEL, type CreateRoomInput, type Room } from '../model/types';
import { FacilitiesEditor } from './facilities-editor';

export function RoomFormPanel({
  editing,
  form,
  submitting,
  onClose,
  onChangeForm,
  onSubmit,
}: {
  editing: Room | null;
  form: CreateRoomInput;
  submitting: boolean;
  onClose: () => void;
  onChangeForm: (next: CreateRoomInput) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
      <div className="row" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <h3 className="text-base font-medium" style={{ margin: 0 }}>
          {editing ? `Edit · ${editing.name}` : 'Tambah Ruangan'}
        </h3>
        <button type="button" onClick={onClose} className="btn btn-icon btn-ghost btn-sm" aria-label="Tutup">
          <X size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="caption mb-1 block">Nama *</label>
          <input
            value={form.name}
            onChange={(e) => onChangeForm({ ...form, name: e.target.value })}
            required
            className="input-althea"
            placeholder="Mis. Sky Room"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="caption mb-1 block">Tipe *</label>
            <select
              value={form.type}
              onChange={(e) => onChangeForm({ ...form, type: e.target.value as CreateRoomInput['type'] })}
              className="input-althea"
            >
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>{ROOM_TYPE_LABEL[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="caption mb-1 block">Kapasitas</label>
            <input
              type="number"
              min={1}
              value={form.capacity ?? 1}
              onChange={(e) => onChangeForm({ ...form, capacity: Number(e.target.value) })}
              className="input-althea"
            />
          </div>
        </div>

        <FacilitiesEditor
          value={form.facilities ?? []}
          type={form.type}
          onChange={(facilities) => onChangeForm({ ...form, facilities })}
        />

        <div>
          <label className="caption mb-1 block">Catatan internal (opsional)</label>
          <textarea
            value={form.description ?? ''}
            onChange={(e) => onChangeForm({ ...form, description: e.target.value })}
            rows={2}
            className="input-althea"
            style={{ height: 'auto', padding: 10 }}
            placeholder="Mis. AC service 2026-02-01, butuh ganti tisu"
          />
          <p className="caption mt-1" style={{ fontSize: 11 }}>
            Catatan freeform untuk admin — tidak ditampilkan ke psikolog/klien.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(e) => onChangeForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          Ruangan aktif (tampil di grid)
        </label>
      </div>

      <div className="row gap-2" style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Batal</button>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
          {submitting ? 'Menyimpan…' : editing ? 'Simpan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
}
