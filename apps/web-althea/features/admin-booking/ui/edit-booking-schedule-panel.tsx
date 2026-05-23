'use client';

/**
 * The reschedulable section of EditBookingDialog (canReschedule === true branch).
 * Renders: psikolog select, DateStrip, availability warnings, SlotGrid,
 * room select, and optional reschedule-reason textarea.
 */
import type { Dispatch, SetStateAction } from 'react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import { DateStrip } from './booking-wizard/date-strip';
import { SlotGrid } from './booking-wizard/slot-grid';
import type { Slot } from './edit-booking-dialog.helpers';

type ResolvedAvailability = {
  isOpen: boolean;
  slotIndices: number[] | null;
  source: 'override' | 'weekly' | 'unset';
  reason: string | null;
};

interface EditBookingSchedulePanelProps {
  // psikolog
  psikologListFiltered: Psikolog[];
  psikologUserId: number | null;
  setPsikologUserId: Dispatch<SetStateAction<number | null>>;
  psikologName: string | null;
  selectedPsikolog: Psikolog | null;
  // date
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  closedDayOfWeek: number[];
  holidays: string[];
  // availability
  resolvedAvailability: ResolvedAvailability | null | undefined;
  psikologClosedToday: boolean;
  overrideReason: string | null | undefined;
  // slots
  slots: Slot[];
  slotIdx: number | null;
  setSlotIdx: Dispatch<SetStateAction<number | null>>;
  unavailableSlotIdx: Set<number>;
  psikologDayBookingsLoading: boolean;
  // rooms
  roomId: number | null;
  setRoomId: Dispatch<SetStateAction<number | null>>;
  roomListData: Room[];
  occupiedRoomIds: Set<number>;
  // reason textarea
  scheduleChanged: boolean;
  reason: string;
  setReason: Dispatch<SetStateAction<string>>;
}

export function EditBookingSchedulePanel({
  psikologListFiltered,
  psikologUserId,
  setPsikologUserId,
  psikologName,
  selectedPsikolog,
  date,
  setDate,
  closedDayOfWeek,
  holidays,
  resolvedAvailability,
  psikologClosedToday,
  overrideReason,
  slots,
  slotIdx,
  setSlotIdx,
  unavailableSlotIdx,
  psikologDayBookingsLoading,
  roomId,
  setRoomId,
  roomListData,
  occupiedRoomIds,
  scheduleChanged,
  reason,
  setReason,
}: EditBookingSchedulePanelProps) {
  return (
    <>
      <div>
        <label className="caption mb-1 block">Psikolog</label>
        <select
          value={psikologUserId ?? ''}
          onChange={(e) => {
            setPsikologUserId(e.target.value ? Number(e.target.value) : null);
            setSlotIdx(null);
          }}
          className="input-althea"
        >
          {psikologListFiltered.map((p) => (
            <option key={p.userId} value={p.userId}>
              {p.fullName ?? p.email}
            </option>
          ))}
        </select>
      </div>

      <DateStrip
        selectedDate={date}
        psikolog={selectedPsikolog}
        psikologUserId={psikologUserId}
        closedDayOfWeek={closedDayOfWeek}
        holidays={holidays}
        onChangeDate={(d) => {
          setDate(d);
          setSlotIdx(null);
        }}
      />

      {psikologClosedToday && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ⚠ <strong>{psikologName ?? 'Psikolog'}</strong> tidak praktik di tanggal ini
          {resolvedAvailability?.source === 'override'
            ? ' (override khusus tanggal ini'
            : ' (sesuai jadwal mingguan psikolog'}
          {overrideReason ? `: ${overrideReason}` : ''}). Pilih tanggal lain atau ganti
          psikolog.
        </div>
      )}
      {!psikologClosedToday && resolvedAvailability?.source === 'override' && (
        <div className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-xs text-sage-800">
          ℹ Tanggal ini pakai <strong>jadwal khusus</strong> psikolog (override)
          {overrideReason ? ` — ${overrideReason}` : ''}.
        </div>
      )}

      <SlotGrid
        slots={slots}
        unavailableSlotIdx={unavailableSlotIdx}
        slotIdx={slotIdx}
        psikologName={psikologName}
        isLoadingBookings={psikologDayBookingsLoading}
        onPick={(idx) => setSlotIdx(idx)}
      />

      <div>
        <label className="caption mb-1 block">Ruang</label>
        <select
          value={roomId ?? ''}
          onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
          className="input-althea"
        >
          <option value="">-- pilih ruang --</option>
          {roomListData.map((r) => {
            const occupied = slotIdx !== null && occupiedRoomIds.has(r.id);
            return (
              <option key={r.id} value={r.id} disabled={occupied}>
                {occupied ? '🔴 ' : ''}[{r.type}] {r.name}
                {occupied ? ' — terpakai' : ''}
              </option>
            );
          })}
        </select>
        {slotIdx !== null && occupiedRoomIds.size > 0 && (
          <p className="caption mt-1 text-rose-700">
            ⚠ Ruangan bertanda 🔴 sudah terpakai di slot ini.
          </p>
        )}
      </div>

      {scheduleChanged && (
        <div>
          <label className="caption mb-1 block">Alasan perubahan jadwal (opsional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="input-althea h-auto py-2"
          />
        </div>
      )}
    </>
  );
}
