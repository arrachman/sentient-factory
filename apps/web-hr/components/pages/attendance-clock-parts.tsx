"use client";

import {
  Camera,
  Check,
  CircleDashed,
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Loader2,
  ScanFace,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Coords = { latitude: number; longitude: number };

export type TodaySession = {
  clock_in_at?: string | null;
  clock_out_at?: string | null;
  clock_in_worksite_name?: string | null;
  clock_out_worksite_name?: string | null;
  total_work_minutes?: number | null;
};

const TIME_FMT = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const HM_FMT = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});
const DATE_FMT = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function toDate(v?: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMinutes = Math.floor(ms / 60_000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

// ─── Camera / selfie verification ──────────────────────────────────────────

export function CameraPanel({
  videoRef,
  ready,
  camError,
  isClockedIn,
  onEnroll,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
  camError: string | null;
  isClockedIn: boolean;
  onEnroll: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[68%] w-[42%] rounded-[50%] border-2 border-white/40" />
          </div>
        )}
        {ready && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <ScanFace className="h-3.5 w-3.5" /> Verifikasi wajah
          </span>
        )}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
            {camError ? (
              <p className="max-w-xs px-4 text-center text-sm">{camError}</p>
            ) : (
              <>
                <Camera className="h-6 w-6" />
                <span className="text-sm">Menyiapkan kamera…</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Snapshot selfie diambil otomatis saat menekan tombol clock
          {isClockedIn ? " out" : " in"}. Posisikan wajah di dalam bingkai.
        </p>
        <Button variant="ghost" size="sm" className="shrink-0" onClick={onEnroll}>
          <ScanFace className="h-4 w-4" /> Daftarkan Wajah
        </Button>
      </div>
    </div>
  );
}

// ─── Status + action ────────────────────────────────────────────────────────

export function StatusPanel({
  now,
  isClockedIn,
  isDone,
  elapsed,
  clockInAt,
  clockOutAt,
  totalMinutes,
  worksiteName,
  coords,
  geoError,
  cameraReady,
  busy,
  canClock,
  onClock,
}: {
  now: Date;
  isClockedIn: boolean;
  isDone: boolean;
  elapsed: string | null;
  clockInAt: Date | null;
  clockOutAt: Date | null;
  totalMinutes: number | null;
  worksiteName: string | null;
  coords: Coords | null;
  geoError: string | null;
  cameraReady: boolean;
  busy: null | "in" | "out";
  canClock: boolean;
  onClock: (kind: "in" | "out") => void;
}) {
  const statusBadge = isClockedIn ? (
    <Badge variant="success">Sedang bekerja</Badge>
  ) : isDone ? (
    <Badge variant="info">Sesi selesai</Badge>
  ) : (
    <Badge variant="default">Belum clock in</Badge>
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="text-center">
        <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
          {TIME_FMT.format(now)}
        </div>
        <div className="mt-1 text-sm capitalize text-muted-foreground">
          {DATE_FMT.format(now)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {statusBadge}
        {elapsed && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <Clock className="h-3.5 w-3.5" /> {elapsed}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border text-center">
        <div className="bg-card p-3">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Masuk
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
            {clockInAt ? HM_FMT.format(clockInAt) : "—"}
          </div>
        </div>
        <div className="bg-card p-3">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Keluar
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
            {clockOutAt ? HM_FMT.format(clockOutAt) : "—"}
          </div>
        </div>
      </div>

      {isDone && typeof totalMinutes === "number" && (
        <p className="text-center text-xs text-muted-foreground">
          Total kerja hari ini: {formatDuration(totalMinutes * 60_000)}
        </p>
      )}

      <div className="space-y-1.5">
        <ReadinessRow
          ok={cameraReady}
          label="Kamera siap"
          icon={<Camera className="h-3.5 w-3.5" />}
        />
        <ReadinessRow
          ok={Boolean(coords)}
          label={
            coords
              ? `Lokasi terkunci (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
              : (geoError ?? "Mengambil lokasi GPS…")
          }
          icon={<MapPin className="h-3.5 w-3.5" />}
        />
        {worksiteName && (
          <ReadinessRow
            ok
            label={`Worksite: ${worksiteName}`}
            icon={<MapPin className="h-3.5 w-3.5" />}
          />
        )}
      </div>

      {isClockedIn ? (
        <Button
          variant="danger"
          className="h-12 w-full text-sm font-semibold"
          disabled={!canClock}
          onClick={() => onClock("out")}
        >
          {busy === "out" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          Clock Out
        </Button>
      ) : (
        <Button
          variant="primary"
          className="h-12 w-full text-sm font-semibold"
          disabled={!canClock}
          onClick={() => onClock("in")}
        >
          {busy === "in" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          {isDone ? "Clock In Lagi" : "Clock In"}
        </Button>
      )}

      {!coords && (
        <p className="text-center text-xs text-muted-foreground">
          Tombol aktif setelah lokasi GPS terkunci.
        </p>
      )}
    </div>
  );
}

function ReadinessRow({
  ok,
  label,
  icon,
}: {
  ok: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-foreground/90">{label}</span>
      {ok ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <CircleDashed className="h-4 w-4 animate-pulse text-muted-foreground" />
      )}
    </div>
  );
}
