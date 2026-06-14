'use client';

import { PowerOff, Plus, Trash2 } from 'lucide-react';
import { ROOM_TYPES, ROOM_TYPE_LABEL, type Room } from '../model/types';

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
        opacity: room.isActive ? 1 : 0.5,
      }}
    >
      <button
        type="button"
        onClick={onEdit}
        className="col"
        style={{
          minWidth: 0, alignItems: 'flex-start', gap: 2, flex: 1,
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: room.isActive ? 'var(--teal-800)' : 'var(--fg-muted, #6b7280)' }}>{room.name}</span>
        <span className="caption" style={{ fontSize: 11 }}>
          kap. {room.capacity}{room.isActive ? '' : ' · nonaktif'}
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

export function RoomList({
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
    <div className="flex flex-col" style={{ width: 320, borderRight: '1px solid var(--border)', background: 'var(--cream-50)' }}>
      <div className="row" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <h2 className="text-base font-medium" style={{ margin: 0 }}>Atur Ruangan</h2>
        <button type="button" onClick={onCreateNew} className="btn btn-primary btn-sm">
          <Plus size={13} /> Baru
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {ROOM_TYPES.map((type) => {
          const filtered = rooms.filter((r) => r.type === type);
          if (filtered.length === 0) return null;
          return (
            <div key={type} style={{ marginBottom: 14 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>{ROOM_TYPE_LABEL[type]}</div>
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
        {rooms.length === 0 && (
          <div className="caption" style={{ padding: 12, textAlign: 'center' }}>Belum ada ruangan.</div>
        )}
      </div>
    </div>
  );
}
