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

  // Booked default: sage SATURATED (lebih gelap dari Tersedia tint) +
  // strong dark border. Bedanya jelas dari Tersedia yang almost-white.
  let bg = '#a9c8b0'; // mid-sage saturated
  let borderColor = '#5b8a66'; // sage-500
  let textColor = '#1f3a25'; // sage-900
  let opacity = 1;
  let badge: string | null = null;
  let badgeBg = '';

  if (tone === 'now') {
    bg = '#5b8a66'; // sage-500 solid
    borderColor = '#385a43'; // sage-700
    textColor = '#fff';
    badge = 'BERLANGSUNG';
    badgeBg = 'rgba(255,255,255,0.3)';
  } else if (tone === 'done') {
    bg = '#ece6d3'; // cream-200
    borderColor = '#c9bfa1';
    textColor = '#6b6047';
    opacity = 0.85;
    badge = 'SELESAI';
    badgeBg = 'rgba(0,0,0,0.08)';
  } else if (tone === 'cancelled') {
    bg = '#f5f2e9'; // cream-100
    borderColor = 'var(--border)';
    textColor = 'var(--fg-muted)';
    opacity = 0.55;
    badge = 'BATAL';
    badgeBg = 'rgba(181,65,65,0.12)';
  } else {
    badge = 'BOOKED';
    badgeBg = 'rgba(91,138,102,0.28)';
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
        // Almost-white card dengan hint sage — clearly "empty / placeholder",
        // beda jelas dari Booked (saturated) atau Libur (gray).
        background: '#fafdf7',
        border: '1px solid #c5d8c8',
        color: '#5b8a66',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      Tersedia
    </div>
  );
}

function LiburCell({ cellHeight, reason }: { cellHeight: number; reason: string | null }) {
  return (
    <div
      title={reason ? `Kosong: ${reason}` : 'Kosong (luar jadwal mingguan / cuti)'}
      style={{
        height: cellHeight - 4,
        margin: 2,
        padding: '6px 8px',
        borderRadius: 6,
        // Disabled gray — clearly "not interactive", neutral non-attention
        background: '#eeece6',
        border: '1px solid #d8d4c8',
        color: '#9a9588',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      Kosong
    </div>
  );
}

function PastEmptyCell({ cellHeight }: { cellHeight: number }) {
  return (
    <div
      style={{
        height: cellHeight - 4,
        margin: 2,
        borderRadius: 6,
        background: 'rgba(0,0,0,0.015)',
        border: '1px dashed rgba(0,0,0,0.06)',
      }}
    />
  );
}
