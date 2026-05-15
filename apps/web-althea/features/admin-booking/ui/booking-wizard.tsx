'use client';

/**
 * Booking Wizard — single-page form.
 *
 * Sebelumnya 4-step wizard dengan Next/Prev — admin harus klik 3-4×
 * untuk submit 1 booking. Now: semua section visible in one scroll,
 * fill top-to-bottom, klik "Buat Booking" sekali.
 *
 * Sections (urut, prereq cascading):
 *   1. Klien (combobox searchable)
 *   2. Layanan (button grid grouped by category) — unlock after klien dipilih
 *   3. Psikolog (card grid) — unlock after layanan dipilih
 *   4. Jadwal & Ruang (date + slot picker + room) — unlock after psikolog dipilih
 *
 * Auto-scroll ke section selanjutnya saat user pick. Sections dengan
 * prereq belum terpenuhi → disabled overlay + hint message.
 */
import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { Step1Client } from './booking-wizard/step1-client';
import { Step2Service } from './booking-wizard/step2-service';
import { Step3Psikolog } from './booking-wizard/step3-psikolog';
import { Step4ScheduleRoom } from './booking-wizard/step4-schedule-room';
import { useWizardState } from './booking-wizard/use-wizard-state';

export function BookingWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const w = useWizardState({ open, onClose });
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);
  const s = w.state;
  const setS = w.setState;

  const firstSlotIdx = s.sessions[0]?.slotIdx ?? null;

  // Auto-scroll cascade: saat user pick di section sebelumnya, gulir ke section berikutnya.
  useEffect(() => {
    if (!open) return;
    if (s.clientId && !s.serviceId) {
      sec2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (s.serviceId && !s.psikologUserId) {
      sec3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (s.psikologUserId && firstSlotIdx === null) {
      sec4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open, s.clientId, s.serviceId, s.psikologUserId, firstSlotIdx]);

  if (!open) return null;

  const canSubmit = w.canSubmit;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`card-althea w-full ${w.isMulti ? 'max-w-3xl' : 'max-w-2xl'} max-h-[92vh] overflow-hidden bg-card flex flex-col`}
      >
        <DialogHeader onClose={onClose} />

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <Section
            stepNum={1}
            title="Klien"
            filled={!!s.clientId}
            disabled={false}
          >
            <Step1Client
              clientList={w.clientList}
              selectedId={s.clientId}
              onChange={(clientId) => setS({ ...s, clientId })}
            />
          </Section>

          <Section
            ref={sec2Ref}
            stepNum={2}
            title="Layanan"
            filled={!!s.serviceId}
            disabled={!s.clientId}
            disabledHint="Pilih klien dulu."
          >
            <Step2Service
              serviceList={w.serviceList}
              selectedId={s.serviceId}
              selectedService={w.selectedService}
              onChange={(serviceId) => setS({ ...s, serviceId })}
            />
          </Section>

          <Section
            ref={sec3Ref}
            stepNum={3}
            title="Psikolog"
            filled={!!s.psikologUserId}
            disabled={!s.serviceId}
            disabledHint="Pilih layanan dulu."
          >
            <Step3Psikolog
              psikologList={w.psikologList}
              filteredItems={w.psikologListFiltered}
              selectedId={s.psikologUserId}
              onChange={(psikologUserId) => setS({ ...s, psikologUserId })}
              serviceFilterActive={!!s.serviceId}
              totalPsikolog={w.psikologList.data?.data.length ?? 0}
              selectedServiceName={w.selectedService?.name}
            />
          </Section>

          <Section
            ref={sec4Ref}
            stepNum={4}
            title={w.isMulti ? `Jadwal ${s.sessions.length} Sesi & Ruang` : 'Jadwal & Ruang'}
            filled={w.allSessionsFilled && !!s.roomId}
            disabled={!s.psikologUserId}
            disabledHint="Pilih psikolog dulu."
          >
            <Step4ScheduleRoom
              state={s}
              setState={setS}
              isMulti={w.isMulti}
              updateSession={w.updateSession}
              reapplyInterval={w.reapplyInterval}
              setIntervalDays={w.setIntervalDays}
              intraConflict={w.intraConflict}
              slots={w.slots}
              unavailableSlotIdx={w.unavailableSlotIdx}
              occupiedRoomIds={w.occupiedRoomIds}
              psikologClosedToday={w.psikologClosedToday}
              resolvedAvailability={w.resolvedAvailability}
              selectedService={w.selectedService}
              selectedSlot={w.selectedSlot}
              psikologList={w.psikologList}
              roomList={w.roomList}
              psikologDayBookings={w.psikologDayBookings}
              closedDayOfWeek={w.closedDayOfWeek}
              holidays={w.holidays}
            />
          </Section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3">
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
            Batal
          </button>
          <button
            type="button"
            onClick={() => w.submit()}
            disabled={!canSubmit}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            {w.submitting
              ? 'Menyimpan...'
              : w.isMulti
                ? `Buat ${s.sessions.length} Booking Sekaligus`
                : 'Buat Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DialogHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
      <div>
        <h2 className="h2">Booking Baru</h2>
        <p className="caption mt-1">
          Isi klien, layanan, psikolog, lalu pilih slot.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost btn-icon btn-sm"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

const Section = ({
  ref,
  stepNum,
  title,
  filled,
  disabled,
  disabledHint,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>;
  stepNum: number;
  title: string;
  filled: boolean;
  disabled: boolean;
  disabledHint?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'
      } ${filled ? 'border-sage-300' : 'border-border'}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
            filled
              ? 'bg-sage-500 text-white'
              : 'bg-cream-100 text-fg-muted'
          }`}
        >
          {filled ? <Check className="h-3.5 w-3.5" /> : stepNum}
        </span>
        <span className="text-sm font-semibold text-teal-800">{title}</span>
        {disabled && disabledHint ? (
          <span className="ml-auto caption text-fg-muted italic">{disabledHint}</span>
        ) : null}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
