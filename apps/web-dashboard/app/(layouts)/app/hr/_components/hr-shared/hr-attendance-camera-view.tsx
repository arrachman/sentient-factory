'use client';

import { type RefObject, type CSSProperties } from 'react';
import { Check, LoaderCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from '../hr-attendance-effects.module.css';
import { getInitials } from './_utils-hr';

interface HrAttendanceCameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  // display state
  actionMode: 'clockIn' | 'clockOut';
  validationUiState: string;
  submitting: boolean;
  livenessVerified: boolean;
  // overlay
  overlayStyle: CSSProperties | null;
  overlayToneClass: string;
  // attendance info overlay
  attendanceFrameGuideClass: string;
  attendanceInfoTitle: string;
  attendanceInfoMessage: string;
  attendanceInfoTone: string;
  // errors
  cameraError: string | null;
  actionError: string | null;
  detectorUnavailable: boolean;
  // geo
  geoCoords: { latitude: number; longitude: number } | null;
  geoLabel: string | null;
  // identify panel
  identifyLoading: boolean;
  lowConfidence: boolean;
  lowConfidenceHint: string | null;
  topIdentifyMatches: Array<{
    appUserId: number;
    hrUserId: number;
    fullName: string | null;
    username: string;
    employeeCode: string | null;
    similarity: number;
    isCurrentUser: boolean;
  }>;
  // status panel
  canSubmitCurrentAction: boolean;
  attendanceActionHint: string | null;
  // handlers
  retryCaptureFlow: () => void;
  closeAction: () => void;
}

export function HrAttendanceCameraView({
  videoRef,
  canvasRef,
  actionMode,
  validationUiState,
  submitting,
  livenessVerified,
  overlayStyle,
  overlayToneClass,
  attendanceFrameGuideClass,
  attendanceInfoTitle,
  attendanceInfoMessage,
  attendanceInfoTone,
  cameraError,
  actionError,
  detectorUnavailable,
  geoCoords,
  geoLabel,
  identifyLoading,
  lowConfidence,
  lowConfidenceHint,
  topIdentifyMatches,
  canSubmitCurrentAction,
  attendanceActionHint,
  retryCaptureFlow,
  closeAction,
}: HrAttendanceCameraViewProps) {
  const modeTitle = actionMode === 'clockIn' ? 'Absen Masuk' : 'Absen Pulang';

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{modeTitle}</p>
        <h2 className="text-xl font-semibold text-slate-950">
          {submitting ? 'Mencatat Kehadiran...' : 'Arahkan wajah ke dalam frame'}
        </h2>
        <div className="space-y-1 text-sm text-slate-500">
          <p>
            {livenessVerified
              ? 'Verifikasi wajah berhasil.'
              : 'Pastikan wajah terlihat jelas dan lurus ke kamera agar absensi cepat diproses.'}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 shadow-sm">
            <div className="relative">
              <video
                ref={videoRef}
                className={cn(
                  'aspect-[16/10] max-h-[520px] w-full object-cover',
                  'transition-all duration-300',
                  validationUiState === 'success' && 'saturate-110',
                  validationUiState === 'failure' && 'contrast-110 saturate-[.85]',
                )}
                muted
                playsInline
                autoPlay
              />
              <div className="pointer-events-none absolute inset-0">
                <div className={cn(styles.reticleOverlay, 'absolute inset-0')} />
                {validationUiState === 'scanning' ? <div className={cn(styles.scanLine, 'absolute inset-x-[12%] top-[10%]')} /> : null}
                {overlayStyle ? (
                  <div className={cn('absolute rounded-[28px] border-2 transition-all duration-150', overlayToneClass)} style={overlayStyle}>
                    <div className={cn(styles.faceCorner, styles.faceCornerTl)} />
                    <div className={cn(styles.faceCorner, styles.faceCornerTr)} />
                    <div className={cn(styles.faceCorner, styles.faceCornerBl)} />
                    <div className={cn(styles.faceCorner, styles.faceCornerBr)} />
                  </div>
                ) : null}
                {validationUiState === 'success' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlaySuccess, 'absolute inset-0')} /> : null}
                {validationUiState === 'failure' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlayFailure, 'absolute inset-0')} /> : null}
                {submitting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55">
                    <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="size-4 animate-spin" />
                        Mencatat Kehadiran...
                      </span>
                    </div>
                  </div>
                ) : null}
                {!submitting ? (
                  <div className="absolute inset-x-4 bottom-4 flex justify-center">
                    <div
                      className={cn(
                        'max-w-md rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm',
                        attendanceFrameGuideClass,
                      )}
                    >
                      <p className="text-sm font-semibold">{attendanceInfoTitle}</p>
                      <p className={cn('mt-1 text-xs leading-5', attendanceInfoTone === 'info' ? 'text-white/85' : 'text-current/80')}>
                        {attendanceInfoMessage}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {cameraError ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{cameraError}</div>
          ) : null}
          {detectorUnavailable ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Deteksi wajah otomatis belum tersedia di browser ini. Gunakan Chrome atau Edge terbaru.
            </div>
          ) : null}
          {actionError ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', validationUiState === 'failure' && styles.mapStageShake)}>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                  geoCoords ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500',
                )}
              >
                <MapPin className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {geoCoords ? 'Lokasi Terbaca' : 'Membaca Lokasi'}
                </p>
                <p className="text-sm text-slate-600">
                  {geoCoords
                    ? (geoLabel ?? 'Lokasi GPS sudah siap untuk validasi absensi.')
                    : 'Tunggu sebentar sampai lokasi GPS terbaca sebelum melanjutkan.'}
                </p>
                {geoCoords ? (
                  <p className="text-xs font-medium text-emerald-700">Status lokasi siap dipakai untuk validasi.</p>
                ) : null}
              </div>
            </div>
          </div>

          {identifyLoading ? (
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
              Memeriksa identitas wajah dari database...
            </div>
          ) : null}

          {lowConfidence && lowConfidenceHint ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Kemiripan masih rendah.</p>
              <p className="mt-1">{lowConfidenceHint}</p>
            </div>
          ) : null}

          {topIdentifyMatches.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kandidat Teratas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topIdentifyMatches.map((match) => (
                  <div
                    key={`${match.appUserId}-${match.hrUserId}`}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium',
                      match.isCurrentUser ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700',
                    )}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] font-semibold">
                      {getInitials(match.fullName ?? match.username)}
                    </span>
                    {match.fullName ?? match.username}
                    {match.employeeCode ? ` • ${match.employeeCode}` : ''}
                    {` • ${(match.similarity * 100).toFixed(1)}%`}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status Proses</p>
            <div className="mt-3 flex flex-col gap-3">
              <div
                className={cn(
                  'flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                  submitting
                    ? 'bg-sky-50 text-sky-700'
                    : validationUiState === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : validationUiState === 'failure'
                        ? 'bg-rose-50 text-rose-700'
                        : canSubmitCurrentAction
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600',
                )}
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : validationUiState === 'success' || canSubmitCurrentAction ? (
                  <Check className="size-4" />
                ) : null}
                <span>
                  {submitting
                    ? (actionMode === 'clockIn' ? 'Clock in sedang dikirim otomatis...' : 'Clock out sedang dikirim otomatis...')
                    : validationUiState === 'success' || canSubmitCurrentAction
                      ? (actionMode === 'clockIn' ? 'Siap clock in otomatis.' : 'Siap clock out otomatis.')
                      : attendanceActionHint}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {validationUiState === 'failure' ? (
                  <Button className={cn(styles.retryButton, 'h-12 rounded-xl py-3 text-white')} onClick={retryCaptureFlow}>
                    Coba Lagi
                  </Button>
                ) : null}
                <Button variant="outline" className="h-12 rounded-xl py-3" disabled={submitting} onClick={closeAction}>
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
