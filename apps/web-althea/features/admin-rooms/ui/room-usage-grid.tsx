'use client';

/**
 * Grid pemakaian ruangan: rows = slot waktu, cols = ruangan, cell = booking.
 *
 * Visual hierarchy:
 *   - Booked → card warna psikolog menonjol (opacity 26%, left bar 3px)
 *   - Empty (admin) → dashed border + ikon plus (afford klik)
 *   - Empty (readOnly) → near-invisible; hanya muncul saat hover
 *   - Row banding: even rows soft cream tint untuk membantu eye-track horizontal
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { ROOM_TYPE_STYLE } from '../model/constants';
import type { SlotDef } from '../model/constants';
import { bookingForCell, shortName } from '../model/utils';
import type { Room } from '../model/types';

const CELL_HEIGHT_PX = 58;
const ROW_BAND_EVEN = 'rgba(247, 244, 237, 0.55)';
const PICKED_BG = 'rgba(91, 138, 102, 0.12)';

export function RoomUsageGrid({
  rooms,
  bookings,
  dateKey,
  slots,
  pickedKey = null,
  onPick,
  readOnly = false,
}: {
  rooms: Room[];
  bookings: Booking[];
  dateKey: string;
  slots: SlotDef[];
  pickedKey?: string | null;
  onPick?: (room: Room, slotIdx: number, booking: Booking | null) => void;
  readOnly?: boolean;
}) {
  const activeRooms = rooms.filter((r) => r.isActive);
  const colTpl = `90px repeat(${activeRooms.length}, minmax(96px, 1fr))`;

  return (
    // Satu container scroll untuk header + body — keduanya ikut saat scroll horizontal.
    // Header pakai sticky top:0 agar tetap terlihat saat scroll vertikal.
    <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
      <div style={{ minWidth: 'max-content' }}>
        <GridHeader rooms={activeRooms} colTpl={colTpl} />
        {slots.map((slot, slotIdx) => (
          <div
            key={`${slot.start}-${slot.end}`}
            style={{
              display: 'grid',
              gridTemplateColumns: colTpl,
              borderBottom:
                slotIdx === slots.length - 1
                  ? 'none'
                  : '1px solid var(--border)',
              background: slotIdx % 2 === 1 ? ROW_BAND_EVEN : 'transparent',
            }}
          >
            <SlotLabel slot={slot} idx={slotIdx} />
            {activeRooms.map((r) => {
              const booking = bookingForCell(bookings, r.id, dateKey, slot);
              const cellKey = `${r.id}-${slotIdx}`;
              return (
                <GridCell
                  key={cellKey}
                  booking={booking}
                  isPicked={pickedKey === cellKey}
                  readOnly={readOnly}
                  isInactive={!r.isActive}
                  onClick={() => onPick?.(r, slotIdx, booking)}
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
              opacity: r.isActive ? 1 : 0.45,
              background: r.isActive ? 'transparent' : 'rgba(0,0,0,0.03)',
            }}
          >
            <div className="row gap-1" style={{ justifyContent: 'center' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: r.isActive ? s.fg : 'var(--fg-muted)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: r.isActive ? 'var(--teal-800)' : 'var(--fg-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={r.isActive ? r.name : `${r.name} (nonaktif)`}
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
              {r.isActive ? `kap. ${r.capacity}` : 'nonaktif'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SlotLabel({ slot, idx }: { slot: SlotDef; idx: number }) {
  return (
    <div
      style={{
        padding: '8px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRight: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {slot.label ?? `Slot ${idx + 1}`}
      </span>
    </div>
  );
}

function GridCell({
  booking,
  isPicked,
  readOnly,
  isInactive,
  onClick,
}: {
  booking: Booking | null;
  isPicked: boolean;
  readOnly: boolean;
  isInactive: boolean;
  onClick: () => void;
}) {
  const cellClass = booking
    ? 'room-cell room-cell--booked'
    : readOnly
      ? 'room-cell room-cell--empty-readonly'
      : 'room-cell room-cell--empty';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cellClass}
      data-picked={isPicked || undefined}
      style={{
        padding: 4,
        borderLeft: '1px solid var(--border)',
        minHeight: CELL_HEIGHT_PX,
        cursor: 'pointer',
        background: isPicked ? PICKED_BG : isInactive ? 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 2px, transparent 2px, transparent 8px)' : 'transparent',
        opacity: isInactive ? 0.5 : 1,
        borderTop: 0,
        borderBottom: 0,
        borderRight: 0,
        textAlign: 'left',
        transition: 'background 120ms ease',
      }}
    >
      {booking ? <BookedCell booking={booking} /> : <EmptyCell readOnly={readOnly} />}
    </button>
  );
}

function BookedCell({ booking }: { booking: Booking }) {
  const psyColor =
    booking.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)';
  return (
    <div
      style={{
        background: `${psyColor}26`,
        borderLeft: `3px solid ${psyColor}`,
        borderRadius: 6,
        padding: '7px 10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: `inset 0 0 0 1px ${psyColor}1a`,
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
          opacity: 0.78,
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

function EmptyCell(_: { readOnly: boolean }) {
  // Sengaja kosong visual di semua role — biarkan row band yang berbicara.
  // Hover affordance di-handle via CSS class (room-cell--empty / room-cell--empty-readonly).
  return <div style={{ height: '100%', borderRadius: 6 }} aria-hidden />;
}
