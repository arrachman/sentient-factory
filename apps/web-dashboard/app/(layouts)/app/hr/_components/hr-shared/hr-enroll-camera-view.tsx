'use client';

import { type RefObject } from 'react';
import { LoaderCircle, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from '../hr-attendance-effects.module.css';

interface HrEnrollCameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  // state
  validationUiState: string;
  submitting: boolean;
  enrollmentFreezeFrameUrl: string | null;
  enrollmentUsedByOther: boolean;
  enrollmentHeroTitle: string | null;
  enrollmentHeroMessage: string | null;
  enrollmentIsHolding: boolean;
  enrollmentHoldProgress: number;
  enrollmentStabilityHits: number;
  enrollmentLockPulse: boolean;
  enrollmentConflictOwnerLabel: string;
  selectedEnrollmentTargetContext: string;
  cameraError: string | null;
  actionError: string | null;
  detectorUnavailable: boolean;
  // handlers
  retryEnrollmentWithDifferentFace: () => void;
  closeAction: () => void;
}

export function HrEnrollCameraView({
  videoRef,
  canvasRef,
  validationUiState,
  submitting,
  enrollmentFreezeFrameUrl,
  enrollmentUsedByOther,
  enrollmentHeroTitle,
  enrollmentHeroMessage,
  enrollmentIsHolding,
  enrollmentHoldProgress,
  enrollmentStabilityHits,
  enrollmentLockPulse,
  enrollmentConflictOwnerLabel,
  selectedEnrollmentTargetContext,
  cameraError,
  actionError,
  detectorUnavailable,
  retryEnrollmentWithDifferentFace,
  closeAction,
}: HrEnrollCameraViewProps) {
  const enrollShellClass =
    validationUiState === 'success'
      ? 'bg-emerald-500'
      : validationUiState === 'failure'
        ? 'bg-white'
        : 'bg-amber-400';
  const enrollTextClass =
    validationUiState === 'success'
      ? 'text-white'
      : validationUiState === 'failure'
        ? 'text-rose-500'
        : 'text-slate-950';
  const enrollGuideClass =
    validationUiState === 'success'
      ? 'border-white/90 text-white'
      : validationUiState === 'failure'
        ? 'border-rose-500 text-rose-500'
        : 'border-white/95 text-white';

  return (
    <div className={cn('mx-auto max-w-md overflow-hidden rounded-[32px] shadow-sm', enrollShellClass)}>
      <div className="flex min-h-[calc(100vh-10rem)] flex-col gap-y-6 px-5 pb-10 pt-8 sm:min-h-[780px]">
        <div className="flex justify-center">
          {selectedEnrollmentTargetContext ? (
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/10 px-4 py-1.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
              <UserRound className="size-4 shrink-0" />
              <span className="truncate">{selectedEnrollmentTargetContext}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative w-full max-w-[320px]">
            <div className="relative mx-auto aspect-square w-[82vw] max-w-[320px] overflow-hidden rounded-full border-[10px] border-white bg-slate-950 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
              {enrollmentFreezeFrameUrl ? (
                <img
                  src={enrollmentFreezeFrameUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  autoPlay
                />
              )}
              <div className="pointer-events-none absolute inset-0">
                {enrollmentFreezeFrameUrl ? null : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(styles.enrollSilhouetteGuide, enrollGuideClass)} />
                  </div>
                )}
                {validationUiState === 'success' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlaySuccess, 'absolute inset-0')} /> : null}
                {validationUiState === 'failure' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlayFailure, 'absolute inset-0')} /> : null}
                {submitting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                    <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="size-4 animate-spin" />
                        Mencatat Kehadiran...
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 px-3 text-center">
              <p className={cn('text-[30px] leading-8 font-semibold', enrollTextClass)}>
                {enrollmentUsedByOther
                  ? 'Wajah Sudah Terdaftar'
                  : enrollmentFreezeFrameUrl
                  ? 'Wajah Tersimpan'
                  : enrollmentHeroTitle}
              </p>
              {enrollmentHeroMessage ? (
                <p
                  className={cn(
                    'mt-3 text-sm leading-6',
                    validationUiState === 'success'
                      ? 'text-white/90'
                      : validationUiState === 'failure'
                        ? 'text-rose-600'
                        : 'text-slate-800/80',
                  )}
                >
                  {enrollmentHeroMessage}
                </p>
              ) : null}
              {enrollmentIsHolding ? (
                <div className="mx-auto mt-5 max-w-[260px]">
                  <div className="h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-200"
                      style={{ width: `${enrollmentHoldProgress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={cn(
                          'h-2.5 w-2.5 rounded-full transition-colors',
                          enrollmentStabilityHits >= step ? 'bg-white' : 'bg-black/15',
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-800/70">
                    Stabilisasi {enrollmentStabilityHits}/4
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {cameraError ? (
          <div className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{cameraError}</div>
        ) : null}
        {detectorUnavailable ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Deteksi wajah otomatis belum tersedia di browser ini. Gunakan Chrome atau Edge terbaru.
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div>
        ) : null}

        {enrollmentUsedByOther ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">
              Wajah yang dipindai sudah terdaftar di sistem atas nama pegawai lain (
              {enrollmentConflictOwnerLabel}).
            </p>
            <p className="mt-1 text-amber-800">
              Pendaftaran dibatalkan. Pastikan Anda melakukan scan pada wajah pegawai yang tepat.
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          {enrollmentUsedByOther ? (
            <Button
              className="h-11 flex-1 rounded-xl bg-amber-600 text-white hover:bg-amber-700"
              disabled={submitting}
              onClick={retryEnrollmentWithDifferentFace}
            >
              Scan Ulang
            </Button>
          ) : null}
          <Button variant="outline" className="h-11 flex-1 rounded-xl bg-white/80" disabled={submitting} onClick={closeAction}>
            Batal
          </Button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
