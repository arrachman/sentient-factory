'use client';

/**
 * Satu baris jadwal sesi untuk wizard multi-sesi.
 *
 * UX: accordion. 1 sesi expanded sekaligus, tampil DateStrip + SlotGrid
 * (sama dengan single-session UX). Sesi yang belum dijadwalkan auto-expand;
 * setelah user pilih slot, auto-collapse + jump ke sesi berikutnya yang
 * belum dijadwalkan.
 *
 * Per-row hook (availability + day bookings) hidup di komponen, supaya jumlah
 * hook tetap stabil saat sessions[] berubah panjang (rules-of-hooks).
 */
import { useMemo } from 'react';
import { Check, ChevronDown, Pencil } from 'lucide-react';
import {
  useBookingList,
} from '@/features/admin-booking/hooks/use-booking';
import { usePsikologAvailabilityForDate } from '@/features/admin-psikolog/hooks/use-psikolog';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { DateStrip } from './date-strip';
import { SlotGrid } from './slot-grid';

export type SessionRowState = {
  date: string;
  slotIdx: number | null;
};

type Slot = { start: string; end: string; label?: string };

const DAY_LONG = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatDateID(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${DAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function SessionRow({
  index,
  state,
  slots,
  psikolog,
  psikologUserId,
  roomId,
  closedDayOfWeek,
  holidays,
  isIntraConflict,
  isExpanded,
  onToggleExpand,
  onChange,
  onSlotPicked,
}: {
  index: number;
  state: SessionRowState;
  slots: Slot[];
  psikolog: Psikolog | null;
  psikologUserId: number | null;
  roomId: number | null;
  closedDayOfWeek: number[];
  holidays: string[];
  isIntraConflict: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (partial: Partial<SessionRowState>) => void;
  onSlotPicked: () => void;
}) {
  const availabilityQuery = usePsikologAvailabilityForDate(
    psikologUserId,
    state.date,
  );
  const resolved = availabilityQuery.data?.data;

  const dayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && state.date ? state.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  const roomDayBookings = useBookingList({
    roomId: roomId ?? undefined,
    date: roomId && state.date ? state.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  const psikologClosed = Boolean(
    psikologUserId && resolved && !resolved.isOpen,
  );

  const unavailableIdx = useMemo(() => {
    const taken = new Set<number>();
    if (!psikologUserId) return taken;
    if (psikologClosed) {
      slots.forEach((_, i) => taken.add(i));
      return taken;
    }
    const allowed = resolved?.slotIndices;
    if (allowed != null) {
      const set = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!set.has(idx)) taken.add(idx);
      });
    }
    for (const b of dayBookings.data?.data ?? []) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${state.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${state.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
      });
    }
    for (const b of roomDayBookings.data?.data ?? []) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${state.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${state.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
      });
    }
    return taken;
  }, [
    psikologUserId,
    psikologClosed,
    resolved,
    dayBookings.data,
    roomDayBookings.data,
    slots,
    state.date,
  ]);

  const overrideReason =
    resolved?.source === 'override' ? resolved.reason : null;

  const hasSchedule = state.slotIdx !== null;
  const summarySlot =
    hasSchedule && state.slotIdx !== null ? slots[state.slotIdx] : null;

  const headerClass = hasSchedule
    ? 'border-sage-300'
    : isIntraConflict
      ? 'border-rose-300'
      : 'border-border';

  return (
    <div
      className={`rounded-lg border bg-card transition-colors ${headerClass}`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0 ${
            hasSchedule
              ? 'bg-sage-500 text-white'
              : 'bg-cream-100 text-fg-muted'
          }`}
        >
          {hasSchedule ? <Check className="h-3.5 w-3.5" /> : index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-teal-800">
            Sesi {index + 1}
          </div>
          <div className="caption truncate">
            {hasSchedule && summarySlot ? (
              <span className="text-fg">
                {formatDateID(state.date)} · {summarySlot.start}–{summarySlot.end}
              </span>
            ) : (
              <span className="italic text-fg-muted">belum dijadwalkan</span>
            )}
          </div>
        </div>
        {isIntraConflict && (
          <span className="caption text-rose-700 italic flex-shrink-0">
            ⚠ bentrok
          </span>
        )}
        <span className="flex-shrink-0 text-fg-muted">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <Pencil className="h-3.5 w-3.5" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-3 py-3 space-y-3 bg-cream-50">
          {!psikologUserId ? (
            <p className="caption text-fg-muted">
              Pilih psikolog dulu di section sebelumnya.
            </p>
          ) : (
            <>
              <DateStrip
                selectedDate={state.date}
                psikolog={psikolog}
                closedDayOfWeek={closedDayOfWeek}
                holidays={holidays}
                onChangeDate={(date) => onChange({ date, slotIdx: null })}
              />
              {psikologClosed && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  ⚠ <strong>{psikolog?.fullName ?? 'Psikolog'}</strong> tidak
                  praktik di tanggal ini
                  {resolved?.source === 'override'
                    ? ' (override khusus tanggal ini'
                    : ' (sesuai jadwal mingguan'}
                  {overrideReason ? `: ${overrideReason}` : ''}). Pilih tanggal
                  lain.
                </div>
              )}
              {!psikologClosed && resolved?.source === 'override' && (
                <div className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-xs text-sage-800">
                  ℹ Tanggal ini pakai <strong>jadwal khusus</strong> psikolog
                  (override)
                  {overrideReason ? ` — ${overrideReason}` : ''}.
                </div>
              )}
              <SlotGrid
                slots={slots}
                unavailableSlotIdx={unavailableIdx}
                slotIdx={state.slotIdx}
                psikologName={psikolog?.fullName ?? null}
                isLoadingBookings={
                  dayBookings.isLoading || roomDayBookings.isLoading
                }
                onPick={(idx) => {
                  onChange({ slotIdx: idx });
                  onSlotPicked();
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
