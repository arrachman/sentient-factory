/**
 * Tipe spesifik untuk Attendance Reviews (list + detail).
 */

export type AttendanceReviewHistoryEntry = {
  id: number;
  previousStatus: string | null;
  nextStatus: string;
  note: string | null;
  createdAt: string;
  actorUsername: string | null;
  actorFullName: string | null;
  metadataJson: Record<string, unknown> | null;
};

export type AttendanceReviewRow = {
  id: number;
  event_type: string;
  event_at: string;
  result: string;
  reason_code: string | null;
  reviewStatus: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  snapshotUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  metadataJson: Record<string, unknown> | null;
  work_date: string | null;
  clockInStatus: string | null;
  clockOutStatus: string | null;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
};

export type AttendanceReviewDetail = AttendanceReviewRow & {
  sessionId: number | null;
  clockInAt: string | null;
  clockOutAt: string | null;
  faceScore: number | null;
  livenessScore: number | null;
  deviceInfo: Record<string, unknown> | null;
  defaultWorksiteCode: string | null;
  defaultWorksiteRadiusMeters: number | null;
  reviewedByUsername: string | null;
  reviewedByFullName: string | null;
  reviewHistory: AttendanceReviewHistoryEntry[];
};
