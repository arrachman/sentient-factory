'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Plus, X } from 'lucide-react';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { BookingWizard } from '@/features/admin-booking/ui/booking-wizard';
import {
  BOOKING_STATUSES,
  STATUS_LABEL,
  type Booking,
  type BookingStatus,
} from '@/features/admin-booking/model/types';
import { SPECIALTY_LABEL, type Psikolog } from '@/features/admin-psikolog/model/types';

// ============================================================================
// Constants
// ============================================================================

type SlotDef = { start: string; end: string };
const SLOTS: SlotDef[] = [
  { start: '08:00', end: '09:30' },
  { start: '10:00', end: '11:30' },
  { start: '13:00', end: '14:30' },
  { start: '15:00', end: '16:30' },
  { start: '17:00', end: '18:30' },
  { start: '19:00', end: '20:30' },
];

const SVC_COLOR: Record<string, { fill: string; bar: string; text: string }> = {
  konseling: { fill: 'rgba(91,138,102,0.12)', bar: 'var(--sage-500)', text: 'var(--teal-800)' },
  terapi: { fill: 'rgba(190,140,90,0.14)', bar: '#be8c5a', text: '#5a3d20' },
  anak: { fill: 'rgba(218,165,32,0.16)', bar: '#daa520', text: '#5e4310' },
  tes: { fill: 'rgba(137,109,179,0.14)', bar: '#896db3', text: '#3e2c5e' },
};

const SVC_CATEGORIES = ['konseling', 'terapi', 'anak', 'tes'] as const;
const SVC_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  anak: 'Anak',
  tes: 'Tes',
};

const DAY_LABELS_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

type ViewMode = 'Hari' | 'Minggu' | 'Bulan';

type Filters = {
  psikologIds: Set<number>;
  categories: Set<string>;
  roomIds: Set<number>;
  statuses: Set<BookingStatus>;
};

const EMPTY_FILTERS: Filters = {
  psikologIds: new Set(),
  categories: new Set(),
  roomIds: new Set(),
  statuses: new Set(),
};

// ============================================================================
// Date helpers
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

function addDays(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

function addMonths(key: string, months: number): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + months);
  return toDateKey(d);
}

function weekStartMonday(key: string): string {
  const d = new Date(key);
  const dow = d.getDay(); // 0=Sun, 1=Mon, ...
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return toDateKey(d);
}

function monthStart(key: string): string {
  const d = new Date(key);
  d.setDate(1);
  return toDateKey(d);
}

function monthEnd(key: string): string {
  const d = new Date(key);
  d.setMonth(d.getMonth() + 1, 0);
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

function formatWeekRange(start: string): string {
  const s = new Date(start);
  const e = new Date(start);
  e.setDate(e.getDate() + 6);
  const sameMonth = s.getMonth() === e.getMonth();
  const startStr = s.toLocaleDateString('id-ID', { day: '2-digit' });
  const endStr = e.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return sameMonth
    ? `${startStr} – ${endStr}`
    : `${s.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} – ${endStr}`;
}

function formatMonth(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

// ============================================================================
// Booking helpers
// ============================================================================

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

function applyFilters(bookings: Booking[], filters: Filters): Booking[] {
  const { psikologIds, categories, roomIds, statuses } = filters;
  if (
    psikologIds.size === 0 &&
    categories.size === 0 &&
    roomIds.size === 0 &&
    statuses.size === 0
  ) {
    return bookings;
  }
  return bookings.filter((b) => {
    if (psikologIds.size > 0 && !psikologIds.has(b.psikologUserId)) return false;
    if (categories.size > 0 && !categories.has(b.service.category)) return false;
    if (roomIds.size > 0 && !roomIds.has(b.room.id)) return false;
    if (statuses.size > 0 && !statuses.has(b.status)) return false;
    return true;
  });
}

function filterCount(filters: Filters): number {
  return (
    filters.psikologIds.size +
    filters.categories.size +
    filters.roomIds.size +
    filters.statuses.size
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
          width: 32, height: 32, borderRadius: 999,
          background: p.color ?? 'var(--sage-500)',
          color: '#fff', display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}
      >
        {initial}
      </span>
      <div className="flex flex-col leading-tight" style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
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
        background: c.fill, borderRadius: 8, borderLeft: `3px solid ${c.bar}`,
        padding: '8px 9px', height: '100%', cursor: 'pointer',
      }}
      title={`#${b.id} · ${b.client.name}`}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 3, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {b.client.name}
      </div>
      <div style={{ fontSize: 10.5, color: c.text, opacity: 0.8, lineHeight: 1.3, marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {b.service.name}
      </div>
      <div className="flex flex-wrap" style={{ gap: 4 }}>
        <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(255,255,255,0.6)', borderRadius: 4, color: c.text, fontWeight: 500 }}>
          {b.room.name}
        </span>
        {b.sessionTotal > 1 && (
          <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(255,255,255,0.6)', borderRadius: 4, color: c.text, fontWeight: 500 }}>
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
        height: '100%', width: '100%', borderRadius: 8,
        border: '1px dashed var(--border-strong, #d8d3c3)',
        display: 'grid', placeItems: 'center', cursor: 'pointer',
        color: 'var(--fg-subtle, #b8b3a3)', background: 'transparent',
      }}
      aria-label="Slot kosong — klik untuk booking baru"
    >
      <Plus size={16} />
    </button>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="card-althea-flat" style={{ padding: 14 }}>
      <div className="caption" style={{ marginBottom: 6 }}>{label}</div>
      <div className="flex items-baseline gap-2">
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: 'var(--teal-800)' }}>{value}</span>
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
// Filter Popover
// ============================================================================

function FilterPopover({
  open,
  onClose,
  filters,
  onChange,
  psikologs,
  rooms,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (next: Filters) => void;
  psikologs: Psikolog[];
  rooms: Array<{ id: number; name: string; type: string }>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, onClose]);

  if (!open) return null;

  function toggle<T>(set: Set<T>, v: T): Set<T> {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  }

  const total = filterCount(filters);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Filter jadwal"
      className="card-althea"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        width: 320,
        maxHeight: 480,
        overflowY: 'auto',
        zIndex: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: 16,
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <span className="eyebrow">Filter ({total})</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={total === 0}
            className="btn btn-ghost btn-sm"
            style={{ height: 24, padding: '0 8px', fontSize: 11 }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Tutup"
            style={{ height: 24, width: 24 }}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Service category */}
      <div style={{ marginBottom: 14 }}>
        <span className="caption" style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
          Kategori layanan
        </span>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {SVC_CATEGORIES.map((cat) => {
            const active = filters.categories.has(cat);
            const c = SVC_COLOR[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    categories: toggle(filters.categories, cat),
                  })
                }
                className="btn btn-sm"
                style={{
                  height: 24,
                  padding: '0 10px',
                  fontSize: 11.5,
                  background: active ? c.bar : 'var(--cream-100)',
                  color: active ? '#fff' : 'var(--fg)',
                  border: '1px solid ' + (active ? c.bar : 'var(--border)'),
                }}
              >
                {SVC_LABEL[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: 14 }}>
        <span className="caption" style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
          Status booking
        </span>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {BOOKING_STATUSES.filter((s) => s !== 'cancelled').map((status) => {
            const active = filters.statuses.has(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  onChange({ ...filters, statuses: toggle(filters.statuses, status) })
                }
                className="btn btn-sm"
                style={{
                  height: 24,
                  padding: '0 10px',
                  fontSize: 11.5,
                  background: active ? 'var(--sage-500)' : 'var(--cream-100)',
                  color: active ? '#fff' : 'var(--fg)',
                  border: '1px solid ' + (active ? 'var(--sage-500)' : 'var(--border)'),
                }}
              >
                {STATUS_LABEL[status]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Psikolog */}
      <div style={{ marginBottom: 14 }}>
        <span className="caption" style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
          Psikolog ({filters.psikologIds.size}/{psikologs.length})
        </span>
        <div
          className="flex flex-col"
          style={{ gap: 4, maxHeight: 140, overflowY: 'auto' }}
        >
          {psikologs.map((p) => {
            const active = filters.psikologIds.has(p.userId);
            return (
              <label
                key={p.userId}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  background: active ? 'var(--sage-50)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    onChange({
                      ...filters,
                      psikologIds: toggle(filters.psikologIds, p.userId),
                    })
                  }
                  className="h-3.5 w-3.5"
                />
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.fullName ?? p.email}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Room */}
      {rooms.length > 0 && (
        <div>
          <span className="caption" style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Ruangan ({filters.roomIds.size}/{rooms.length})
          </span>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {rooms.map((r) => {
              const active = filters.roomIds.has(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, roomIds: toggle(filters.roomIds, r.id) })
                  }
                  className="btn btn-sm"
                  style={{
                    height: 22,
                    padding: '0 8px',
                    fontSize: 11,
                    background: active ? 'var(--teal-700)' : 'var(--cream-100)',
                    color: active ? '#fff' : 'var(--fg)',
                    border: '1px solid ' + (active ? 'var(--teal-700)' : 'var(--border)'),
                  }}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Hari view (full grid: psikolog × slot)
// ============================================================================

function HariView({
  date,
  psikologs,
  bookings,
  isLoading,
  onCellClick,
}: {
  date: string;
  psikologs: Psikolog[];
  bookings: Booking[];
  isLoading: boolean;
  onCellClick: () => void;
}) {
  if (isLoading) return <div className="p-8 text-center text-fg-muted">Memuat jadwal...</div>;
  if (psikologs.length === 0)
    return <div className="p-8 text-center text-fg-muted">Belum ada psikolog aktif.</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `110px repeat(${psikologs.length}, minmax(140px, 1fr))`,
          borderBottom: '1px solid var(--border)',
          minWidth: 110 + psikologs.length * 140,
        }}
      >
        <div style={{ padding: '12px 14px', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Slot
        </div>
        {psikologs.map((p) => (
          <div key={p.id} style={{ padding: '12px 10px', borderLeft: '1px solid var(--border)' }}>
            <PsikologHeader p={p} />
          </div>
        ))}
      </div>

      {SLOTS.map((slot, slotIdx) => (
        <div
          key={slot.start}
          style={{
            display: 'grid',
            gridTemplateColumns: `110px repeat(${psikologs.length}, minmax(140px, 1fr))`,
            borderBottom: slotIdx === SLOTS.length - 1 ? 'none' : '1px solid var(--border)',
            minWidth: 110 + psikologs.length * 140,
          }}
        >
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream-50)', borderRight: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{slot.start}</span>
            <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{slot.end}</span>
          </div>
          {psikologs.map((p) => {
            const b = findBookingForSlot(bookings, p.userId, date, slot);
            return (
              <div key={p.id} style={{ padding: 6, borderLeft: '1px solid var(--border)', minHeight: 88 }}>
                {b ? <BookingCard b={b} /> : <EmptySlot onClick={onCellClick} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Minggu view (7 days × 6 slots)
// ============================================================================

function MingguView({
  weekStart,
  bookings,
  isLoading,
  onCellClick,
}: {
  weekStart: string;
  bookings: Booking[];
  isLoading: boolean;
  onCellClick: () => void;
}) {
  if (isLoading) return <div className="p-8 text-center text-fg-muted">Memuat jadwal minggu...</div>;

  const days: string[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));
  const today = todayKey();

  // Group bookings by date+slot index
  const byCell = new Map<string, Booking[]>();
  for (const b of bookings) {
    const start = new Date(b.scheduledStart);
    const dateKey = toDateKey(start);
    const hour = start.getHours();
    const slotIdx = SLOTS.findIndex((s) => parseInt(s.start.split(':')[0], 10) === hour || (parseInt(s.start.split(':')[0], 10) <= hour && parseInt(s.end.split(':')[0], 10) > hour));
    if (slotIdx === -1) continue;
    const key = `${dateKey}#${slotIdx}`;
    if (!byCell.has(key)) byCell.set(key, []);
    byCell.get(key)!.push(b);
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '110px repeat(7, minmax(120px, 1fr))',
          borderBottom: '1px solid var(--border)',
          minWidth: 110 + 7 * 120,
        }}
      >
        <div style={{ padding: '12px 14px', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Slot
        </div>
        {days.map((d, i) => {
          const isToday = d === today;
          const dateObj = new Date(d);
          return (
            <div
              key={d}
              style={{
                padding: '12px 10px',
                borderLeft: '1px solid var(--border)',
                background: isToday ? 'var(--sage-50)' : 'transparent',
                textAlign: 'center',
              }}
            >
              <span className="caption" style={{ fontSize: 10.5, display: 'block' }}>
                {DAY_LABELS_SHORT[i]}
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: isToday ? 'var(--sage-700)' : 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>
                {pad(dateObj.getDate())}
              </span>
            </div>
          );
        })}
      </div>

      {/* Slot rows */}
      {SLOTS.map((slot, slotIdx) => (
        <div
          key={slot.start}
          style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(7, minmax(120px, 1fr))',
            borderBottom: slotIdx === SLOTS.length - 1 ? 'none' : '1px solid var(--border)',
            minWidth: 110 + 7 * 120,
          }}
        >
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream-50)', borderRight: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{slot.start}</span>
            <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{slot.end}</span>
          </div>
          {days.map((d) => {
            const cellKey = `${d}#${slotIdx}`;
            const cellBookings = byCell.get(cellKey) ?? [];
            const isToday = d === today;
            return (
              <div
                key={d}
                style={{
                  padding: 4,
                  borderLeft: '1px solid var(--border)',
                  minHeight: 72,
                  background: isToday ? 'rgba(91,138,102,0.04)' : 'transparent',
                }}
              >
                {cellBookings.length === 0 ? (
                  <EmptySlot onClick={onCellClick} />
                ) : (
                  <div className="flex flex-col" style={{ gap: 3, height: '100%' }}>
                    {cellBookings.slice(0, 2).map((b) => {
                      const c = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
                      return (
                        <div
                          key={b.id}
                          style={{
                            background: c.fill,
                            borderLeft: `2px solid ${c.bar}`,
                            borderRadius: 4,
                            padding: '3px 6px',
                            fontSize: 10.5,
                            color: c.text,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={`#${b.id} · ${b.client.name} · ${b.room.name}`}
                        >
                          {b.client.name}
                        </div>
                      );
                    })}
                    {cellBookings.length > 2 && (
                      <span className="caption" style={{ fontSize: 10, paddingLeft: 4 }}>
                        +{cellBookings.length - 2} lagi
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Bulan view (month calendar with booking count per day)
// ============================================================================

function BulanView({
  monthAnchor,
  bookings,
  isLoading,
  onDayClick,
}: {
  monthAnchor: string;
  bookings: Booking[];
  isLoading: boolean;
  onDayClick: (dateKey: string) => void;
}) {
  if (isLoading) return <div className="p-8 text-center text-fg-muted">Memuat jadwal bulan...</div>;

  const start = new Date(monthStart(monthAnchor));
  const end = new Date(monthEnd(monthAnchor));
  const today = todayKey();

  // First Monday-aligned cell
  const firstDow = start.getDay();
  const offset = firstDow === 0 ? -6 : 1 - firstDow;
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() + offset);

  // Build 6 × 7 = 42 cells
  const cells: { dateKey: string; inMonth: boolean; isToday: boolean; count: number; categories: Set<string> }[] = [];
  const countByDate = new Map<string, { count: number; categories: Set<string> }>();
  for (const b of bookings) {
    const dk = toDateKey(new Date(b.scheduledStart));
    if (!countByDate.has(dk)) countByDate.set(dk, { count: 0, categories: new Set() });
    const entry = countByDate.get(dk)!;
    entry.count += 1;
    entry.categories.add(b.service.category);
  }

  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const dk = toDateKey(d);
    const inMonth = d >= start && d <= end;
    const stat = countByDate.get(dk) ?? { count: 0, categories: new Set<string>() };
    cells.push({ dateKey: dk, inMonth, isToday: dk === today, count: stat.count, categories: stat.categories });
  }

  return (
    <div>
      {/* Day-of-week header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {DAY_LABELS_SHORT.map((d) => (
          <div
            key={d}
            style={{
              padding: '10px 8px',
              textAlign: 'center',
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'var(--cream-50)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 'minmax(80px, 1fr)',
        }}
      >
        {cells.map((cell, i) => {
          const day = new Date(cell.dateKey).getDate();
          const isLastRow = i >= 35;
          return (
            <button
              type="button"
              key={cell.dateKey + i}
              onClick={() => onDayClick(cell.dateKey)}
              style={{
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border)',
                borderBottom: isLastRow ? 'none' : '1px solid var(--border)',
                background: cell.isToday
                  ? 'var(--sage-50)'
                  : cell.inMonth
                  ? 'transparent'
                  : 'var(--cream-50)',
                opacity: cell.inMonth ? 1 : 0.5,
                padding: 8,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
              title={`${formatDateLong(cell.dateKey)} · ${cell.count} booking`}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: cell.isToday ? 700 : 500,
                    color: cell.isToday ? 'var(--sage-700)' : 'var(--teal-800)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {day}
                </span>
                {cell.count > 0 && (
                  <span
                    className="badge badge-sage"
                    style={{ height: 16, fontSize: 10, padding: '0 6px' }}
                  >
                    {cell.count}
                  </span>
                )}
              </div>
              {/* Category dots */}
              {cell.categories.size > 0 && (
                <div className="flex" style={{ gap: 2, marginTop: 'auto' }}>
                  {Array.from(cell.categories).slice(0, 4).map((cat) => {
                    const c = SVC_COLOR[cat] ?? SVC_COLOR.konseling;
                    return (
                      <span
                        key={cat}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: c.bar,
                        }}
                        title={SVC_LABEL[cat]}
                      />
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export function SchedulePage() {
  const [date, setDate] = useState<string>(todayKey());
  const [view, setView] = useState<ViewMode>('Hari');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });

  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];

  // Determine date range to fetch based on view
  const datesToFetch = useMemo(() => {
    if (view === 'Hari') return [date];
    if (view === 'Minggu') {
      const start = weekStartMonday(date);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    // Bulan: fetch all days of grid (42 cells) — but heavy. Limit to month-only.
    const start = new Date(monthStart(date));
    const end = new Date(monthEnd(date));
    const out: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(toDateKey(d));
    }
    return out;
  }, [date, view]);

  // useQueries: dynamic batch yang aman untuk Rules of Hooks (Hari=1 / Minggu=7
  // / Bulan=~31 queries — array length berubah saat view switch). React Query
  // handle internal subscription, kita cukup pass arr config.
  const dayQueries = useQueries({
    queries: datesToFetch.map((d) => ({
      queryKey: ['clinic', 'booking', 'list', { date: d, limit: 200, includeCancelled: false }],
      queryFn: () => bookingApi.list({ date: d, limit: 200, includeCancelled: false }),
    })),
  });
  const isLoading = dayQueries.some((q) => q.isLoading) || psikologList.isLoading;
  const allBookings = useMemo<Booking[]>(
    () => dayQueries.flatMap((q) => q.data?.data ?? []),
    // dataUpdatedAt joined as a stable signature
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayQueries.map((q) => q.dataUpdatedAt).join(',')],
  );

  const filteredBookings = useMemo(
    () => applyFilters(allBookings, filters),
    [allBookings, filters],
  );

  // Stats — for Hari mode focus on today; Minggu/Bulan use entire range
  const stats = useMemo(() => {
    const totalSlots = psikologs.length * SLOTS.length * (datesToFetch.length || 1);
    const usedRoomIds = new Set(filteredBookings.map((b) => b.room.id));
    const inProgressCount = filteredBookings.filter((b) => b.status === 'in_progress').length;
    return {
      sesi: { value: filteredBookings.length, sub: totalSlots ? `dari ${totalSlots} slot tersedia` : '—' },
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
  }, [psikologs.length, filteredBookings, rooms.length, datesToFetch.length]);

  function shiftPrev() {
    if (view === 'Hari') setDate(addDays(date, -1));
    else if (view === 'Minggu') setDate(addDays(date, -7));
    else setDate(addMonths(date, -1));
  }
  function shiftNext() {
    if (view === 'Hari') setDate(addDays(date, 1));
    else if (view === 'Minggu') setDate(addDays(date, 7));
    else setDate(addMonths(date, 1));
  }

  // Date pill label
  const dateLabel =
    view === 'Hari'
      ? formatDateLong(date)
      : view === 'Minggu'
      ? formatWeekRange(weekStartMonday(date))
      : formatMonth(date);

  const activeFilterCount = filterCount(filters);

  function handleBulanDayClick(dateKey: string) {
    // Switch to Hari view at clicked date
    setDate(dateKey);
    setView('Hari');
  }

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
            position: 'relative',
          }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shiftPrev}
              className="btn btn-outline btn-sm btn-icon"
              aria-label={`${view} sebelumnya`}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus()}
              className="flex items-center gap-2"
              style={{
                background: 'var(--bg-elev, var(--cream-50))',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 14px',
                height: 36,
                cursor: 'pointer',
                position: 'relative',
              }}
              title="Pilih tanggal"
            >
              <CalendarDays size={15} style={{ color: 'var(--sage-600)' }} />
              <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>
                {dateLabel}
              </span>
              {/* Hidden native date input */}
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
                aria-label="Pilih tanggal"
              />
            </button>
            <button
              type="button"
              onClick={shiftNext}
              className="btn btn-outline btn-sm btn-icon"
              aria-label={`${view} berikutnya`}
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDate(todayKey())}
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 4 }}
              title="Kembali ke hari ini"
            >
              Hari ini
            </button>

            {/* View toggle */}
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

          <div className="flex items-center gap-2" style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="btn btn-outline btn-sm"
              style={{
                background: activeFilterCount > 0 ? 'var(--sage-50)' : undefined,
                borderColor: activeFilterCount > 0 ? 'var(--sage-300)' : undefined,
              }}
              aria-expanded={filterOpen}
            >
              <Filter size={14} /> Filter
              {activeFilterCount > 0 && (
                <span
                  className="badge badge-sage"
                  style={{ height: 18, fontSize: 10, marginLeft: 4, padding: '0 6px' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} style={{ stroke: '#fff' }} /> Jadwalkan Klien
            </button>
            <FilterPopover
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              filters={filters}
              onChange={setFilters}
              psikologs={psikologs}
              rooms={rooms}
            />
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            padding: '0 28px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}
        >
          <StatCard label={view === 'Hari' ? 'Sesi terjadwal' : view === 'Minggu' ? 'Sesi minggu ini' : 'Sesi bulan ini'} value={stats.sesi.value} sub={stats.sesi.sub} />
          <StatCard label="Psikolog aktif" value={stats.psikolog.value} sub={stats.psikolog.sub} />
          <StatCard label="Ruangan terpakai" value={stats.ruangan.value} sub={stats.ruangan.sub} />
          <StatCard label="Notifikasi WA" value={stats.wa.value} sub={stats.wa.sub} />
        </div>

        {/* Schedule grid card */}
        <div style={{ padding: '0 28px 18px' }}>
          <div className="card-althea" style={{ overflow: 'hidden' }}>
            <div
              className="flex items-center justify-between flex-wrap gap-3"
              style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="h2" style={{ margin: 0 }}>
                {view === 'Hari'
                  ? 'Grid Penjadwalan · Psikolog × Slot'
                  : view === 'Minggu'
                  ? 'Grid Mingguan · Hari × Slot'
                  : 'Kalender Bulanan'}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <ServiceLegendItem category="konseling" label="Konseling" />
                <ServiceLegendItem category="terapi" label="Terapi" />
                <ServiceLegendItem category="anak" label="Anak" />
                <ServiceLegendItem category="tes" label="Tes" />
              </div>
            </div>

            {view === 'Hari' && (
              <HariView
                date={date}
                psikologs={psikologs}
                bookings={filteredBookings}
                isLoading={isLoading}
                onCellClick={() => setWizardOpen(true)}
              />
            )}
            {view === 'Minggu' && (
              <MingguView
                weekStart={weekStartMonday(date)}
                bookings={filteredBookings}
                isLoading={isLoading}
                onCellClick={() => setWizardOpen(true)}
              />
            )}
            {view === 'Bulan' && (
              <BulanView
                monthAnchor={date}
                bookings={filteredBookings}
                isLoading={isLoading}
                onDayClick={handleBulanDayClick}
              />
            )}
          </div>
        </div>
      </div>

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
