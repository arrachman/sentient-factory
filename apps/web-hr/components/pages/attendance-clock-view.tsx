'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PageHeader } from '@/components/molecules/page-header';
import { FaceEnrollDialog } from '@/components/pages/face-enroll-dialog';
import {
  StageTopBar,
  toDate,
  formatDuration,
  type TodaySession,
} from '@/components/pages/attendance-clock-parts';
import { StageActionDock } from '@/components/pages/attendance-action-dock';
import { FaceScanner, deriveScanPhase } from '@/components/pages/attendance-face-scanner';
import { useCamera } from '@/lib/use-camera';
import { useGeo } from '@/lib/use-geo';
import { useFaceDetector } from '@/lib/use-face-detector';
import { captureFaceEmbedding } from '@/lib/face-embedding';
import { getAttendanceErrorCopy } from '@/lib/attendance-errors';
import { useNow } from '@/lib/use-now';
import { getAttendanceMe, clockIn, clockOut } from '@/lib/api/attendance';
import type { ClockPayload } from '@/lib/api/attendance';
import { hrQueryKeys } from '@/lib/api/hooks';

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
  const geo = useGeo();
  const face = useFaceDetector(videoRef, ready);
  const [busy, setBusy] = useState<null | 'in' | 'out'>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const startedRef = useRef(false);

  const { data: me } = useQuery({
    queryKey: ['hr', 'attendance', 'me'],
    queryFn: getAttendanceMe,
    retry: false,
  });

  // Start the camera once on mount (geolocation self-starts in useGeo).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startCamera();
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

  const scanPhase = deriveScanPhase({
    cameraReady: ready,
    camError,
    faceSupported: face.supported,
    present: face.present,
    centered: face.centered,
  });

  const canClock = Boolean(geo.coords) && busy === null;

  async function doClock(kind: 'in' | 'out') {
    if (!geo.coords) {
      toast.error('Menunggu lokasi GPS… tekan “Coba lagi” bila perlu.');
      return;
    }
    setBusy(kind);
    const metrics = face.metricsRef.current;
    const faceCapture = captureFaceEmbedding(
      videoRef.current,
      face.supported ? metrics.score : 0.85,
    );
    if (!faceCapture) {
      toast.error('Kamera belum bisa membaca wajah. Tunggu sebentar lalu coba lagi.');
      setBusy(null);
      return;
    }
    const payload: ClockPayload = {
      latitude: geo.coords.latitude,
      longitude: geo.coords.longitude,
      snapshotDataUrl: capture() ?? undefined,
      faceEmbedding: faceCapture.embedding,
      faceDetectionMode: face.supported ? 'shape-detection' : 'browser',
      faceScore: face.supported ? metrics.score : faceCapture.qualityScore,
      livenessScore: faceCapture.livenessScore,
      faceDetectionCount: face.supported ? metrics.count : undefined,
      metadata: {
        source: 'web-hr',
        capturedAt: new Date().toISOString(),
        gpsAccuracyM: geo.accuracy ?? undefined,
        faceCentered: face.supported ? metrics.centered : undefined,
        embeddingDimensions: faceCapture.embedding.length,
      },
    };
    try {
      if (kind === 'in') await clockIn(payload);
      else await clockOut(payload);
      toast.success(kind === 'in' ? 'Clock in tercatat.' : 'Clock out tercatat.');
      await qc.invalidateQueries({ queryKey: ['hr', 'attendance', 'me'] });
      await qc.invalidateQueries({ queryKey: hrQueryKeys.dashboard });
    } catch (e) {
      const copy = getAttendanceErrorCopy(e);
      toast.error(copy.title, { description: copy.description });
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageHeader title="Absensi Saya" code="ATT" bodyClassName="p-0 overflow-hidden">
      <div className="relative h-full min-h-[480px] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* subtle vignette so glass overlays stay legible over any frame */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

        <FaceScanner
          phase={scanPhase}
          camError={camError}
          faceSupported={face.supported}
          faceCount={face.count}
        />

        <StageTopBar
          now={now}
          isClockedIn={isClockedIn}
          isDone={isDone}
          elapsed={elapsed}
          clockInAt={clockInAt}
          onEnroll={() => {
            stopCamera();
            setEnrollOpen(true);
          }}
        />

        <StageActionDock
          isClockedIn={isClockedIn}
          isDone={isDone}
          clockInAt={clockInAt}
          clockOutAt={clockOutAt}
          totalMinutes={today?.total_work_minutes ?? null}
          worksiteName={worksiteName}
          coords={geo.coords}
          accuracy={geo.accuracy}
          geoStatus={geo.status}
          geoError={geo.error}
          onRetryGeo={geo.locate}
          cameraReady={ready}
          camError={camError}
          scanPhase={scanPhase}
          faceSupported={face.supported}
          busy={busy}
          canClock={canClock}
          onClock={doClock}
        />
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
