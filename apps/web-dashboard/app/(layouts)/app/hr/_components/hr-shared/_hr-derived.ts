'use client';

/**
 * Pure derived-value computation for the HR attendance state hook.
 * All inputs are explicit parameters; no React hooks are called here.
 *
 * This module exports:
 *   - HrDerivedInput: param type
 *   - computeHrDerived: main function → returns HrDerived
 *   - computeHrDerivedUi: second pass for UI labels (depends on first pass results)
 */

import type {
  AttendanceMePayload,
  AttendanceHistoryPayload,
  AttendanceActionMode,
  FaceIdentifyPayload,
  FaceBoundingBox,
  FaceCaptureAnalysis,
} from './_types-hr';
import {
  getLiveFaceFraming,
  getLowConfidenceGuidance,
  getAttendanceBanner,
  getAttendanceActionHint,
  isManualReviewStatus,
} from './_utils-hr';

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

export type HrDerivedInput = {
  data: AttendanceMePayload | null;
  historyPreview: AttendanceHistoryPayload['data'];
  actionMode: AttendanceActionMode | null;
  faceDetected: boolean;
  detectionHits: number;
  livenessVerified: boolean;
  livenessProgress: number;
  livenessPrompt: string;
  detectedFaceBox: FaceBoundingBox | null;
  identifyResult: FaceIdentifyPayload | null;
  identifyLoading: boolean;
  captureAnalysis: FaceCaptureAnalysis | null;
  submitting: boolean;
  cameraReady: boolean;
  cameraError: string | null;
  detectorUnavailable: boolean;
  enrollmentConflictMessage: string | null;
  enrollmentConflictAppUserId: number | null;
  enrollmentHoldStep: number;
  videoElement: HTMLVideoElement | null;
};

// ---------------------------------------------------------------------------
// computeHrDerived
// ---------------------------------------------------------------------------

export function computeHrDerived(input: HrDerivedInput) {
  const {
    data, historyPreview, actionMode, faceDetected, detectionHits,
    livenessVerified, detectedFaceBox, identifyResult, identifyLoading,
    captureAnalysis, submitting, cameraReady, cameraError, detectorUnavailable,
    enrollmentConflictMessage, enrollmentHoldStep, videoElement,
  } = input;

  const profile = data?.profile ?? null;
  const today = data?.today ?? null;

  const selectedEnrollmentTarget = profile
    ? {
        hrUserId: profile.hrUserId,
        appUserId: profile.appUserId,
        employeeCode: profile.employeeCode,
        faceEnrollmentStatus: profile.faceEnrollmentStatus,
        employeeRoleType: profile.employeeRoleType,
        isActive: true as const,
        username: profile.username,
        fullName: profile.fullName,
        defaultWorksiteName: profile.defaultWorksiteName,
        assignedWorksites: profile.assignedWorksites ?? [],
      }
    : null;

  const identifiedCandidate = identifyResult?.candidate ?? null;
  const identifyMatched = !!identifyResult?.matched && !!identifiedCandidate;
  const identifyMatchesEnrollmentTarget =
    !!identifiedCandidate && !!selectedEnrollmentTarget &&
    identifiedCandidate.appUserId === selectedEnrollmentTarget.appUserId;
  const identifyMatchesCurrentUser =
    actionMode === 'enroll' ? identifyMatchesEnrollmentTarget : !!identifiedCandidate?.isCurrentUser;
  const topIdentifyMatches = identifyResult?.topMatches ?? [];
  const topSimilarity = topIdentifyMatches[0]?.similarity ?? 0;
  const identifyConflict = identifyMatched && !identifyMatchesCurrentUser;
  const enrollmentConflictOwnerLabel =
    identifiedCandidate?.fullName ?? identifiedCandidate?.username ?? 'pegawai lain';

  const liveFraming = getLiveFaceFraming(videoElement, detectedFaceBox);
  const autoSubmitEnabled = data?.settings?.autoSubmitEnabled ?? true;
  const faceVerifyConfidenceThreshold = data?.settings?.faceVerifyConfidenceThreshold ?? 0.82;
  const autoSubmitConfidenceThreshold = data?.settings?.autoSubmitConfidenceThreshold ?? 0.9;
  const lowConfidence = faceDetected && !identifyMatched && topSimilarity >= 0.5 && topSimilarity < 0.7;
  const lowConfidenceHint =
    lowConfidence && captureAnalysis
      ? getLowConfidenceGuidance({
          similarity: topSimilarity,
          brightness: captureAnalysis.brightness,
          faceCoverage: captureAnalysis.faceCoverage,
        })
      : null;

  const banner = getAttendanceBanner(profile, today);
  const actionHint = getAttendanceActionHint(profile, today);
  const statusTitle = banner?.title ?? 'Absensi';
  const isEnrolled = profile?.faceEnrollmentStatus === 'enrolled';
  const showEnrollmentSection = !!profile && !isEnrolled;
  const canClockIn = !!profile && isEnrolled && !today?.clock_in_at;
  const canClockOut = !!profile && isEnrolled && !!today?.clock_in_at && !today?.clock_out_at;
  const needsManualReview =
    isManualReviewStatus(today?.clock_in_status) || isManualReviewStatus(today?.clock_out_status);

  const presentDays = historyPreview.filter((row) => !!row.clock_in_at).length;
  const fullDays = historyPreview.filter((row) => !!row.clock_out_at).length;
  const totalHistoryMinutes = historyPreview.reduce(
    (sum, row) => sum + Number(row.total_work_minutes ?? 0), 0,
  );
  const avgHistoryHours = fullDays > 0 ? totalHistoryMinutes / 60 / fullDays : 0;
  const lateArrivals = historyPreview.filter(
    (row) => isManualReviewStatus(row.clock_in_status) || row.clock_in_status === 'warning' || row.clock_in_status === 'rejected',
  ).length;
  const earlyDepartures = historyPreview.filter(
    (row) => isManualReviewStatus(row.clock_out_status) || row.clock_out_status === 'warning' || row.clock_out_status === 'rejected',
  ).length;
  const outOfGeofenceCount = (data?.recentEvents ?? []).filter(
    (event) => event.reason_code === 'outside_geofence',
  ).length;
  const pendingReviewEvents = (data?.recentEvents ?? []).filter(
    (event) => event.result === 'manual_review' || event.result === 'warning',
  );
  const latestPendingReview = pendingReviewEvents[0] ?? null;

  // ── Enrollment state ──────────────────────────────────────────────────────
  const selectedEnrollmentTargetAlreadyEnrolled =
    selectedEnrollmentTarget?.faceEnrollmentStatus === 'enrolled';
  const isEnrollmentFocus = actionMode === 'enroll';
  const enrollmentFaceVisible = faceDetected || !!detectedFaceBox;
  const enrollmentAlignmentState = !enrollmentFaceVisible ? 'idle' : liveFraming.alignmentState;
  const enrollmentGuideLocked = enrollmentFaceVisible && liveFraming.locked;
  const enrollmentFaceAligned = enrollmentGuideLocked;
  const enrollmentStabilityHits = Math.min(enrollmentHoldStep || detectionHits, 4);
  const enrollmentTargetAlreadyHasFace =
    actionMode === 'enroll' && !!enrollmentConflictMessage &&
    enrollmentConflictMessage.includes('Pegawai ini sudah memiliki wajah terdaftar aktif');
  const enrollmentUsedByOther =
    actionMode === 'enroll' &&
    (identifyConflict || (!!enrollmentConflictMessage && !enrollmentTargetAlreadyHasFace));
  const enrollmentIsHolding =
    actionMode === 'enroll' && enrollmentFaceVisible &&
    (enrollmentGuideLocked || enrollmentAlignmentState === 'near') &&
    livenessVerified && !submitting && !enrollmentUsedByOther && !enrollmentTargetAlreadyHasFace;
  const enrollmentHoldProgress =
    enrollmentIsHolding && livenessVerified
      ? Math.min(100, Math.round((enrollmentStabilityHits / 4) * 100))
      : 0;

  // ── Attendance framing + unknownFace ──────────────────────────────────────
  const attendanceFramingReady =
    faceDetected &&
    (liveFraming.wellFramed || liveFraming.alignmentState === 'near' ||
      (liveFraming.faceCoverage >= 0.04 && liveFraming.centerOffsetX <= 0.22 && liveFraming.centerOffsetY <= 0.22));
  const unknownFaceDetected =
    actionMode !== 'enroll' && faceDetected && !!identifyResult && !identifyLoading &&
    !identifyMatched && detectionHits >= 4 && topSimilarity < faceVerifyConfidenceThreshold;

  // ── Validation + submit readiness ─────────────────────────────────────────
  const enrollmentReady =
    actionMode === 'enroll' && cameraReady && !detectorUnavailable &&
    enrollmentStabilityHits >= 4 && livenessVerified && enrollmentGuideLocked &&
    !enrollmentConflictMessage && !cameraError && !selectedEnrollmentTargetAlreadyEnrolled && !identifyConflict;

  const validationUiState =
    actionMode === 'enroll'
      ? !cameraReady ? 'idle'
        : enrollmentUsedByOther || enrollmentTargetAlreadyHasFace ? 'low-confidence'
        : enrollmentReady ? 'success'
        : enrollmentFaceVisible ? (enrollmentGuideLocked ? 'scanning' : 'low-confidence')
        : 'idle'
      : !cameraReady ? 'idle'
        : identifyLoading ? 'scanning'
        : identifyConflict ? 'failure'
        : (identifyMatched || (faceDetected && detectionHits >= 1 && attendanceFramingReady)) ? 'success'
        : lowConfidence ? 'low-confidence'
        : faceDetected ? 'scanning'
        : 'idle';

  const canSubmitCurrentAction =
    actionMode === 'enroll'
      ? !submitting && !cameraError && !detectorUnavailable && !identifyConflict &&
        !enrollmentConflictMessage && !selectedEnrollmentTargetAlreadyEnrolled &&
        enrollmentStabilityHits >= 3 && enrollmentGuideLocked && livenessVerified
      : !submitting && !cameraError && !detectorUnavailable && !identifyLoading &&
        !identifyConflict && !unknownFaceDetected && faceDetected && detectionHits >= 1 && attendanceFramingReady;

  const shouldAutoSubmit =
    actionMode !== null && autoSubmitEnabled && !submitting && !cameraError && !detectorUnavailable &&
    (actionMode === 'enroll'
      ? validationUiState === 'success' && enrollmentStabilityHits >= 4 && livenessVerified && enrollmentGuideLocked && !identifyConflict
      : canSubmitCurrentAction);

  // ── Overlay ───────────────────────────────────────────────────────────────
  const overlayBox = detectedFaceBox;
  const overlayStyle =
    cameraReady && overlayBox && videoElement
      ? {
          left: `${(overlayBox.x / videoElement.videoWidth) * 100}%`,
          top: `${(overlayBox.y / videoElement.videoHeight) * 100}%`,
          width: `${(overlayBox.width / videoElement.videoWidth) * 100}%`,
          height: `${(overlayBox.height / videoElement.videoHeight) * 100}%`,
        }
      : null;

  return {
    profile, today, selectedEnrollmentTarget,
    identifiedCandidate, identifyMatched, identifyMatchesEnrollmentTarget,
    identifyMatchesCurrentUser, topIdentifyMatches, topSimilarity,
    identifyConflict, enrollmentConflictOwnerLabel,
    liveFraming, autoSubmitEnabled, autoSubmitConfidenceThreshold, faceVerifyConfidenceThreshold,
    lowConfidence, lowConfidenceHint,
    banner, actionHint, statusTitle,
    isEnrolled, showEnrollmentSection, canClockIn, canClockOut, needsManualReview,
    presentDays, fullDays, totalHistoryMinutes, avgHistoryHours,
    lateArrivals, earlyDepartures, outOfGeofenceCount, pendingReviewEvents, latestPendingReview,
    selectedEnrollmentTargetAlreadyEnrolled, isEnrollmentFocus,
    enrollmentFaceVisible, enrollmentAlignmentState, enrollmentGuideLocked, enrollmentFaceAligned,
    enrollmentStabilityHits, enrollmentTargetAlreadyHasFace, enrollmentUsedByOther,
    enrollmentIsHolding, enrollmentHoldProgress,
    attendanceFramingReady, unknownFaceDetected,
    enrollmentReady, validationUiState, canSubmitCurrentAction, shouldAutoSubmit,
    overlayBox, overlayStyle,
  };
}

export type HrDerivedBase = ReturnType<typeof computeHrDerived>;
