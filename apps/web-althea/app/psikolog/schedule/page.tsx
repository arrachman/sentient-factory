'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { useMe } from '@/features/auth/hooks/use-me';

// ============================================================================
// Constants
// ============================================================================

// 10 jam slots (08-17) — granularitas 1 jam mengikuti mockup
const SLOTS = ['08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00'];
const SLOT_BASE_HOUR = 8;
const SLOT_HEIGHT = 56; // px

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayKey(): string {
  return toDateKey(new Date());
}

/** Senin (start) of week containing date */
function weekStart(dateKey: string): Date {
  const d = new Date(dateKey);
  const dow = d.getDay(); // 0 Sun, 1 Mon, ...
  const offset = dow === 0 ? -6 : 1 - dow; // shift to Mon
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function shiftWeek(dateKey: string, weeks: number): string {
  const d = new Date(dateKey);
  d.setDate(d.getDate() + weeks * 7);
  return toDateKey(d);
}

function formatWeekLabel(dateKey: string): string {
  const start = weekStart(dateKey);
  const end = new Date(start);
  end.setDate(end.getDate() + 5);
  const startStr = start.toLocaleDateString('id-ID', { day: '2-digit' });
  const endStr = end.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}

function bookingPositionInDay(b: Booking, dayDate: Date): { slotIdx: number; span: number } | null {
  const start = new Date(b.scheduledStart);
  const end = new Date(b.scheduledEnd);
  // Same day check
  if (
    start.getFullYear() !== dayDate.getFullYear() ||
    start.getMonth() !== dayDate.getMonth() ||
    start.getDate() !== dayDate.getDate()
  ) {
    return null;
  }
  const slotIdx = start.getHours() - SLOT_BASE_HOUR;
  const durationHours = Math.max(1, Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000)));
  const span = durationHours;
  if (slotIdx < 0 || slotIdx >= SLOTS.length) return null;
  return { slotIdx, span };
}

function bookingTone(b: Booking): 'done' | 'now' | 'next' {
  if (b.status === 'completed') return 'done';
  if (b.status === 'in_progress') return 'now';
  return 'next';
}

// ============================================================================
// Sub-components
// ============================================================================

function ScheduleLegend() {
  const items = [
    { color: 'var(--sage-500)', border: 'var(--sage-500)', label: 'Berlangsung' },
    {
      color: 'var(--sage-100)',
      border: 'var(--sage-300)',
      label: 'Booked (akan datang)',
    },
    {
      color: 'var(--cream-200)',
      border: 'var(--border-strong)',
      label: 'Selesai',
    },
    {
      color: 'var(--bg-elev, #fff)',
      border: 'var(--sage-400)',
      borderStyle: 'dashed' as const,
      label: 'Tersedia · belum ada klien',
    },
  ];
  return (
    <div
      className="flex flex-wrap items-center"
      style={{
        gap: 16,
        padding: '0 4px 12px',
        fontSize: 11.5,
        color: 'var(--fg-muted)',
      }}
    >
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1">
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: it.color,
              border: `${it.borderStyle === 'dashed' ? '1.5px dashed' : '1px solid'} ${it.border}`,
            }}
          />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function BookingBlock({ b, slotIdx, span }: { b: Booking; slotIdx: number; span: number }) {
  const tone = bookingTone(b);
  const isNow = tone === 'now';
  const isDone = tone === 'done';
  return (
    <div
      style={{
        position: 'absolute',
        top: slotIdx * SLOT_HEIGHT + 2,
        left: 4,
        right: 4,
        height: span * SLOT_HEIGHT - 4,
        padding: '8px 10px',
        borderRadius: 6,
        background: isNow
          ? 'var(--sage-500)'
          : isDone
          ? 'var(--cream-200)'
          : 'var(--sage-100)',
        border:
          '1px solid ' +
          (isNow
            ? 'var(--sage-700)'
            : isDone
            ? 'var(--border-strong)'
            : 'var(--sage-300)'),
        color: isNow ? '#fff' : isDone ? 'var(--fg-muted)' : 'var(--sage-800)',
        opacity: isDone ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: 11,
        lineHeight: 1.3,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      title={`${b.client.name} · ${b.service.name}`}
    >
      <span
        style={{
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.client.name}
      </span>
      <span style={{ fontSize: 10, opacity: 0.85 }}>
        {b.room.name}
        {b.sessionTotal > 1 ? ` · sesi ${b.sessionN}/${b.sessionTotal}` : ''}
      </span>
      {isNow && (
        <span style={{ fontSize: 10, fontWeight: 600, marginTop: 'auto' }}>● Berlangsung</span>
      )}
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function PsikologSchedulePage() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  // Anchor di-init '' supaya SSR + client hydration konsisten (todayKey()
  // calls new Date() yang nilai-nya beda di server vs client → hydration
  // mismatch). Set ke today setelah mount via useEffect.
  const [anchor, setAnchor] = useState<string>('');
  const [view, setView] = useState<'Hari' | 'Minggu' | 'Bulan'>('Minggu');

  useEffect(() => {
    if (!anchor) setAnchor(todayKey());
  }, [anchor]);

  const start = useMemo(() => (anchor ? weekStart(anchor) : new Date()), [anchor]);
  const days = useMemo<Date[]>(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [start]);

  // Fetch bookings per day (parallel via React Query). For 6 days, this means
  // up to 6 queries — acceptable for personal schedule. Future optimization:
  // tambah `from`/`to` filter di backend, jadi cukup 1 query.
  const dayQueries = days.map((d) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBookingList(
      myUserId
        ? { psikologUserId: myUserId, date: toDateKey(d), limit: 50 }
        : { date: toDateKey(d), limit: 0 },
    ),
  );

  const dayBookings = dayQueries.map((q) => q.data?.data ?? []);
  const allBookings = dayBookings.flat();
  const isLoading = dayQueries.some((q) => q.isLoading);

  const todayIdx = days.findIndex((d) => toDateKey(d) === todayKey());

  // Stats
  const totalBooked = allBookings.length;
  const totalSlots = 6 * SLOTS.length;
  const utilisation = totalSlots > 0 ? Math.round((totalBooked / totalSlots) * 100) : 0;

  // Render skeleton sampai anchor terisi (post-mount). Mencegah hydration
  // mismatch antara SSR (todayKey() di server time) vs CSR (todayKey() di
  // client time) — timestamp bisa beda hari kalau page cached.
  if (!anchor) {
    return (
      <div style={{ padding: 24 }}>
        <div className="caption">Memuat jadwal...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center" style={{ marginBottom: 16, gap: 12 }}>
        <div
          className="flex items-center"
          style={{
            background: 'var(--bg-elev, #fff)',
            padding: 4,
            borderRadius: 8,
            border: '1px solid var(--border)',
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setAnchor(shiftWeek(anchor, -1))}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Minggu sebelumnya"
          >
            <ChevronLeft size={14} />
          </button>
          <span
            style={{
              padding: '0 12px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatWeekLabel(anchor)}
          </span>
          <button
            type="button"
            onClick={() => setAnchor(shiftWeek(anchor, 1))}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Minggu berikutnya"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* View toggle: Hari / Minggu / Bulan */}
        <div
          className="flex items-center"
          style={{
            background: 'var(--bg-elev, #fff)',
            padding: 4,
            borderRadius: 8,
            border: '1px solid var(--border)',
            gap: 2,
          }}
        >
          {(['Hari', 'Minggu', 'Bulan'] as const).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className="btn btn-sm"
                style={{
                  height: 28,
                  padding: '0 12px',
                  background: active ? 'var(--sage-500)' : 'transparent',
                  color: active ? '#fff' : 'var(--fg)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {v}
              </button>
            );
          })}
        </div>

        <span style={{ flex: 1 }} />

        <div className="flex items-center gap-2">
          <span
            className="badge"
            style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 24 }}
          >
            {totalBooked} sesi terbooking
          </span>
          <span className="badge badge-sage" style={{ height: 24 }}>
            {utilisation}% kapasitas
          </span>
        </div>
      </div>

      {/* Legend */}
      <ScheduleLegend />

      {/* Week grid */}
      <div className="card-althea" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60px repeat(6, 1fr)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ padding: '12px 8px', background: 'var(--cream-50)' }} />
          {days.map((d, i) => {
            const isToday = i === todayIdx;
            return (
              <div
                key={d.toISOString()}
                style={{
                  padding: '12px 12px',
                  textAlign: 'center',
                  background: isToday ? 'var(--sage-50)' : 'var(--cream-50)',
                  borderLeft: '1px solid var(--border)',
                }}
              >
                <span className="caption" style={{ fontSize: 11 }}>
                  {DAY_LABELS[i]}
                </span>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: isToday ? 'var(--sage-700)' : 'var(--teal-800)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {pad(d.getDate())}
                </div>
              </div>
            );
          })}
        </div>

        {/* Body grid (relative — booking blocks absolute) */}
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div
              className="caption"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(255,255,255,0.6)',
                zIndex: 5,
              }}
            >
              Memuat jadwal...
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(6, 1fr)' }}>
            {/* Time column */}
            <div className="flex flex-col">
              {SLOTS.map((t) => (
                <div
                  key={t}
                  style={{
                    height: SLOT_HEIGHT,
                    padding: '6px 8px',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'right',
                  }}
                >
                  <span
                    className="caption"
                    style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((d, dayIdx) => (
              <div
                key={d.toISOString()}
                style={{ position: 'relative', borderLeft: '1px solid var(--border)' }}
              >
                {SLOTS.map((_, si) => (
                  <div
                    key={si}
                    style={{ height: SLOT_HEIGHT, borderTop: '1px solid var(--border)' }}
                  />
                ))}
                {dayBookings[dayIdx].map((b) => {
                  const pos = bookingPositionInDay(b, d);
                  if (!pos) return null;
                  return (
                    <BookingBlock
                      key={b.id}
                      b={b}
                      slotIdx={pos.slotIdx}
                      span={pos.span}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div
        className="flex items-start gap-2"
        style={{
          marginTop: 14,
          padding: 12,
          background: 'var(--info-soft, #e6f0f7)',
          borderRadius: 8,
          border: '1px solid #cfdde8',
        }}
      >
        <Bell size={14} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0, marginTop: 2 }} />
        <span className="caption" style={{ color: '#2c4a60' }}>
          Anda hanya dapat mengubah jadwal sendiri. Untuk reschedule lintas-psikolog atau menambah
          klien baru, hubungi admin klinik.
        </span>
      </div>
    </div>
  );
}
