'use client';

/**
 * Detail panel kanan saat user klik sel di RoomUsageGrid.
 * Tampilan:
 *   - Ikon kotak warna tipe ruangan + nama (Lora 20px) + badge type/kap/active
 *   - Sesi pada slot terpilih (psikolog avatar + klien + layanan + sesi N/total),
 *     atau placeholder "slot kosong"
 *   - Fasilitas → badges (dari `room.description` atau default by type)
 *   - Action: Edit ruangan / Hapus
 */
import { Pencil, Trash2, X } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { DEFAULT_FACILITIES, ROOM_TYPE_STYLE, type SlotDef } from '../model/constants';
import { ROOM_TYPE_LABEL, type Room } from '../model/types';

export function RoomDetailPanel({
  room,
  slot,
  booking,
  onClose,
  onEdit,
  onDelete,
}: {
  room: Room;
  slot: SlotDef;
  booking: Booking | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const style = ROOM_TYPE_STYLE[room.type];
  const Icon = style.icon;
  // Sumber fasilitas: prefer structured `facilities` array. Legacy fallback
  // ke `description` comma-separated untuk room lama yang belum di-migrate.
  // Ultimate fallback ke DEFAULT_FACILITIES per type supaya UI tidak kosong.
  const facilities =
    room.facilities && room.facilities.length > 0
      ? room.facilities
      : room.description && room.description.includes(',')
        ? room.description
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : DEFAULT_FACILITIES[room.type];

  return (
    <aside
      className="card-althea"
      style={{
        width: 320,
        flexShrink: 0,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflowY: 'auto',
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow">Detail · {slot.start}</span>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Tutup"
        >
          <X size={14} />
        </button>
      </div>

      <div className="col gap-2">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: style.bg,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon size={26} style={{ color: style.fg }} />
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          {room.name}
        </h3>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <span
            className="badge"
            style={{
              background: style.bg,
              color: style.fg,
              textTransform: 'capitalize',
            }}
          >
            {ROOM_TYPE_LABEL[room.type]}
          </span>
          <span className="badge badge-neutral">
            kap. {room.capacity} orang
          </span>
          {!room.isActive ? (
            <span className="badge badge-warn">Nonaktif</span>
          ) : null}
        </div>
      </div>

      <Hr />

      <div className="col gap-2">
        <span className="eyebrow">Sesi pada slot ini</span>
        {booking ? <BookingSummary booking={booking} /> : <EmptySlotMessage />}
      </div>

      <div className="col gap-2">
        <span className="eyebrow">Fasilitas</span>
        <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
          {facilities.length === 0 ? (
            <span className="caption">—</span>
          ) : (
            facilities.map((f) => (
              <span key={f} className="badge badge-neutral">
                {f}
              </span>
            ))
          )}
        </div>
      </div>

      <Hr />

      <div className="row gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
        >
          <Pencil size={13} /> Edit ruangan
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-ghost btn-sm"
          style={{ flex: 1, color: 'var(--danger)' }}
        >
          <Trash2 size={13} /> Hapus
        </button>
      </div>
    </aside>
  );
}

function Hr() {
  return (
    <hr
      style={{
        height: 1,
        background: 'var(--border)',
        border: 0,
        margin: 0,
      }}
    />
  );
}

function BookingSummary({ booking }: { booking: Booking }) {
  const psyColor =
    booking.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)';
  const psyDisplay = booking.psikolog.fullName ?? booking.psikolog.email;
  const psyTitle = booking.psikolog.clinicPsikologProfile?.title;

  return (
    <div className="card-althea-flat" style={{ padding: 12 }}>
      <div
        className="row gap-2"
        style={{ alignItems: 'center', marginBottom: 6 }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: psyColor,
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {psyDisplay.slice(0, 2).toUpperCase()}
        </span>
        <div className="col" style={{ minWidth: 0 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
            }}
          >
            {psyDisplay}
          </span>
          {psyTitle ? (
            <span className="caption" style={{ fontSize: 10.5 }}>
              {psyTitle}
            </span>
          ) : null}
        </div>
      </div>
      <div className="caption" style={{ lineHeight: 1.5 }}>
        Klien:{' '}
        <strong style={{ color: 'var(--fg)' }}>{booking.client.name}</strong>
        <br />
        Layanan: {booking.service.name}
        <br />
        Sesi: {booking.sessionN}/{booking.sessionTotal}
      </div>
    </div>
  );
}

function EmptySlotMessage() {
  return (
    <p
      className="caption"
      style={{
        margin: 0,
        padding: 12,
        background: 'var(--cream-50)',
        borderRadius: 8,
        lineHeight: 1.5,
      }}
    >
      Slot kosong — booking baru bisa dibuat lewat halaman Jadwal.
    </p>
  );
}
