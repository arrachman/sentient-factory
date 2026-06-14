'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AttendanceMePayload,
  AttendanceHistoryPayload,
  AttendanceActionMode,
  FaceIdentifyPayload,
  FaceBoundingBox,
  FaceCaptureAnalysis,
  SuccessReviewState,
} from './_types-hr';
import { normalizeDeviceError, createClientAttendanceError } from './_utils-hr';
import { fetchJson, postJson } from './fetch-json';
import { captureSnapshot as captureSnapshotFn, analyzeCurrentFaceFrame as analyzeFrameFn } from './_hr-frame-capture';
import { reportClientFailure } from './_hr-action-utils';
import { computeHrDerived } from './_hr-derived';
import { computeHrDerivedUi } from './_hr-derived-ui';
import { useHrCameraLifecycle } from './use-hr-camera-lifecycle';
import { useHrAttendanceEffects } from './use-hr-attendance-effects';
import { submitAttendanceAction as submitAction } from './_hr-submit-action';

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

  // ── State ─────────────────────────────────────────────────────────────────
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

  // ── Refs ──────────────────────────────────────────────────────────────────
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
      .catch(() => { if (!cancelled) setData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Frame capture + GPS helpers
  const captureSnapshot = useCallback(
    () => captureSnapshotFn(videoRef, canvasRef, detectedFaceBox),
    [detectedFaceBox],
  );
  const analyzeCurrentFaceFrame = () => analyzeFrameFn(videoRef, canvasRef, detectedFaceBox);

  async function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    if (geoCoords) return geoCoords;
    if (!navigator.geolocation) throw createClientAttendanceError('Geolocation is not available on this device.', 'gps_unavailable');
    setGeoLabel('Requesting GPS fix...');
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setGeoCoords(coords);
          setGeoLabel(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
          resolve(coords);
        },
        (err) => reject(createClientAttendanceError(normalizeDeviceError(err, 'gps'), err.code === err.PERMISSION_DENIED ? 'gps_denied' : err.code === err.TIMEOUT ? 'gps_timeout' : 'gps_unavailable')),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });
  }

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

  useHrCameraLifecycle({
    setters: {
      setCameraReady, setCameraError, setDetectorReady, setFaceDetected, setDetectionHits,
      setDetectedFaceBox, setLivenessVerified, setLivenessProgress, setLivenessPrompt,
      setEnrollmentHoldStep, setEnrollmentFreezeFrameUrl, setEnrollmentLockPulse,
      setDetectorUnavailable, setActionError, setActionMessage,
      setEnrollmentConflictMessage, setEnrollmentConflictAppUserId,
      setGeoLabel, setGeoCoords, setCameraRestartToken,
    },
    refs: {
      videoRef, streamRef, reportedFailureRef, detectorModeRef,
      missedDetectionFramesRef, blinkPeakSeenRef, guideLockSeenRef, cameraRestartingRef,
    },
    state: { actionMode, cameraRestartToken, detectionHits, livenessVerified, enrollmentFreezeFrameUrl },
    captureSnapshot,
  });

  // Identify trigger
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
    if (!cameraReady || !faceDetected || detectionHits < 3) return;
    if (Date.now() < identifyCooldownUntilRef.current) return;

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
        if (identifyRequestRef.current !== requestId) return;
        setCaptureAnalysis(analysis);
        setIdentifyResult(payload?.data ?? null);
      } catch {
        if (identifyRequestRef.current !== requestId) return;
        setCaptureAnalysis(null);
        setIdentifyResult(null);
      } finally {
        if (identifyRequestRef.current === requestId) setIdentifyLoading(false);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [actionMode, cameraReady, detectionHits, faceDetected]);

  useEffect(() => () => { if (autoSubmitTimerRef.current) window.clearTimeout(autoSubmitTimerRef.current); }, []);

  useEffect(() => {
    if (!actionMessage || actionMode || successReview) return;
    const timer = window.setTimeout(() => setActionMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [actionMessage, actionMode, successReview]);

  useEffect(() => {
    if (!actionMode || actionMode === 'enroll' || identifyLoading || showUnknownFaceDialog || unknownDialogShownRef.current) return;
    if (!faceDetected || detectionHits < 4) return;
    const topSim = identifyResult?.topMatches?.[0]?.similarity ?? 0;
    if (!(!identifyResult?.matched && topSim < 0.5)) return;
    unknownDialogShownRef.current = true;
    const timer = window.setTimeout(() => setShowUnknownFaceDialog(true), 700);
    return () => window.clearTimeout(timer);
  }, [actionMode, detectionHits, faceDetected, identifyLoading, identifyResult, showUnknownFaceDialog]);

  const derived = computeHrDerived({
    data, historyPreview, actionMode, faceDetected, detectionHits,
    livenessVerified, livenessProgress, livenessPrompt, detectedFaceBox,
    identifyResult, identifyLoading, captureAnalysis, submitting,
    cameraReady, cameraError, detectorUnavailable,
    enrollmentConflictMessage, enrollmentConflictAppUserId, enrollmentHoldStep,
    videoElement: videoRef.current,
  });

  const ui = computeHrDerivedUi({
    base: derived, actionMode, livenessProgress, livenessPrompt,
    faceDetected, detectionHits, livenessVerified, submitting, cameraReady,
    identifyLoading, enrollmentConflictMessage,
  });

  async function submitAttendanceAction(mode: AttendanceActionMode) {
    await submitAction(mode, {
      cameraReady, faceDetected, detectionHits, livenessVerified, livenessProgress,
      detectedFaceBox, identifyResult, captureAnalysis,
      topSimilarity: derived.topSimilarity,
      lowConfidenceHint: derived.lowConfidenceHint,
      selectedEnrollmentTarget: derived.selectedEnrollmentTarget,
      profile: derived.profile,
      validationUiState: derived.validationUiState,
      geoCoords,
      setSubmitting, setActionError, setActionMessage,
      setIdentifyResult, setCaptureAnalysis,
      setEnrollmentConflictMessage, setEnrollmentConflictAppUserId,
      setSuccessReview,
      videoRef, canvasRef, detectorModeRef, reportedFailureRef,
      loadAttendanceMe, closeAction, getCurrentPosition,
      routerReplace: (href) => router.replace(href),
    });
  }

  useHrAttendanceEffects({
    actionMode, submitting, cameraReady, cameraError, detectorUnavailable,
    faceDetected, detectionHits, livenessVerified, identifyLoading,
    identifyResult, detectedFaceBox, enrollmentConflictMessage, enrollmentConflictAppUserId,
    enrollmentFreezeFrameUrl, showEnrollmentSection: derived.showEnrollmentSection,
    validationUiState: derived.validationUiState,
    shouldAutoSubmit: derived.shouldAutoSubmit,
    identifyConflict: derived.identifyConflict,
    identifyMatched: derived.identifyMatched,
    identifyMatchesEnrollmentTarget: derived.identifyMatchesEnrollmentTarget,
    identifiedCandidate: derived.identifiedCandidate,
    enrollmentConflictOwnerLabel: derived.enrollmentConflictOwnerLabel,
    enrollmentUsedByOther: derived.enrollmentUsedByOther,
    enrollmentFaceVisible: derived.enrollmentFaceVisible,
    enrollmentGuideLocked: derived.enrollmentGuideLocked,
    enrollmentAlignmentState: derived.enrollmentAlignmentState,
    enrollmentTargetAlreadyHasFace: derived.enrollmentTargetAlreadyHasFace,
    enrollmentStabilityHits: derived.enrollmentStabilityHits,
    lowConfidence: derived.lowConfidence,
    lowConfidenceHint: derived.lowConfidenceHint,
    wellFramed: derived.liveFraming.wellFramed,
    unknownFaceDetected: derived.unknownFaceDetected,
    topSimilarity: derived.topSimilarity,
    initialActionMode,
    setActionMode, setEnrollmentConflictMessage, setEnrollmentConflictAppUserId,
    setEnrollmentFreezeFrameUrl, setEnrollmentHoldStep,
    initialActionAppliedRef, lastValidationStateRef, autoSubmitTimerRef,
    autoSubmitScheduledRef, enrollmentHoldTimerRef, failureToastCooldownRef,
    captureSnapshot, submitAttendanceAction, retryCaptureFlow,
  });

  return {
    videoRef,
    canvasRef,
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
    identifyCooldownUntilRef,
    identifyRequestRef,
    unknownDialogShownRef,
    closeAction,
    retryCaptureFlow,
    retryEnrollmentWithDifferentFace,
    submitAttendanceAction,
    ...derived,
    ...ui,
  };
}
