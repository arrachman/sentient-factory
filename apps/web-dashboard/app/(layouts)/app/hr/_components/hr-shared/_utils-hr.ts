/**
 * Utility functions spesifik untuk HrAttendancePageView.
 * Mencakup: face detection helpers, normalisasi review rows,
 * banner/action hints, dan pembantu lainnya.
 *
 * Formatters umum (formatDateTime, statusTone, dll.) ada di ./formatters.ts
 * Normalizers umum (normalizeWorksiteRow, dll.) ada di ./normalizers.ts
 */

import type {
  FaceBoundingBox,
  FaceAlignmentState,
  RuntimeFaceDetector,
  RuntimeFaceDetectionResult,
  AttendanceMePayload,
  ClientAttendanceError,
  AttendanceReviewRow,
  AttendanceReviewDetail,
  FaceEnrollmentManagementRow,
} from './_types-hr';
import type { AssignedWorksiteRow } from './types';
import { normalizeNumericValue, normalizeAssignedWorksiteRow } from './normalizers';

// ---------------------------------------------------------------------------
// MediaPipe constants
// ---------------------------------------------------------------------------

export const MEDIAPIPE_WASM_ROOT =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';

export const MEDIAPIPE_FACE_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export const MEDIAPIPE_NOISY_ERROR_PATTERNS = [
  'Created TensorFlow Lite XNNPACK delegate for CPU.',
  'INFO: Created TensorFlow Lite XNNPACK delegate for CPU.',
];

// ---------------------------------------------------------------------------
// MediaPipe noise suppression
// ---------------------------------------------------------------------------

export function shouldSuppressMediapipeConsoleError(args: unknown[]) {
  return args.some((arg) => {
    if (typeof arg !== 'string') return false;
    return MEDIAPIPE_NOISY_ERROR_PATTERNS.some((pattern) => arg.includes(pattern));
  });
}

export async function withSuppressedMediapipeConsoleNoise<T>(fn: () => Promise<T> | T) {
  const originalConsoleError = console.error;
  console.error = (...args: Parameters<typeof console.error>) => {
    if (shouldSuppressMediapipeConsoleError(args)) return;
    originalConsoleError(...args);
  };
  try {
    return await fn();
  } finally {
    console.error = originalConsoleError;
  }
}

// ---------------------------------------------------------------------------
// Face detector factory (singleton promise)
// ---------------------------------------------------------------------------

let faceDetectorPromise: Promise<{
  detector: RuntimeFaceDetector | null;
  mode: 'mediapipe' | 'fallback';
}> | null = null;

export function resetFaceDetectorPromise() {
  faceDetectorPromise = null;
}

export async function getFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const wasmFileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_ROOT);
        const faceLandmarker = await withSuppressedMediapipeConsoleNoise(() =>
          vision.FaceLandmarker.createFromOptions(wasmFileset, {
            baseOptions: {
              modelAssetPath: MEDIAPIPE_FACE_LANDMARKER_MODEL,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          }),
        );
        let lastVideoTimestamp = -1;

        return {
          detector: {
            estimateFaces: async (input: HTMLVideoElement) => {
              if (
                !input ||
                input.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
                input.videoWidth <= 0 ||
                input.videoHeight <= 0 ||
                !Number.isFinite(input.currentTime) ||
                input.currentTime <= 0
              ) {
                return [];
              }

              const videoTimestamp = Math.round(input.currentTime * 1000);
              if (
                !Number.isFinite(videoTimestamp) ||
                videoTimestamp <= 0 ||
                videoTimestamp <= lastVideoTimestamp
              ) {
                return [];
              }

              let result: {
                faceLandmarks?: unknown[];
                faceBlendshapes?: Array<{
                  categories?: Array<{ categoryName?: string; score?: number }>;
                }>;
              } | null = null;
              try {
                result = await withSuppressedMediapipeConsoleNoise(() =>
                  faceLandmarker.detectForVideo(input, videoTimestamp),
                );
                lastVideoTimestamp = videoTimestamp;
              } catch {
                return [];
              }

              const landmarksList = result.faceLandmarks ?? [];
              const blendShapesList = result.faceBlendshapes ?? [];

              return landmarksList
                .map((landmarks, index) => {
                  if (!Array.isArray(landmarks) || landmarks.length === 0) return null;

                  let minX = Number.POSITIVE_INFINITY;
                  let minY = Number.POSITIVE_INFINITY;
                  let maxX = Number.NEGATIVE_INFINITY;
                  let maxY = Number.NEGATIVE_INFINITY;

                  for (const landmark of landmarks) {
                    const x = Number(landmark.x ?? 0) * input.videoWidth;
                    const y = Number(landmark.y ?? 0) * input.videoHeight;
                    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                  }

                  if (
                    !Number.isFinite(minX) ||
                    !Number.isFinite(minY) ||
                    !Number.isFinite(maxX) ||
                    !Number.isFinite(maxY)
                  ) {
                    return null;
                  }

                  const categories = blendShapesList[index]?.categories ?? [];
                  const leftBlink = Number(
                    categories.find((item) => item.categoryName === 'eyeBlinkLeft')?.score ?? 0,
                  );
                  const rightBlink = Number(
                    categories.find((item) => item.categoryName === 'eyeBlinkRight')?.score ?? 0,
                  );

                  return {
                    boundingBox: {
                      x: minX,
                      y: minY,
                      width: Math.max(1, maxX - minX),
                      height: Math.max(1, maxY - minY),
                    },
                    liveness: {
                      leftBlink,
                      rightBlink,
                      avgBlink: (leftBlink + rightBlink) / 2,
                    },
                  } satisfies RuntimeFaceDetectionResult;
                })
                .filter((face): face is RuntimeFaceDetectionResult => !!face);
            },
          } satisfies RuntimeFaceDetector,
          mode: 'mediapipe' as const,
        };
      } catch {
        return { detector: null, mode: 'fallback' as const };
      }
    })();
  }

  return faceDetectorPromise;
}

// ---------------------------------------------------------------------------
// Face bounding box helpers
// ---------------------------------------------------------------------------

export function normalizeFaceBoundingBox(face: unknown): FaceBoundingBox | null {
  if (!face || typeof face !== 'object') return null;

  const rawBox = (face as { boundingBox?: Partial<FaceBoundingBox> }).boundingBox;
  if (!rawBox) return null;

  const x = Number(rawBox.x ?? 0);
  const y = Number(rawBox.y ?? 0);
  const width = Number(rawBox.width ?? 0);
  const height = Number(rawBox.height ?? 0);

  if (!Number.isFinite(x) || !Number.isFinite(y) || width <= 0 || height <= 0) return null;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const expandedWidth = width * 1.42;
  const expandedHeight = height * 1.68;
  const shiftedCenterY = centerY - height * 0.08;

  return {
    x: centerX - expandedWidth / 2,
    y: shiftedCenterY - expandedHeight / 2,
    width: expandedWidth,
    height: expandedHeight,
  };
}

export function clampFaceBox(
  box: FaceBoundingBox,
  frameWidth: number,
  frameHeight: number,
) {
  const paddingX = box.width * 0.1;
  const paddingY = box.height * 0.14;
  const x = Math.max(0, box.x - paddingX);
  const y = Math.max(0, box.y - paddingY);
  const right = Math.min(frameWidth, box.x + box.width + paddingX);
  const bottom = Math.min(frameHeight, box.y + box.height + paddingY);
  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  };
}

export function getDefaultFaceGuideBox(
  frameWidth: number,
  frameHeight: number,
): FaceBoundingBox {
  const width = frameWidth * 0.18;
  const height = frameHeight * 0.3;
  return {
    x: (frameWidth - width) / 2,
    y: frameHeight * 0.2,
    width,
    height,
  };
}

export function getActiveFaceCropBox(
  video: HTMLVideoElement,
  detectedBox: FaceBoundingBox | null,
): FaceBoundingBox {
  if (detectedBox) return clampFaceBox(detectedBox, video.videoWidth, video.videoHeight);
  return getDefaultFaceGuideBox(video.videoWidth, video.videoHeight);
}

// ---------------------------------------------------------------------------
// Live face framing analysis
// ---------------------------------------------------------------------------

export function getLiveFaceFraming(
  video: HTMLVideoElement | null,
  detectedBox: FaceBoundingBox | null,
) {
  if (!video || !detectedBox || video.videoWidth === 0 || video.videoHeight === 0) {
    return {
      faceCoverage: 0,
      guideCoverage: 0,
      centerOffsetX: 1,
      centerOffsetY: 1,
      alignmentState: 'idle' as FaceAlignmentState,
      locked: false,
      wellFramed: false,
    };
  }

  const clampedDetectedBox = clampFaceBox(detectedBox, video.videoWidth, video.videoHeight);
  const detectedArea = clampedDetectedBox.width * clampedDetectedBox.height;
  const frameArea = video.videoWidth * video.videoHeight;
  const faceCoverage = detectedArea / frameArea;
  const frameCenterX = video.videoWidth / 2;
  const frameCenterY = video.videoHeight / 2;
  const faceCenterX = clampedDetectedBox.x + clampedDetectedBox.width / 2;
  const faceCenterY = clampedDetectedBox.y + clampedDetectedBox.height / 2;
  const centerOffsetX = Math.abs(faceCenterX - frameCenterX) / video.videoWidth;
  const centerOffsetY = Math.abs(faceCenterY - frameCenterY) / video.videoHeight;
  const framePaddingX = video.videoWidth * 0.02;
  const framePaddingY = video.videoHeight * 0.02;
  const insideFrameBounds =
    clampedDetectedBox.x >= framePaddingX &&
    clampedDetectedBox.y >= framePaddingY &&
    clampedDetectedBox.x + clampedDetectedBox.width <= video.videoWidth - framePaddingX &&
    clampedDetectedBox.y + clampedDetectedBox.height <= video.videoHeight - framePaddingY;

  const nearAligned =
    faceCoverage >= 0.07 &&
    faceCoverage <= 0.33 &&
    insideFrameBounds &&
    centerOffsetX <= 0.12 &&
    centerOffsetY <= 0.14;

  const locked =
    faceCoverage >= 0.11 &&
    faceCoverage <= 0.26 &&
    insideFrameBounds &&
    centerOffsetX <= 0.08 &&
    centerOffsetY <= 0.1;

  const alignmentState: FaceAlignmentState = locked ? 'locked' : nearAligned ? 'near' : 'off';

  const wellFramed =
    faceCoverage >= 0.06 &&
    faceCoverage <= 0.38 &&
    insideFrameBounds &&
    centerOffsetX <= 0.16 &&
    centerOffsetY <= 0.18;

  return {
    faceCoverage,
    guideCoverage: insideFrameBounds ? 1 : 0,
    centerOffsetX,
    centerOffsetY,
    alignmentState,
    locked,
    wellFramed,
  };
}

export function getLowConfidenceGuidance(options: {
  similarity: number;
  brightness: number;
  faceCoverage: number;
}) {
  if (options.faceCoverage < 0.16) return 'Dekatkan wajah ke kamera.';
  if (options.brightness < 0.32) return 'Cari tempat yang lebih terang.';
  if (options.similarity < 0.55) return 'Hadapkan wajah lurus ke kamera lalu tahan beberapa detik.';
  return 'Tahan wajah tetap dan pastikan seluruh wajah terlihat jelas.';
}

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
