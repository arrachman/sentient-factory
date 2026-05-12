'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type {
  AttendanceMePayload,
  AttendanceHistoryPayload,
  AttendanceActionMode,
  FaceIdentifyPayload,
  FaceBoundingBox,
  FaceCaptureAnalysis,
  SuccessReviewState,
  ClientAttendanceError,
} from './_types-hr';
import {
  getFaceDetector,
  normalizeFaceBoundingBox,
  getActiveFaceCropBox,
  getLiveFaceFraming,
  getLowConfidenceGuidance,
  getAttendanceBanner,
  getAttendanceActionHint,
  getMapEmbedUrl,
  normalizeDeviceError,
  isManualReviewStatus,
  createClientAttendanceError,
} from './_utils-hr';
import {
  humanizeStatus,
  humanizeReasonCode,
  formatEventLabel,
  formatMinutes,
  formatDateTime,
  formatWorkDate,
  getHistoryQuickRange,
} from './formatters';
import { fetchJson, postJson } from './fetch-json';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHrAttendanceState({
  initialTargetUserId,
  initialActionMode,
}: {
  initialTargetUserId?: string;
  initialActionMode?: AttendanceActionMode;
}) {
  const router = useRouter();

  // ── State ────────────────────────────────────────────────────────────────
  const [data, setData] = useState<AttendanceMePayload | null>(null);
  const [historyPreview, setHistoryPreview] = useState<AttendanceHistoryPayload['data']>([]);
  const [loading, setLoading] = useState(true);
  const [actionMode, setActionMode] = useState<AttendanceActionMode | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successReview, setSuccessReview] = useState<SuccessReviewState | null>(null);
  const [enrollmentConflictMessage, setEnrollmentConflictMessage] = useState<string | null>(null);
  const [enrollmentConflictAppUserId, setEnrollmentConflictAppUserId] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionHits, setDetectionHits] = useState(0);
  const [livenessVerified, setLivenessVerified] = useState(false);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [livenessPrompt, setLivenessPrompt] = useState('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
  const [enrollmentHoldStep, setEnrollmentHoldStep] = useState(0);
  const [detectorReady, setDetectorReady] = useState(false);
  const [detectedFaceBox, setDetectedFaceBox] = useState<FaceBoundingBox | null>(null);
  const [cameraRestartToken, setCameraRestartToken] = useState(0);
  const [geoLabel, setGeoLabel] = useState<string | null>(null);
  const [geoCoords, setGeoCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [identifyLoading, setIdentifyLoading] = useState(false);
  const [identifyResult, setIdentifyResult] = useState<FaceIdentifyPayload | null>(null);
  const [captureAnalysis, setCaptureAnalysis] = useState<FaceCaptureAnalysis | null>(null);
  const [detectorUnavailable, setDetectorUnavailable] = useState(false);
  const [showUnknownFaceDialog, setShowUnknownFaceDialog] = useState(false);
  const [brokenEventImages, setBrokenEventImages] = useState<Record<number, boolean>>({});
  const [enrollmentLockPulse, setEnrollmentLockPulse] = useState(false);
  const [enrollmentFreezeFrameUrl, setEnrollmentFreezeFrameUrl] = useState<string | null>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reportedFailureRef = useRef<string | null>(null);
  const detectorModeRef = useRef<'mediapipe' | 'fallback'>('fallback');
  const identifyRequestRef = useRef(0);
  const identifyCooldownUntilRef = useRef(0);
  const unknownDialogShownRef = useRef(false);
  const lastValidationStateRef = useRef<string>('idle');
  const autoSubmitTimerRef = useRef<number | null>(null);
  const autoSubmitScheduledRef = useRef(false);
  const cameraRestartingRef = useRef(false);
  const failureToastCooldownRef = useRef(0);
  const missedDetectionFramesRef = useRef(0);
  const blinkPeakSeenRef = useRef(false);
  const guideLockSeenRef = useRef(false);
  const enrollmentHoldTimerRef = useRef<number | null>(null);
  const initialActionAppliedRef = useRef(false);

  // ── Data loading ──────────────────────────────────────────────────────────
  async function loadAttendanceMe() {
    const [attendancePayload, historyPayload] = await Promise.all([
      fetchJson<AttendanceMePayload>('/api/hr/attendance/me'),
      fetchJson<AttendanceHistoryPayload['data']>('/api/hr/attendance/history?page=1&limit=22'),
    ]);
    setData(attendancePayload?.data ?? null);
    setHistoryPreview(historyPayload?.data ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    loadAttendanceMe()
      .catch(() => {
        if (!cancelled) {
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Reset on actionMode close ─────────────────────────────────────────────
  useEffect(() => {
    if (!actionMode) {
      setIdentifyLoading(false);
      setIdentifyResult(null);
      setCaptureAnalysis(null);
      setShowUnknownFaceDialog(false);
      identifyCooldownUntilRef.current = 0;
      identifyRequestRef.current += 1;
      unknownDialogShownRef.current = false;
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
      setLivenessVerified(false);
      setLivenessProgress(0);
      setEnrollmentHoldStep(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
      blinkPeakSeenRef.current = false;
      guideLockSeenRef.current = false;
      setEnrollmentLockPulse(false);
      return;
    }

    if (!cameraReady || !faceDetected || detectionHits < 3) {
      return;
    }

    if (Date.now() < identifyCooldownUntilRef.current) {
      return;
    }

    const requestId = identifyRequestRef.current + 1;
    identifyRequestRef.current = requestId;
    identifyCooldownUntilRef.current = Date.now() + 2500;

    const timer = window.setTimeout(async () => {
      try {
        setIdentifyLoading(true);
        const analysis = analyzeCurrentFaceFrame();
        const faceEmbedding = analysis.embedding;
        const payload = await postJson<FaceIdentifyPayload>('/api/hr/attendance/face-identify', {
          faceEmbedding,
          faceDetectionCount: detectionHits,
          faceDetectionMode: detectorModeRef.current,
        });

        if (identifyRequestRef.current !== requestId) {
          return;
        }

        setCaptureAnalysis(analysis);
        setIdentifyResult(payload?.data ?? null);
      } catch {
        if (identifyRequestRef.current !== requestId) {
          return;
        }

        setCaptureAnalysis(null);
        setIdentifyResult(null);
      } finally {
        if (identifyRequestRef.current === requestId) {
          setIdentifyLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMode, cameraReady, detectionHits, faceDetected]);

  // ── Camera lifecycle ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!actionMode) {
      return;
    }

    const activeMode = actionMode;
    let cancelled = false;
    let detectionTimer: number | null = null;
    let restartTimer: number | null = null;
    let currentTrack: MediaStreamTrack | null = null;
    let currentVideo: HTMLVideoElement | null = null;

    const requestCameraRestart = (message: string) => {
      if (cancelled || cameraRestartingRef.current) {
        return;
      }

      cameraRestartingRef.current = true;
      setCameraError(message);
      setCameraReady(false);
      setFaceDetected(false);
      setDetectionHits(0);
      setLivenessVerified(false);
      setLivenessProgress(0);
      setEnrollmentHoldStep(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
      setDetectedFaceBox(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (currentVideo) {
        currentVideo.srcObject = null;
      }

      restartTimer = window.setTimeout(() => {
        if (!cancelled) {
          setCameraRestartToken((value) => value + 1);
        }
      }, 350);
    };

    const handleTrackEnded = () => {
      requestCameraRestart('Stream kamera terputus. Sistem mencoba menyambungkan ulang kamera.');
    };

    const handleTrackMuted = () => {
      requestCameraRestart('Preview kamera terhenti sementara. Sistem mencoba memulihkan stream kamera.');
    };

    const handleVideoStreamInterrupted = () => {
      requestCameraRestart('Preview kamera kosong. Sistem mencoba memuat ulang stream kamera.');
    };

    async function startCamera() {
      cameraRestartingRef.current = false;
      setCameraReady(false);
      setDetectorReady(false);
      setCameraError(null);
      setActionError(null);
      setActionMessage(null);
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
      setFaceDetected(false);
      setDetectionHits(0);
      setDetectedFaceBox(null);
      setLivenessVerified(false);
      setLivenessProgress(0);
      setEnrollmentHoldStep(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
      blinkPeakSeenRef.current = false;
      guideLockSeenRef.current = false;
      setEnrollmentLockPulse(false);
      missedDetectionFramesRef.current = 0;
      setDetectorUnavailable(false);
      setGeoLabel(null);
      setGeoCoords(null);
      reportedFailureRef.current = null;

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Browser camera API is not available on this device.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        currentTrack = stream.getVideoTracks()[0] ?? null;
        if (currentTrack) {
          currentTrack.addEventListener('ended', handleTrackEnded);
          currentTrack.addEventListener('mute', handleTrackMuted);
        }

        if (videoRef.current) {
          currentVideo = videoRef.current;
          currentVideo.addEventListener('emptied', handleVideoStreamInterrupted);
          currentVideo.addEventListener('stalled', handleVideoStreamInterrupted);
          currentVideo.srcObject = stream;
          await currentVideo.play().catch(() => undefined);
        }

        setCameraReady(true);

        void getCurrentPosition().catch((error) => {
          if (!cancelled) {
            setActionError(error instanceof Error ? error.message : 'Gagal mendapatkan GPS.');
          }
        });

        const { detector, mode } = await getFaceDetector();
        if (cancelled) {
          return;
        }

        setDetectorReady(true);
        detectorModeRef.current = mode;

        if (mode === 'fallback' || !detector) {
          setDetectedFaceBox(null);
          setFaceDetected(false);
          setDetectionHits(0);
          setLivenessVerified(false);
          setLivenessProgress(0);
          setEnrollmentFreezeFrameUrl(null);
          setDetectorUnavailable(true);
          setActionError(
            'Browser ini belum mendukung deteksi wajah otomatis. Gunakan Chrome atau Edge versi terbaru untuk melanjutkan pendaftaran wajah dan absensi.',
          );
          return;
        }

        detectionTimer = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) {
            return;
          }

          try {
            const faces = await detector.estimateFaces(video);
            if (cancelled) {
              return;
            }

            const hasFace = faces.length > 0;
            if (hasFace) {
              const currentFace = faces[0];
              missedDetectionFramesRef.current = 0;
              setFaceDetected(true);
              const normalizedFaceBox = normalizeFaceBoundingBox(currentFace);
              setDetectedFaceBox(normalizedFaceBox);
              const nextDetectionHits = Math.min(detectionHits + 1, 12);
              setDetectionHits((current) => Math.min(current + 1, 12));
              const framing = getLiveFaceFraming(video, normalizedFaceBox);
              const attendanceFramingReady =
                framing.wellFramed ||
                framing.alignmentState === 'near' ||
                (
                  framing.faceCoverage >= 0.04 &&
                  framing.centerOffsetX <= 0.22 &&
                  framing.centerOffsetY <= 0.22
                );

              if (activeMode === 'enroll') {
                if (framing.locked) {
                  if (!guideLockSeenRef.current) {
                    guideLockSeenRef.current = true;
                    setEnrollmentLockPulse(true);
                    window.setTimeout(() => setEnrollmentLockPulse(false), 320);
                  }
                } else {
                  guideLockSeenRef.current = false;
                  setEnrollmentLockPulse(false);
                }
              }

              const blinkScore = currentFace.liveness.avgBlink;
              if (!livenessVerified) {
                if (activeMode === 'enroll') {
                  if (!framing.locked) {
                    blinkPeakSeenRef.current = false;
                    setLivenessProgress(0);
                    setLivenessPrompt('Posisikan wajah ke dalam area panduan sampai sistem mengunci wajah.');
                    setEnrollmentFreezeFrameUrl(null);
                  } else if (!blinkPeakSeenRef.current && blinkScore >= 0.38) {
                    blinkPeakSeenRef.current = true;
                    setLivenessProgress(1);
                    setLivenessPrompt('Kedipan mulai terbaca. Selesaikan satu kedipan yang jelas.');
                  } else if (blinkPeakSeenRef.current && blinkScore <= 0.26) {
                    blinkPeakSeenRef.current = false;
                    setLivenessVerified(true);
                    setLivenessProgress(2);
                    setLivenessPrompt('Kedipan terdeteksi. Verifikasi liveness berhasil.');
                  } else if (!blinkPeakSeenRef.current) {
                    setLivenessPrompt('Verifikasi wajah siap. Kedipkan mata sekali untuk melanjutkan.');
                  }
                } else if (!attendanceFramingReady) {
                  setLivenessProgress(1);
                  setLivenessPrompt('Geser wajah ke tengah frame dan pastikan dahi sampai dagu terlihat penuh.');
                } else if (nextDetectionHits >= 1) {
                  setLivenessVerified(true);
                  setLivenessProgress(2);
                  setLivenessPrompt('Wajah sudah siap. Sistem sedang menyiapkan absensi.');
                } else {
                  setLivenessProgress(0);
                  setLivenessPrompt('Arahkan wajah ke dalam frame sampai posisi stabil.');
                }
              }
              if (activeMode === 'enroll' && framing.locked && livenessVerified && !enrollmentFreezeFrameUrl) {
                try {
                  setEnrollmentFreezeFrameUrl(captureSnapshot());
                } catch {
                  // ignore freeze capture failures; live preview stays as fallback
                }
              }
            } else {
              missedDetectionFramesRef.current += 1;
              if (missedDetectionFramesRef.current >= 3) {
                setFaceDetected(false);
                setDetectedFaceBox(null);
                setDetectionHits(0);
                setLivenessVerified(false);
                setLivenessProgress(0);
                setEnrollmentHoldStep(0);
                setEnrollmentFreezeFrameUrl(null);
                setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
                blinkPeakSeenRef.current = false;
                guideLockSeenRef.current = false;
                setEnrollmentLockPulse(false);
              } else {
                setDetectionHits((current) => Math.max(0, current - 1));
              }
            }
          } catch {
            missedDetectionFramesRef.current += 1;
            if (missedDetectionFramesRef.current >= 3) {
              setFaceDetected(false);
              setDetectedFaceBox(null);
              setDetectionHits(0);
              setLivenessVerified(false);
              setLivenessProgress(0);
              setEnrollmentHoldStep(0);
              setEnrollmentFreezeFrameUrl(null);
              setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
              blinkPeakSeenRef.current = false;
              guideLockSeenRef.current = false;
              setEnrollmentLockPulse(false);
            }
          }
        }, 350);
      } catch (error) {
        const message = normalizeDeviceError(error, 'camera');
        setCameraError(message);
        void reportClientFailure(activeMode, 'camera_denied', {
          metadata: {
            stage: 'camera_bootstrap',
          },
        });
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      if (detectionTimer) {
        window.clearInterval(detectionTimer);
      }
      if (restartTimer) {
        window.clearTimeout(restartTimer);
      }
      if (currentTrack) {
        currentTrack.removeEventListener('ended', handleTrackEnded);
        currentTrack.removeEventListener('mute', handleTrackMuted);
      }
      if (currentVideo) {
        currentVideo.removeEventListener('emptied', handleVideoStreamInterrupted);
        currentVideo.removeEventListener('stalled', handleVideoStreamInterrupted);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraReady(false);
      setDetectorReady(false);
      setFaceDetected(false);
      setDetectionHits(0);
      setDetectedFaceBox(null);
      setLivenessVerified(false);
      setLivenessProgress(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
      blinkPeakSeenRef.current = false;
      guideLockSeenRef.current = false;
      setEnrollmentLockPulse(false);
      missedDetectionFramesRef.current = 0;
      setGeoLabel(null);
      setGeoCoords(null);
    };
  }, [actionMode, cameraRestartToken]);

  // ── Unknown face dialog trigger ───────────────────────────────────────────
  useEffect(() => {
    if (!actionMode || actionMode === 'enroll' || identifyLoading || showUnknownFaceDialog || unknownDialogShownRef.current) {
      return;
    }

    if (!faceDetected || detectionHits < 4) {
      return;
    }

    const topSimilarity = identifyResult?.topMatches?.[0]?.similarity ?? 0;
    const shouldShowUnknown = !identifyResult?.matched && topSimilarity < 0.5;
    if (!shouldShowUnknown) {
      return;
    }

    unknownDialogShownRef.current = true;
    const timer = window.setTimeout(() => {
      setShowUnknownFaceDialog(true);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMode, detectionHits, faceDetected, identifyLoading, identifyResult, showUnknownFaceDialog]);

  // ── Auto-clear autoSubmitTimer on unmount ────────────────────────────────
  useEffect(() => {
    return () => {
      if (autoSubmitTimerRef.current) {
        window.clearTimeout(autoSubmitTimerRef.current);
      }
    };
  }, []);

  // ── Auto-dismiss actionMessage ────────────────────────────────────────────
  useEffect(() => {
    if (!actionMessage || actionMode || successReview) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMessage, actionMode, successReview]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function closeAction() {
    setActionMode(null);
    setCameraError(null);
    setActionError(null);
    setGeoLabel(null);
    setGeoCoords(null);
    setDetectedFaceBox(null);
    setDetectorUnavailable(false);
    setIdentifyLoading(false);
    setIdentifyResult(null);
    setEnrollmentConflictMessage(null);
    setEnrollmentConflictAppUserId(null);
    setEnrollmentHoldStep(0);
    setEnrollmentFreezeFrameUrl(null);
    identifyCooldownUntilRef.current = 0;
    identifyRequestRef.current += 1;
  }

  function retryCaptureFlow() {
    setActionError(null);
    setCameraError(null);
    setShowUnknownFaceDialog(false);
    setDetectorUnavailable(false);
    setIdentifyResult(null);
    setCaptureAnalysis(null);
    setFaceDetected(false);
    setDetectionHits(0);
    setDetectedFaceBox(null);
    setLivenessVerified(false);
    setLivenessProgress(0);
    setEnrollmentHoldStep(0);
    setEnrollmentFreezeFrameUrl(null);
    setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
    setEnrollmentConflictMessage(null);
    setEnrollmentConflictAppUserId(null);
    blinkPeakSeenRef.current = false;
    unknownDialogShownRef.current = false;
    identifyCooldownUntilRef.current = 0;
    identifyRequestRef.current += 1;
  }

  function retryEnrollmentWithDifferentFace() {
    setEnrollmentConflictMessage(null);
    setEnrollmentConflictAppUserId(null);
    setActionError(null);
    setActionMessage(null);
    setIdentifyResult(null);
    setCaptureAnalysis(null);
    setFaceDetected(false);
    setDetectionHits(0);
    setDetectedFaceBox(null);
    setLivenessVerified(false);
    setLivenessProgress(0);
    setEnrollmentHoldStep(0);
    setEnrollmentFreezeFrameUrl(null);
    setLivenessPrompt('Posisikan wajah ke dalam area panduan sampai sistem mengunci wajah.');
    blinkPeakSeenRef.current = false;
    guideLockSeenRef.current = false;
    setEnrollmentLockPulse(false);
    identifyCooldownUntilRef.current = 0;
    identifyRequestRef.current += 1;
    setCameraRestartToken((value) => value + 1);
  }

  function playValidationCue(kind: 'success' | 'failure') {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(kind === 'success' ? [18] : [18, 40, 18]);
      }

      if (typeof window === 'undefined') {
        return;
      }

      const AudioContextCtor =
        window.AudioContext ||
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextCtor) {
        return;
      }

      const context = new AudioContextCtor();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = kind === 'success' ? 880 : 320;
      gain.gain.value = 0.0001;

      oscillator.connect(gain);
      gain.connect(context.destination);

      const start = context.currentTime;
      const end = start + (kind === 'success' ? 0.08 : 0.12);
      gain.gain.exponentialRampToValueAtTime(0.04, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.start(start);
      oscillator.stop(end);
      window.setTimeout(() => void context.close().catch(() => undefined), 180);
    } catch {
      // ignore audio/haptic issues
    }
  }

  async function reportClientFailure(
    mode: AttendanceActionMode,
    reasonCode: string,
    options?: {
      snapshotDataUrl?: string | null;
      latitude?: number;
      longitude?: number;
      faceScore?: number;
      livenessScore?: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    const dedupeKey = `${mode}:${reasonCode}`;
    if (reportedFailureRef.current === dedupeKey) {
      return;
    }
    reportedFailureRef.current = dedupeKey;

    const eventType =
      mode === 'enroll'
        ? 'face_enrollment_attempt'
        : mode === 'clockIn'
          ? 'clock_in_attempt'
          : 'clock_out_attempt';

    await fetch('/api/hr/attendance/report-failure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        reasonCode,
        latitude: options?.latitude,
        longitude: options?.longitude,
        faceScore: options?.faceScore,
        livenessScore: options?.livenessScore,
        snapshotDataUrl: options?.snapshotDataUrl ?? undefined,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
        metadata: {
          source: 'web-dashboard',
          ...(options?.metadata ?? {}),
        },
      }),
    }).catch(() => undefined);
  }

  const captureSnapshot = useCallback(function captureSnapshot() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Camera preview is not ready yet.');
    }

    const activeCrop = getActiveFaceCropBox(video, detectedFaceBox);
    canvas.width = activeCrop.width;
    canvas.height = activeCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not available.');
    }

    ctx.drawImage(
      video,
      activeCrop.x,
      activeCrop.y,
      activeCrop.width,
      activeCrop.height,
      0,
      0,
      activeCrop.width,
      activeCrop.height,
    );

    return canvas.toDataURL('image/jpeg', 0.85);
  }, [detectedFaceBox]);

  function analyzeCurrentFaceFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Camera preview is not ready yet.');
    }

    const framing = getLiveFaceFraming(video, detectedFaceBox);
    const activeCrop = getActiveFaceCropBox(video, detectedFaceBox);

    const tempCanvas = document.createElement('canvas');
    const EMBED_SIZE = 32;
    tempCanvas.width = EMBED_SIZE;
    tempCanvas.height = EMBED_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('Canvas 2D context is not available.');
    }

    tempCtx.drawImage(
      video,
      activeCrop.x,
      activeCrop.y,
      activeCrop.width,
      activeCrop.height,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height,
    );

    const pixels = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    const embedding: number[] = [];
    let sum = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const grayscale =
        (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) / 255;
      embedding.push(grayscale);
      sum += grayscale;
    }

    const mean = sum / embedding.length;
    let norm = 0;
    const centered = embedding.map((value) => {
      const next = value - mean;
      norm += next * next;
      return next;
    });

    const safeNorm = Math.sqrt(norm) || 1;
    return {
      embedding: centered.map((value) => Number((value / safeNorm).toFixed(6))),
      brightness: mean,
      faceCoverage: framing.faceCoverage,
      guideCoverage: framing.guideCoverage,
      centerOffsetX: framing.centerOffsetX,
      centerOffsetY: framing.centerOffsetY,
      wellFramed: framing.wellFramed,
    };
  }

  async function getCurrentPosition() {
    if (geoCoords) {
      return geoCoords;
    }

    if (!navigator.geolocation) {
      throw createClientAttendanceError(
        'Geolocation is not available on this device.',
        'gps_unavailable',
      );
    }

    setGeoLabel('Requesting GPS fix...');

    return await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setGeoCoords(coords);
          setGeoLabel(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
          resolve(coords);
        },
        (error) => {
          const message = normalizeDeviceError(error, 'gps');
          const reasonCode =
            error.code === error.PERMISSION_DENIED
              ? 'gps_denied'
              : error.code === error.TIMEOUT
                ? 'gps_timeout'
                : 'gps_unavailable';
          reject(createClientAttendanceError(message, reasonCode));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  }

  // ── Derived values (computed before submitAttendanceAction so they're available) ──
  const profile = data?.profile;
  const today = data?.today;
  const selectedEnrollmentTarget = profile
    ? {
      hrUserId: profile.hrUserId,
      appUserId: profile.appUserId,
      employeeCode: profile.employeeCode,
      faceEnrollmentStatus: profile.faceEnrollmentStatus,
      employeeRoleType: profile.employeeRoleType,
      isActive: true,
      username: profile.username,
      fullName: profile.fullName,
      defaultWorksiteName: profile.defaultWorksiteName,
      assignedWorksites: profile.assignedWorksites ?? [],
    }
    : null;
  const identifiedCandidate = identifyResult?.candidate ?? null;
  const identifyMatched = !!identifyResult?.matched && !!identifiedCandidate;
  const identifyMatchesEnrollmentTarget =
    !!identifiedCandidate &&
    !!selectedEnrollmentTarget &&
    identifiedCandidate.appUserId === selectedEnrollmentTarget.appUserId;
  const identifyMatchesCurrentUser =
    actionMode === 'enroll' ? identifyMatchesEnrollmentTarget : !!identifiedCandidate?.isCurrentUser;
  const topIdentifyMatches = identifyResult?.topMatches ?? [];
  const topSimilarity = topIdentifyMatches[0]?.similarity ?? 0;
  const liveFraming = getLiveFaceFraming(videoRef.current, detectedFaceBox);
  const autoSubmitEnabled = data?.settings?.autoSubmitEnabled ?? true;
  const faceVerifyConfidenceThreshold = data?.settings?.faceVerifyConfidenceThreshold ?? 0.82;
  const lowConfidence = faceDetected && !identifyMatched && topSimilarity >= 0.5 && topSimilarity < 0.7;
  const lowConfidenceHint = lowConfidence && captureAnalysis
    ? getLowConfidenceGuidance({
        similarity: topSimilarity,
        brightness: captureAnalysis.brightness,
        faceCoverage: captureAnalysis.faceCoverage,
      })
    : null;
  const identifyConflict = identifyMatched && !identifyMatchesCurrentUser;
  const enrollmentConflictOwnerLabel =
    identifiedCandidate?.fullName ?? identifiedCandidate?.username ?? 'pegawai lain';

  async function submitAttendanceAction(mode: AttendanceActionMode) {
    setSubmitting(true);
    setActionError(null);
    setActionMessage(null);
    let duplicateConflictAppUserId: number | null = null;

    try {
      if (!cameraReady) {
        throw createClientAttendanceError('Preview kamera belum siap.', 'camera_not_ready');
      }

      const hasStableAttendanceFace =
        mode === 'enroll'
          ? detectionHits >= 2
          : faceDetected || !!detectedFaceBox;

      if (!hasStableAttendanceFace) {
        const snapshotDataUrl = cameraReady ? captureSnapshot() : null;
        await reportClientFailure(mode, 'face_not_detected', {
          snapshotDataUrl,
          faceScore: 0,
          livenessScore: 0,
          metadata: {
            detectionHits,
            stage: 'pre_submit_validation',
            validationUiState: 'failure',
          },
        });
        throw createClientAttendanceError(
          'Wajah belum terdeteksi dengan stabil. Posisi wajah diperbaiki lalu coba lagi.',
          'face_not_detected',
        );
      }

      if (mode === 'enroll' && !livenessVerified) {
        const snapshotDataUrl = cameraReady ? captureSnapshot() : null;
        await reportClientFailure(mode, 'liveness_not_verified', {
          snapshotDataUrl,
          faceScore: 0,
          livenessScore: 0.1,
          metadata: {
            detectionHits,
            stage: 'pre_submit_liveness',
            validationUiState: 'failure',
            livenessProgress,
          },
        });
        throw createClientAttendanceError(
          'Verifikasi wajah asli belum selesai. Kedipkan mata sekali lalu tahan wajah tetap lurus.',
          'liveness_not_verified',
        );
      }

      const preSubmitFraming = getLiveFaceFraming(videoRef.current, detectedFaceBox);
      if (mode === 'enroll' && !preSubmitFraming.wellFramed) {
        const snapshotDataUrl = cameraReady ? captureSnapshot() : null;
        await reportClientFailure(mode, 'face_not_centered', {
          snapshotDataUrl,
          faceScore: 0,
          livenessScore: 0,
          metadata: {
            detectionHits,
            stage: 'pre_submit_framing',
            validationUiState: 'failure',
            faceCoverage: preSubmitFraming.faceCoverage,
            guideCoverage: preSubmitFraming.guideCoverage,
            centerOffsetX: preSubmitFraming.centerOffsetX,
            centerOffsetY: preSubmitFraming.centerOffsetY,
          },
        });
        throw createClientAttendanceError(
          'Wajah harus masuk penuh di dalam frame. Hadapkan wajah lurus ke kamera dan posisikan tepat di tengah.',
          'face_not_centered',
        );
      }

      const snapshotDataUrl = captureSnapshot();
      const liveCaptureAnalysis = analyzeCurrentFaceFrame();
      const faceEmbedding = liveCaptureAnalysis.embedding;
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };

      let liveIdentifyResult = identifyResult;
      if (!liveIdentifyResult && faceDetected && detectionHits >= 1) {
        const identifyPayload = await postJson<FaceIdentifyPayload>('/api/hr/attendance/face-identify', {
          faceEmbedding,
          faceDetectionCount: detectionHits,
          faceDetectionMode: detectorModeRef.current,
        });
        liveIdentifyResult = identifyPayload?.data ?? null;
        setIdentifyResult(liveIdentifyResult);
        setCaptureAnalysis(liveCaptureAnalysis);
      }

      const liveIdentifyCandidate = liveIdentifyResult?.candidate ?? null;
      const liveIdentifyMatchesActionTarget = mode === 'enroll'
        ? !!liveIdentifyCandidate &&
          liveIdentifyCandidate.appUserId === (selectedEnrollmentTarget?.appUserId ?? profile?.appUserId)
        : !!liveIdentifyCandidate?.isCurrentUser;

      if (liveIdentifyResult?.matched && liveIdentifyCandidate && !liveIdentifyMatchesActionTarget) {
        duplicateConflictAppUserId = liveIdentifyCandidate.appUserId;
        await reportClientFailure(mode, 'face_identified_as_other_user', {
          snapshotDataUrl,
          metadata: {
            stage: 'pre_submit_identify_conflict',
            validationUiState: 'failure',
            brightness: liveCaptureAnalysis.brightness,
            faceCoverage: liveCaptureAnalysis.faceCoverage,
            topSimilarity,
            lowConfidenceHint,
            identifiedCandidate: {
              hrUserId: liveIdentifyCandidate.hrUserId,
              appUserId: liveIdentifyCandidate.appUserId,
              employeeCode: liveIdentifyCandidate.employeeCode,
              username: liveIdentifyCandidate.username,
              fullName: liveIdentifyCandidate.fullName,
              similarity: liveIdentifyCandidate.similarity,
            },
            topMatches: liveIdentifyResult.topMatches,
          },
        });
        throw createClientAttendanceError(
          `Wajah yang terdeteksi lebih cocok dengan ${liveIdentifyCandidate.fullName ?? liveIdentifyCandidate.username}. Gunakan akun yang benar sebelum melanjutkan.`,
          'face_identified_as_other_user',
        );
      }

      if (mode === 'enroll') {
        const payload = await postJson<{ faceEnrollmentStatus: string }>(
          '/api/hr/face-enrollment',
          {
            targetAppUserId: selectedEnrollmentTarget?.appUserId ?? profile?.appUserId,
            qualityScore: Math.min(0.99, Math.max(0.7, detectionHits / 10)),
            livenessScore: 0.96,
            snapshotDataUrl,
            faceEmbedding,
            faceDetectionCount: detectionHits,
            faceDetectionMode: detectorModeRef.current,
            metadata: {
              detectionHits,
              detectorMode: detectorModeRef.current,
              source: 'web-dashboard',
              deviceInfo,
              validationUiState,
              livenessVerified,
              identifyConfidence: topSimilarity,
              brightness: liveCaptureAnalysis.brightness,
              faceCoverage: liveCaptureAnalysis.faceCoverage,
              lowConfidenceHint,
            },
          },
        );

        await loadAttendanceMe();
        setActionMessage(payload?.message ?? 'Pendaftaran wajah berhasil disimpan.');
        setSuccessReview({
          mode,
          snapshotDataUrl,
          recordedAt: new Date().toISOString(),
          employeeName:
            selectedEnrollmentTarget?.fullName ??
            selectedEnrollmentTarget?.username ??
            profile?.fullName ??
            profile?.username ??
            'Pegawai',
          actionLabel: 'Pendaftaran wajah berhasil',
        });
        closeAction();
        return;
      }

      const coords = await getCurrentPosition();
      const payload = await postJson<{ status: string; reasonCode: string | null }>(
        mode === 'clockIn' ? '/api/hr/attendance/clock-in' : '/api/hr/attendance/clock-out',
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          livenessScore: livenessVerified ? 0.96 : 0.1,
          snapshotDataUrl,
          faceEmbedding,
          faceDetectionCount: detectionHits,
          faceDetectionMode: detectorModeRef.current,
          deviceInfo,
          metadata: {
            validationUiState,
            livenessVerified,
            identifyConfidence: topSimilarity,
            brightness: liveCaptureAnalysis.brightness,
            faceCoverage: liveCaptureAnalysis.faceCoverage,
            lowConfidenceHint,
          },
        },
      );

      await loadAttendanceMe();
      setActionMessage(
        mode === 'clockIn'
          ? 'Clock in berhasil dicatat. Anda kembali ke halaman absensi.'
          : 'Clock out berhasil dicatat. Anda kembali ke halaman absensi.',
      );
      closeAction();
      if (mode === 'clockIn') {
        window.setTimeout(() => {
          router.replace('/app/hr/attendance');
        }, 150);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Proses absensi gagal.';
      const isDuplicateEnrollmentConflict =
        mode === 'enroll' &&
        (
          message.includes('Wajah ini sudah terdaftar untuk pegawai lain') ||
          message.includes('Pegawai ini sudah memiliki wajah terdaftar aktif')
        );

      if (isDuplicateEnrollmentConflict) {
        setEnrollmentConflictMessage(message);
        setEnrollmentConflictAppUserId(duplicateConflictAppUserId);
      }
      const reasonCode =
        typeof (error as ClientAttendanceError)?.reasonCode === 'string'
          ? (error as ClientAttendanceError).reasonCode
          : null;
      if (reasonCode && reasonCode !== 'face_not_detected' && reasonCode !== 'camera_denied') {
        void reportClientFailure(mode, reasonCode, {
          metadata: {
            stage: 'submit',
            validationUiState,
            identifyConfidence: topSimilarity,
            brightness: captureAnalysis?.brightness ?? null,
            faceCoverage: captureAnalysis?.faceCoverage ?? null,
            lowConfidenceHint,
          },
        });
      }
      setActionError(isDuplicateEnrollmentConflict ? null : message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── More derived values ───────────────────────────────────────────────────
  const banner = getAttendanceBanner(profile ?? null, today ?? null);
  const selectedEnrollmentTargetAlreadyEnrolled =
    selectedEnrollmentTarget?.faceEnrollmentStatus === 'enrolled';
  const isEnrolled = profile?.faceEnrollmentStatus === 'enrolled';
  const showEnrollmentSection = !!profile && !isEnrolled;
  const canClockIn = !!profile && isEnrolled && !today?.clock_in_at;
  const canClockOut = !!profile && isEnrolled && !!today?.clock_in_at && !today?.clock_out_at;
  const autoSubmitConfidenceThreshold = data?.settings?.autoSubmitConfidenceThreshold ?? 0.9;
  const actionHint = getAttendanceActionHint(profile ?? null, today ?? null);
  const needsManualReview =
    isManualReviewStatus(today?.clock_in_status) || isManualReviewStatus(today?.clock_out_status);
  const presentDays = historyPreview.filter((row) => !!row.clock_in_at).length;
  const fullDays = historyPreview.filter((row) => !!row.clock_out_at).length;
  const totalHistoryMinutes = historyPreview.reduce((sum, row) => sum + Number(row.total_work_minutes ?? 0), 0);
  const avgHistoryHours = fullDays > 0 ? totalHistoryMinutes / 60 / fullDays : 0;
  const lateArrivals = historyPreview.filter((row) => isManualReviewStatus(row.clock_in_status) || row.clock_in_status === 'warning' || row.clock_in_status === 'rejected').length;
  const earlyDepartures = historyPreview.filter((row) => isManualReviewStatus(row.clock_out_status) || row.clock_out_status === 'warning' || row.clock_out_status === 'rejected').length;
  const outOfGeofenceCount = (data?.recentEvents ?? []).filter((event) => event.reason_code === 'outside_geofence').length;
  const pendingReviewEvents = (data?.recentEvents ?? []).filter((event) => event.result === 'manual_review' || event.result === 'warning');
  const latestPendingReview = pendingReviewEvents[0] ?? null;
  const statusTitle = banner?.title ?? 'Absensi';
  const isEnrollmentFocus = actionMode === 'enroll';
  const attendanceFramingReady =
    faceDetected &&
    (
      liveFraming.wellFramed ||
      liveFraming.alignmentState === 'near' ||
      (
        liveFraming.faceCoverage >= 0.04 &&
        liveFraming.centerOffsetX <= 0.22 &&
        liveFraming.centerOffsetY <= 0.22
      )
    );
  const unknownFaceDetected =
    actionMode !== 'enroll' &&
    faceDetected &&
    !!identifyResult &&
    !identifyLoading &&
    !identifyMatched &&
    detectionHits >= 4 &&
    topSimilarity < faceVerifyConfidenceThreshold;
  const enrollmentTargetAlreadyHasFace =
    actionMode === 'enroll' &&
    !!enrollmentConflictMessage &&
    enrollmentConflictMessage.includes('Pegawai ini sudah memiliki wajah terdaftar aktif');
  const enrollmentUsedByOther =
    actionMode === 'enroll' &&
    (
      identifyConflict ||
      (!!enrollmentConflictMessage && !enrollmentTargetAlreadyHasFace)
    );
  const enrollmentFaceVisible = faceDetected || !!detectedFaceBox;
  const enrollmentAlignmentState = !enrollmentFaceVisible
    ? 'idle'
    : liveFraming.alignmentState;
  const enrollmentGuideLocked = enrollmentFaceVisible && liveFraming.locked;
  const enrollmentFaceAligned = enrollmentGuideLocked;
  const enrollmentStabilityHits = Math.min(enrollmentHoldStep || detectionHits, 4);
  const enrollmentIsHolding =
    actionMode === 'enroll' &&
    enrollmentFaceVisible &&
    (enrollmentGuideLocked || enrollmentAlignmentState === 'near') &&
    livenessVerified &&
    !submitting &&
    !enrollmentUsedByOther &&
    !enrollmentTargetAlreadyHasFace;
  const enrollmentHoldProgress = enrollmentIsHolding && livenessVerified
    ? Math.min(100, Math.round((enrollmentStabilityHits / 4) * 100))
    : 0;
  const enrollmentInfoTone = enrollmentUsedByOther
    ? 'warning'
    : selectedEnrollmentTargetAlreadyEnrolled
    ? 'warning'
        : identifyMatched && identifyMatchesEnrollmentTarget
          ? 'success'
        : enrollmentGuideLocked
          ? 'success'
          : enrollmentFaceVisible && enrollmentAlignmentState === 'near'
            ? 'info'
            : enrollmentFaceVisible
              ? 'warning'
              : 'info';
  const enrollmentInfoTitle = enrollmentUsedByOther
    ? 'Wajah Sudah Dipakai Pegawai Lain'
    : selectedEnrollmentTargetAlreadyEnrolled
    ? 'Wajah Pegawai Sudah Terdaftar'
      : identifyMatched && identifyMatchesEnrollmentTarget
        ? 'Wajah Target Sudah Dikenali'
        : enrollmentGuideLocked
          ? 'Posisi Wajah Sudah Pas'
          : enrollmentFaceVisible && enrollmentAlignmentState === 'near'
            ? 'Wajah Hampir Masuk Panduan'
          : enrollmentFaceVisible
            ? 'Wajah Belum Masuk Panduan'
            : 'Posisikan Wajah Penuh di Dalam Kotak';
  const enrollmentInfoMessage = enrollmentUsedByOther
    ? identifyConflict
      ? `Verifikasi wajah berhasil, tetapi wajah ini lebih cocok dengan ${enrollmentConflictOwnerLabel}. Pendaftaran untuk target saat ini diblok.`
      : `Verifikasi wajah berhasil, tetapi ${enrollmentConflictMessage}`
      : selectedEnrollmentTargetAlreadyEnrolled
    ? 'Pegawai ini sudah memiliki wajah terdaftar. Pendaftaran baru akan diblok agar data lama tidak tertimpa.'
      : identifyMatched && identifyMatchesEnrollmentTarget
        ? (livenessVerified
          ? 'Wajah target sudah dikenali dan liveness sudah lolos. Pertahankan posisi wajah di dalam oval sampai sistem mencatat.'
          : livenessPrompt)
        : enrollmentGuideLocked
          ? (livenessVerified
            ? `Posisi wajah sudah pas. Pertahankan di dalam oval sampai stabilisasi selesai (${enrollmentStabilityHits}/4).`
            : livenessPrompt)
          : enrollmentFaceVisible && enrollmentAlignmentState === 'near'
            ? 'Wajah sudah masuk panduan. Sekarang kedipkan mata sekali untuk verifikasi.'
          : enrollmentFaceVisible && enrollmentAlignmentState === 'off'
            ? 'Masukkan seluruh wajah ke dalam oval panduan. Dahi, mata, hidung, dan dagu harus terlihat penuh.'
          : enrollmentFaceVisible && detectionHits >= 2
            ? 'Wajah sudah terbaca. Pastikan seluruh wajah berada di dalam oval panduan.'
            : enrollmentFaceVisible
              ? 'Geser wajah ke tengah hingga seluruh wajah masuk ke dalam oval panduan.'
        : 'Masukkan seluruh wajah ke dalam oval panduan. Dahi, mata, hidung, dan dagu harus terlihat penuh.';
  const attendanceInfoTone = identifyConflict
    ? 'danger'
    : identifyMatched && identifyMatchesCurrentUser
      ? 'success'
      : livenessVerified && liveFraming.wellFramed
        ? 'success'
        : faceDetected
          ? 'info'
          : 'info';
  const attendanceInfoTitle = identifyConflict
    ? 'Wajah Tidak Sesuai Akun'
    : identifyLoading
      ? 'Mencocokkan Wajah'
    : identifyMatched && identifyMatchesCurrentUser
      ? 'Wajah Sudah Dikenali'
    : faceDetected && !livenessVerified
      ? 'Menstabilkan Wajah'
      : livenessVerified && attendanceFramingReady
        ? 'Posisi Wajah Sudah Bagus'
        : faceDetected
          ? 'Wajah Sudah Terdeteksi'
          : 'Posisikan Wajah Penuh di Dalam Kotak';
  const attendanceInfoMessage = identifyConflict
    ? `Wajah yang tertangkap lebih cocok dengan ${identifiedCandidate?.fullName ?? identifiedCandidate?.username}. Gunakan akun yang benar sebelum melanjutkan.`
    : identifyLoading
      ? 'Tunggu sebentar, sistem sedang mencocokkan wajah Anda dengan data yang terdaftar.'
    : identifyMatched && identifyMatchesCurrentUser
      ? (livenessVerified
        ? 'Wajah akun ini sudah dikenali dan liveness sudah lolos. Tahan wajah tetap lurus sampai sistem mencatat.'
        : livenessPrompt)
    : faceDetected && !livenessVerified
      ? livenessPrompt
      : livenessVerified && attendanceFramingReady
        ? 'Posisi wajah sudah cukup baik. Sistem akan melanjutkan absensi otomatis.'
        : faceDetected && detectionHits >= 2
          ? 'Wajah sudah terbaca. Tahan wajah sebentar atau geser sedikit ke tengah jika masih belum lanjut.'
          : faceDetected
            ? 'Wajah sudah terbaca, tetapi masih perlu sedikit penyesuaian. Geser wajah ke tengah dan pastikan dahi serta dagu tetap masuk frame.'
            : 'Pastikan seluruh wajah masuk ke dalam kotak. Dahi, mata, hidung, dan dagu harus terlihat penuh.';
  const enrollmentReady =
    actionMode === 'enroll' &&
    cameraReady &&
    !detectorUnavailable &&
    enrollmentStabilityHits >= 4 &&
    livenessVerified &&
    enrollmentGuideLocked &&
    !enrollmentConflictMessage &&
    !cameraError &&
    !selectedEnrollmentTargetAlreadyEnrolled &&
    !identifyConflict;
  const validationUiState = actionMode === 'enroll'
        ? !cameraReady
          ? 'idle'
        : enrollmentUsedByOther || enrollmentTargetAlreadyHasFace
          ? 'low-confidence'
          : enrollmentReady
            ? 'success'
            : enrollmentFaceVisible
              ? enrollmentGuideLocked
                ? 'scanning'
                : 'low-confidence'
              : 'idle'
    : !cameraReady
    ? 'idle'
    : identifyLoading
      ? 'scanning'
      : identifyConflict
        ? 'failure'
        : identifyMatched || (faceDetected && detectionHits >= 1 && attendanceFramingReady)
          ? 'success'
        : lowConfidence
          ? 'low-confidence'
          : faceDetected
            ? 'scanning'
            : 'idle';
  const canSubmitCurrentAction = actionMode === 'enroll'
    ? !submitting && !actionError && !cameraError && !detectorUnavailable && !identifyConflict && !enrollmentConflictMessage && !selectedEnrollmentTargetAlreadyEnrolled && enrollmentStabilityHits >= 3 && enrollmentGuideLocked && livenessVerified
    : !submitting && !cameraError && !detectorUnavailable && !identifyLoading && !identifyConflict && !unknownFaceDetected && faceDetected && detectionHits >= 1 && attendanceFramingReady;
  const attendanceActionHint = actionMode === 'enroll'
    ? null
    : identifyLoading
      ? 'Sedang mencocokkan wajah dengan data pegawai.'
      : identifyConflict
        ? 'Wajah tidak sesuai dengan akun yang sedang login.'
      : unknownFaceDetected
        ? 'Wajah belum dikenali sistem. Pastikan wajah sudah terdaftar.'
      : !faceDetected
        ? 'Arahkan wajah ke tengah frame.'
      : !livenessVerified
        ? livenessPrompt
      : !canSubmitCurrentAction
        ? 'Tunggu sebentar, sistem masih menyiapkan validasi akhir.'
        : 'Wajah siap. Absensi akan diproses otomatis.';
  const overlayBox = detectedFaceBox;
  const overlayStyle = cameraReady && overlayBox && videoRef.current
    ? {
        left: `${(overlayBox.x / videoRef.current.videoWidth) * 100}%`,
        top: `${(overlayBox.y / videoRef.current.videoHeight) * 100}%`,
        width: `${(overlayBox.width / videoRef.current.videoWidth) * 100}%`,
        height: `${(overlayBox.height / videoRef.current.videoHeight) * 100}%`,
      }
    : null;
  const primaryActionLabel = actionMode === 'enroll'
    ? 'Simpan Pendaftaran Wajah'
    : actionMode === 'clockIn'
      ? 'Kirim Jam Masuk'
      : 'Kirim Jam Pulang';
  const selectedEnrollmentTargetName =
    selectedEnrollmentTarget?.fullName ??
    selectedEnrollmentTarget?.username ??
    profile?.fullName ??
    profile?.username ??
    '';
  const selectedEnrollmentTargetCode =
    selectedEnrollmentTarget?.employeeCode ??
    profile?.employeeCode ??
    null;
  const selectedEnrollmentTargetContext = selectedEnrollmentTargetName
    ? `Mendaftarkan: ${selectedEnrollmentTargetName}${selectedEnrollmentTargetCode ? ` (${selectedEnrollmentTargetCode})` : ''}`
    : '';
  const primaryActionButtonLabel = actionMode === 'enroll' && !canSubmitCurrentAction
    ? selectedEnrollmentTargetAlreadyEnrolled
      ? 'Wajah Sudah Terdaftar'
        : enrollmentUsedByOther
          ? 'Wajah Sudah Dipakai Pegawai Lain'
        : enrollmentTargetAlreadyHasFace
          ? 'Wajah Pegawai Sudah Terdaftar'
        : !enrollmentGuideLocked
          ? enrollmentFaceVisible
            ? 'Wajah hampir masuk panduan'
            : 'Arahkan wajah ke kamera'
        : livenessProgress === 1
          ? 'Selesaikan kedipan...'
        : !livenessVerified
          ? 'Menunggu berkedip...'
            : !cameraReady
              ? 'Menyiapkan kamera...'
              : primaryActionLabel
    : primaryActionLabel;
  const enrollmentFrameLabel = actionMode === 'enroll'
    ? validationUiState === 'success'
      ? 'Verifikasi Berhasil'
      : enrollmentUsedByOther
        ? 'Wajah sudah dipakai pegawai lain'
      : enrollmentTargetAlreadyHasFace
          ? 'Wajah pegawai sudah terdaftar'
        : !enrollmentGuideLocked
          ? enrollmentFaceVisible
            ? 'Wajah hampir masuk panduan'
            : 'Arahkan wajah ke kamera'
          : livenessProgress === 1
            ? 'Selesaikan kedipan...'
        : 'Verifikasi wajah siap'
    : null;
  const enrollmentHeroTitle = actionMode === 'enroll'
    ? enrollmentUsedByOther
      ? 'Wajah sudah dipakai pegawai lain'
      : enrollmentTargetAlreadyHasFace
        ? 'Wajah pegawai sudah terdaftar'
      : !enrollmentFaceVisible
        ? 'Posisikan wajah Anda ke dalam panduan'
        : !enrollmentGuideLocked
          ? 'Wajah hampir masuk panduan'
        : livenessProgress === 1
          ? 'Selesaikan kedipan mata'
        : !livenessVerified
            ? 'Posisi wajah sesuai'
            : submitting
              ? 'Menyimpan pendaftaran wajah'
              : validationUiState === 'success'
                ? 'Verifikasi berhasil'
                : `Tahan posisi ${enrollmentStabilityHits}/4`
    : null;
  const enrollmentHeroMessage = actionMode === 'enroll'
    ? enrollmentUsedByOther
      ? identifyConflict
        ? `Verifikasi wajah berhasil, tetapi wajah ini lebih cocok dengan ${enrollmentConflictOwnerLabel}. Pilih pegawai yang benar atau gunakan wajah lain.`
        : `Verifikasi wajah berhasil, tetapi ${enrollmentConflictMessage}`
        : enrollmentTargetAlreadyHasFace
          ? 'Target ini sudah memiliki wajah aktif. Pendaftaran ulang diblok agar data wajah tidak dobel.'
        : !enrollmentFaceVisible
          ? 'Arahkan wajah ke kamera lalu masukkan seluruh wajah ke dalam oval panduan.'
        : !enrollmentGuideLocked
            ? 'Wajah hampir masuk panduan. Geser sedikit lagi agar seluruh wajah masuk oval.'
            : livenessProgress === 1
              ? 'Tutup lalu buka mata sekali lagi dengan jelas.'
              : !livenessVerified
                ? 'Kedipkan mata Anda satu kali untuk menyelesaikan verifikasi.'
                : submitting
                  ? 'Tunggu sebentar sampai sistem selesai mencatat wajah target.'
                  : enrollmentHoldProgress >= 100
                    ? 'Stabilisasi selesai. Sistem sedang menyiapkan penyimpanan otomatis.'
                    : `Pertahankan wajah tetap di dalam oval (${enrollmentStabilityHits}/4).`
    : null;
  const shouldAutoSubmit =
    actionMode !== null &&
    autoSubmitEnabled &&
    !submitting &&
    !actionError &&
    !cameraError &&
    !detectorUnavailable &&
    (
      actionMode === 'enroll'
        ? validationUiState === 'success' &&
          enrollmentStabilityHits >= 4 &&
          livenessVerified &&
          enrollmentGuideLocked &&
          !identifyConflict
        : canSubmitCurrentAction
    );

  // ── Effects that depend on derived values ─────────────────────────────────
  useEffect(() => {
    if (initialActionAppliedRef.current) {
      return;
    }

    if (initialActionMode !== 'enroll' || !profile || actionMode) {
      return;
    }

    if (!showEnrollmentSection) {
      initialActionAppliedRef.current = true;
      return;
    }

    setActionMode('enroll');
    initialActionAppliedRef.current = true;
  }, [actionMode, initialActionMode, profile, showEnrollmentSection]);

  useEffect(() => {
    if (actionMode !== 'enroll' || !enrollmentConflictMessage) {
      return;
    }

    if (!faceDetected || detectionHits < 2) {
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
      return;
    }

    if (identifyLoading) {
      return;
    }

    const currentCandidateAppUserId = identifiedCandidate?.appUserId ?? null;

    if (enrollmentConflictAppUserId === null) {
      if (identifyMatchesEnrollmentTarget) {
        setEnrollmentConflictMessage(null);
      }
      return;
    }

    const candidateChanged =
      currentCandidateAppUserId !== null &&
      currentCandidateAppUserId !== enrollmentConflictAppUserId;

    if (!identifyMatched || identifyMatchesEnrollmentTarget || candidateChanged) {
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
    }
  }, [
    actionMode,
    detectionHits,
    enrollmentConflictAppUserId,
    enrollmentConflictMessage,
    faceDetected,
    identifyLoading,
    identifyMatched,
    identifyMatchesEnrollmentTarget,
    identifiedCandidate?.appUserId,
  ]);

  useEffect(() => {
    if (actionMode !== 'enroll' || !enrollmentUsedByOther || enrollmentFreezeFrameUrl || !faceDetected || !detectedFaceBox) {
      return;
    }

    try {
      setEnrollmentFreezeFrameUrl(captureSnapshot());
    } catch {
      // Keep the last live frame if snapshot capture fails.
    }
  }, [
    actionMode,
    captureSnapshot,
    detectedFaceBox,
    enrollmentFreezeFrameUrl,
    enrollmentUsedByOther,
    faceDetected,
  ]);

  useEffect(() => {
    const previous = lastValidationStateRef.current;
    if (validationUiState !== previous) {
      if (validationUiState === 'success') {
        playValidationCue('success');
      } else if (validationUiState === 'failure') {
        playValidationCue('failure');
      }
      lastValidationStateRef.current = validationUiState;
    }
  }, [validationUiState]);

  useEffect(() => {
    if (autoSubmitTimerRef.current) {
      if (!shouldAutoSubmit) {
        window.clearTimeout(autoSubmitTimerRef.current);
        autoSubmitTimerRef.current = null;
        autoSubmitScheduledRef.current = false;
      }
    }

    if (shouldAutoSubmit && !autoSubmitScheduledRef.current) {
      autoSubmitScheduledRef.current = true;
      autoSubmitTimerRef.current = window.setTimeout(() => {
        autoSubmitTimerRef.current = null;
        autoSubmitScheduledRef.current = false;
        void submitAttendanceAction(actionMode as AttendanceActionMode);
      }, 360);
    }

    return () => {
      if (!shouldAutoSubmit && autoSubmitTimerRef.current) {
        window.clearTimeout(autoSubmitTimerRef.current);
        autoSubmitTimerRef.current = null;
        autoSubmitScheduledRef.current = false;
      }
    };
  }, [
    actionMode,
    shouldAutoSubmit,
  ]);

  useEffect(() => {
    if (
      actionMode !== 'enroll' ||
      submitting ||
      cameraError ||
      detectorUnavailable ||
      enrollmentUsedByOther ||
      enrollmentTargetAlreadyHasFace ||
      !enrollmentFaceVisible ||
      !livenessVerified
    ) {
      if (enrollmentHoldTimerRef.current) {
        window.clearInterval(enrollmentHoldTimerRef.current);
        enrollmentHoldTimerRef.current = null;
      }
      setEnrollmentHoldStep(0);
      return;
    }

    if (enrollmentHoldTimerRef.current) {
      return;
    }

    enrollmentHoldTimerRef.current = window.setInterval(() => {
      setEnrollmentHoldStep((current) => {
        const next = Math.min(4, current + 1);
        return next;
      });
    }, 430);

    return () => {
      if (enrollmentHoldTimerRef.current) {
        window.clearInterval(enrollmentHoldTimerRef.current);
        enrollmentHoldTimerRef.current = null;
      }
    };
  }, [
    actionMode,
    cameraError,
    detectorUnavailable,
    enrollmentFaceVisible,
    enrollmentGuideLocked,
    enrollmentAlignmentState,
    enrollmentTargetAlreadyHasFace,
    enrollmentUsedByOther,
    livenessVerified,
    submitting,
  ]);

  useEffect(() => {
    if (!actionMode || detectorUnavailable || cameraError || submitting || !cameraReady) {
      return;
    }

    const shouldWarn =
      actionMode === 'enroll'
        ? faceDetected && detectionHits >= 3 && !!identifyConflict
        : false;

    if (!shouldWarn) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (Date.now() < failureToastCooldownRef.current) {
        return;
      }

      failureToastCooldownRef.current = Date.now() + 4500;
      toast.error(getUnknownFaceToastMessage(actionMode));
      playValidationCue('failure');
      retryCaptureFlow();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    actionMode,
    cameraError,
    cameraReady,
    detectionHits,
    detectorUnavailable,
    faceDetected,
    identifyConflict,
    identifyLoading,
    lowConfidence,
    submitting,
    unknownFaceDetected,
  ]);

  // ── Helper used inside effects above ─────────────────────────────────────
  function getUnknownFaceToastMessage(mode: AttendanceActionMode) {
    if (actionMode === 'enroll' && faceDetected && !liveFraming.wellFramed) {
      return 'Posisikan wajah penuh di tengah frame. Jangan hanya sebagian wajah yang masuk kamera.';
    }

    if (mode === 'enroll') {
      return 'Wajah belum stabil. Pastikan cahaya cukup dan wajah berada di tengah frame.';
    }

    if (identifyConflict && identifiedCandidate) {
      return `Wajah lebih cocok dengan ${identifiedCandidate.fullName ?? identifiedCandidate.username}.`;
    }

    if (lowConfidence && lowConfidenceHint) {
      return lowConfidenceHint;
    }

    return 'Wajah tidak dikenali, coba sesuaikan pencahayaan dan posisi wajah.';
  }

  // ── Return everything the component needs ─────────────────────────────────
  return {
    // refs
    videoRef,
    canvasRef,
    // basic state
    data,
    historyPreview,
    loading,
    actionMode,
    setActionMode,
    cameraReady,
    cameraError,
    actionError,
    actionMessage,
    submitting,
    successReview,
    setSuccessReview,
    enrollmentConflictMessage,
    faceDetected,
    detectionHits,
    livenessVerified,
    livenessProgress,
    livenessPrompt,
    detectorReady,
    detectedFaceBox,
    geoLabel,
    geoCoords,
    identifyLoading,
    identifyResult,
    captureAnalysis,
    detectorUnavailable,
    showUnknownFaceDialog,
    setShowUnknownFaceDialog,
    brokenEventImages,
    setBrokenEventImages,
    enrollmentLockPulse,
    enrollmentFreezeFrameUrl,
    // refs exposed for dialog callbacks
    identifyCooldownUntilRef,
    identifyRequestRef,
    unknownDialogShownRef,
    // handlers
    closeAction,
    retryCaptureFlow,
    retryEnrollmentWithDifferentFace,
    submitAttendanceAction,
    // derived from data
    profile,
    today,
    banner,
    selectedEnrollmentTarget,
    selectedEnrollmentTargetAlreadyEnrolled,
    isEnrolled,
    showEnrollmentSection,
    canClockIn,
    canClockOut,
    autoSubmitEnabled,
    autoSubmitConfidenceThreshold,
    actionHint,
    needsManualReview,
    presentDays,
    fullDays,
    totalHistoryMinutes,
    avgHistoryHours,
    lateArrivals,
    earlyDepartures,
    outOfGeofenceCount,
    pendingReviewEvents,
    latestPendingReview,
    statusTitle,
    isEnrollmentFocus,
    // identify
    identifiedCandidate,
    identifyMatched,
    identifyMatchesEnrollmentTarget,
    identifyMatchesCurrentUser,
    topIdentifyMatches,
    topSimilarity,
    liveFraming,
    attendanceFramingReady,
    lowConfidence,
    lowConfidenceHint,
    unknownFaceDetected,
    identifyConflict,
    // enrollment
    enrollmentTargetAlreadyHasFace,
    enrollmentUsedByOther,
    enrollmentConflictOwnerLabel,
    enrollmentFaceVisible,
    enrollmentAlignmentState,
    enrollmentGuideLocked,
    enrollmentFaceAligned,
    enrollmentStabilityHits,
    enrollmentIsHolding,
    enrollmentHoldProgress,
    enrollmentInfoTone,
    enrollmentInfoTitle,
    enrollmentInfoMessage,
    // attendance
    attendanceInfoTone,
    attendanceInfoTitle,
    attendanceInfoMessage,
    enrollmentReady,
    validationUiState,
    canSubmitCurrentAction,
    attendanceActionHint,
    overlayBox,
    overlayStyle,
    primaryActionLabel,
    selectedEnrollmentTargetName,
    selectedEnrollmentTargetCode,
    selectedEnrollmentTargetContext,
    primaryActionButtonLabel,
    enrollmentFrameLabel,
    enrollmentHeroTitle,
    enrollmentHeroMessage,
    shouldAutoSubmit,
  };
}
