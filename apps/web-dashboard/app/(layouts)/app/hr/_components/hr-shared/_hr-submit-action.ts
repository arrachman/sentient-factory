'use client';

/**
 * submitAttendanceAction extracted from use-hr-attendance-state.
 * Takes an explicit context object instead of closing over hook state.
 */

import type {
  AttendanceActionMode,
  FaceIdentifyPayload,
  FaceBoundingBox,
  FaceCaptureAnalysis,
  ClientAttendanceError,
  SuccessReviewState,
} from './_types-hr';
import { getLiveFaceFraming, createClientAttendanceError } from './_utils-hr';
import { postJson } from './fetch-json';
import { reportClientFailure } from './_hr-action-utils';
import { captureSnapshot, analyzeCurrentFaceFrame } from './_hr-frame-capture';

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

export type SubmitActionContext = {
  // state read
  cameraReady: boolean;
  faceDetected: boolean;
  detectionHits: number;
  livenessVerified: boolean;
  livenessProgress: number;
  detectedFaceBox: FaceBoundingBox | null;
  identifyResult: FaceIdentifyPayload | null;
  captureAnalysis: FaceCaptureAnalysis | null;
  topSimilarity: number;
  lowConfidenceHint: string | null;
  selectedEnrollmentTarget: {
    appUserId: number;
    fullName: string | null;
    username: string;
    employeeCode: string | null;
  } | null;
  profile: {
    appUserId: number;
    fullName: string | null;
    username: string;
  } | null;
  validationUiState: string;
  geoCoords: { latitude: number; longitude: number } | null;
  // setters
  setSubmitting: (value: boolean) => void;
  setActionError: (value: string | null) => void;
  setActionMessage: (value: string | null) => void;
  setIdentifyResult: (value: FaceIdentifyPayload | null) => void;
  setCaptureAnalysis: (value: FaceCaptureAnalysis | null) => void;
  setEnrollmentConflictMessage: (value: string | null) => void;
  setEnrollmentConflictAppUserId: (value: number | null) => void;
  setSuccessReview: (value: SuccessReviewState | null) => void;
  // refs
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  detectorModeRef: React.MutableRefObject<'mediapipe' | 'fallback'>;
  reportedFailureRef: React.MutableRefObject<string | null>;
  // callbacks
  loadAttendanceMe: () => Promise<void>;
  closeAction: () => void;
  getCurrentPosition: () => Promise<{ latitude: number; longitude: number }>;
  routerReplace: (href: string) => void;
};

// ---------------------------------------------------------------------------
// submitAttendanceAction
// ---------------------------------------------------------------------------

export async function submitAttendanceAction(
  mode: AttendanceActionMode,
  ctx: SubmitActionContext,
): Promise<void> {
  const {
    cameraReady, faceDetected, detectionHits, livenessVerified, livenessProgress,
    detectedFaceBox, identifyResult, captureAnalysis, topSimilarity, lowConfidenceHint,
    selectedEnrollmentTarget, profile, validationUiState, geoCoords,
    setSubmitting, setActionError, setActionMessage, setIdentifyResult, setCaptureAnalysis,
    setEnrollmentConflictMessage, setEnrollmentConflictAppUserId, setSuccessReview,
    videoRef, canvasRef, detectorModeRef, reportedFailureRef,
    loadAttendanceMe, closeAction, getCurrentPosition, routerReplace,
  } = ctx;

  setSubmitting(true);
  setActionError(null);
  setActionMessage(null);
  let duplicateConflictAppUserId: number | null = null;

  const captureSnap = () => captureSnapshot(videoRef, canvasRef, detectedFaceBox);
  const analyzeFrame = () => analyzeCurrentFaceFrame(videoRef, canvasRef, detectedFaceBox);
  const report = (reasonCode: string, options?: Parameters<typeof reportClientFailure>[3]) =>
    reportClientFailure(mode, reasonCode, reportedFailureRef, options);

  try {
    if (!cameraReady) {
      throw createClientAttendanceError('Preview kamera belum siap.', 'camera_not_ready');
    }

    const hasStableAttendanceFace =
      mode === 'enroll' ? detectionHits >= 2 : faceDetected || !!detectedFaceBox;

    if (!hasStableAttendanceFace) {
      const snapshotDataUrl = cameraReady ? captureSnap() : null;
      await report('face_not_detected', { snapshotDataUrl, faceScore: 0, livenessScore: 0, metadata: { detectionHits, stage: 'pre_submit_validation', validationUiState: 'failure' } });
      throw createClientAttendanceError('Wajah belum terdeteksi dengan stabil. Posisi wajah diperbaiki lalu coba lagi.', 'face_not_detected');
    }

    if (mode === 'enroll' && !livenessVerified) {
      const snapshotDataUrl = cameraReady ? captureSnap() : null;
      await report('liveness_not_verified', { snapshotDataUrl, faceScore: 0, livenessScore: 0.1, metadata: { detectionHits, stage: 'pre_submit_liveness', validationUiState: 'failure', livenessProgress } });
      throw createClientAttendanceError('Verifikasi wajah asli belum selesai. Kedipkan mata sekali lalu tahan wajah tetap lurus.', 'liveness_not_verified');
    }

    const preSubmitFraming = getLiveFaceFraming(videoRef.current, detectedFaceBox);
    if (mode === 'enroll' && !preSubmitFraming.wellFramed) {
      const snapshotDataUrl = cameraReady ? captureSnap() : null;
      await report('face_not_centered', {
        snapshotDataUrl, faceScore: 0, livenessScore: 0,
        metadata: { detectionHits, stage: 'pre_submit_framing', validationUiState: 'failure', faceCoverage: preSubmitFraming.faceCoverage, guideCoverage: preSubmitFraming.guideCoverage, centerOffsetX: preSubmitFraming.centerOffsetX, centerOffsetY: preSubmitFraming.centerOffsetY },
      });
      throw createClientAttendanceError('Wajah harus masuk penuh di dalam frame. Hadapkan wajah lurus ke kamera dan posisikan tepat di tengah.', 'face_not_centered');
    }

    const snapshotDataUrl = captureSnap();
    const liveCaptureAnalysis = analyzeFrame();
    const faceEmbedding = liveCaptureAnalysis.embedding;
    const deviceInfo = { userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language };

    let liveIdentifyResult = identifyResult;
    if (!liveIdentifyResult && faceDetected && detectionHits >= 1) {
      const identifyPayload = await postJson<FaceIdentifyPayload>('/api/hr/attendance/face-identify', {
        faceEmbedding, faceDetectionCount: detectionHits, faceDetectionMode: detectorModeRef.current,
      });
      liveIdentifyResult = identifyPayload?.data ?? null;
      setIdentifyResult(liveIdentifyResult);
      setCaptureAnalysis(liveCaptureAnalysis);
    }

    const liveIdentifyCandidate = liveIdentifyResult?.candidate ?? null;
    const liveIdentifyMatchesActionTarget =
      mode === 'enroll'
        ? !!liveIdentifyCandidate && liveIdentifyCandidate.appUserId === (selectedEnrollmentTarget?.appUserId ?? profile?.appUserId)
        : !!liveIdentifyCandidate?.isCurrentUser;

    if (liveIdentifyResult?.matched && liveIdentifyCandidate && !liveIdentifyMatchesActionTarget) {
      duplicateConflictAppUserId = liveIdentifyCandidate.appUserId;
      await report('face_identified_as_other_user', {
        snapshotDataUrl,
        metadata: {
          stage: 'pre_submit_identify_conflict', validationUiState: 'failure',
          brightness: liveCaptureAnalysis.brightness, faceCoverage: liveCaptureAnalysis.faceCoverage,
          topSimilarity, lowConfidenceHint,
          identifiedCandidate: { hrUserId: liveIdentifyCandidate.hrUserId, appUserId: liveIdentifyCandidate.appUserId, employeeCode: liveIdentifyCandidate.employeeCode, username: liveIdentifyCandidate.username, fullName: liveIdentifyCandidate.fullName, similarity: liveIdentifyCandidate.similarity },
          topMatches: liveIdentifyResult.topMatches,
        },
      });
      throw createClientAttendanceError(
        `Wajah yang terdeteksi lebih cocok dengan ${liveIdentifyCandidate.fullName ?? liveIdentifyCandidate.username}. Gunakan akun yang benar sebelum melanjutkan.`,
        'face_identified_as_other_user',
      );
    }

    if (mode === 'enroll') {
      const payload = await postJson<{ faceEnrollmentStatus: string; message?: string }>(
        '/api/hr/face-enrollment',
        {
          targetAppUserId: selectedEnrollmentTarget?.appUserId ?? profile?.appUserId,
          qualityScore: Math.min(0.99, Math.max(0.7, detectionHits / 10)),
          livenessScore: 0.96,
          snapshotDataUrl, faceEmbedding,
          faceDetectionCount: detectionHits, faceDetectionMode: detectorModeRef.current,
          metadata: {
            detectionHits, detectorMode: detectorModeRef.current, source: 'web-dashboard',
            deviceInfo, validationUiState, livenessVerified,
            identifyConfidence: topSimilarity,
            brightness: liveCaptureAnalysis.brightness, faceCoverage: liveCaptureAnalysis.faceCoverage,
            lowConfidenceHint,
          },
        },
      );
      await loadAttendanceMe();
      setActionMessage(payload?.message ?? 'Pendaftaran wajah berhasil disimpan.');
      setSuccessReview({
        mode, snapshotDataUrl, recordedAt: new Date().toISOString(),
        employeeName: selectedEnrollmentTarget?.fullName ?? selectedEnrollmentTarget?.username ?? profile?.fullName ?? profile?.username ?? 'Pegawai',
        actionLabel: 'Pendaftaran wajah berhasil',
      });
      closeAction();
      return;
    }

    const coords = geoCoords ?? await getCurrentPosition();
    const payload = await postJson<{ status: string; reasonCode: string | null }>(
      mode === 'clockIn' ? '/api/hr/attendance/clock-in' : '/api/hr/attendance/clock-out',
      {
        latitude: coords.latitude, longitude: coords.longitude,
        livenessScore: livenessVerified ? 0.96 : 0.1,
        snapshotDataUrl, faceEmbedding,
        faceDetectionCount: detectionHits, faceDetectionMode: detectorModeRef.current,
        deviceInfo,
        metadata: { validationUiState, livenessVerified, identifyConfidence: topSimilarity, brightness: liveCaptureAnalysis.brightness, faceCoverage: liveCaptureAnalysis.faceCoverage, lowConfidenceHint },
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
      window.setTimeout(() => routerReplace('/app/hr/attendance'), 150);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proses absensi gagal.';
    const isDuplicateEnrollmentConflict =
      mode === 'enroll' &&
      (message.includes('Wajah ini sudah terdaftar untuk pegawai lain') || message.includes('Pegawai ini sudah memiliki wajah terdaftar aktif'));

    if (isDuplicateEnrollmentConflict) {
      setEnrollmentConflictMessage(message);
      setEnrollmentConflictAppUserId(duplicateConflictAppUserId);
    }

    const reasonCode =
      typeof (error as ClientAttendanceError)?.reasonCode === 'string'
        ? (error as ClientAttendanceError).reasonCode
        : null;
    if (reasonCode && reasonCode !== 'face_not_detected' && reasonCode !== 'camera_denied') {
      void reportClientFailure(mode, reasonCode, reportedFailureRef, {
        metadata: {
          stage: 'submit', validationUiState,
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
