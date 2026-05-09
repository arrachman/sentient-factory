'use client';

/**
 * Room Usage Grid (read-only, reusable).
 *
 * Mirror dari mockup `RoomUsageGrid` di apps/psychology-design/AdminRooms.jsx.
 * Layout: rows = slot waktu, cols = ruangan. Sel berisi nama psikolog (warna
 * unik per psikolog) saat ruangan terpakai, atau "kosong" saat slot bebas.
 *
 * Dipakai di:
 *   - /owner/dashboard (compact, read-only ringkasan)
 *   - /resepsionis/dashboard (compact, read-only untuk recognize klien yang datang)
 *
 * Untuk versi editable dengan detail panel, lihat features/admin-rooms/ui/rooms-page.tsx.
 */

import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room, RoomType } from '@/features/admin-rooms/model/types';

export type SlotDef = { start: string; end: string };

export const ROOM_GRID_SLOTS: SlotDef[] = [
  { start: '08:00', end: '09:30' },
  { start: '10:00', end: '11:30' },
  { start: '13:00', end: '14:30' },
  { start: '15:00', end: '16:30' },
  { start: '17:00', end: '18:30' },
  { start: '19:00', end: '20:30' },
];

const TYPE_DOT: Record<RoomType, string> = {
  konseling: 'var(--sage-700)',
  anak: '#8b3d2a',
  tes: '#6b5320',
  seminar: '#2c4a60',
};

function shortPsikologName(fullName: string | null | undefined, email: string): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return email.split('@')[0];
}

function bookingForCell(
  bookings: Booking[],
  roomId: number,
  dateKey: string,
  slot: SlotDef,
): Booking | null {
  const slotStart = new Date(`${dateKey}T${slot.start}:00`).getTime();
  const slotEnd = new Date(`${dateKey}T${slot.end}:00`).getTime();
  return (
    bookings.find((b) => {
      if (b.room.id !== roomId) return false;
      const bs = new Date(b.scheduledStart).getTime();
      const be = new Date(b.scheduledEnd).getTime();
      return bs < slotEnd && be > slotStart;
    }) ?? null
  );
}

type GridProps = {
  rooms: Room[];
  bookings: Booking[];
  dateKey: string;
  /** Compact density (38px sel, font kecil, hide subtitle). Default true untuk owner. */
  compact?: boolean;
};

export function RoomUsageGrid({ rooms, bookings, dateKey, compact = true }: GridProps) {
  const cellH = compact ? 38 : 56;
  const fontTitle = compact ? 11 : 12.5;
  const fontSub = compact ? 9.5 : 10.5;
  const colTpl = `90px repeat(${rooms.length}, minmax(96px, 1fr))`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        {/* Header — daftar ruangan */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: colTpl,
            borderBottom: '1px solid var(--border)',
            background: 'var(--cream-50)',
            minWidth: 'max-content',
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
          {rooms.map((r) => (
            <div
              key={r.id}
              style={{
                padding: '8px 8px',
                borderLeft: '1px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: TYPE_DOT[r.type],
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
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>
                kap. {r.capacity}
              </div>
            </div>
          ))}
        </div>

        {/* Body — slot rows */}
        {ROOM_GRID_SLOTS.map((slot, slotIdx) => (
          <div
            key={`${slot.start}-${slot.end}`}
            style={{
              display: 'grid',
              gridTemplateColumns: colTpl,
              borderBottom:
                slotIdx === ROOM_GRID_SLOTS.length - 1
                  ? 'none'
                  : '1px solid var(--border)',
              minWidth: 'max-content',
            }}
          >
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
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)' }}>
                {slot.start}
              </span>
              <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{slot.end}</span>
            </div>
            {rooms.map((r) => {
              const booking = bookingForCell(bookings, r.id, dateKey, slot);
              const psyColor =
                booking?.psikolog?.clinicPsikologProfile?.color ??
                'var(--sage-500)';
              return (
                <div
                  key={`${r.id}-${slotIdx}`}
                  style={{
                    padding: 4,
                    borderLeft: '1px solid var(--border)',
                    minHeight: cellH,
                  }}
                >
                  {booking ? (
                    <div
                      style={{
                        background: `${psyColor}22`,
                        borderLeft: `3px solid ${psyColor}`,
                        borderRadius: 6,
                        padding: compact ? '4px 6px' : '6px 8px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: fontTitle,
                          fontWeight: 700,
                          color: psyColor,
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={`${booking.psikolog.fullName ?? booking.psikolog.email} · ${booking.service.name}`}
                      >
                        {shortPsikologName(booking.psikolog.fullName, booking.psikolog.email)}
                      </div>
                      {!compact && (
                        <div
                          style={{
                            fontSize: fontSub,
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
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 6,
                        border: '1px dashed var(--cream-200)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--fg-subtle, var(--fg-muted))',
                      }}
                    >
                      <span style={{ fontSize: 9.5 }}>kosong</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

type LegendProps = {
  /** Subset psikolog yang appear di grid (default semua aktif). */
  psikologs: Psikolog[];
  compact?: boolean;
};

export function RoomUsageLegend({ psikologs, compact = true }: LegendProps) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {psikologs.map((p) => {
        const color = p.color ?? 'var(--sage-500)';
        const short = shortPsikologName(p.fullName, p.email);
        return (
          <div key={p.id} className="flex items-center gap-1">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: color,
                display: 'inline-block',
              }}
            />
            <span
              className="caption"
              style={{
                fontSize: compact ? 10.5 : 11.5,
                color: 'var(--teal-800)',
                fontWeight: 500,
              }}
            >
              {short}
            </span>
          </div>
        );
      })}
    </div>
  );
}
