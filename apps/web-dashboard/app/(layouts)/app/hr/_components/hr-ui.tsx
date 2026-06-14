'use client';

import {
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import styles from './hr-attendance-effects.module.css';
import { useHrAttendanceState } from './hr-shared/use-hr-attendance-state';
import { HrSuccessReview } from './hr-shared/hr-success-review';
import { HrEnrollCameraView } from './hr-shared/hr-enroll-camera-view';
import { HrAttendanceCameraView } from './hr-shared/hr-attendance-camera-view';
import { HrAttendanceDashboard } from './hr-shared/hr-attendance-dashboard';

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
import type { AttendanceActionMode } from './hr-shared/_types-hr';
import { SectionShell } from './hr-shared/section-shell';

export function HrAttendancePageView({
  initialTargetUserId,
  initialActionMode,
}: {
  initialTargetUserId?: string;
  initialActionMode?: AttendanceActionMode;
}) {
  const s = useHrAttendanceState({ initialTargetUserId, initialActionMode });

  // CSS-class derivations that depend on the CSS module (kept in component)
  const overlayToneClass = s.actionMode === 'enroll'
    ? s.enrollmentAlignmentState === 'locked'
      ? styles.faceBoxSuccess
      : s.enrollmentAlignmentState === 'near'
        ? styles.faceBoxLow
        : s.enrollmentAlignmentState === 'off'
          ? styles.faceBoxUnknown
          : styles.faceBoxIdle
    : s.validationUiState === 'success'
      ? styles.faceBoxSuccess
      : s.validationUiState === 'failure'
        ? styles.faceBoxUnknown
        : s.validationUiState === 'low-confidence'
          ? styles.faceBoxLow
        : s.validationUiState === 'scanning'
          ? styles.faceBoxScanning
          : styles.faceBoxIdle;

  const attendanceFrameGuideClass = s.attendanceInfoTone === 'danger'
    ? 'border-rose-200 bg-rose-50/92 text-rose-900'
    : s.attendanceInfoTone === 'success'
      ? 'border-emerald-200 bg-emerald-50/92 text-emerald-900'
      : 'border-white/25 bg-slate-950/48 text-white';

  return (
    <SectionShell
      title={s.actionMode === 'enroll' ? '' : 'Absensi'}
      wide={!!s.actionMode}
    >
      <div className="space-y-6">
        {s.successReview ? (
          <HrSuccessReview
            successReview={s.successReview}
            onClose={() => s.setSuccessReview(null)}
          />
        ) : s.actionMode === 'enroll' ? (
          <HrEnrollCameraView
            videoRef={s.videoRef}
            canvasRef={s.canvasRef}
            validationUiState={s.validationUiState}
            submitting={s.submitting}
            enrollmentFreezeFrameUrl={s.enrollmentFreezeFrameUrl}
            enrollmentUsedByOther={s.enrollmentUsedByOther}
            enrollmentHeroTitle={s.enrollmentHeroTitle}
            enrollmentHeroMessage={s.enrollmentHeroMessage}
            enrollmentIsHolding={s.enrollmentIsHolding}
            enrollmentHoldProgress={s.enrollmentHoldProgress}
            enrollmentStabilityHits={s.enrollmentStabilityHits}
            enrollmentLockPulse={s.enrollmentLockPulse}
            enrollmentConflictOwnerLabel={s.enrollmentConflictOwnerLabel}
            selectedEnrollmentTargetContext={s.selectedEnrollmentTargetContext}
            cameraError={s.cameraError}
            actionError={s.actionError}
            detectorUnavailable={s.detectorUnavailable}
            retryEnrollmentWithDifferentFace={s.retryEnrollmentWithDifferentFace}
            closeAction={s.closeAction}
          />
        ) : s.actionMode === 'clockIn' || s.actionMode === 'clockOut' ? (
          <HrAttendanceCameraView
            videoRef={s.videoRef}
            canvasRef={s.canvasRef}
            actionMode={s.actionMode}
            validationUiState={s.validationUiState}
            submitting={s.submitting}
            livenessVerified={s.livenessVerified}
            overlayStyle={s.overlayStyle}
            overlayToneClass={overlayToneClass}
            attendanceFrameGuideClass={attendanceFrameGuideClass}
            attendanceInfoTitle={s.attendanceInfoTitle}
            attendanceInfoMessage={s.attendanceInfoMessage}
            attendanceInfoTone={s.attendanceInfoTone}
            cameraError={s.cameraError}
            actionError={s.actionError}
            detectorUnavailable={s.detectorUnavailable}
            geoCoords={s.geoCoords}
            geoLabel={s.geoLabel}
            identifyLoading={s.identifyLoading}
            lowConfidence={s.lowConfidence}
            lowConfidenceHint={s.lowConfidenceHint}
            topIdentifyMatches={s.topIdentifyMatches}
            canSubmitCurrentAction={s.canSubmitCurrentAction}
            attendanceActionHint={s.attendanceActionHint}
            retryCaptureFlow={s.retryCaptureFlow}
            closeAction={s.closeAction}
          />
        ) : null}

        {!s.successReview && !s.actionMode ? (
          <HrAttendanceDashboard
            data={s.data}
            historyPreview={s.historyPreview}
            today={s.today}
            profile={s.profile}
            presentDays={s.presentDays}
            fullDays={s.fullDays}
            totalHistoryMinutes={s.totalHistoryMinutes}
            avgHistoryHours={s.avgHistoryHours}
            lateArrivals={s.lateArrivals}
            earlyDepartures={s.earlyDepartures}
            outOfGeofenceCount={s.outOfGeofenceCount}
            pendingReviewEvents={s.pendingReviewEvents}
            latestPendingReview={s.latestPendingReview}
            actionMessage={s.actionMessage}
            actionMode={s.actionMode}
            isEnrolled={s.isEnrolled}
            canClockIn={s.canClockIn}
            canClockOut={s.canClockOut}
            showEnrollmentSection={s.showEnrollmentSection}
            brokenEventImages={s.brokenEventImages}
            setBrokenEventImages={s.setBrokenEventImages}
            setActionMode={s.setActionMode}
          />
        ) : null}

        <Dialog
          open={s.showUnknownFaceDialog}
          onOpenChange={(open) => {
            s.setShowUnknownFaceDialog(open);
            if (!open) {
              s.unknownDialogShownRef.current = true;
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
              {s.lowConfidenceHint ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                  Saran: {s.lowConfidenceHint}
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
                  s.setShowUnknownFaceDialog(false);
                  s.identifyCooldownUntilRef.current = 0;
                  s.identifyRequestRef.current += 1;
                }}
              >
                Coba Lagi
              </Button>
              <Button
                className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => {
                  s.setShowUnknownFaceDialog(false);
                  s.setActionMode('enroll');
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
