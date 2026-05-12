/**
 * Step indicator (4 segments) untuk Booking Wizard.
 */
import type { WizardStep } from './use-wizard-state';

const LABELS = ['Klien', 'Layanan', 'Psikolog', 'Jadwal & Ruang'];

export function WizardStepper({ step }: { step: WizardStep }) {
  return (
    <div className="flex border-b border-border">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className={`flex-1 px-3 py-2 text-center text-xs font-medium ${
            step === n
              ? 'bg-sage-100 text-sage-800'
              : step > n
                ? 'bg-success-soft text-success'
                : 'text-fg-muted'
          }`}
        >
          {n}. {LABELS[n - 1]}
        </div>
      ))}
    </div>
  );
}
