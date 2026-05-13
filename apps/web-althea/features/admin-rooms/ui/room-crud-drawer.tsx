'use client';

/**
 * Drawer "Atur Ruangan" — split 320px daftar (grouped by type) + form di kanan.
 *
 *   ┌──────────────┬──────────────────┐
 *   │ Daftar       │ Form (Tambah/Edit)│
 *   │ (per type)   │                   │
 *   │ + Tombol Baru│                   │
 *   └──────────────┴──────────────────┘
 *
 * Klik baris di list → masuk ke mode edit (form ter-pre-fill).
 * Klik trash icon → confirm + delete.
 */
import { useState } from 'react';
import { Plus, PowerOff, Trash2, X } from 'lucide-react';
import { DEFAULT_FACILITIES } from '../model/constants';
import {
  ROOM_TYPES,
  ROOM_TYPE_LABEL,
  type CreateRoomInput,
  type Room,
} from '../model/types';

export function RoomCrudDrawer({
  rooms,
  editing,
  form,
  submitting,
  onClose,
  onChangeForm,
  onSubmit,
  onCreateNew,
  onEdit,
  onDelete,
  onDeactivate,
}: {
  rooms: Room[];
  editing: Room | null;
  form: CreateRoomInput;
  submitting: boolean;
  onClose: () => void;
  onChangeForm: (next: CreateRoomInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCreateNew: () => void;
  onEdit: (r: Room) => void;
  onDelete: (r: Room) => void;
  onDeactivate: (r: Room) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          marginLeft: 'auto',
          background: 'var(--bg-elev)',
          width: 'min(100%, 720px)',
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          borderLeft: '1px solid var(--border)',
        }}
      >
        <RoomList
          rooms={rooms}
          editingId={editing?.id ?? null}
          onCreateNew={onCreateNew}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeactivate={onDeactivate}
        />
        <RoomFormPanel
          editing={editing}
          form={form}
          submitting={submitting}
          onClose={onClose}
          onChangeForm={onChangeForm}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

// =====================================================================
// Sub-components
// =====================================================================

function RoomList({
  rooms,
  editingId,
  onCreateNew,
  onEdit,
  onDelete,
  onDeactivate,
}: {
  rooms: Room[];
  editingId: number | null;
  onCreateNew: () => void;
  onEdit: (r: Room) => void;
  onDelete: (r: Room) => void;
  onDeactivate: (r: Room) => void;
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: 320,
        borderRight: '1px solid var(--border)',
        background: 'var(--cream-50)',
      }}
    >
      <div
        className="row"
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="text-base font-medium" style={{ margin: 0 }}>
          Atur Ruangan
        </h2>
        <button
          type="button"
          onClick={onCreateNew}
          className="btn btn-primary btn-sm"
        >
          <Plus size={13} /> Baru
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {ROOM_TYPES.map((type) => {
          const filtered = rooms.filter((r) => r.type === type);
          if (filtered.length === 0) return null;
          return (
            <div key={type} style={{ marginBottom: 14 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                {ROOM_TYPE_LABEL[type]}
              </div>
              <div className="col" style={{ gap: 4 }}>
                {filtered.map((r) => (
                  <RoomRow
                    key={r.id}
                    room={r}
                    selected={editingId === r.id}
                    onEdit={() => onEdit(r)}
                    onDelete={() => onDelete(r)}
                    onDeactivate={() => onDeactivate(r)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {rooms.length === 0 ? (
          <div
            className="caption"
            style={{ padding: 12, textAlign: 'center' }}
          >
            Belum ada ruangan.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RoomRow({
  room,
  selected,
  onEdit,
  onDelete,
  onDeactivate,
}: {
  room: Room;
  selected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div
      className="row"
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 10px',
        borderRadius: 8,
        background: selected ? 'var(--sage-100)' : 'var(--bg-elev)',
        border: '1px solid var(--border)',
      }}
    >
      <button
        type="button"
        onClick={onEdit}
        className="col"
        style={{
          minWidth: 0,
          alignItems: 'flex-start',
          gap: 2,
          flex: 1,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
          {room.name}
        </span>
        <span className="caption" style={{ fontSize: 11 }}>
          kap. {room.capacity}
          {room.isActive ? '' : ' · nonaktif'}
        </span>
      </button>
      {room.hasBookings ? (
        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          aria-label={room.isActive ? `Nonaktifkan ${room.name}` : `${room.name} sudah nonaktif`}
          onClick={onDeactivate}
          disabled={!room.isActive}
          title={room.isActive ? 'Ada booking terkait — klik untuk nonaktifkan' : 'Sudah nonaktif'}
          style={{ color: 'var(--warning, #c97a1a)', opacity: room.isActive ? 1 : 0.3 }}
        >
          <PowerOff size={13} />
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          aria-label={`Hapus ${room.name}`}
          onClick={onDelete}
          style={{ color: 'var(--danger)' }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

function RoomFormPanel({
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
    <form
      onSubmit={onSubmit}
      className="flex flex-col"
      style={{ flex: 1, minWidth: 0 }}
    >
      <div
        className="row"
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
        }}
      >
        <h3 className="text-base font-medium" style={{ margin: 0 }}>
          {editing ? `Edit · ${editing.name}` : 'Tambah Ruangan'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Tutup"
        >
          <X size={14} />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div>
          <label className="caption mb-1 block">Nama *</label>
          <input
            value={form.name}
            onChange={(e) =>
              onChangeForm({ ...form, name: e.target.value })
            }
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
              onChange={(e) =>
                onChangeForm({
                  ...form,
                  type: e.target.value as CreateRoomInput['type'],
                })
              }
              className="input-althea"
            >
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ROOM_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="caption mb-1 block">Kapasitas</label>
            <input
              type="number"
              min={1}
              value={form.capacity ?? 1}
              onChange={(e) =>
                onChangeForm({
                  ...form,
                  capacity: Number(e.target.value),
                })
              }
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
            onChange={(e) =>
              onChangeForm({ ...form, description: e.target.value })
            }
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
            onChange={(e) =>
              onChangeForm({ ...form, isActive: e.target.checked })
            }
            className="h-4 w-4"
          />
          Ruangan aktif (tampil di grid)
        </label>
      </div>
      <div
        className="row gap-2"
        style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border)',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline btn-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-sm"
        >
          {submitting ? 'Menyimpan…' : editing ? 'Simpan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
}

/**
 * Facility chip editor:
 * - Existing chips dengan tombol X untuk hapus
 * - Input text + Enter (atau klik +) untuk tambah custom facility
 * - Suggested chips per type (DEFAULT_FACILITIES) — klik untuk tambah cepat
 */
function FacilitiesEditor({
  value,
  type,
  onChange,
}: {
  value: string[];
  type: CreateRoomInput['type'];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const suggestions = DEFAULT_FACILITIES[type] ?? [];
  const remainingSuggestions = suggestions.filter((s) => !value.includes(s));

  function addFacility(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (value.length >= 30) return; // max 30 (selaras DTO)
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...value, trimmed]);
    setInput('');
  }

  function removeFacility(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  function applyAllSuggestions() {
    const merged = [...value];
    for (const s of remainingSuggestions) {
      if (merged.length >= 30) break;
      merged.push(s);
    }
    onChange(merged);
  }

  return (
    <div>
      <label className="caption mb-1 block">
        Fasilitas{' '}
        <span className="caption" style={{ fontSize: 11, opacity: 0.7 }}>
          ({value.length}/30)
        </span>
      </label>

      {/* Selected chips */}
      {value.length > 0 ? (
        <div
          className="flex flex-wrap"
          style={{ gap: 6, marginBottom: 8 }}
        >
          {value.map((f) => (
            <span
              key={f}
              className="badge badge-sage"
              style={{ height: 26, paddingRight: 4, gap: 4 }}
            >
              {f}
              <button
                type="button"
                onClick={() => removeFacility(f)}
                aria-label={`Hapus ${f}`}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'inherit',
                  padding: 0,
                }}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p
          className="caption"
          style={{ fontSize: 11, marginBottom: 8, fontStyle: 'italic' }}
        >
          Belum ada fasilitas — tambah lewat suggestions di bawah atau ketik
          custom. Kalau kosong, UI fallback ke default per type.
        </p>
      )}

      {/* Custom input */}
      <div className="flex" style={{ gap: 6 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addFacility(input);
            }
          }}
          maxLength={60}
          className="input-althea"
          placeholder="Ketik fasilitas custom, tekan Enter"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => addFacility(input)}
          disabled={!input.trim() || value.length >= 30}
          className="btn btn-outline btn-sm"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {/* Suggested chips per type */}
      {remainingSuggestions.length > 0 ? (
        <div style={{ marginTop: 10 }}>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 6 }}
          >
            <span className="caption" style={{ fontSize: 11 }}>
              Saran untuk tipe {ROOM_TYPE_LABEL[type].toLowerCase()}:
            </span>
            <button
              type="button"
              onClick={applyAllSuggestions}
              className="btn btn-ghost btn-sm"
              style={{ height: 22, padding: '0 8px', fontSize: 11 }}
            >
              Pakai semua
            </button>
          </div>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {remainingSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addFacility(s)}
                disabled={value.length >= 30}
                className="badge badge-neutral"
                style={{
                  cursor: 'pointer',
                  border: '1px dashed var(--border-strong)',
                  background: 'transparent',
                }}
              >
                <Plus size={10} /> {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
