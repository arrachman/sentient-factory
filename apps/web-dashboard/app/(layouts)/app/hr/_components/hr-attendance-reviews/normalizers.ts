/**
 * Normalizer untuk payload Attendance Reviews dari API.
 */
import { normalizeNumericValue } from '../hr-shared';
import type {
  AttendanceReviewDetail,
  AttendanceReviewRow,
} from './types';

export function normalizeAttendanceReviewRow(
  row: Record<string, unknown>,
): AttendanceReviewRow {
  return {
    id: Number(row.id ?? 0),
    event_type: String(row.event_type ?? ''),
    event_at: String(row.event_at ?? ''),
    result: String(row.result ?? ''),
    reason_code: typeof row.reason_code === 'string' ? row.reason_code : null,
    reviewStatus:
      typeof row.reviewStatus === 'string' ? row.reviewStatus : null,
    reviewedAt: typeof row.reviewedAt === 'string' ? row.reviewedAt : null,
    reviewNote: typeof row.reviewNote === 'string' ? row.reviewNote : null,
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    latitude: row.latitude == null ? null : normalizeNumericValue(row.latitude),
    longitude:
      row.longitude == null ? null : normalizeNumericValue(row.longitude),
    metadataJson:
      row.metadataJson && typeof row.metadataJson === 'object'
        ? (row.metadataJson as Record<string, unknown>)
        : null,
    work_date: typeof row.work_date === 'string' ? row.work_date : null,
    clockInStatus:
      typeof row.clockInStatus === 'string' ? row.clockInStatus : null,
    clockOutStatus:
      typeof row.clockOutStatus === 'string' ? row.clockOutStatus : null,
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName:
      typeof row.defaultWorksiteName === 'string'
        ? row.defaultWorksiteName
        : null,
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
      row.livenessScore == null
        ? null
        : normalizeNumericValue(row.livenessScore),
    deviceInfo:
      row.deviceInfo && typeof row.deviceInfo === 'object'
        ? (row.deviceInfo as Record<string, unknown>)
        : null,
    defaultWorksiteCode:
      typeof row.defaultWorksiteCode === 'string'
        ? row.defaultWorksiteCode
        : null,
    defaultWorksiteRadiusMeters:
      row.defaultWorksiteRadiusMeters == null
        ? null
        : normalizeNumericValue(row.defaultWorksiteRadiusMeters),
    reviewedByUsername:
      typeof row.reviewedByUsername === 'string'
        ? row.reviewedByUsername
        : null,
    reviewedByFullName:
      typeof row.reviewedByFullName === 'string'
        ? row.reviewedByFullName
        : null,
    reviewHistory: Array.isArray(row.reviewHistory)
      ? row.reviewHistory
          .filter(
            (entry): entry is Record<string, unknown> =>
              Boolean(entry && typeof entry === 'object'),
          )
          .map((entry) => ({
            id: Number(entry.id ?? 0),
            previousStatus:
              typeof entry.previousStatus === 'string'
                ? entry.previousStatus
                : null,
            nextStatus: String(entry.nextStatus ?? ''),
            note: typeof entry.note === 'string' ? entry.note : null,
            createdAt: String(entry.createdAt ?? ''),
            actorUsername:
              typeof entry.actorUsername === 'string'
                ? entry.actorUsername
                : null,
            actorFullName:
              typeof entry.actorFullName === 'string'
                ? entry.actorFullName
                : null,
            metadataJson:
              entry.metadataJson && typeof entry.metadataJson === 'object'
                ? (entry.metadataJson as Record<string, unknown>)
                : null,
          }))
      : [],
  };
}
