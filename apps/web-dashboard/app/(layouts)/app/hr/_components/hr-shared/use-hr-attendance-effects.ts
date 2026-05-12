'use client';

/**
 * Secondary effects for the HR attendance flow that depend on derived values.
 * These effects handle: initial-action auto-apply, enrollment conflict cleanup,
 * freeze-frame capture, validation audio cue, auto-submit scheduling,
 * enrollment hold timer, and unknown-face toast.
 */

import { useEffect } from 'react';
import { toast } from 'sonner';
import type { AttendanceActionMode, FaceIdentifyPayload, FaceBoundingBox } from './_types-hr';
import { playValidationCue, getUnknownFaceToastMessage } from './_hr-action-utils';

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

export type AttendanceEffectsInput = {
  // state
  actionMode: AttendanceActionMode | null;
  submitting: boolean;
  cameraReady: boolean;
  cameraError: string | null;
  detectorUnavailable: boolean;
  faceDetected: boolean;
  detectionHits: number;
  livenessVerified: boolean;
  identifyLoading: boolean;
  identifyResult: FaceIdentifyPayload | null;
  detectedFaceBox: FaceBoundingBox | null;
  enrollmentConflictMessage: string | null;
  enrollmentConflictAppUserId: number | null;
  enrollmentFreezeFrameUrl: string | null;
  showEnrollmentSection: boolean;
  // derived
  validationUiState: string;
  shouldAutoSubmit: boolean;
  identifyConflict: boolean;
  identifyMatched: boolean;
  identifyMatchesEnrollmentTarget: boolean;
  identifiedCandidate: FaceIdentifyPayload['candidate'] | null;
  enrollmentConflictOwnerLabel: string;
  enrollmentUsedByOther: boolean;
  enrollmentFaceVisible: boolean;
  enrollmentGuideLocked: boolean;
  enrollmentAlignmentState: string;
  enrollmentTargetAlreadyHasFace: boolean;
  enrollmentStabilityHits: number;
  lowConfidence: boolean;
  lowConfidenceHint: string | null;
  wellFramed: boolean;
  unknownFaceDetected: boolean;
  topSimilarity: number;
  // props
  initialActionMode: AttendanceActionMode | undefined;
  // setters
  setActionMode: (value: AttendanceActionMode | null) => void;
  setEnrollmentConflictMessage: (value: string | null) => void;
  setEnrollmentConflictAppUserId: (value: number | null) => void;
  setEnrollmentFreezeFrameUrl: (value: string | null) => void;
  setEnrollmentHoldStep: (value: React.SetStateAction<number>) => void;
  // refs
  initialActionAppliedRef: React.MutableRefObject<boolean>;
  lastValidationStateRef: React.MutableRefObject<string>;
  autoSubmitTimerRef: React.MutableRefObject<number | null>;
  autoSubmitScheduledRef: React.MutableRefObject<boolean>;
  enrollmentHoldTimerRef: React.MutableRefObject<number | null>;
  failureToastCooldownRef: React.MutableRefObject<number>;
  // callbacks
  captureSnapshot: () => string;
  submitAttendanceAction: (mode: AttendanceActionMode) => Promise<void>;
  retryCaptureFlow: () => void;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHrAttendanceEffects(input: AttendanceEffectsInput): void {
  const {
    actionMode, submitting, cameraReady, cameraError, detectorUnavailable,
    faceDetected, detectionHits, livenessVerified, identifyLoading, identifyResult,
    detectedFaceBox, enrollmentConflictMessage, enrollmentConflictAppUserId,
    enrollmentFreezeFrameUrl, showEnrollmentSection,
    validationUiState, shouldAutoSubmit, identifyConflict, identifyMatched,
    identifyMatchesEnrollmentTarget, identifiedCandidate, enrollmentConflictOwnerLabel,
    enrollmentUsedByOther, enrollmentFaceVisible, enrollmentGuideLocked,
    enrollmentAlignmentState, enrollmentTargetAlreadyHasFace, enrollmentStabilityHits,
    lowConfidence, lowConfidenceHint, wellFramed, unknownFaceDetected,
    initialActionMode,
    setActionMode, setEnrollmentConflictMessage, setEnrollmentConflictAppUserId,
    setEnrollmentFreezeFrameUrl, setEnrollmentHoldStep,
    initialActionAppliedRef, lastValidationStateRef, autoSubmitTimerRef,
    autoSubmitScheduledRef, enrollmentHoldTimerRef, failureToastCooldownRef,
    captureSnapshot, submitAttendanceAction, retryCaptureFlow,
  } = input;

  // ── Initial action auto-apply ─────────────────────────────────────────────
  useEffect(() => {
    if (initialActionAppliedRef.current) return;
    if (initialActionMode !== 'enroll' || !input.actionMode === null || actionMode) return;
    if (!showEnrollmentSection) { initialActionAppliedRef.current = true; return; }
    setActionMode('enroll');
    initialActionAppliedRef.current = true;
  }, [actionMode, initialActionMode, showEnrollmentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Enrollment conflict cleanup ───────────────────────────────────────────
  useEffect(() => {
    if (actionMode !== 'enroll' || !enrollmentConflictMessage) return;
    if (!faceDetected || detectionHits < 2) {
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
      return;
    }
    if (identifyLoading) return;

    const currentCandidateAppUserId = identifiedCandidate?.appUserId ?? null;
    if (enrollmentConflictAppUserId === null) {
      if (identifyMatchesEnrollmentTarget) setEnrollmentConflictMessage(null);
      return;
    }
    const candidateChanged =
      currentCandidateAppUserId !== null && currentCandidateAppUserId !== enrollmentConflictAppUserId;
    if (!identifyMatched || identifyMatchesEnrollmentTarget || candidateChanged) {
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
    }
  }, [
    actionMode, detectionHits, enrollmentConflictAppUserId, enrollmentConflictMessage,
    faceDetected, identifyLoading, identifyMatched, identifyMatchesEnrollmentTarget,
    identifiedCandidate?.appUserId,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Enrollment freeze-frame capture ──────────────────────────────────────
  useEffect(() => {
    if (actionMode !== 'enroll' || !enrollmentUsedByOther || enrollmentFreezeFrameUrl || !faceDetected || !detectedFaceBox) return;
    try { setEnrollmentFreezeFrameUrl(captureSnapshot()); } catch { /* keep live frame */ }
  }, [actionMode, detectedFaceBox, enrollmentFreezeFrameUrl, enrollmentUsedByOther, faceDetected]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation audio cue ──────────────────────────────────────────────────
  useEffect(() => {
    const previous = lastValidationStateRef.current;
    if (validationUiState !== previous) {
      if (validationUiState === 'success') playValidationCue('success');
      else if (validationUiState === 'failure') playValidationCue('failure');
      lastValidationStateRef.current = validationUiState;
    }
  }, [validationUiState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-submit scheduling ────────────────────────────────────────────────
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
  }, [actionMode, shouldAutoSubmit]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Enrollment hold timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (
      actionMode !== 'enroll' || submitting || cameraError || detectorUnavailable ||
      enrollmentUsedByOther || enrollmentTargetAlreadyHasFace || !enrollmentFaceVisible || !livenessVerified
    ) {
      if (enrollmentHoldTimerRef.current) {
        window.clearInterval(enrollmentHoldTimerRef.current);
        enrollmentHoldTimerRef.current = null;
      }
      setEnrollmentHoldStep(0);
      return;
    }
    if (enrollmentHoldTimerRef.current) return;
    enrollmentHoldTimerRef.current = window.setInterval(() => {
      setEnrollmentHoldStep((current) => Math.min(4, current + 1));
    }, 430);
    return () => {
      if (enrollmentHoldTimerRef.current) {
        window.clearInterval(enrollmentHoldTimerRef.current);
        enrollmentHoldTimerRef.current = null;
      }
    };
  }, [
    actionMode, cameraError, detectorUnavailable, enrollmentFaceVisible, enrollmentGuideLocked,
    enrollmentAlignmentState, enrollmentTargetAlreadyHasFace, enrollmentUsedByOther, livenessVerified, submitting,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Unknown face / identify-conflict toast ────────────────────────────────
  useEffect(() => {
    if (!actionMode || detectorUnavailable || cameraError || submitting || !cameraReady) return;
    const shouldWarn = actionMode === 'enroll' ? faceDetected && detectionHits >= 3 && !!identifyConflict : false;
    if (!shouldWarn) return;

    const timer = window.setTimeout(() => {
      if (Date.now() < failureToastCooldownRef.current) return;
      failureToastCooldownRef.current = Date.now() + 4500;
      toast.error(getUnknownFaceToastMessage(actionMode, {
        faceDetected,
        wellFramed,
        identifyConflict,
        identifyResult,
        lowConfidence,
        lowConfidenceHint,
      }));
      playValidationCue('failure');
      retryCaptureFlow();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [
    actionMode, cameraError, cameraReady, detectionHits, detectorUnavailable,
    faceDetected, identifyConflict, identifyLoading, lowConfidence, submitting, unknownFaceDetected,
  ]); // eslint-disable-line react-hooks/exhaustive-deps
}
