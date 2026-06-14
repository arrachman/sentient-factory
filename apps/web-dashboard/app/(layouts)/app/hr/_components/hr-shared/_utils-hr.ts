/**
 * Utility functions spesifik untuk HR modul.
 * Mencakup: normalisasi review rows, banner/action hints, dan helper lainnya.
 *
 * MediaPipe / face-detection utilities telah dipindah ke _utils-face.ts.
 * Formatters umum (formatDateTime, statusTone, dll.) ada di ./formatters.ts
 * Normalizers umum (normalizeWorksiteRow, dll.) ada di ./normalizers.ts
 */

import type {
  AttendanceMePayload,
  ClientAttendanceError,
  AttendanceReviewRow,
  AttendanceReviewDetail,
  FaceEnrollmentManagementRow,
} from './_types-hr';
import type { AssignedWorksiteRow } from './types';
import { normalizeNumericValue, normalizeAssignedWorksiteRow } from './normalizers';

// Re-export everything from _utils-face so external consumers don't need to change imports.
export {
  MEDIAPIPE_WASM_ROOT,
  MEDIAPIPE_FACE_LANDMARKER_MODEL,
  MEDIAPIPE_NOISY_ERROR_PATTERNS,
  shouldSuppressMediapipeConsoleError,
  withSuppressedMediapipeConsoleNoise,
  resetFaceDetectorPromise,
  getFaceDetector,
  normalizeFaceBoundingBox,
  clampFaceBox,
  getDefaultFaceGuideBox,
  getActiveFaceCropBox,
  getLiveFaceFraming,
  getLowConfidenceGuidance,
} from './_utils-face';

// ---------------------------------------------------------------------------
// Attendance banner & action hints
// ---------------------------------------------------------------------------

export function getAttendanceBanner(
  profile: AttendanceMePayload['profile'],
  today: AttendanceMePayload['today'],
) {
  if (!profile) return null;

  if (profile.faceEnrollmentStatus !== 'enrolled') {
    return {
      tone: 'warning' as const,
      title: 'Pendaftaran Wajah Wajib Dilakukan',
      description:
        'Simpan wajah terlebih dulu agar sistem absensi memiliki referensi yang terdaftar.',
    };
  }

  if (today?.clock_out_status === 'manual_review' || today?.clock_in_status === 'manual_review') {
    return {
      tone: 'warning' as const,
      title: 'Absensi hari ini perlu tinjauan manual.',
      description:
        'Absensi sudah tercatat, tetapi masih perlu ditinjau HR atau atasan sebelum final.',
    };
  }

  if (today?.clock_out_status === 'success') {
    return {
      tone: 'success' as const,
      title: 'Absensi hari ini sudah selesai.',
      description: 'Jam masuk dan jam pulang sudah tercatat dengan baik.',
    };
  }

  if (today?.clock_in_status === 'success' && !today?.clock_out_at) {
    return {
      tone: 'info' as const,
      title: 'Jam masuk sudah tercatat.',
      description: 'Lanjutkan jam pulang setelah sesi kerja selesai.',
    };
  }

  return {
    tone: 'info' as const,
    title: 'Siap untuk absensi hari ini.',
    description: 'Gunakan kamera untuk pendaftaran wajah, jam masuk, dan jam pulang.',
  };
}

export function getAttendanceActionHint(
  profile: AttendanceMePayload['profile'],
  today: AttendanceMePayload['today'],
) {
  if (!profile) return 'User saat ini belum terdaftar di absensi Sentient HR.';
  if (profile.faceEnrollmentStatus !== 'enrolled')
    return 'Face enrollment must be completed before clock in or clock out is allowed.';
  if (today?.clock_out_at) return 'Absensi hari ini sudah selesai.';
  if (today?.clock_in_at && !today?.clock_out_at)
    return 'Jam masuk sudah tercatat. Lanjutkan jam pulang setelah pekerjaan selesai.';
  return 'Gunakan jam masuk untuk memulai absensi hari ini.';
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

export function getInitials(value: string | null | undefined) {
  if (!value) return 'HR';
  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return 'HR';
  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

export function getMapEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.0035;
  const left = longitude - delta;
  const right = longitude + delta;
  const top = latitude + delta;
  const bottom = latitude - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

export function normalizeDeviceError(error: unknown, target: 'camera' | 'gps') {
  const message = error instanceof Error ? error.message : '';
  const lowered = message.toLowerCase();

  if (target === 'camera') {
    if (
      lowered.includes('permission') ||
      lowered.includes('denied') ||
      lowered.includes('notallowederror')
    ) {
      return 'Izin kamera ditolak. Izinkan akses kamera di browser lalu coba lagi.';
    }
    if (lowered.includes('notfound') || lowered.includes('devices not found')) {
      return 'Kamera depan yang bisa digunakan tidak ditemukan di perangkat ini.';
    }
    return 'Akses kamera tidak tersedia di perangkat atau browser ini.';
  }

  if (lowered.includes('permission') || lowered.includes('denied')) {
    return 'Izin GPS ditolak. Izinkan akses lokasi di browser untuk melanjutkan.';
  }
  if (lowered.includes('timeout')) {
    return 'Pencarian GPS timeout. Pindah ke area dengan sinyal lebih baik lalu coba lagi.';
  }
  if (lowered.includes('unavailable')) {
    return 'Lokasi GPS sedang tidak tersedia di perangkat ini.';
  }
  return 'Akses GPS gagal. Periksa izin lokasi di browser lalu coba lagi.';
}

export function isManualReviewStatus(value: string | null | undefined) {
  return value === 'manual_review';
}

export function createClientAttendanceError(
  message: string,
  reasonCode: string,
): ClientAttendanceError {
  const error = new Error(message) as ClientAttendanceError;
  error.reasonCode = reasonCode;
  return error;
}

// ---------------------------------------------------------------------------
// Normalization of review rows (not in normalizers.ts)
// ---------------------------------------------------------------------------

export function normalizeFaceEnrollmentManagementRow(
  row: Record<string, unknown>,
): FaceEnrollmentManagementRow {
  return {
    hrUserId: Number(row.hrUserId ?? 0),
    appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    faceTemplateVersion: Number(row.faceTemplateVersion ?? 1),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'),
    isActive: Boolean(row.isActive),
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites)
      ? row.assignedWorksites
          .filter(
            (entry): entry is Record<string, unknown> =>
              Boolean(entry && typeof entry === 'object'),
          )
          .map((entry) => normalizeAssignedWorksiteRow(entry))
      : [],
    activeEnrollmentId:
      row.activeEnrollmentId == null ? null : Number(row.activeEnrollmentId),
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    qualityScore:
      row.qualityScore == null ? null : normalizeNumericValue(row.qualityScore),
    enrolledAt: typeof row.enrolledAt === 'string' ? row.enrolledAt : null,
    registeredByUsername:
      typeof row.registeredByUsername === 'string' ? row.registeredByUsername : null,
    registeredByFullName:
      typeof row.registeredByFullName === 'string' ? row.registeredByFullName : null,
  };
}

export function normalizeAttendanceReviewRow(
  row: Record<string, unknown>,
): AttendanceReviewRow {
  return {
    id: Number(row.id ?? 0),
    event_type: String(row.event_type ?? ''),
    event_at: String(row.event_at ?? ''),
    result: String(row.result ?? ''),
    reason_code: typeof row.reason_code === 'string' ? row.reason_code : null,
    reviewStatus: typeof row.reviewStatus === 'string' ? row.reviewStatus : null,
    reviewedAt: typeof row.reviewedAt === 'string' ? row.reviewedAt : null,
    reviewNote: typeof row.reviewNote === 'string' ? row.reviewNote : null,
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    latitude:
      row.latitude == null ? null : normalizeNumericValue(row.latitude),
    longitude:
      row.longitude == null ? null : normalizeNumericValue(row.longitude),
    metadataJson:
      row.metadataJson && typeof row.metadataJson === 'object'
        ? (row.metadataJson as Record<string, unknown>)
        : null,
    work_date: typeof row.work_date === 'string' ? row.work_date : null,
    clockInStatus: typeof row.clockInStatus === 'string' ? row.clockInStatus : null,
    clockOutStatus: typeof row.clockOutStatus === 'string' ? row.clockOutStatus : null,
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName:
      typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
  };
}

export function normalizeAttendanceReviewDetail(
  row: Record<string, unknown>,
): AttendanceReviewDetail {
  const base = normalizeAttendanceReviewRow(row);
  return {
    ...base,
    sessionId: row.sessionId == null ? null : Number(row.sessionId),
    clockInAt: typeof row.clockInAt === 'string' ? row.clockInAt : null,
    clockOutAt: typeof row.clockOutAt === 'string' ? row.clockOutAt : null,
    faceScore:
      row.faceScore == null ? null : normalizeNumericValue(row.faceScore),
    livenessScore:
      row.livenessScore == null ? null : normalizeNumericValue(row.livenessScore),
    deviceInfo:
      row.deviceInfo && typeof row.deviceInfo === 'object'
        ? (row.deviceInfo as Record<string, unknown>)
        : null,
    defaultWorksiteCode:
      typeof row.defaultWorksiteCode === 'string' ? row.defaultWorksiteCode : null,
    defaultWorksiteRadiusMeters:
      row.defaultWorksiteRadiusMeters == null
        ? null
        : normalizeNumericValue(row.defaultWorksiteRadiusMeters),
    reviewedByUsername:
      typeof row.reviewedByUsername === 'string' ? row.reviewedByUsername : null,
    reviewedByFullName:
      typeof row.reviewedByFullName === 'string' ? row.reviewedByFullName : null,
    reviewHistory: Array.isArray(row.reviewHistory)
      ? row.reviewHistory
          .filter(
            (entry): entry is Record<string, unknown> =>
              Boolean(entry && typeof entry === 'object'),
          )
          .map((entry) => ({
            id: Number(entry.id ?? 0),
            previousStatus:
              typeof entry.previousStatus === 'string' ? entry.previousStatus : null,
            nextStatus: String(entry.nextStatus ?? ''),
            note: typeof entry.note === 'string' ? entry.note : null,
            createdAt: String(entry.createdAt ?? ''),
            actorUsername:
              typeof entry.actorUsername === 'string' ? entry.actorUsername : null,
            actorFullName:
              typeof entry.actorFullName === 'string' ? entry.actorFullName : null,
            metadataJson:
              entry.metadataJson && typeof entry.metadataJson === 'object'
                ? (entry.metadataJson as Record<string, unknown>)
                : null,
          }))
      : [],
  };
}
