'use client';

/**
 * UI label derivations for the HR attendance flow.
 * Depends on HrDerivedBase (from _hr-derived.ts) plus a few raw state values.
 * No React hooks — pure function.
 */

import type { AttendanceActionMode } from './_types-hr';
import type { HrDerivedBase } from './_hr-derived';

export type HrDerivedUiInput = {
  base: HrDerivedBase;
  actionMode: AttendanceActionMode | null;
  livenessProgress: number;
  livenessPrompt: string;
  faceDetected: boolean;
  detectionHits: number;
  livenessVerified: boolean;
  submitting: boolean;
  cameraReady: boolean;
  // raw state not in HrDerivedBase
  identifyLoading: boolean;
  enrollmentConflictMessage: string | null;
};

export function computeHrDerivedUi(input: HrDerivedUiInput) {
  const { base, actionMode, livenessProgress, livenessPrompt, faceDetected, detectionHits, livenessVerified, submitting, cameraReady, identifyLoading, enrollmentConflictMessage } = input;
  const {
    identifyConflict, identifyMatched, identifyMatchesCurrentUser,
    identifiedCandidate, enrollmentConflictOwnerLabel,
    enrollmentUsedByOther, enrollmentTargetAlreadyHasFace, enrollmentGuideLocked,
    enrollmentFaceVisible, enrollmentAlignmentState, enrollmentStabilityHits,
    enrollmentHoldProgress, selectedEnrollmentTargetAlreadyEnrolled,
    liveFraming, validationUiState, unknownFaceDetected, canSubmitCurrentAction,
    attendanceFramingReady, topSimilarity, lowConfidence, lowConfidenceHint,
  } = base;

  // ── Enrollment info panel ─────────────────────────────────────────────────
  const enrollmentInfoTone = enrollmentUsedByOther
    ? 'warning'
    : selectedEnrollmentTargetAlreadyEnrolled
      ? 'warning'
      : identifyMatched && base.identifyMatchesEnrollmentTarget
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
      : identifyMatched && base.identifyMatchesEnrollmentTarget
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
      : identifyMatched && base.identifyMatchesEnrollmentTarget
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

  // ── Attendance info panel ─────────────────────────────────────────────────
  const attendanceInfoTone = identifyConflict
    ? 'danger'
    : identifyMatched && identifyMatchesCurrentUser
      ? 'success'
      : livenessVerified && liveFraming.wellFramed
        ? 'success'
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

  // ── Action hints ──────────────────────────────────────────────────────────
  const attendanceActionHint =
    actionMode === 'enroll'
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

  // ── Primary action labels ─────────────────────────────────────────────────
  const primaryActionLabel =
    actionMode === 'enroll'
      ? 'Simpan Pendaftaran Wajah'
      : actionMode === 'clockIn'
        ? 'Kirim Jam Masuk'
        : 'Kirim Jam Pulang';

  const selectedEnrollmentTarget = base.selectedEnrollmentTarget;
  const profile = base.profile;
  const selectedEnrollmentTargetName =
    selectedEnrollmentTarget?.fullName ?? selectedEnrollmentTarget?.username ??
    profile?.fullName ?? profile?.username ?? '';
  const selectedEnrollmentTargetCode =
    selectedEnrollmentTarget?.employeeCode ?? profile?.employeeCode ?? null;
  const selectedEnrollmentTargetContext = selectedEnrollmentTargetName
    ? `Mendaftarkan: ${selectedEnrollmentTargetName}${selectedEnrollmentTargetCode ? ` (${selectedEnrollmentTargetCode})` : ''}`
    : '';

  const primaryActionButtonLabel =
    actionMode === 'enroll' && !canSubmitCurrentAction
      ? selectedEnrollmentTargetAlreadyEnrolled
        ? 'Wajah Sudah Terdaftar'
        : enrollmentUsedByOther
          ? 'Wajah Sudah Dipakai Pegawai Lain'
          : enrollmentTargetAlreadyHasFace
            ? 'Wajah Pegawai Sudah Terdaftar'
            : !enrollmentGuideLocked
              ? enrollmentFaceVisible ? 'Wajah hampir masuk panduan' : 'Arahkan wajah ke kamera'
              : livenessProgress === 1
                ? 'Selesaikan kedipan...'
                : !livenessVerified
                  ? 'Menunggu berkedip...'
                  : !cameraReady
                    ? 'Menyiapkan kamera...'
                    : primaryActionLabel
      : primaryActionLabel;

  const enrollmentFrameLabel =
    actionMode === 'enroll'
      ? validationUiState === 'success'
        ? 'Verifikasi Berhasil'
        : enrollmentUsedByOther
          ? 'Wajah sudah dipakai pegawai lain'
          : enrollmentTargetAlreadyHasFace
            ? 'Wajah pegawai sudah terdaftar'
            : !enrollmentGuideLocked
              ? enrollmentFaceVisible ? 'Wajah hampir masuk panduan' : 'Arahkan wajah ke kamera'
              : livenessProgress === 1
                ? 'Selesaikan kedipan...'
                : 'Verifikasi wajah siap'
      : null;

  const enrollmentHeroTitle =
    actionMode === 'enroll'
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

  const enrollmentHeroMessage =
    actionMode === 'enroll'
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

  return {
    enrollmentInfoTone,
    enrollmentInfoTitle,
    enrollmentInfoMessage,
    attendanceInfoTone,
    attendanceInfoTitle,
    attendanceInfoMessage,
    attendanceActionHint,
    primaryActionLabel,
    selectedEnrollmentTargetName,
    selectedEnrollmentTargetCode,
    selectedEnrollmentTargetContext,
    primaryActionButtonLabel,
    enrollmentFrameLabel,
    enrollmentHeroTitle,
    enrollmentHeroMessage,
  };
}

export type HrDerivedUi = ReturnType<typeof computeHrDerivedUi>;
