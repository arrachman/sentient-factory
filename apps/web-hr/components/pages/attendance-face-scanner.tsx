'use client';

import { Camera, Loader2, ScanFace, ShieldCheck, Users } from 'lucide-react';

export type ScanPhase = 'init' | 'scanning' | 'locked' | 'error';

export function deriveScanPhase(args: {
  cameraReady: boolean;
  camError: string | null;
  faceSupported: boolean;
  present: boolean;
  centered: boolean;
}): ScanPhase {
  if (args.camError) return 'error';
  if (!args.cameraReady) return 'init';
  // With real detection we can confirm a good frame; without it we stay in the
  // guiding "scanning" state and never fake a lock.
  if (args.faceSupported && args.present && args.centered) return 'locked';
  return 'scanning';
}

const LABELS: Record<ScanPhase, { text: string; sub?: string }> = {
  init: { text: 'Menyiapkan kamera…' },
  scanning: { text: 'Posisikan wajah di dalam bingkai' },
  locked: { text: 'Wajah terkunci', sub: 'Siap untuk absen' },
  error: { text: 'Kamera bermasalah' },
};

/**
 * Animated 3D-style face scanner that overlays the live camera. Phase is driven
 * by camera + (optional) on-device face detection, giving real-time framing
 * feedback instead of a static circle. Visuals live in styles/hr-attendance.css.
 */
export function FaceScanner({
  phase,
  camError,
  faceSupported,
  faceCount,
}: {
  phase: ScanPhase;
  camError: string | null;
  faceSupported: boolean;
  faceCount: number;
}) {
  // Hard camera failure → clear, centered diagnostic (no decorative scanner).
  if (phase === 'error') {
    return (
      <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3 px-6 text-center text-white/85">
        <Camera className="h-9 w-9 text-white/55" />
        <p className="max-w-sm text-sm leading-relaxed">{camError}</p>
      </div>
    );
  }

  if (phase === 'init') {
    return (
      <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3 text-white/85">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Menyiapkan kamera…</span>
      </div>
    );
  }

  const label = LABELS[phase];
  const multiFace = faceCount > 1;

  return (
    <div className="face-stage" data-phase={phase} aria-hidden>
      <div className="face-oval">
        <span className="face-ring" />
        <span className="face-ring face-ring--b" />
        <span className="face-sweep" />
        <span className="face-pulse" />
        <span className="face-corner face-corner--tl" />
        <span className="face-corner face-corner--tr" />
        <span className="face-corner face-corner--bl" />
        <span className="face-corner face-corner--br" />

        {/* Floating status label below the oval. */}
        <span className="absolute -bottom-12 left-1/2 inline-flex max-w-[88vw] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 backdrop-blur">
          {phase === 'locked' ? (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
          )}
          <ScanFace className="h-3.5 w-3.5 opacity-80" />
          <span>{label.text}</span>
          {label.sub && <span className="text-white/55">· {label.sub}</span>}
        </span>
      </div>

      {/* Warn when more than one person is in frame (anti buddy-punch hint). */}
      {multiFace && (
        <span className="absolute left-1/2 top-4 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-red-500/85 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
          <Users className="h-3.5 w-3.5" /> {faceCount} wajah terdeteksi — pastikan hanya Anda
        </span>
      )}

      {/* Detection unsupported → quiet note so the framing still feels intentional. */}
      {!faceSupported && phase === 'scanning' && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white/55 backdrop-blur">
          Deteksi wajah otomatis tidak tersedia di perangkat ini
        </span>
      )}
    </div>
  );
}
