'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock3,
  LoaderCircle,
  UserRound,
  Timer,
  MapPin,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import styles from './hr-attendance-effects.module.css';

// ---------------------------------------------------------------------------
// Re-exported from hr-shared — types, utilities, SectionShell
// ---------------------------------------------------------------------------
export type {
  AttendanceMePayload,
  AttendanceHistoryPayload,
  DashboardPayload,
  WorksitesPayload,
  FaceEnrollmentManagementRow,
  AttendanceLogItem,
  AttendanceReviewRow,
  AttendanceReviewHistoryEntry,
  AttendanceReviewDetail,
  AttendanceActionMode,
  FaceIdentifyPayload,
  ClientAttendanceError,
  FaceBoundingBox,
  FaceLivenessMetrics,
  RuntimeFaceDetectionResult,
  RuntimeFaceDetector,
  FaceCaptureAnalysis,
  FaceAlignmentState,
  SuccessReviewState,
  GeofenceSearchResult,
} from './hr-shared/_types-hr';
export type { ApiEnvelope, AssignedWorksiteRow, WorksiteRow, AttendanceUserOption } from './hr-shared/types';

export {
  shouldSuppressMediapipeConsoleError,
  withSuppressedMediapipeConsoleNoise,
  getFaceDetector,
  normalizeFaceBoundingBox,
  clampFaceBox,
  getDefaultFaceGuideBox,
  getActiveFaceCropBox,
  getLiveFaceFraming,
  getLowConfidenceGuidance,
  getAttendanceBanner,
  getAttendanceActionHint,
  getInitials,
  getMapEmbedUrl,
  normalizeDeviceError,
  isManualReviewStatus,
  createClientAttendanceError,
  normalizeFaceEnrollmentManagementRow,
  normalizeAttendanceReviewRow,
  normalizeAttendanceReviewDetail,
  MEDIAPIPE_WASM_ROOT,
  MEDIAPIPE_FACE_LANDMARKER_MODEL,
  MEDIAPIPE_NOISY_ERROR_PATTERNS,
} from './hr-shared/_utils-hr';
export {
  statusTone,
  humanizeStatus,
  humanizeReasonCode,
  humanizeValidationUiState,
  formatEventLabel,
  formatMinutes,
  formatDateTime,
  formatWorkDate,
  formatCompactInteger,
  formatPercentValue,
  formatScorePercentage,
  formatDecimalValue,
  getJakartaDayKey,
  getJakartaCalendarParts,
  getHistoryQuickRange,
  shiftDateKey,
  parseHrWallClock,
  formatJakartaWallClock,
} from './hr-shared/formatters';
export {
  normalizeNumericValue,
  normalizeWorksiteRow,
  normalizeAssignedWorksiteRow,
  normalizeAttendanceUserOption,
} from './hr-shared/normalizers';
export { fetchJson, postJson, putJson } from './hr-shared/fetch-json';
export { SectionShell } from './hr-shared/section-shell';

// ---------------------------------------------------------------------------
// Internal imports for HrAttendancePageView
// ---------------------------------------------------------------------------
import type {
  AttendanceMePayload,
  AttendanceHistoryPayload,
  AttendanceActionMode,
  FaceIdentifyPayload,
  FaceBoundingBox,
  FaceCaptureAnalysis,
  SuccessReviewState,
  ClientAttendanceError,
} from './hr-shared/_types-hr';
import {
  getFaceDetector,
  normalizeFaceBoundingBox,
  getActiveFaceCropBox,
  getLiveFaceFraming,
  getLowConfidenceGuidance,
  getAttendanceBanner,
  getAttendanceActionHint,
  getInitials,
  getMapEmbedUrl,
  normalizeDeviceError,
  isManualReviewStatus,
  createClientAttendanceError,
} from './hr-shared/_utils-hr';
import {
  statusTone,
  humanizeStatus,
  humanizeReasonCode,
  humanizeValidationUiState,
  formatEventLabel,
  formatMinutes,
  formatDateTime,
  formatWorkDate,
  getHistoryQuickRange,
} from './hr-shared/formatters';
import { fetchJson, postJson } from './hr-shared/fetch-json';
import { SectionShell } from './hr-shared/section-shell';

export function HrAttendancePageView({
  initialTargetUserId,
  initialActionMode,
}: {
  initialTargetUserId?: string;
  initialActionMode?: AttendanceActionMode;
}) {
  const router = useRouter();
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

              if (actionMode === 'enroll') {
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
                if (actionMode === 'enroll') {
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
              if (actionMode === 'enroll' && framing.locked && livenessVerified && !enrollmentFreezeFrameUrl) {
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

  useEffect(() => {
    return () => {
      if (autoSubmitTimerRef.current) {
        window.clearTimeout(autoSubmitTimerRef.current);
      }
    };
  }, []);

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

  function captureSnapshot() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Camera preview is not ready yet.');
    }

    const activeCrop = getActiveFaceCropBox(video, detectedFaceBox);
    const maxWidth = 480;
    const scale = Math.min(1, maxWidth / activeCrop.width);
    canvas.width = Math.max(220, Math.round(activeCrop.width * scale));
    canvas.height = Math.max(280, Math.round(activeCrop.height * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context is not available.');
    }

    context.drawImage(
      video,
      activeCrop.x,
      activeCrop.y,
      activeCrop.width,
      activeCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    return canvas.toDataURL('image/jpeg', 0.68);
  }

  function analyzeCurrentFaceFrame(): FaceCaptureAnalysis {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Preview kamera belum siap untuk embedding wajah.');
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 12;
    tempCanvas.height = 12;

    const context = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Canvas tidak tersedia untuk embedding wajah.');
    }

    const detectedBox = getActiveFaceCropBox(video, detectedFaceBox);
    const framing = getLiveFaceFraming(video, detectedFaceBox);

    context.drawImage(
      video,
      detectedBox.x,
      detectedBox.y,
      detectedBox.width,
      detectedBox.height,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height,
    );

    const pixels = context.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
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

  function buildFaceEmbedding() {
    return analyzeCurrentFaceFrame().embedding;
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

  const profile = data?.profile;
  const today = data?.today;
  const banner = getAttendanceBanner(profile ?? null, today ?? null);
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
  const selectedEnrollmentTargetAlreadyEnrolled =
    selectedEnrollmentTarget?.faceEnrollmentStatus === 'enrolled';
  const isEnrolled = profile?.faceEnrollmentStatus === 'enrolled';
  const showEnrollmentSection = !!profile && !isEnrolled;
  const canClockIn = !!profile && isEnrolled && !today?.clock_in_at;
  const canClockOut = !!profile && isEnrolled && !!today?.clock_in_at && !today?.clock_out_at;
  const autoSubmitEnabled = data?.settings?.autoSubmitEnabled ?? true;
  const autoSubmitConfidenceThreshold = data?.settings?.autoSubmitConfidenceThreshold ?? 0.9;
  const faceVerifyConfidenceThreshold = data?.settings?.faceVerifyConfidenceThreshold ?? 0.82;
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
  const lowConfidence = faceDetected && !identifyMatched && topSimilarity >= 0.5 && topSimilarity < 0.7;
  const lowConfidenceHint = lowConfidence && captureAnalysis
    ? getLowConfidenceGuidance({
        similarity: topSimilarity,
        brightness: captureAnalysis.brightness,
        faceCoverage: captureAnalysis.faceCoverage,
      })
    : null;
  const unknownFaceDetected =
    actionMode !== 'enroll' &&
    faceDetected &&
    !!identifyResult &&
    !identifyLoading &&
    !identifyMatched &&
    detectionHits >= 4 &&
    topSimilarity < faceVerifyConfidenceThreshold;
  const identifyConflict = identifyMatched && !identifyMatchesCurrentUser;
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
  const enrollmentConflictOwnerLabel =
    identifiedCandidate?.fullName ?? identifiedCandidate?.username ?? 'pegawai lain';
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
  const overlayToneClass = actionMode === 'enroll'
    ? enrollmentAlignmentState === 'locked'
      ? styles.faceBoxSuccess
      : enrollmentAlignmentState === 'near'
        ? styles.faceBoxLow
        : enrollmentAlignmentState === 'off'
          ? styles.faceBoxUnknown
          : styles.faceBoxIdle
    : validationUiState === 'success'
      ? styles.faceBoxSuccess
      : validationUiState === 'failure'
        ? styles.faceBoxUnknown
        : validationUiState === 'low-confidence'
          ? styles.faceBoxLow
        : validationUiState === 'scanning'
          ? styles.faceBoxScanning
          : styles.faceBoxIdle;
  const attendanceFrameGuideClass = attendanceInfoTone === 'danger'
    ? 'border-rose-200 bg-rose-50/92 text-rose-900'
    : attendanceInfoTone === 'success'
      ? 'border-emerald-200 bg-emerald-50/92 text-emerald-900'
      : 'border-white/25 bg-slate-950/48 text-white';
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
  const enrollmentFrameLabelClass = validationUiState === 'success' || enrollmentGuideLocked
    ? enrollmentUsedByOther
      ? 'bg-amber-500 text-white'
      : 'bg-emerald-500 text-white'
    : enrollmentAlignmentState === 'near'
      ? 'bg-amber-500 text-white'
    : validationUiState === 'failure'
      ? 'bg-rose-500 text-white'
      : 'bg-amber-500 text-white';
  const staticGuideClass = actionMode === 'enroll' && enrollmentGuideLocked
    ? validationUiState === 'success'
      ? cn(styles.scanGuide, styles.scanGuideSuccess)
      : cn(styles.scanGuide, styles.scanGuideActive, enrollmentLockPulse ? styles.scanGuideLockPulse : '')
    : actionMode === 'enroll' && enrollmentAlignmentState === 'near'
      ? cn(styles.scanGuide, styles.scanGuideNear)
      : actionMode === 'enroll' && enrollmentAlignmentState === 'off'
        ? cn(styles.scanGuide, styles.scanGuideOff)
    : styles.scanGuide;
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

  return (
    <SectionShell
      title={actionMode === 'enroll' ? '' : 'Absensi'}
      wide={!!actionMode}
    >
      <div className="space-y-6">
        {successReview ? (
          <div className="mx-auto max-w-md rounded-[28px] border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="size-8" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Berhasil
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{successReview.actionLabel}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {successReview.employeeName} • {formatDateTime(successReview.recordedAt)}
            </p>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              {successReview.snapshotDataUrl ? (
                <img
                  src={successReview.snapshotDataUrl}
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-slate-100 text-slate-400">
                  <UserRound className="size-12" />
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Karyawan</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{successReview.employeeName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Waktu</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(successReview.recordedAt)}</p>
              </div>
            </div>

            <Button className="mt-6 h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setSuccessReview(null)}>
              Tutup
            </Button>
          </div>
        ) : actionMode ? (
          (() => {
            const modeTitle =
              actionMode === 'enroll'
                ? 'Pendaftaran Wajah'
                : actionMode === 'clockIn'
                  ? 'Absen Masuk'
                  : 'Absen Pulang';

            if (actionMode === 'enroll') {
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
                            <div className={cn('absolute rounded-[28px] border-2 transition-all duration-150', overlayToneClass)} style={overlayStyle ?? undefined}>
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
          })()
        ) : null}

        {false ? (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Pendaftaran Wajah
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                Ambil foto wajah frontal yang jelas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fokuskan wajah di dalam frame dan pastikan lokasi GPS sudah terbaca sebelum menyimpan.
              </p>
            </div>

            <div className={cn(
              'attendance-shell overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm',
              validationUiState === 'scanning' && styles.attendanceShellScanning,
              validationUiState === 'success' && styles.attendanceShellSuccess,
              validationUiState === 'failure' && styles.attendanceShellFailure,
            )}>
              <div className="border-b border-slate-200 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-slate-900">Pendaftaran Wajah</p>
              </div>

              <div className="relative border-b border-slate-200 bg-slate-950">
                <video
                  ref={videoRef}
                  className={cn(
                    'aspect-[4/3] w-full object-cover transition-all duration-300',
                    validationUiState === 'scanning' && 'saturate-[.72] contrast-[1.04]',
                    validationUiState === 'success' && 'saturate-100 contrast-110',
                    validationUiState === 'failure' && 'saturate-[.82] contrast-[1.06]',
                  )}
                  muted
                  playsInline
                  autoPlay
                />
                <div className="pointer-events-none absolute inset-0">
                  <div className={cn(styles.reticleOverlay, 'absolute inset-0')} />
                  {validationUiState === 'scanning' ? <div className={cn(styles.scanLine, 'absolute inset-x-[8%] top-[12%]')} /> : null}
                  {overlayStyle ? (
                    <div className={cn('absolute rounded-2xl border-2', overlayToneClass)} style={overlayStyle ?? undefined}>
                      <div className={cn(styles.faceCorner, styles.faceCornerTl)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerTr)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerBl)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerBr)} />
                      {identifyMatched && identifiedCandidate ? (
                        <div className={styles.faceTag}>
                          {identifiedCandidate?.fullName ?? identifiedCandidate?.username}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {validationUiState === 'success' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlaySuccess, 'absolute inset-0')} /> : null}
                  {validationUiState === 'failure' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlayFailure, 'absolute inset-0')} /> : null}
                </div>
              </div>

              <div className={cn('map-stage relative bg-slate-100', validationUiState === 'failure' && styles.mapStageShake)}>
                {geoCoords ? (
                  <>
                    <iframe
                      title="Peta lokasi absensi"
                      src={getMapEmbedUrl(geoCoords!.latitude, geoCoords!.longitude)}
                      className="h-56 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    {geoCoords && validationUiState !== 'idle' ? <div className={styles.gpsLinkStream} /> : null}
                  </>
                ) : (
                  <div className="flex h-56 items-center justify-center px-6 text-center text-sm text-slate-500">
                    Menunggu lokasi GPS agar peta bisa ditampilkan.
                  </div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kamera</p>
                <p className="mt-2 font-medium text-slate-900">
                  {cameraReady ? 'Preview langsung siap' : 'Menyalakan kamera...'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deteksi Wajah</p>
                <p className="mt-2 font-medium text-slate-900">
                  {detectorUnavailable
                    ? 'Deteksi wajah tidak didukung'
                    : detectorReady
                      ? (faceDetected ? 'Wajah terdeteksi' : 'Mencari wajah...')
                      : 'Menyiapkan detektor...'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {detectorUnavailable ? 'Browser perlu dukungan FaceDetector API.' : `Hit deteksi: ${detectionHits}`}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">GPS</p>
                <p className="mt-2 font-medium text-slate-900">{geoLabel ?? 'Mengambil lokasi GPS...'}</p>
              </div>
            </div>

            {identifyLoading ? (
              <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
                Memeriksa identitas wajah dari database...
              </div>
            ) : identifyMatched && identifiedCandidate ? (
              <div
                className={cn(
                  'rounded-2xl border-l-4 px-4 py-3 text-sm',
                  identifyMatchesCurrentUser
                    ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-l-rose-500 bg-rose-50 text-rose-700',
                )}
              >
                <p className="font-semibold">
                  {identifyMatchesCurrentUser ? 'OK, wajah dikenali.' : 'Wajah dikenali, tetapi berbeda dengan akun login.'}
                </p>
                <p className="mt-1">
                  {identifiedCandidate?.fullName ?? identifiedCandidate?.username}
                  {identifiedCandidate?.employeeCode ? ` • ${identifiedCandidate?.employeeCode}` : ''}
                  {` • similarity ${(((identifiedCandidate?.similarity ?? 0) * 100).toFixed(1))}%`}
                </p>
              </div>
            ) : faceDetected && detectionHits >= 3 ? (
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm',
                  actionMode === 'enroll'
                    ? 'bg-sky-50 text-sky-800'
                    : 'bg-amber-50 text-amber-800',
                )}
              >
                {actionMode === 'enroll'
                  ? 'Wajah terdeteksi dengan baik. Karena ini pendaftaran awal, data wajah bisa langsung disimpan.'
                  : 'Wajah terdeteksi, tetapi belum cocok dengan anggota yang terdaftar di database.'}
              </div>
            ) : null}

            {lowConfidence && lowConfidenceHint ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Kemiripan masih rendah.</p>
                <p className="mt-1">{lowConfidenceHint}</p>
              </div>
            ) : null}

            {topIdentifyMatches.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
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

            {cameraError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{cameraError}</div>
            ) : null}
            {detectorUnavailable ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Deteksi wajah otomatis tidak tersedia di browser ini. Sistem sengaja memblokir submit agar pendaftaran tidak lolos tanpa wajah yang valid.
              </div>
            ) : null}
            {actionError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                className={cn(
                  'h-12 flex-1 rounded-xl py-3 text-white transition-all duration-300',
                  validationUiState === 'success'
                    ? `${styles.primarySubmitSuccess} bg-emerald-600 hover:bg-emerald-600`
                    : validationUiState === 'failure'
                      ? `${styles.primarySubmitDisabled} bg-slate-300 text-slate-600 hover:bg-slate-300`
                      : 'bg-emerald-500 hover:bg-emerald-600',
                )}
                disabled={!canSubmitCurrentAction}
                onClick={() => void submitAttendanceAction('enroll')}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Memproses...
                  </>
                ) : validationUiState === 'success' ? (
                  <>
                    <Check className="mr-2 size-4" />
                    Tervalidasi
                  </>
                ) : (
                  'Simpan Pendaftaran Wajah'
                )}
              </Button>
              {validationUiState === 'failure' ? (
                <Button className={cn(styles.retryButton, 'h-12 flex-1 rounded-xl py-3 text-white')} onClick={retryCaptureFlow}>
                  Coba Lagi
                </Button>
              ) : null}
              <Button variant="outline" className="h-12 flex-1 rounded-xl py-3" disabled={submitting} onClick={closeAction}>
                Batal
              </Button>
            </div>
          </>
        ) : null}

        {!successReview && !actionMode ? (
          <>
        <div className="space-y-6 rounded-[30px] bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">Dashboard Pribadi</p>
              <p className="text-sm text-slate-500">
                Selamat datang kembali, {profile?.fullName ?? profile?.username ?? 'Pegawai'}. Berikut ringkasan absensi Anda hari ini.
              </p>
            </div>
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              Hari ini, {formatWorkDate(today?.work_date)}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_320px]">
            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock3 className="size-4 text-blue-600" />
                  <p className="text-base font-semibold">Status Absensi Hari Ini</p>
                </div>
                <Badge className={cn('border-0 px-3 py-1.5 text-xs font-semibold', today?.clock_out_at ? 'bg-emerald-100 text-emerald-700' : today?.clock_in_at ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700')}>
                  {today?.clock_out_at ? 'SUDAH SELESAI' : today?.clock_in_at ? 'SEDANG BERJALAN' : 'BELUM MULAI'}
                </Badge>
              </div>
              <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Jam Masuk</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(today?.clock_in_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Jam Pulang</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(today?.clock_out_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Jam</p>
                  <p className="mt-2 text-lg font-semibold text-blue-600">{formatMinutes(today?.total_work_minutes)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Lokasi Kerja</p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MapPin className="size-4 text-slate-400" />
                    {profile?.defaultWorksiteName ?? '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">Aksi Cepat</p>
              <div className="grid gap-3">
                {isEnrolled && (canClockIn || canClockOut || today?.clock_in_at || today?.clock_out_at) ? (
                  <Button
                    className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!isEnrolled || !!actionMode || (!canClockIn && !canClockOut)}
                    onClick={() => {
                      if (canClockIn) {
                        setActionMode('clockIn');
                      } else if (canClockOut) {
                        setActionMode('clockOut');
                      }
                    }}
                  >
                    Buka Absensi
                  </Button>
                ) : (
                  <Button asChild className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/app/hr/attendance">Buka Absensi</Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="h-12 rounded-xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200">
                  <Link href="/app/hr/attendance-history">Lihat Riwayat</Link>
                </Button>
                <div className={cn('flex items-center justify-between rounded-xl border px-4 py-4', showEnrollmentSection ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700')}>
                  <div className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    <span className="text-sm font-semibold">Pendaftaran Wajah</span>
                  </div>
                  {showEnrollmentSection ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto p-0 text-sm font-semibold text-amber-800 hover:bg-transparent"
                      disabled={!profile || !!actionMode}
                      onClick={() => setActionMode('enroll')}
                    >
                      DAFTAR
                    </Button>
                  ) : (
                    <span className="text-sm font-semibold">TERDAFTAR</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Hari Hadir',
                value: `${presentDays} / ${historyPreview.length || 22}`,
                icon: Check,
                tone: 'bg-blue-50 text-blue-600',
              },
              {
                label: 'Hari Penuh',
                value: String(fullDays),
                icon: Check,
                tone: 'bg-emerald-50 text-emerald-600',
              },
              {
                label: 'Total Jam',
                value: `${(totalHistoryMinutes / 60).toFixed(totalHistoryMinutes % 60 === 0 ? 0 : 1)}h`,
                icon: Timer,
                tone: 'bg-amber-50 text-amber-600',
              },
              {
                label: 'Rata-rata Jam/Hari',
                value: `${avgHistoryHours.toFixed(avgHistoryHours % 1 === 0 ? 0 : 1)}h`,
                icon: Clock3,
                tone: 'bg-slate-100 text-slate-600',
              },
            ].map((metric) => (
              <div key={metric.label} className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={cn('flex size-10 items-center justify-center rounded-xl', metric.tone)}>
                    <metric.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_320px]">
            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-950">Riwayat Absensi Terbaru</h3>
                <Link href="/app/hr/attendance-history" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Tanggal</th>
                      <th className="px-5 py-3">Jam Masuk</th>
                      <th className="px-5 py-3">Jam Pulang</th>
                      <th className="px-5 py-3">Durasi</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {historyPreview.slice(0, 5).map((row) => {
                      const statusLabel = row.clock_out_at ? 'PENUH' : row.clock_in_at ? 'BERJALAN' : humanizeStatus(row.clock_out_status ?? row.clock_in_status);
                      const statusClass = row.clock_out_status === 'rejected' || row.clock_in_status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : isManualReviewStatus(row.clock_out_status) || isManualReviewStatus(row.clock_in_status) || row.clock_out_status === 'warning' || row.clock_in_status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : row.clock_out_at
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700';
                      return (
                        <tr key={row.id} className="text-slate-700">
                          <td className="px-5 py-3 font-medium text-slate-900">{formatWorkDate(row.work_date)}</td>
                          <td className="px-5 py-3">{formatDateTime(row.clock_in_at)}</td>
                          <td className="px-5 py-3">{formatDateTime(row.clock_out_at)}</td>
                          <td className="px-5 py-3">{formatMinutes(row.total_work_minutes)}</td>
                          <td className="px-5 py-3">
                            <Badge className={cn('border-0', statusClass)}>{statusLabel}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {historyPreview.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-6 text-sm text-slate-500">Belum ada riwayat absensi.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">Kehadiran & Kepatuhan</h3>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Terlambat', value: lateArrivals, tone: 'text-rose-600 bg-rose-100' },
                    { label: 'Pulang Cepat', value: earlyDepartures, tone: 'text-amber-600 bg-amber-100' },
                    { label: 'Di Luar Geofence', value: outOfGeofenceCount, tone: 'text-slate-600 bg-slate-100' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex size-8 items-center justify-center rounded-lg', item.tone)}>
                          <AlertTriangle className="size-4" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-l-4 border-l-amber-500 border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">Review & Klarifikasi</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {latestPendingReview
                    ? `Anda memiliki ${pendingReviewEvents.length} review tertunda terkait ${humanizeReasonCode(latestPendingReview.reason_code) || formatEventLabel(latestPendingReview.event_type).toLowerCase()} pada ${formatWorkDate(latestPendingReview.event_at)}.`
                    : 'Tidak ada review yang menunggu klarifikasi saat ini.'}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 h-11 w-full rounded-xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <Link href="/app/hr/attendance-history">Buka Detail Review Saya</Link>
                </Button>
              </div>
            </div>
          </div>

          {actionMessage ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {actionMessage}
            </div>
          ) : null}
        </div>

        {false ? (
          (() => {
            const currentActionMode: AttendanceActionMode = actionMode as AttendanceActionMode;
            const modeCopy: Record<
              AttendanceActionMode,
              {
                eyebrow: string;
                title: string;
                description: string;
                badgeTitle: string;
              }
            > = {
              enroll: {
                eyebrow: 'Pendaftaran Wajah',
                title: 'Ambil foto wajah frontal yang jelas',
                description: 'Gunakan pencahayaan stabil dan pastikan wajah terlihat penuh.',
                badgeTitle: 'Pendaftaran Wajah',
              },
              clockIn: {
                eyebrow: 'Capture Jam Masuk',
                title: 'Jaga wajah tetap di dalam frame',
                description: 'GPS hanya diminta untuk jam masuk dan jam pulang.',
                badgeTitle: `Absensi ${formatWorkDate(today?.work_date)}`,
              },
              clockOut: {
                eyebrow: 'Capture Jam Pulang',
                title: 'Jaga wajah tetap di dalam frame',
                description: 'GPS hanya diminta untuk jam masuk dan jam pulang.',
                badgeTitle: `Absensi ${formatWorkDate(today?.work_date)}`,
              },
            };
            const modeText = modeCopy[currentActionMode];

            return (
          <div className="space-y-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {modeText.eyebrow}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">
                {modeText.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {modeText.description}
              </p>
            </div>

            <div className={cn(
              'attendance-shell overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm',
              validationUiState === 'scanning' && styles.attendanceShellScanning,
              validationUiState === 'success' && styles.attendanceShellSuccess,
              validationUiState === 'failure' && styles.attendanceShellFailure,
            )}>
              <div className="border-b border-slate-200 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  {modeText.badgeTitle}
                </p>
              </div>

              <div className="relative border-b border-slate-200 bg-slate-950">
                <video
                  ref={videoRef}
                  className={cn(
                    'aspect-[4/3] w-full object-cover transition-all duration-300',
                    validationUiState === 'scanning' && 'saturate-[.72] contrast-[1.04]',
                    validationUiState === 'success' && 'saturate-100 contrast-110',
                    validationUiState === 'failure' && 'saturate-[.82] contrast-[1.06]',
                  )}
                  muted
                  playsInline
                  autoPlay
                />
                <div className="pointer-events-none absolute inset-0">
                  <div className={cn(styles.reticleOverlay, 'absolute inset-0')} />
                  {validationUiState === 'scanning' ? <div className={cn(styles.scanLine, 'absolute inset-x-[8%] top-[12%]')} /> : null}
                  {overlayStyle ? (
                    <div className={cn('absolute rounded-2xl border-2', overlayToneClass)} style={overlayStyle ?? undefined}>
                      <div className={cn(styles.faceCorner, styles.faceCornerTl)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerTr)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerBl)} />
                      <div className={cn(styles.faceCorner, styles.faceCornerBr)} />
                      {identifyMatched && identifiedCandidate ? (
                        <div className={styles.faceTag}>
                          {identifiedCandidate?.fullName ?? identifiedCandidate?.username}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {validationUiState === 'success' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlaySuccess, 'absolute inset-0')} /> : null}
                  {validationUiState === 'failure' ? <div className={cn(styles.glitchOverlay, styles.glitchOverlayFailure, 'absolute inset-0')} /> : null}
                </div>
              </div>

              <div className={cn('map-stage relative bg-slate-100', validationUiState === 'failure' && styles.mapStageShake)}>
                {geoCoords ? (
                  <>
                    <iframe
                      title="Peta lokasi absensi"
                      src={getMapEmbedUrl(geoCoords!.latitude, geoCoords!.longitude)}
                      className="h-56 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    {geoCoords && validationUiState !== 'idle' ? <div className={styles.gpsLinkStream} /> : null}
                  </>
                ) : (
                  <div className="flex h-56 items-center justify-center px-6 text-center text-sm text-slate-500">
                    Menunggu lokasi GPS agar peta bisa ditampilkan.
                  </div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kamera</p>
                <p className="mt-2 font-medium text-slate-900">
                  {cameraReady ? 'Preview langsung siap' : 'Menyalakan kamera...'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deteksi Wajah</p>
                <p className="mt-2 font-medium text-slate-900">
                  {detectorReady ? (faceDetected ? 'Wajah terdeteksi' : 'Mencari wajah...') : 'Menyiapkan detektor...'}
                </p>
                <p className="mt-1 text-xs text-slate-500">Hit deteksi: {detectionHits}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">GPS</p>
                <p className="mt-2 font-medium text-slate-900">{geoLabel ?? 'Mengambil lokasi GPS...'}</p>
              </div>
            </div>

            {identifyLoading ? (
              <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
                Memeriksa identitas wajah dari database...
              </div>
            ) : identifyMatched && identifiedCandidate ? (
              <div
                className={cn(
                  'rounded-2xl border-l-4 px-4 py-3 text-sm',
                  identifyMatchesCurrentUser
                    ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-l-rose-500 bg-rose-50 text-rose-700',
                )}
              >
                <p className="font-semibold">
                  {identifyMatchesCurrentUser ? 'OK, wajah dikenali.' : 'Wajah dikenali, tetapi berbeda dengan akun login.'}
                </p>
                <p className="mt-1">
                  {identifiedCandidate?.fullName ?? identifiedCandidate?.username}
                  {identifiedCandidate?.employeeCode ? ` • ${identifiedCandidate?.employeeCode}` : ''}
                  {` • similarity ${(((identifiedCandidate?.similarity ?? 0) * 100).toFixed(1))}%`}
                </p>
              </div>
            ) : faceDetected && detectionHits >= 3 ? (
              <div className={cn(
                'rounded-2xl px-4 py-3 text-sm',
                validationUiState === 'failure'
                  ? 'animate-pulse border border-rose-200 bg-rose-50 text-rose-700'
                  : 'bg-amber-50 text-amber-800',
              )}>
                {validationUiState === 'failure'
                  ? 'Identity Unknown. Try Again?'
                  : 'Wajah terdeteksi, tetapi belum cocok dengan anggota yang terdaftar di database.'}
              </div>
            ) : null}

            {lowConfidence && lowConfidenceHint ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Kemiripan masih rendah.</p>
                <p className="mt-1">{lowConfidenceHint}</p>
              </div>
            ) : null}

            {topIdentifyMatches.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
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

            {cameraError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{cameraError}</div>
            ) : null}
            {actionError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                className={cn(
                  'h-12 flex-1 rounded-xl py-3 text-white transition-all duration-300',
                  validationUiState === 'success'
                    ? `${styles.primarySubmitSuccess} bg-emerald-600 hover:bg-emerald-600`
                    : validationUiState === 'failure'
                      ? `${styles.primarySubmitDisabled} bg-slate-300 text-slate-600 hover:bg-slate-300`
                      : 'bg-emerald-500 hover:bg-emerald-600',
                )}
                disabled={!canSubmitCurrentAction}
                onClick={() => void submitAttendanceAction(currentActionMode)}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Memproses...
                  </>
                ) : validationUiState === 'success' ? (
                  <>
                    <Check className="mr-2 size-4" />
                    {primaryActionLabel}
                  </>
                ) : (
                  primaryActionLabel
                )}
              </Button>
              {validationUiState === 'failure' ? (
                <Button className={cn(styles.retryButton, 'h-12 flex-1 rounded-xl py-3 text-white')} onClick={retryCaptureFlow}>
                  Coba Lagi
                </Button>
              ) : null}
              <Button variant="outline" className="h-12 flex-1 rounded-xl py-3" disabled={submitting} onClick={closeAction}>
                Batal
              </Button>
            </div>
          </div>
            );
          })()
        ) : null}

        {!successReview && !actionMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Riwayat Event Absensi</h3>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {(data?.recentEvents ?? []).length === 0 ? (
              <div className="py-6 text-sm text-slate-500">Belum ada event absensi.</div>
            ) : (
              (data?.recentEvents ?? []).map((event) => {
                const imageBroken = brokenEventImages[event.id];
                const reason = humanizeReasonCode(event.reason_code);
                return (
                  <div key={event.id} className="flex min-h-[52px] items-center gap-3 py-2">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {event.snapshot_url && !imageBroken ? (
                        <a
                          href={`/api/hr/events/${event.id}/snapshot`}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-full w-full"
                        >
                          <img
                            src={`/api/hr/events/${event.id}/snapshot`}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={() =>
                              setBrokenEventImages((current) => ({
                                ...current,
                                [event.id]: true,
                              }))
                            }
                          />
                        </a>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-600">
                          {profile?.fullName || profile?.username ? (
                            <span className="text-sm font-semibold">
                              {getInitials(profile?.fullName ?? profile?.username)}
                            </span>
                          ) : (
                            <UserRound className="size-5" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {formatEventLabel(event.event_type)}
                        </p>
                        <Badge className={cn('border-0', statusTone(event.result))}>{humanizeStatus(event.result)}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(event.event_at)}</p>
                      {reason ? <p className="truncate text-xs text-slate-500">{reason}</p> : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        ) : null}
          </>
        ) : null}

        <Dialog
          open={showUnknownFaceDialog}
          onOpenChange={(open) => {
            setShowUnknownFaceDialog(open);
            if (!open) {
              unknownDialogShownRef.current = true;
            }
          }}
        >
          <DialogContent className="max-w-md rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
            <DialogHeader className="border-b border-slate-200 px-5 py-4">
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <AlertTriangle className="size-5 text-rose-500" />
                Wajah Belum Terdaftar
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Sistem tidak menemukan wajah ini di database anggota. Anda bisa mendaftarkan wajah baru atau mengulang pemindaian.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="px-5 py-4 text-sm text-slate-600">
              {lowConfidenceHint ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                  Saran: {lowConfidenceHint}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Pastikan wajah menghadap ke depan, dekat dengan kamera, dan pencahayaan cukup terang.
                </div>
              )}
            </DialogBody>
            <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setShowUnknownFaceDialog(false);
                  setActionError(null);
                  unknownDialogShownRef.current = false;
                  identifyCooldownUntilRef.current = 0;
                  identifyRequestRef.current += 1;
                }}
              >
                Coba Lagi
              </Button>
              <Button
                className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => {
                  setShowUnknownFaceDialog(false);
                  setActionMode('enroll');
                  setActionError(null);
                }}
              >
                Daftarkan Wajah Baru
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </SectionShell>
  );
}
