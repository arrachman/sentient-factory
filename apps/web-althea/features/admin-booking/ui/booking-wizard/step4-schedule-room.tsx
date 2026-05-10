'use client';

/**
 * Step 4 wizard — tanggal + slot grid (filtered by psikolog availability) +
 * ruang dropdown + buffer override + catatan.
 */
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
  selectedService,
  selectedSlot,
  psikologList,
  roomList,
  psikologDayBookings,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  isClosedDay: boolean;
  psikologClosedToday: boolean;
  selectedService: Service | undefined;
  selectedSlot: Slot | null;
  psikologList: ReturnType<typeof usePsikologList>;
  roomList: ReturnType<typeof useRoomList>;
  psikologDayBookings: ReturnType<typeof useBookingList>;
}) {
  const psikologName =
    psikologList.data?.data.find((p) => p.userId === state.psikologUserId)
      ?.fullName ?? null;
  return (
    <div className="space-y-3">
      <DateField
        date={state.date}
        isClosedDay={isClosedDay}
        bufferOverride={state.bufferOverride}
        onChangeDate={(date) =>
          setState((p) => ({ ...p, date, slotIdx: null }))
        }
      />
      {psikologClosedToday && !state.bufferOverride && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ⚠ <strong>{psikologName}</strong> tidak praktik di hari ini
          (sesuai jadwal mingguan psikolog). Pilih tanggal lain, ganti psikolog
          di step sebelumnya, atau centang override di bawah.
        </div>
      )}
      <SlotGrid
        slots={slots}
        unavailableSlotIdx={unavailableSlotIdx}
        slotIdx={state.slotIdx}
        bufferOverride={state.bufferOverride}
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

function DateField({
  date,
  isClosedDay,
  bufferOverride,
  onChangeDate,
}: {
  date: string;
  isClosedDay: boolean;
  bufferOverride: boolean;
  onChangeDate: (date: string) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Tanggal</label>
      <input
        type="date"
        value={date}
        onChange={(e) => onChangeDate(e.target.value)}
        className="input-althea max-w-[220px]"
      />
      {isClosedDay && !bufferOverride ? (
        <p className="caption mt-1 text-amber-700">
          ⚠ Klinik tutup di hari ini. Centang override di bawah, atau pilih
          tanggal lain.
        </p>
      ) : null}
    </div>
  );
}

function SlotGrid({
  slots,
  unavailableSlotIdx,
  slotIdx,
  bufferOverride,
  psikologName,
  isLoadingBookings,
  onPick,
}: {
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  slotIdx: number | null;
  bufferOverride: boolean;
  psikologName: string | null;
  isLoadingBookings: boolean;
  onPick: (idx: number) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">
        Slot tersedia untuk{' '}
        <strong className="text-teal-800">
          {psikologName ?? 'psikolog'}
        </strong>
      </label>
      {slots.length === 0 ? (
        <p className="caption italic text-fg-muted">
          Belum ada slot operasional. Set di Pengaturan → Slot Operasional
          dulu.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {slots.map((slot, i) => {
            const active = slotIdx === i;
            const taken = unavailableSlotIdx.has(i);
            const disabled = taken && !bufferOverride;
            return (
              <button
                key={i}
                type="button"
                onClick={() => !disabled && onPick(i)}
                disabled={disabled}
                className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-sage-50 border-sage-500 text-teal-800'
                    : taken
                      ? 'bg-cream-100 border-border text-fg-muted line-through cursor-not-allowed opacity-70'
                      : 'bg-card border-border text-fg hover:border-sage-300'
                }`}
                title={
                  taken ? 'Sudah ada booking lain di slot ini' : undefined
                }
              >
                <div className="font-semibold">
                  {slot.start} – {slot.end}
                </div>
                <div className="caption mt-0.5">
                  {taken ? 'sudah penuh' : slot.label || 'tersedia'}
                </div>
              </button>
            );
          })}
        </div>
      )}
      {isLoadingBookings ? (
        <p className="caption mt-1 text-fg-muted">
          Mengecek slot kosong…
        </p>
      ) : null}
      {!isLoadingBookings &&
      unavailableSlotIdx.size > 0 &&
      slots.length > 0 ? (
        <p className="caption mt-1 text-fg-muted">
          {slots.length - unavailableSlotIdx.size} dari {slots.length} slot
          tersedia di tanggal ini.
        </p>
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
