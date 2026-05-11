'use client';

/**
 * 1 cell di grid Jadwal Saya: 1 hari × 1 slot. Render visual sesuai 4 state:
 *   - Berlangsung (in_progress)        → sage solid + dot pulsing
 *   - Booked (akan datang / DP belum)  → sage soft
 *   - Selesai                          → cream faded
 *   - Tersedia                         → dashed sage outline + label
 *   - Libur / off-window               → cream gray plain
 *   - Past tanpa booking               → faded plain
 */
import type { Booking } from '@/features/admin-booking/model/types';
import {
  bookedTone,
  emptySlotTone,
  type DayAvailability,
} from '../model/availability';

const SVC_BAR: Record<string, string> = {
  konseling: 'var(--sage-500)',
  terapi: '#be8c5a',
  anak: '#daa520',
  tes: '#896db3',
};

export function SlotCell({
  date,
  slotIdx,
  slotStart,
  slotEnd,
  booking,
  availability,
  cellHeight,
}: {
  date: Date;
  slotIdx: number;
  slotStart: string;
  slotEnd: string;
  booking: Booking | null;
  availability: DayAvailability;
  cellHeight: number;
}) {
  if (booking) return <BookedCell booking={booking} cellHeight={cellHeight} />;

  const tone = emptySlotTone({ date, slotIdx, slotEnd, availability });
  if (tone === 'available') {
    return <AvailableCell cellHeight={cellHeight} />;
  }
  if (tone === 'past') {
    return <PastEmptyCell cellHeight={cellHeight} />;
  }
  return <LiburCell cellHeight={cellHeight} reason={availability.reason ?? null} />;
}

// ---- 4 cell variants ----

function BookedCell({ booking, cellHeight }: { booking: Booking; cellHeight: number }) {
  const tone = bookedTone(booking);
  const cat = booking.service.category;
  const bar = SVC_BAR[cat] ?? SVC_BAR.konseling;

  let bg = 'var(--sage-100)';
  let borderColor = 'var(--sage-300)';
  let textColor = 'var(--sage-800)';
  let opacity = 1;
  let badge: string | null = null;
  let badgeBg = '';

  if (tone === 'now') {
    bg = 'var(--sage-500)';
    borderColor = 'var(--sage-700)';
    textColor = '#fff';
    badge = '● BERLANGSUNG';
    badgeBg = 'rgba(255,255,255,0.25)';
  } else if (tone === 'done') {
    bg = 'var(--cream-200)';
    borderColor = 'var(--border-strong, #d4cfc1)';
    textColor = 'var(--fg-muted)';
    opacity = 0.75;
    badge = 'SELESAI';
    badgeBg = 'rgba(0,0,0,0.06)';
  } else if (tone === 'cancelled') {
    bg = 'var(--cream-100)';
    borderColor = 'var(--border)';
    textColor = 'var(--fg-muted)';
    opacity = 0.5;
    badge = 'BATAL';
    badgeBg = 'rgba(0,0,0,0.06)';
  } else {
    badge = 'BOOKED';
    badgeBg = 'rgba(91,138,102,0.18)';
  }

  return (
    <div
      title={`${booking.client.name} · ${booking.service.name}${
        booking.sessionTotal > 1 ? ` · sesi ${booking.sessionN}/${booking.sessionTotal}` : ''
      }`}
      style={{
        height: cellHeight - 4,
        margin: 2,
        padding: '6px 8px',
        borderRadius: 6,
        background: bg,
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${bar}`,
        color: textColor,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: 11,
        lineHeight: 1.25,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {booking.client.name}
      </span>
      <span
        style={{
          fontSize: 10,
          opacity: 0.85,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {booking.room?.name ?? booking.service.name}
        {booking.sessionTotal > 1 ? ` · ${booking.sessionN}/${booking.sessionTotal}` : ''}
      </span>
      {badge && (
        <span
          style={{
            marginTop: 'auto',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.04em',
            padding: '1px 5px',
            borderRadius: 3,
            background: badgeBg,
            alignSelf: 'flex-start',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function AvailableCell({ cellHeight }: { cellHeight: number }) {
  return (
    <div
      title="Slot tersedia — admin bisa booking di sini"
      style={{
        height: cellHeight - 4,
        margin: 2,
        padding: '6px 8px',
        borderRadius: 6,
        background: 'transparent',
        border: '1.5px dashed #9ebca3',
        color: '#5b8a66',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10.5,
        fontWeight: 500,
        opacity: 0.65,
      }}
    >
      Tersedia
    </div>
  );
}

function LiburCell({ cellHeight, reason }: { cellHeight: number; reason: string | null }) {
  return (
    <div
      title={reason ? `Libur: ${reason}` : 'Libur (luar jadwal mingguan / cuti)'}
      style={{
        height: cellHeight - 4,
        margin: 2,
        padding: '6px 8px',
        borderRadius: 6,
        background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.025) 4px, rgba(0,0,0,0.025) 8px)',
        border: '1px solid var(--border)',
        color: 'var(--fg-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 500,
        fontStyle: 'italic',
      }}
    >
      libur
    </div>
  );
}

function PastEmptyCell({ cellHeight }: { cellHeight: number }) {
  return (
    <div
      style={{
        height: cellHeight - 4,
        margin: 2,
        background: 'transparent',
      }}
    />
  );
}
