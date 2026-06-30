"use client";

import {
  Camera,
  Check,
  CircleDashed,
  Clock,
  CalendarCheck,
  LogIn,
  LogOut,
  MapPin,
  Loader2,
  ScanFace,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

type StatusTone = "live" | "done" | "idle";

function statusOf(isClockedIn: boolean, isDone: boolean): {
  tone: StatusTone;
  Icon: typeof Clock;
  title: string;
} {
  if (isClockedIn) return { tone: "live", Icon: Clock, title: "Sedang bekerja" };
  if (isDone) return { tone: "done", Icon: CalendarCheck, title: "Sesi selesai" };
  return { tone: "idle", Icon: LogIn, title: "Belum clock in" };
}

// ─── Top overlay: status pill (left) + live clock (right) ───────────────────

export function StageTopBar({
  now,
  isClockedIn,
  isDone,
  elapsed,
  clockInAt,
  onEnroll,
}: {
  now: Date;
  isClockedIn: boolean;
  isDone: boolean;
  elapsed: string | null;
  clockInAt: Date | null;
  onEnroll: () => void;
}) {
  const { tone, Icon, title } = statusOf(isClockedIn, isDone);
  const dot = {
    live: "bg-emerald-400",
    done: "bg-sky-400",
    idle: "bg-white/50",
  }[tone];
  const subtitle = isClockedIn
    ? `Sejak ${clockInAt ? HM_FMT.format(clockInAt) : "—"}${elapsed ? ` · ${elapsed}` : ""}`
    : isDone
      ? "Kerja hari ini sudah tercatat"
      : "Posisikan wajah, lalu clock in";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-black/45 px-4 py-2.5 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Icon className="h-4.5 w-4.5" />
          <span
            className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ${dot} ${tone === "live" ? "animate-pulse" : ""} ring-2 ring-black/50`}
          />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[11px] text-white/65">{subtitle}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="pointer-events-auto rounded-2xl bg-black/45 px-4 py-2 text-right text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <div className="font-mono text-2xl font-semibold tabular-nums leading-none tracking-tight sm:text-3xl">
            {TIME_FMT.format(now)}
          </div>
          <div className="mt-1 text-[11px] capitalize text-white/65">
            {DATE_FMT.format(now)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEnroll}
          className="pointer-events-auto h-8 gap-1.5 rounded-full bg-black/45 px-3 text-xs text-white ring-1 ring-white/10 backdrop-blur-md hover:bg-black/60 hover:text-white"
        >
          <ScanFace className="h-3.5 w-3.5" /> Daftarkan Wajah
        </Button>
      </div>
    </div>
  );
}

// ─── Center: face-alignment guide + camera state ────────────────────────────

export function FaceGuide({
  ready,
  camError,
}: {
  ready: boolean;
  camError: string | null;
}) {
  if (ready) {
    return (
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
        <div className="relative h-[58%] max-h-[460px] w-[44%] max-w-[360px]">
          <div className="absolute inset-0 rounded-[50%] border-2 border-white/45 shadow-[0_0_0_9999px_rgba(0,0,0,0.34)]" />
          <span className="absolute -bottom-9 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <ScanFace className="h-3.5 w-3.5" /> Posisikan wajah di dalam bingkai
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3 text-white/85">
      {camError ? (
        <>
          <Camera className="h-8 w-8 text-white/55" />
          <p className="max-w-sm px-6 text-center text-sm leading-relaxed">
            {camError}
          </p>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Menyiapkan kamera…</span>
        </>
      )}
    </div>
  );
}

// ─── Bottom dock: summary + readiness chips + clock action ──────────────────

export function StageActionDock({
  isClockedIn,
  isDone,
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
  isClockedIn: boolean;
  isDone: boolean;
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
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl bg-black/50 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="grid flex-1 grid-cols-3 gap-2">
          <Stat label="Masuk" value={clockInAt ? HM_FMT.format(clockInAt) : "—"} />
          <Stat label="Keluar" value={clockOutAt ? HM_FMT.format(clockOutAt) : "—"} />
          <Stat
            label="Total"
            value={
              typeof totalMinutes === "number"
                ? formatDuration(totalMinutes * 60_000)
                : "—"
            }
          />
        </div>

        <div className="hidden w-px self-stretch bg-white/12 sm:block" />

        <div className="flex flex-1 flex-col gap-1.5">
          <Chip
            ok={cameraReady}
            icon={<Camera className="h-3.5 w-3.5" />}
            label={cameraReady ? "Kamera siap" : "Menyiapkan kamera…"}
          />
          <Chip
            ok={Boolean(coords)}
            icon={<MapPin className="h-3.5 w-3.5" />}
            label={
              coords
                ? `Lokasi terkunci · ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
                : (geoError ?? "Mengambil lokasi GPS…")
            }
          />
          {worksiteName && (
            <Chip
              ok
              icon={<MapPin className="h-3.5 w-3.5" />}
              label={`Worksite · ${worksiteName}`}
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:w-56">
          {isClockedIn ? (
            <Button
              variant="danger"
              className="h-14 w-full text-base font-semibold"
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
              className="h-14 w-full text-base font-semibold"
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
            <p className="text-center text-[11px] text-white/55">
              Aktif setelah lokasi GPS terkunci
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/8 px-3 py-2 text-center ring-1 ring-white/10">
      <div className="text-[10px] uppercase tracking-wide text-white/55">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Chip({
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
      <span className={ok ? "text-emerald-400" : "text-white/55"}>{icon}</span>
      <span className="flex-1 truncate text-white/85">{label}</span>
      {ok ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <CircleDashed className="h-4 w-4 shrink-0 animate-pulse text-white/55" />
      )}
    </div>
  );
}
