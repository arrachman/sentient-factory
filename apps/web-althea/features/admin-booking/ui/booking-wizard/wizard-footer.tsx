'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WizardStep } from './use-wizard-state';

/**
 * Footer wizard — tombol Sebelumnya / Batal / Selanjutnya|Buat Booking.
 */
export function WizardFooter({
  step,
  canNext,
  submitting,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
}: {
  step: WizardStep;
  canNext: boolean;
  submitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 1}
        className="btn btn-outline disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" /> Sebelumnya
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
        >
          Batal
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="btn btn-primary disabled:opacity-50"
          >
            Selanjutnya <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canNext || submitting}
            className="btn btn-primary disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Buat Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
