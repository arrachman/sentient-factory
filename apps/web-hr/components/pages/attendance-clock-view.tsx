"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/molecules/page-header";
import { FaceEnrollDialog } from "@/components/pages/face-enroll-dialog";
import {
  CameraPanel,
  StatusHero,
  ActionPanel,
  toDate,
  formatDuration,
  type Coords,
  type TodaySession,
} from "@/components/pages/attendance-clock-parts";
import { useCamera } from "@/lib/use-camera";
import { useNow } from "@/lib/use-now";
import { getAttendanceMe, clockIn, clockOut } from "@/lib/api/attendance";
import type { ClockPayload } from "@/lib/api/attendance";
import { hrQueryKeys } from "@/lib/api/hooks";

const GEO_SUPPORTED =
  typeof navigator === "undefined" || Boolean(navigator.geolocation);

export function AttendanceClockView() {
  const qc = useQueryClient();
  const now = useNow();
  const {
    videoRef,
    ready,
    error: camError,
    start: startCamera,
    stop: stopCamera,
    capture,
  } = useCamera();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(
    GEO_SUPPORTED ? null : "Geolokasi tidak didukung browser ini.",
  );
  const [busy, setBusy] = useState<null | "in" | "out">(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const startedRef = useRef(false);

  const { data: me } = useQuery({
    queryKey: ["hr", "attendance", "me"],
    queryFn: getAttendanceMe,
    retry: false,
  });

  // Start camera + request geolocation once on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startCamera();
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () =>
          setGeoError("Lokasi tidak tersedia. Aktifkan GPS / izinkan lokasi."),
        { enableHighAccuracy: true, timeout: 10_000 },
      );
    }
  }, [startCamera]);

  const today = useMemo<TodaySession | null>(() => {
    const root = me as Record<string, unknown> | undefined;
    const data = (root?.data ?? root) as Record<string, unknown> | undefined;
    return (data?.today as TodaySession | null) ?? null;
  }, [me]);

  const clockInAt = toDate(today?.clock_in_at);
  const clockOutAt = toDate(today?.clock_out_at);
  const isClockedIn = Boolean(clockInAt && !clockOutAt);
  const isDone = Boolean(clockInAt && clockOutAt);
  const elapsed =
    isClockedIn && clockInAt
      ? formatDuration(now.getTime() - clockInAt.getTime())
      : null;
  const worksiteName =
    today?.clock_in_worksite_name ?? today?.clock_out_worksite_name ?? null;

  const canClock = Boolean(coords) && busy === null;

  async function doClock(kind: "in" | "out") {
    if (!coords) {
      toast.error("Menunggu lokasi GPS…");
      return;
    }
    setBusy(kind);
    const payload: ClockPayload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      snapshotDataUrl: capture() ?? undefined,
      faceDetectionMode: "browser",
      metadata: { source: "web-hr", capturedAt: new Date().toISOString() },
    };
    try {
      if (kind === "in") await clockIn(payload);
      else await clockOut(payload);
      toast.success(
        kind === "in" ? "Clock in tercatat." : "Clock out tercatat.",
      );
      await qc.invalidateQueries({ queryKey: ["hr", "attendance", "me"] });
      await qc.invalidateQueries({ queryKey: hrQueryKeys.dashboard });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Proses absensi gagal.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageHeader
      title="Absensi Saya"
      code="ATT"
      description="Clock in / out dengan verifikasi selfie dan lokasi GPS (adaptasi jibble Timer + Verification)."
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <StatusHero
          now={now}
          isClockedIn={isClockedIn}
          isDone={isDone}
          elapsed={elapsed}
          clockInAt={clockInAt}
          totalMinutes={today?.total_work_minutes ?? null}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <CameraPanel
            videoRef={videoRef}
            ready={ready}
            camError={camError}
            isClockedIn={isClockedIn}
            onEnroll={() => {
              stopCamera();
              setEnrollOpen(true);
            }}
          />

          <ActionPanel
            isClockedIn={isClockedIn}
            isDone={isDone}
            clockInAt={clockInAt}
            clockOutAt={clockOutAt}
            totalMinutes={today?.total_work_minutes ?? null}
            worksiteName={worksiteName}
            coords={coords}
            geoError={geoError}
            cameraReady={ready}
            busy={busy}
            canClock={canClock}
            onClock={doClock}
          />
        </div>
      </div>

      <FaceEnrollDialog
        open={enrollOpen}
        onOpenChange={(o) => {
          setEnrollOpen(o);
          if (!o) void startCamera(); // resume clock camera after enrolling
        }}
      />
    </PageHeader>
  );
}
