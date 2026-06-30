"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, LogIn, LogOut, MapPin, Loader2, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaceEnrollDialog } from "@/components/pages/face-enroll-dialog";
import { useCamera } from "@/lib/use-camera";
import { getAttendanceMe, clockIn, clockOut } from "@/lib/api/attendance";
import type { ClockPayload } from "@/lib/api/attendance";
import { hrQueryKeys } from "@/lib/api/hooks";

type Coords = { latitude: number; longitude: number };

function pick(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o?.[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return "—";
}

export function AttendanceClockView() {
  const qc = useQueryClient();
  const {
    videoRef,
    ready,
    error: camError,
    start: startCamera,
    stop: stopCamera,
    capture,
  } = useCamera();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "in" | "out">(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const startedRef = useRef(false);
  const geolocationSupported =
    typeof navigator === "undefined" || Boolean(navigator.geolocation);

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

  const sessionState = me
    ? pick(me as Record<string, unknown>, "state", "sessionState", "status")
    : "—";
  const isClockedIn = /in|open|active|hadir/i.test(sessionState);

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
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Absensi Saya
          <span className="code-tag">ATT</span>
        </h1>
      </div>
      <div className="page-body overflow-auto p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="text-sm text-muted-foreground">
            Clock in / out dengan verifikasi selfie dan lokasi GPS (adaptasi
            jibble Timer + Verification).
          </p>

          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {!ready && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
                  {camError ? (
                    <p className="max-w-xs px-4 text-center text-sm">
                      {camError}
                    </p>
                  ) : (
                    <>
                      <Camera className="h-6 w-6" />
                      <span className="text-sm">Menyiapkan kamera…</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {coords
                    ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                    : (geoError ??
                      (geolocationSupported
                        ? "Mengambil lokasi…"
                        : "Geolokasi tidak didukung browser ini."))}
                </span>
                <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  Status: {isClockedIn ? "Sudah clock in" : sessionState}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={busy !== null || !coords}
                  onClick={() => doClock("in")}
                >
                  {busy === "in" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  Clock In
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  disabled={busy !== null || !coords}
                  onClick={() => doClock("out")}
                >
                  {busy === "out" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Clock Out
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Snapshot selfie diambil otomatis saat menekan tombol. Pastikan
                wajah terlihat jelas dan Anda berada di dalam area worksite.
              </p>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  Wajah belum terdaftar atau ingin perbarui?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    stopCamera();
                    setEnrollOpen(true);
                  }}
                >
                  <ScanFace className="h-4 w-4" /> Daftarkan Wajah
                </Button>
              </div>
            </div>
          </div>
        </div>

        <FaceEnrollDialog
          open={enrollOpen}
          onOpenChange={(o) => {
            setEnrollOpen(o);
            if (!o) void startCamera(); // resume clock camera after enrolling
          }}
        />
      </div>
    </div>
  );
}
