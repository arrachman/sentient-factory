'use client';

/**
 * Hari view — full grid `psikolog × slot` untuk satu tanggal aktif.
 * Sel kosong = EmptySlot (klik buka BookingWizard).
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { emptySlotTone } from '@/features/psikolog-schedule/model/availability';
import type { AvailabilityResolver } from '../../hooks/use-availability-map';
import { SLOTS } from '../../model/constants';
import { findBookingForSlot } from '../../model/filters';
import { BookingCard } from '../components/booking-card';
import { EmptySlot } from '../components/empty-slot';
import { PsikologHeader } from '../components/psikolog-header';

export function HariView({
  date,
  psikologs,
  bookings,
  isLoading,
  onBookingClick,
  resolveAvailability,
  onEmptySlotClick,
}: {
  date: string;
  psikologs: Psikolog[];
  bookings: Booking[];
  isLoading: boolean;
  onBookingClick: (b: Booking) => void;
  resolveAvailability?: AvailabilityResolver;
  onEmptySlotClick?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-fg-muted">Memuat jadwal...</div>
    );
  }
  if (psikologs.length === 0) {
    return (
      <div className="p-8 text-center text-fg-muted">
        Belum ada psikolog aktif.
      </div>
    );
  }

  const colTpl = `110px repeat(${psikologs.length}, minmax(140px, 1fr))`;
  const minWidth = 110 + psikologs.length * 140;
  const dateObj = new Date(`${date}T00:00:00`);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: colTpl,
          borderBottom: '1px solid var(--border)',
          minWidth,
        }}
      >
        <SlotHeaderCell />
        {psikologs.map((p) => (
          <div
            key={p.id}
            style={{
              padding: '12px 10px',
              borderLeft: '1px solid var(--border)',
            }}
          >
            <PsikologHeader p={p} />
          </div>
        ))}
      </div>

      {SLOTS.map((slot, slotIdx) => (
        <div
          key={slot.start}
          style={{
            display: 'grid',
            gridTemplateColumns: colTpl,
            borderBottom:
              slotIdx === SLOTS.length - 1
                ? 'none'
                : '1px solid var(--border)',
            minWidth,
            background: slotIdx % 2 === 1 ? 'rgba(247, 244, 237, 0.55)' : 'transparent',
          }}
        >
          <SlotLabel start={slot.start} end={slot.end} />
          {psikologs.map((p) => {
            const b = findBookingForSlot(bookings, p.userId, date, slot);
            let emptyTone;
            let emptyReason: string | null = null;
            if (!b && resolveAvailability) {
              const avail = resolveAvailability(p.userId, dateObj);
              emptyTone = emptySlotTone({
                date: dateObj,
                slotIdx,
                slotEnd: slot.end,
                availability: avail,
              });
              emptyReason = avail.reason ?? null;
            }
            return (
              <div
                key={p.id}
                style={{
                  padding: 6,
                  borderLeft: '1px solid var(--border)',
                  minHeight: 88,
                }}
              >
                {b ? (
                  <BookingCard b={b} onClick={() => onBookingClick(b)} />
                ) : (
                  <EmptySlot
                    tone={emptyTone}
                    reason={emptyReason}
                    onClick={onEmptySlotClick}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SlotHeaderCell() {
  return (
    <div
      style={{
        padding: '12px 14px',
        fontSize: 11.5,
        fontWeight: 600,
        color: 'var(--fg-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      Slot
    </div>
  );
}

function SlotLabel({ start, end }: { start: string; end: string }) {
  return (
    <div
      style={{
        padding: '12px 14px',
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
        {start}
      </span>
      <span
        style={{
          fontSize: 10.5,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {end}
      </span>
    </div>
  );
}
