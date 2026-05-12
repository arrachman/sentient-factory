'use client';

/**
 * Step 4 wizard — Section "Jadwal & Ruang".
 *
 * Single-session: DateStrip + SlotGrid + Ruang + Override + Catatan.
 * Multi-session: list accordion SessionRow (DateStrip + SlotGrid per sesi) + Ruang + Override + Catatan.
 */
import { useEffect, useState } from 'react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import type { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import type { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import type { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { WizardSession, WizardState } from './use-wizard-state';
import { SessionRow } from './session-row';
import { DateStrip } from './date-strip';
import { SlotGrid } from './slot-grid';

type Slot = NonNullable<
  ReturnType<typeof useSettings>['data']
>['data']['slotsOfDay'][number];
type Service = NonNullable<
  ReturnType<typeof useServiceList>['data']
>['data'][number];

export function Step4ScheduleRoom({
  state,
  setState,
  isMulti,
  updateSession,
  reapplyInterval,
  setIntervalDays,
  intraConflict,
  slots,
  unavailableSlotIdx,
  psikologClosedToday,
  resolvedAvailability,
  selectedService,
  selectedSlot,
  psikologList,
  roomList,
  psikologDayBookings,
  closedDayOfWeek,
  holidays,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  isMulti: boolean;
  updateSession: (i: number, partial: Partial<WizardSession>) => void;
  reapplyInterval: () => void;
  setIntervalDays: (n: number) => void;
  intraConflict: Set<number>;
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  psikologClosedToday: boolean;
  resolvedAvailability?: {
    isOpen: boolean;
    slotIndices: number[] | null;
    source: 'override' | 'weekly' | 'unset';
    reason: string | null;
    psikologName: string;
  };
  selectedService: Service | undefined;
  selectedSlot: Slot | null;
  psikologList: ReturnType<typeof usePsikologList>;
  roomList: ReturnType<typeof useRoomList>;
  psikologDayBookings: ReturnType<typeof useBookingList>;
  closedDayOfWeek: number[];
  holidays: string[];
}) {
  const selectedPsikolog =
    psikologList.data?.data.find((p) => p.userId === state.psikologUserId) ?? null;
  const psikologName = selectedPsikolog?.fullName ?? null;
  const overrideReason =
    resolvedAvailability?.source === 'override' ? resolvedAvailability.reason : null;

  const firstSession = state.sessions[0];

  return (
    <div className="space-y-3">
      {!isMulti && firstSession && (
        <>
          <DateStrip
            selectedDate={firstSession.date}
            psikolog={selectedPsikolog}
            closedDayOfWeek={closedDayOfWeek}
            holidays={holidays}
            onChangeDate={(date) =>
              setState((p) => ({
                ...p,
                sessions: [{ date, slotIdx: null }],
              }))
            }
          />
          {psikologClosedToday && !state.bufferOverride && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ⚠ <strong>{psikologName}</strong> tidak praktik di tanggal ini
              {resolvedAvailability?.source === 'override'
                ? ' (override khusus tanggal ini'
                : ' (sesuai jadwal mingguan psikolog'}
              {overrideReason ? `: ${overrideReason}` : ''}). Pilih tanggal lain,
              ganti psikolog di step sebelumnya, atau centang override di bawah.
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
            slotIdx={firstSession.slotIdx}
            psikologName={psikologName}
            isLoadingBookings={psikologDayBookings.isLoading}
            onPick={(idx) =>
              setState((p) => ({
                ...p,
                sessions: p.sessions.map((ses, i) =>
                  i === 0 ? { ...ses, slotIdx: idx } : ses,
                ),
              }))
            }
          />
          {selectedService && selectedSlot ? (
            <SlotDurationHint service={selectedService} slot={selectedSlot} />
          ) : null}
        </>
      )}

      {isMulti && (
        <MultiSessionList
          sessions={state.sessions}
          slots={slots}
          psikolog={selectedPsikolog}
          psikologUserId={state.psikologUserId}
          roomId={state.roomId}
          closedDayOfWeek={closedDayOfWeek}
          holidays={holidays}
          intervalDays={state.intervalDays}
          intraConflict={intraConflict}
          onChangeInterval={setIntervalDays}
          onApplyInterval={reapplyInterval}
          onUpdateSession={updateSession}
        />
      )}

      <RoomField
        roomList={roomList}
        roomId={state.roomId}
        onChange={(roomId) => setState((p) => ({ ...p, roomId }))}
      />
      <BufferOverrideToggle
        checked={state.bufferOverride}
        onChange={(v) =>
          setState((p) => ({ ...p, bufferOverride: v }))
        }
      />
      <NotesField
        notes={state.notes}
        onChange={(notes) => setState((p) => ({ ...p, notes }))}
      />
    </div>
  );
}

function MultiSessionList({
  sessions,
  slots,
  psikolog,
  psikologUserId,
  roomId,
  closedDayOfWeek,
  holidays,
  intervalDays,
  intraConflict,
  onChangeInterval,
  onApplyInterval,
  onUpdateSession,
}: {
  sessions: WizardSession[];
  slots: Slot[];
  psikolog: Psikolog | null;
  psikologUserId: number | null;
  roomId: number | null;
  closedDayOfWeek: number[];
  holidays: string[];
  intervalDays: number;
  intraConflict: Set<number>;
  onChangeInterval: (n: number) => void;
  onApplyInterval: () => void;
  onUpdateSession: (i: number, partial: Partial<WizardSession>) => void;
}) {
  // Accordion: 1 sesi expanded sekaligus. Default = sesi pertama yang belum
  // dijadwalkan. Saat user pilih slot → auto-collapse + jump ke unscheduled
  // berikutnya (atau collapse semua kalau sudah lengkap).
  const firstUnscheduled = sessions.findIndex((s) => s.slotIdx === null);
  const [activeIdx, setActiveIdx] = useState<number>(
    firstUnscheduled === -1 ? 0 : firstUnscheduled,
  );

  // Saat psikolog/service berubah → sessions di-reset, kembali ke sesi 1.
  useEffect(() => {
    const idx = sessions.findIndex((s) => s.slotIdx === null);
    setActiveIdx(idx === -1 ? -1 : idx);
  }, [psikologUserId, sessions.length]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="caption block">
            Jadwal {sessions.length} Sesi
          </label>
          <p className="caption text-fg-muted">
            Semua sesi wajib dijadwalkan. Klik sesi untuk pilih tanggal &amp;
            slot.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="caption">Interval (hari):</label>
          <input
            type="number"
            min={1}
            max={90}
            value={intervalDays}
            onChange={(e) => onChangeInterval(Number(e.target.value))}
            className="input-althea max-w-[80px]"
          />
          <button
            type="button"
            onClick={onApplyInterval}
            className="btn btn-outline btn-sm"
            title="Reset tanggal sesi 2..N berdasarkan tanggal sesi 1 + interval"
          >
            Apply Interval
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {sessions.map((ses, i) => (
          <SessionRow
            key={i}
            index={i}
            state={ses}
            slots={slots}
            psikolog={psikolog}
            psikologUserId={psikologUserId}
            roomId={roomId}
            closedDayOfWeek={closedDayOfWeek}
            holidays={holidays}
            isIntraConflict={intraConflict.has(i)}
            isExpanded={activeIdx === i}
            onToggleExpand={() => setActiveIdx((curr) => (curr === i ? -1 : i))}
            onChange={(partial) => onUpdateSession(i, partial)}
            onSlotPicked={() => {
              // Cari sesi berikutnya yang belum dijadwalkan
              const nextUnscheduled = sessions.findIndex(
                (s, j) => j !== i && s.slotIdx === null,
              );
              setActiveIdx(nextUnscheduled === -1 ? -1 : nextUnscheduled);
            }}
          />
        ))}
      </div>
      <p className="caption text-fg-muted">
        💡 Tip: edit tanggal Sesi 1 + klik &quot;Apply Interval&quot; untuk
        auto-fill tanggal sesi berikutnya.
      </p>
    </div>
  );
}

// =====================================================================
// Sub-fields lain
// =====================================================================

function SlotDurationHint({
  service,
  slot,
}: {
  service: Service;
  slot: Slot;
}) {
  const [sh, sm] = slot.start.split(':').map(Number);
  const [eh, em] = slot.end.split(':').map(Number);
  const slotMinutes = eh * 60 + em - (sh * 60 + sm);
  return (
    <p className="caption text-fg-muted">
      💡 Slot {slot.start}–{slot.end} = {slotMinutes} menit. Durasi{' '}
      {service.name}: {service.durationMinutes} menit.
    </p>
  );
}

function RoomField({
  roomList,
  roomId,
  onChange,
}: {
  roomList: ReturnType<typeof useRoomList>;
  roomId: number | null;
  onChange: (roomId: number | null) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Pilih Ruang</label>
      <select
        value={roomId ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        className="input-althea"
      >
        <option value="">-- pilih ruang --</option>
        {(roomList.data?.data ?? []).map((r) => (
          <option key={r.id} value={r.id}>
            [{r.type}] {r.name} (kapasitas {r.capacity})
          </option>
        ))}
      </select>
    </div>
  );
}

function BufferOverrideToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-md border border-border p-3 bg-cream-50">
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 mt-0.5 flex-shrink-0"
        />
        <span className="flex flex-col gap-1">
          <span className="font-medium text-teal-800">
            Lewati validasi jeda &amp; jam buka klinik
          </span>
          <span className="caption">
            Sistem biasanya menolak booking yang berhimpit kurang dari 15
            menit dari sesi lain, atau di hari tutup. Centang HANYA untuk
            kasus khusus: walk-in darurat, sesi beruntun yang disengaja,
            atau sesi di hari libur. Semua override tercatat di audit log.
          </span>
        </span>
      </label>
    </div>
  );
}

function NotesField({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Catatan (opsional)</label>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="input-althea h-auto py-2"
      />
    </div>
  );
}
