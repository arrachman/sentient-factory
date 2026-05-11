'use client';

/**
 * Step 4 wizard — DateStrip (horizontal pagination, color-coded) + slot grid
 * (only available) + ruang dropdown + buffer override + catatan.
 */
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import type { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import type { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import type { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { WizardState } from './use-wizard-state';

type Slot = NonNullable<
  ReturnType<typeof useSettings>['data']
>['data']['slotsOfDay'][number];
type Service = NonNullable<
  ReturnType<typeof useServiceList>['data']
>['data'][number];

export function Step4ScheduleRoom({
  state,
  setState,
  slots,
  unavailableSlotIdx,
  isClosedDay,
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
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  isClosedDay: boolean;
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
  return (
    <div className="space-y-3">
      <DateStrip
        selectedDate={state.date}
        psikolog={selectedPsikolog}
        closedDayOfWeek={closedDayOfWeek}
        holidays={holidays}
        onChangeDate={(date) =>
          setState((p) => ({ ...p, date, slotIdx: null }))
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
        slotIdx={state.slotIdx}
        psikologName={psikologName}
        isLoadingBookings={psikologDayBookings.isLoading}
        onPick={(idx) => setState((p) => ({ ...p, slotIdx: idx }))}
      />
      {selectedService && selectedSlot ? (
        <SlotDurationHint
          service={selectedService}
          slot={selectedSlot}
        />
      ) : null}
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

// =====================================================================
// Sub-fields
// =====================================================================

const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_KEY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

type DateStatus = 'available' | 'klinik-closed' | 'holiday' | 'psikolog-off' | 'psikolog-unset';

const STATUS_INFO: Record<DateStatus, { label: string; bg: string; border: string; fg: string }> = {
  available:        { label: '',          bg: 'bg-card',      border: 'border-border',       fg: 'text-fg' },
  'klinik-closed':  { label: 'Tutup',     bg: 'bg-cream-100', border: 'border-cream-200',    fg: 'text-fg-muted' },
  holiday:          { label: 'Libur',     bg: 'bg-amber-50',  border: 'border-amber-200',    fg: 'text-amber-800' },
  'psikolog-off':   { label: 'Libur',     bg: 'bg-rose-50',   border: 'border-rose-200',     fg: 'text-rose-700' },
  'psikolog-unset': { label: 'Belum set', bg: 'bg-cream-100', border: 'border-cream-200',    fg: 'text-fg-muted' },
};

function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function statusFor(
  d: Date,
  psikolog: Psikolog | null,
  closedDayOfWeek: number[],
  holidays: string[],
): DateStatus {
  const dateStr = toDateKey(d);
  const dow = d.getDay();
  if (holidays.includes(dateStr)) return 'holiday';
  if (closedDayOfWeek.includes(dow)) return 'klinik-closed';
  if (psikolog) {
    const wa = psikolog.weeklyAvailability ?? {};
    if (Object.keys(wa).length === 0) return 'psikolog-unset';
    const dayCfg = wa[DAY_KEY[dow]];
    if (!dayCfg || !dayCfg.isOpen) return 'psikolog-off';
  }
  return 'available';
}

function DateStrip({
  selectedDate,
  psikolog,
  closedDayOfWeek,
  holidays,
  onChangeDate,
}: {
  selectedDate: string;
  psikolog: Psikolog | null;
  closedDayOfWeek: number[];
  holidays: string[];
  onChangeDate: (date: string) => void;
}) {
  // Anchor minggu (Senin) — geser pakai prev/next
  const [weekOffset, setWeekOffset] = useState(0);

  const week = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Senin dari minggu hari ini
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);
    // 7 hari
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const todayKey = toDateKey(new Date());
  const weekLabel = useMemo(() => {
    const first = week[0];
    const last = week[6];
    return `${first.getDate()} ${MONTH_SHORT[first.getMonth()]} – ${last.getDate()} ${MONTH_SHORT[last.getMonth()]} ${last.getFullYear()}`;
  }, [week]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="caption">Tanggal</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="btn btn-ghost btn-icon h-7 w-7"
            aria-label="Minggu sebelumnya"
            title="Minggu sebelumnya"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="caption text-teal-800 font-medium tabular-nums px-1.5 min-w-[140px] text-center">
            {weekLabel}
          </span>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="btn btn-ghost btn-icon h-7 w-7"
            aria-label="Minggu berikutnya"
            title="Minggu berikutnya"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {week.map((d) => {
          const key = toDateKey(d);
          const status = statusFor(d, psikolog, closedDayOfWeek, holidays);
          const info = STATUS_INFO[status];
          const selected = key === selectedDate;
          const isToday = key === todayKey;
          const dow = d.getDay();
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChangeDate(key)}
              className={`flex flex-col items-center px-1 py-2 rounded-md border text-xs transition-colors ${
                selected
                  ? 'bg-sage-500 border-sage-500 text-white shadow-sm'
                  : `${info.bg} ${info.border} ${info.fg} hover:border-sage-300`
              } ${isToday && !selected ? 'ring-1 ring-sage-300' : ''}`}
              title={
                status === 'available'
                  ? 'Tersedia'
                  : status === 'klinik-closed'
                    ? 'Klinik tutup'
                    : status === 'holiday'
                      ? 'Tanggal libur'
                      : status === 'psikolog-off'
                        ? `${psikolog?.fullName ?? 'Psikolog'} tidak praktik`
                        : 'Psikolog belum set jadwal'
              }
            >
              <span className="text-[10px] uppercase tracking-wider opacity-80">
                {DAY_SHORT[dow]}
              </span>
              <span className="text-base font-semibold leading-tight tabular-nums">
                {d.getDate()}
              </span>
              {info.label ? (
                <span className="text-[9.5px] mt-0.5 leading-none">{info.label}</span>
              ) : isToday ? (
                <span className="text-[9.5px] mt-0.5 leading-none opacity-80">hari ini</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SlotGrid({
  slots,
  unavailableSlotIdx,
  slotIdx,
  psikologName,
  isLoadingBookings,
  onPick,
}: {
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  slotIdx: number | null;
  psikologName: string | null;
  isLoadingBookings: boolean;
  onPick: (idx: number) => void;
}) {
  if (slots.length === 0) {
    return (
      <div>
        <label className="caption mb-1 block">Slot tersedia</label>
        <p className="caption italic text-fg-muted">
          Belum ada slot operasional. Set di Pengaturan → Slot Operasional dulu.
        </p>
      </div>
    );
  }

  // Selalu hanya tampilkan slot available (clean UX, no strikethrough clutter).
  const visibleSlots = slots
    .map((slot, i) => ({ slot, i }))
    .filter(({ i }) => !unavailableSlotIdx.has(i));

  return (
    <div>
      <label className="caption mb-1 block">
        Slot tersedia untuk{' '}
        <strong className="text-teal-800">{psikologName ?? 'psikolog'}</strong>
      </label>
      {visibleSlots.length === 0 ? (
        <p className="caption italic text-fg-muted px-3 py-3 rounded-md bg-amber-50 border border-amber-200">
          Tidak ada slot tersedia di tanggal ini. Pilih tanggal lain atau ganti
          psikolog. (Override hanya bypass validasi jam buka — slot yang sudah
          dibooking tetap tidak tampil.)
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {visibleSlots.map(({ slot, i }) => {
              const active = slotIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPick(i)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors text-left ${
                    active
                      ? 'bg-sage-50 border-sage-500 text-teal-800'
                      : 'bg-card border-border text-fg hover:border-sage-300'
                  }`}
                >
                  <div className="font-semibold">
                    {slot.start} – {slot.end}
                  </div>
                  <div className="caption mt-0.5">{slot.label || 'tersedia'}</div>
                </button>
              );
            })}
          </div>
          {!isLoadingBookings && unavailableSlotIdx.size > 0 ? (
            <p className="caption mt-1.5 text-fg-muted">
              {visibleSlots.length} dari {slots.length} slot tersedia di tanggal ini.
            </p>
          ) : null}
        </>
      )}
      {isLoadingBookings ? (
        <p className="caption mt-1 text-fg-muted">Mengecek slot kosong…</p>
      ) : null}
    </div>
  );
}

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
