'use client';

import {
  AlertTriangle,
  Camera,
  Check,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  RotateCw,
  ScanFace,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration, HM_FMT, type Coords } from '@/components/pages/attendance-clock-parts';
import type { ScanPhase } from '@/components/pages/attendance-face-scanner';
import type { GeoStatus } from '@/lib/use-geo';

type StepTone = 'ok' | 'active' | 'warn' | 'idle';

const TONE_RING: Record<StepTone, string> = {
  ok: 'text-emerald-400 bg-emerald-400/15 ring-emerald-400/30',
  active: 'text-amber-300 bg-amber-400/15 ring-amber-400/30',
  warn: 'text-red-300 bg-red-500/15 ring-red-400/30',
  idle: 'text-white/55 bg-white/8 ring-white/10',
};

export function StageActionDock({
  isClockedIn,
  isDone,
  clockInAt,
  clockOutAt,
  totalMinutes,
  worksiteName,
  coords,
  accuracy,
  geoStatus,
  geoError,
  onRetryGeo,
  cameraReady,
  camError,
  scanPhase,
  faceSupported,
  busy,
  canClock,
  onClock,
}: {
  isClockedIn: boolean;
  isDone: boolean;
  clockInAt: Date | null;
  clockOutAt: Date | null;
  totalMinutes: number | null;
  worksiteName: string | null;
  coords: Coords | null;
  accuracy: number | null;
  geoStatus: GeoStatus;
  geoError: string | null;
  onRetryGeo: () => void;
  cameraReady: boolean;
  camError: string | null;
  scanPhase: ScanPhase;
  faceSupported: boolean;
  busy: null | 'in' | 'out';
  canClock: boolean;
  onClock: (kind: 'in' | 'out') => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl bg-black/55 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
        {/* Today's punches */}
        <div className="grid flex-1 grid-cols-3 gap-2 self-center">
          <Stat label="Masuk" value={clockInAt ? HM_FMT.format(clockInAt) : '—'} />
          <Stat label="Keluar" value={clockOutAt ? HM_FMT.format(clockOutAt) : '—'} />
          <Stat
            label="Total"
            value={
              typeof totalMinutes === 'number' ? formatDuration(totalMinutes * 60_000) : '—'
            }
          />
        </div>

        <div className="hidden w-px self-stretch bg-white/12 sm:block" />

        {/* Readiness checklist — the three things that must be right to punch */}
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <ReadyStep {...cameraStep(cameraReady, camError)} />
          <ReadyStep {...faceStep(scanPhase, faceSupported)} />
          <ReadyStep
            {...geoStep(coords, accuracy, geoStatus, geoError, worksiteName)}
            action={
              geoStatus === 'error'
                ? { label: 'Coba lagi', icon: <RotateCw className="h-3.5 w-3.5" />, onClick: onRetryGeo }
                : undefined
            }
          />
        </div>

        {/* Primary action */}
        <div className="flex flex-col justify-center gap-1.5 self-center sm:w-56">
          {isClockedIn ? (
            <Button
              variant="danger"
              className="h-14 w-full text-base font-semibold"
              disabled={!canClock}
              onClick={() => onClock('out')}
            >
              {busy === 'out' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              Clock Out
            </Button>
          ) : (
            <Button
              variant="primary"
              className="h-14 w-full text-base font-semibold"
              disabled={!canClock}
              onClick={() => onClock('in')}
            >
              {busy === 'in' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              {isDone ? 'Clock In Lagi' : 'Clock In'}
            </Button>
          )}
          <p className="text-center text-[11px] text-white/55">
            {disabledReason(canClock, busy, geoStatus, scanPhase)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step builders ──────────────────────────────────────────────────────────

function cameraStep(ready: boolean, camError: string | null) {
  if (ready) return { tone: 'ok' as const, icon: <Camera className="h-4 w-4" />, label: 'Kamera siap' };
  if (camError) return { tone: 'warn' as const, icon: <Camera className="h-4 w-4" />, label: camError };
  return { tone: 'active' as const, icon: <Camera className="h-4 w-4" />, label: 'Menyiapkan kamera…' };
}

function faceStep(phase: ScanPhase, supported: boolean) {
  if (!supported)
    return {
      tone: 'idle' as const,
      icon: <ScanFace className="h-4 w-4" />,
      label: 'Wajah · framing manual',
    };
  if (phase === 'locked')
    return { tone: 'ok' as const, icon: <ShieldCheck className="h-4 w-4" />, label: 'Wajah terkunci' };
  return { tone: 'active' as const, icon: <ScanFace className="h-4 w-4" />, label: 'Mencari wajah…' };
}

function geoStep(
  coords: Coords | null,
  accuracy: number | null,
  status: GeoStatus,
  error: string | null,
  worksiteName: string | null,
) {
  if (coords && status === 'ready') {
    const acc = accuracy != null ? ` · ±${Math.round(accuracy)} m` : '';
    const site = worksiteName ? ` · ${worksiteName}` : '';
    return { tone: 'ok' as const, icon: <MapPin className="h-4 w-4" />, label: `Lokasi terkunci${acc}${site}` };
  }
  if (status === 'error')
    return {
      tone: 'warn' as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      label: error ?? 'Lokasi tidak tersedia',
    };
  return { tone: 'active' as const, icon: <MapPin className="h-4 w-4" />, label: 'Mengambil lokasi GPS…' };
}

function disabledReason(
  canClock: boolean,
  busy: null | 'in' | 'out',
  geoStatus: GeoStatus,
  scanPhase: ScanPhase,
): string {
  if (busy) return 'Memproses…';
  if (canClock) return scanPhase === 'locked' ? 'Semua siap — silakan absen' : 'Siap absen';
  if (geoStatus === 'error') return 'Lokasi belum terkunci — tekan “Coba lagi”';
  return 'Aktif setelah lokasi GPS terkunci';
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/8 px-3 py-2 text-center ring-1 ring-white/10">
      <div className="text-[10px] uppercase tracking-wide text-white/55">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function ReadyStep({
  tone,
  icon,
  label,
  action,
}: {
  tone: StepTone;
  icon: React.ReactNode;
  label: string;
  action?: { label: string; icon: React.ReactNode; onClick: () => void };
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ${TONE_RING[tone]}`}
      >
        {icon}
      </span>
      <span className="flex-1 truncate text-white/85">{label}</span>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
        >
          {action.icon}
          {action.label}
        </button>
      ) : tone === 'ok' ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : tone === 'active' ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-300" />
      ) : null}
    </div>
  );
}
