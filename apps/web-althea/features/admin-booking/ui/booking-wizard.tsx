'use client';

/**
 * Booking Wizard — orchestrator slim.
 *
 * Layout: header dialog → 4-step stepper → step body (switches by step) →
 * footer (prev/cancel/next-or-submit). Logic via `useWizardState()`.
 */
import { X } from 'lucide-react';
import { Step1Client } from './booking-wizard/step1-client';
import { Step2Service } from './booking-wizard/step2-service';
import { Step3Psikolog } from './booking-wizard/step3-psikolog';
import { Step4ScheduleRoom } from './booking-wizard/step4-schedule-room';
import { useWizardState } from './booking-wizard/use-wizard-state';
import { WizardFooter } from './booking-wizard/wizard-footer';
import { WizardStepper } from './booking-wizard/wizard-stepper';

export function BookingWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const w = useWizardState({ open, onClose });
  if (!open) return null;
  const { state: s, setState: setS } = w;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card">
        <DialogHeader step={s.step} onClose={onClose} />
        <WizardStepper step={s.step} />

        <div className="px-6 py-4 space-y-4 min-h-[280px]">
          {s.step === 1 ? (
            <Step1Client
              clientList={w.clientList}
              selectedId={s.clientId}
              onChange={(clientId) => setS({ ...s, clientId })}
            />
          ) : null}
          {s.step === 2 ? (
            <Step2Service
              serviceList={w.serviceList}
              selectedId={s.serviceId}
              selectedService={w.selectedService}
              onChange={(serviceId) => setS({ ...s, serviceId })}
            />
          ) : null}
          {s.step === 3 ? (
            <Step3Psikolog
              psikologList={w.psikologList}
              selectedId={s.psikologUserId}
              onChange={(psikologUserId) => setS({ ...s, psikologUserId })}
            />
          ) : null}
          {s.step === 4 ? (
            <Step4ScheduleRoom
              state={s}
              setState={setS}
              slots={w.slots}
              unavailableSlotIdx={w.unavailableSlotIdx}
              isClosedDay={w.isClosedDay}
              psikologClosedToday={w.psikologClosedToday}
              selectedService={w.selectedService}
              selectedSlot={w.selectedSlot}
              psikologList={w.psikologList}
              roomList={w.roomList}
              psikologDayBookings={w.psikologDayBookings}
            />
          ) : null}
        </div>

        <WizardFooter
          step={s.step}
          canNext={w.canNext()}
          submitting={w.submitting}
          onPrev={w.prev}
          onNext={w.next}
          onSubmit={w.submit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

function DialogHeader({
  step,
  onClose,
}: {
  step: number;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <h2 className="h2">Booking Wizard</h2>
        <p className="caption mt-1">Step {step} dari 4</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost btn-icon"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
