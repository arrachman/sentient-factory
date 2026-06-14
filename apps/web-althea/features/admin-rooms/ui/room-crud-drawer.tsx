'use client';

/**
 * Drawer "Atur Ruangan" — split 320px daftar (grouped by type) + form di kanan.
 *
 *   ┌──────────────┬──────────────────┐
 *   │ Daftar       │ Form (Tambah/Edit)│
 *   │ (per type)   │                   │
 *   │ + Tombol Baru│                   │
 *   └──────────────┴──────────────────┘
 */
import { type CreateRoomInput, type Room } from '../model/types';
import { RoomFormPanel } from './room-form-panel';
import { RoomList } from './room-list';

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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
