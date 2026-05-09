'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { BookingWizard } from '@/features/admin-booking/ui/booking-wizard';
import type { Booking } from '@/features/admin-booking/model/types';
import { SPECIALTY_LABEL, type Psikolog } from '@/features/admin-psikolog/model/types';

// ============================================================================
// Constants
// ============================================================================

// Slot definitions: matches mockup labels (Pagi 1, Pagi 2, Siang 1, Siang 2, Sore, Malam)
type SlotDef = { start: string; end: string };
const SLOTS: SlotDef[] = [
  { start: '08:00', end: '09:30' },
  { start: '10:00', end: '11:30' },
  { start: '13:00', end: '14:30' },
  { start: '15:00', end: '16:30' },
  { start: '17:00', end: '18:30' },
  { start: '19:00', end: '20:30' },
];

const SVC_COLOR: Record<
  string,
  { fill: string; bar: string; text: string }
> = {
  konseling: { fill: 'rgba(91,138,102,0.12)', bar: 'var(--sage-500)', text: 'var(--teal-800)' },
  terapi: { fill: 'rgba(190,140,90,0.14)', bar: '#be8c5a', text: '#5a3d20' },
  anak: { fill: 'rgba(218,165,32,0.16)', bar: '#daa520', text: '#5e4310' },
  tes: { fill: 'rgba(137,109,179,0.14)', bar: '#896db3', text: '#3e2c5e' },
};

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayKey(): string {
  return toDateKey(new Date());
}

function shiftDate(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

function formatDateLong(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Cek apakah booking overlap dengan slot tertentu (psikolog × waktu).
 */
function findBookingForSlot(
  bookings: Booking[],
  psikologUserId: number,
  dateKey: string,
  slot: SlotDef,
): Booking | null {
  const slotStart = new Date(`${dateKey}T${slot.start}:00`);
  const slotEnd = new Date(`${dateKey}T${slot.end}:00`);
  return (
    bookings.find((b) => {
      if (b.psikologUserId !== psikologUserId) return false;
      const bStart = new Date(b.scheduledStart);
      const bEnd = new Date(b.scheduledEnd);
      return bStart < slotEnd && bEnd > slotStart;
    }) || null
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function PsikologHeader({ p }: { p: Psikolog }) {
  const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
  const rawSpecialty =
    Array.isArray(p.specialty) && p.specialty.length > 0 ? p.specialty[0] : null;
  const specialty = rawSpecialty ? SPECIALTY_LABEL[rawSpecialty] ?? rawSpecialty : p.title;
  return (
    <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: p.color ?? 'var(--sage-500)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initial}
      </span>
      <div className="flex flex-col leading-tight" style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--teal-800)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={p.fullName ?? p.email}
        >
          {p.fullName ?? p.email}
        </span>
        {specialty && (
          <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }} title={specialty}>
            {specialty}
          </span>
        )}
      </div>
    </div>
  );
}

function BookingCard({ b }: { b: Booking }) {
  const c = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
  return (
    <div
      style={{
        background: c.fill,
        borderRadius: 8,
        borderLeft: `3px solid ${c.bar}`,
        padding: '8px 9px',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform .15s var(--ease, ease)',
      }}
      title={`#${b.id} · ${b.client.name}`}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: c.text,
          marginBottom: 3,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.client.name}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: c.text,
          opacity: 0.8,
          lineHeight: 1.3,
          marginBottom: 5,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.service.name}
      </div>
      <div className="flex flex-wrap" style={{ gap: 4 }}>
        <span
          style={{
            fontSize: 10,
            padding: '1px 6px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: 4,
            color: c.text,
            fontWeight: 500,
          }}
        >
          {b.room.name}
        </span>
        {b.sessionTotal > 1 && (
          <span
            style={{
              fontSize: 10,
              padding: '1px 6px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 4,
              color: c.text,
              fontWeight: 500,
            }}
          >
            sesi {b.sessionN}/{b.sessionTotal}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptySlot({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 8,
        border: '1px dashed var(--border-strong, #d8d3c3)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        color: 'var(--fg-subtle, #b8b3a3)',
        transition: 'all .15s var(--ease, ease)',
        background: 'transparent',
      }}
      aria-label="Slot kosong — klik untuk booking baru"
    >
      <Plus size={16} />
    </button>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="card-althea-flat" style={{ padding: 14 }}>
      <div className="caption" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          {value}
        </span>
        <span className="caption">{sub}</span>
      </div>
    </div>
  );
}

function ServiceLegendItem({ category, label }: { category: string; label: string }) {
  const c = SVC_COLOR[category] ?? SVC_COLOR.konseling;
  return (
    <div className="flex items-center gap-1">
      <span style={{ width: 10, height: 10, background: c.bar, borderRadius: 2 }} />
      <span className="caption">{label}</span>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export function SchedulePage() {
  const [date, setDate] = useState<string>(todayKey());
  const [view, setView] = useState<'Hari' | 'Minggu' | 'Bulan'>('Hari');
  const [wizardOpen, setWizardOpen] = useState(false);

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const bookingList = useBookingList({ date, limit: 200, includeCancelled: false });
  const roomList = useRoomList({ limit: 200, isActive: true });

  const psikologs = psikologList.data?.data ?? [];
  const bookings = bookingList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];

  const stats = useMemo(() => {
    const totalSlots = psikologs.length * SLOTS.length;
    const usedRoomIds = new Set(bookings.map((b) => b.room.id));
    const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
    return {
      sesi: { value: bookings.length, sub: totalSlots ? `dari ${totalSlots} slot tersedia` : '—' },
      psikolog: {
        value: psikologs.length,
        sub: inProgressCount ? `${inProgressCount} sedang sesi sekarang` : 'siap menerima',
      },
      ruangan: {
        value: `${usedRoomIds.size}/${rooms.length || '—'}`,
        sub: rooms.length ? `${Math.max(0, rooms.length - usedRoomIds.size)} ruangan kosong` : 'memuat...',
      },
      wa: { value: '—', sub: 'terkirim hari ini' },
    };
  }, [psikologs.length, bookings, rooms.length]);

  const isLoading = psikologList.isLoading || bookingList.isLoading;

  return (
    <>
      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 160px)' }}>
        {/* Toolbar */}
        <div
          style={{
            padding: '18px 28px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDate(shiftDate(date, -1))}
              className="btn btn-outline btn-sm btn-icon"
              aria-label="Hari sebelumnya"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDate(todayKey())}
              className="flex items-center gap-2"
              style={{
                background: 'var(--bg-elev, var(--cream-50))',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 14px',
                height: 36,
                cursor: 'pointer',
              }}
              title="Klik untuk kembali ke hari ini"
            >
              <CalendarDays size={15} style={{ color: 'var(--sage-600)' }} />
              <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>
                {formatDateLong(date)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDate(shiftDate(date, 1))}
              className="btn btn-outline btn-sm btn-icon"
              aria-label="Hari berikutnya"
            >
              <ChevronRight size={15} />
            </button>

            {/* View toggle: Hari / Minggu / Bulan */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--cream-100)',
                borderRadius: 8,
                padding: 3,
                marginLeft: 8,
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
                      background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                      boxShadow: active ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                      color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                      height: 28,
                      padding: '0 12px',
                    }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-outline btn-sm">
              <Filter size={14} /> Filter
            </button>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} style={{ stroke: '#fff' }} /> Jadwalkan Klien
            </button>
          </div>
        </div>

        {/* Stats strip — 4 cards */}
        <div
          style={{
            padding: '0 28px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}
        >
          <StatCard label="Sesi terjadwal" value={stats.sesi.value} sub={stats.sesi.sub} />
          <StatCard label="Psikolog aktif" value={stats.psikolog.value} sub={stats.psikolog.sub} />
          <StatCard label="Ruangan terpakai" value={stats.ruangan.value} sub={stats.ruangan.sub} />
          <StatCard label="Notifikasi WA" value={stats.wa.value} sub={stats.wa.sub} />
        </div>

        {/* Schedule grid card */}
        <div style={{ padding: '0 28px 18px' }}>
          <div className="card-althea" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div
              className="flex items-center justify-between flex-wrap gap-3"
              style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="h2" style={{ margin: 0 }}>
                Grid Penjadwalan · Psikolog × Slot
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <ServiceLegendItem category="konseling" label="Konseling" />
                <ServiceLegendItem category="terapi" label="Terapi" />
                <ServiceLegendItem category="anak" label="Anak" />
                <ServiceLegendItem category="tes" label="Tes" />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-fg-muted">Memuat jadwal...</div>
            ) : psikologs.length === 0 ? (
              <div className="p-8 text-center text-fg-muted">Belum ada psikolog aktif.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                {/* Header row: Slot + N psikolog */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `110px repeat(${psikologs.length}, minmax(140px, 1fr))`,
                    borderBottom: '1px solid var(--border)',
                    minWidth: 110 + psikologs.length * 140,
                  }}
                >
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

                {/* Slot rows */}
                {SLOTS.map((slot, slotIdx) => (
                  <div
                    key={slot.start}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `110px repeat(${psikologs.length}, minmax(140px, 1fr))`,
                      borderBottom:
                        slotIdx === SLOTS.length - 1 ? 'none' : '1px solid var(--border)',
                      minWidth: 110 + psikologs.length * 140,
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 14px',
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
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {slot.start}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          color: 'var(--fg-muted)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {slot.end}
                      </span>
                    </div>
                    {psikologs.map((p) => {
                      const b = findBookingForSlot(bookings, p.userId, date, slot);
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
                            <BookingCard b={b} />
                          ) : (
                            <EmptySlot onClick={() => setWizardOpen(true)} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
