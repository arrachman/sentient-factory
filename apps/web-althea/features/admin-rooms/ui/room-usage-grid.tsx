'use client';

/**
 * Grid pemakaian ruangan: rows = slot waktu, cols = ruangan, cell = booking.
 *
 * Tiap sel:
 *   - Ada booking → card warna unik psikolog (background `${color}22`,
 *     left bar 3px, dua baris: nama pendek + nama layanan)
 *   - Kosong → dashed border + ikon plus (klik = open detail panel sebagai
 *     hint untuk admin lanjut booking lewat halaman Jadwal)
 */
import { Plus } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { ROOM_TYPE_STYLE, SLOTS } from '../model/constants';
import { bookingForCell, shortName } from '../model/utils';
import type { Room } from '../model/types';

const CELL_HEIGHT_PX = 56;

export function RoomUsageGrid({
  rooms,
  bookings,
  dateKey,
  pickedKey,
  onPick,
}: {
  rooms: Room[];
  bookings: Booking[];
  dateKey: string;
  pickedKey: string | null;
  onPick: (room: Room, slotIdx: number, booking: Booking | null) => void;
}) {
  const colTpl = `90px repeat(${rooms.length}, minmax(96px, 1fr))`;

  return (
    // Satu container scroll untuk header + body — keduanya ikut saat scroll horizontal.
    // Header pakai sticky top:0 agar tetap terlihat saat scroll vertikal.
    <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
      <div style={{ minWidth: 'max-content' }}>
        <GridHeader rooms={rooms} colTpl={colTpl} />
        {SLOTS.map((slot, slotIdx) => (
          <div
            key={`${slot.start}-${slot.end}`}
            style={{
              display: 'grid',
              gridTemplateColumns: colTpl,
              borderBottom:
                slotIdx === SLOTS.length - 1
                  ? 'none'
                  : '1px solid var(--border)',
            }}
          >
            <SlotLabel slot={slot} />
            {rooms.map((r) => {
              const booking = bookingForCell(bookings, r.id, dateKey, slot);
              const cellKey = `${r.id}-${slotIdx}`;
              return (
                <GridCell
                  key={cellKey}
                  booking={booking}
                  isPicked={pickedKey === cellKey}
                  onClick={() => onPick(r, slotIdx, booking)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function GridHeader({ rooms, colTpl }: { rooms: Room[]; colTpl: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: colTpl,
        borderBottom: '1px solid var(--border)',
        background: 'var(--cream-50)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <div
        style={{
          padding: '10px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--fg-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Slot
      </div>
      {rooms.map((r) => {
        const s = ROOM_TYPE_STYLE[r.type];
        return (
          <div
            key={r.id}
            style={{
              padding: '8px 8px',
              borderLeft: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div className="row gap-1" style={{ justifyContent: 'center' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: s.fg,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={r.name}
              >
                {r.name}
              </span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--fg-muted)',
                marginTop: 2,
              }}
            >
              kap. {r.capacity}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SlotLabel({ slot }: { slot: (typeof SLOTS)[number] }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--cream-50)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--teal-800)',
        }}
      >
        {slot.start}
      </span>
      <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>
        {slot.end}
      </span>
    </div>
  );
}

function GridCell({
  booking,
  isPicked,
  onClick,
}: {
  booking: Booking | null;
  isPicked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: 4,
        borderLeft: '1px solid var(--border)',
        minHeight: CELL_HEIGHT_PX,
        cursor: 'pointer',
        background: isPicked ? 'rgba(91,138,102,0.08)' : 'transparent',
        border: 'none',
        borderTop: 0,
        borderBottom: 0,
        borderRight: 0,
        textAlign: 'left',
      }}
    >
      {booking ? <BookedCell booking={booking} /> : <EmptyCell />}
    </button>
  );
}

function BookedCell({ booking }: { booking: Booking }) {
  const psyColor =
    booking.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)';
  return (
    <div
      style={{
        background: `${psyColor}22`,
        borderLeft: `3px solid ${psyColor}`,
        borderRadius: 6,
        padding: '6px 8px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: psyColor,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {shortName(booking.psikolog.fullName, booking.psikolog.email)}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: psyColor,
          opacity: 0.7,
          lineHeight: 1.2,
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {booking.service.name}
      </div>
    </div>
  );
}

function EmptyCell() {
  return (
    <div
      style={{
        height: '100%',
        borderRadius: 6,
        border: '1px dashed var(--border-strong)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--fg-muted)',
      }}
    >
      <Plus size={12} />
    </div>
  );
}
