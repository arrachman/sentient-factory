/**
 * HR-UI-specific TypeScript types.
 * Types yang dipakai oleh HrAttendancePageView dan utilitas pendukungnya.
 * Types umum (ApiEnvelope, WorksiteRow, dll.) ada di ./types.ts.
 */

import type { AssignedWorksiteRow } from './types';

export type AttendanceMePayload = {
  profile: {
    hrUserId: number;
    appUserId: number;
    employeeCode: string | null;
    faceEnrollmentStatus: string;
    employeeRoleType: string;
    username: string;
    fullName: string | null;
    defaultWorksiteName: string | null;
    defaultWorksiteCode: string | null;
    defaultWorksiteRadiusMeters: number | null;
    assignedWorksites: AssignedWorksiteRow[];
  } | null;
  today: {
    id: number;
    work_date: string;
    clock_in_at: string | null;
    clock_out_at: string | null;
    clock_in_status: string | null;
    clock_out_status: string | null;
    total_work_minutes: number | null;
    clock_in_worksite_name: string | null;
    clock_out_worksite_name: string | null;
  } | null;
  recentEvents: Array<{
    id: number;
    event_type: string;
    event_at: string;
    result: string;
    reason_code: string | null;
    snapshot_url: string | null;
  }>;
  message?: string;
  settings?: {
    autoSubmitEnabled?: boolean;
    autoSubmitConfidenceThreshold?: number;
    faceIdentifyConfidenceThreshold?: number;
    faceVerifyConfidenceThreshold?: number;
  };
};

export type AttendanceHistoryPayload = {
  data: Array<{
    id: number;
    work_date: string;
    clock_in_at: string | null;
    clock_out_at: string | null;
    clock_in_status: string | null;
    clock_out_status: string | null;
    total_work_minutes: number | null;
    clock_in_worksite_name: string | null;
    clock_out_worksite_name: string | null;
    username: string;
    full_name: string | null;
  }>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DashboardPayload = {
  mode: 'self' | 'admin';
  summary: any;
  profile?: AttendanceMePayload['profile'];
  today?: AttendanceMePayload['today'];
  recentEvents?: AttendanceMePayload['recentEvents'];
  message?: string;
  qualityOverview?: any;
  reviewOverview?: any;
  productivityOverview?: any;
  history?: AttendanceHistoryPayload['data'];
  historyMeta?: AttendanceHistoryPayload['meta'];
  recentSessions?: Array<any>;
  exceptionEvents?: Array<any>;
  settings?: {
    autoSubmitEnabled?: boolean;
    autoSubmitConfidenceThreshold?: number;
    faceIdentifyConfidenceThreshold?: number;
    faceVerifyConfidenceThreshold?: number;
  };
};

export type WorksitesPayload = {
  data: import('./types').WorksiteRow[];
};

export type FaceEnrollmentManagementRow = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  faceTemplateVersion: number;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
  activeEnrollmentId: number | null;
  snapshotUrl: string | null;
  qualityScore: number | null;
  enrolledAt: string | null;
  registeredByUsername: string | null;
  registeredByFullName: string | null;
};

export type AttendanceLogItem = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  status: string;
  filterGroup: 'needs_review' | 'success' | 'rejected';
  tone: 'default' | 'warning' | 'danger';
  href: string;
  typeLabel: string;
  rawDate: string;
  snapshotUrl?: string | null;
  reviewHref?: string | null;
  historyHref?: string | null;
  detailRows: Array<{ label: string; value: string }>;
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

export type AttendanceActionMode = 'enroll' | 'clockIn' | 'clockOut';

export type FaceIdentifyPayload = {
  matched: boolean;
  threshold: number;
  currentUserHrId: number;
  currentUserAppId: number;
  candidate: {
    hrUserId: number;
    appUserId: number;
    employeeCode: string | null;
    username: string;
    fullName: string | null;
    similarity: number;
    isCurrentUser: boolean;
  } | null;
  topMatches: Array<{
    hrUserId: number;
    appUserId: number;
    employeeCode: string | null;
    username: string;
    fullName: string | null;
    similarity: number;
    isCurrentUser: boolean;
  }>;
};

export type ClientAttendanceError = Error & {
  reasonCode?: string;
};

export type FaceBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FaceLivenessMetrics = {
  leftBlink: number;
  rightBlink: number;
  avgBlink: number;
};

export type RuntimeFaceDetectionResult = {
  boundingBox: FaceBoundingBox;
  liveness: FaceLivenessMetrics;
};

export type RuntimeFaceDetector = {
  estimateFaces: (input: HTMLVideoElement) => Promise<RuntimeFaceDetectionResult[]>;
};

export type FaceCaptureAnalysis = {
  embedding: number[];
  brightness: number;
  faceCoverage: number;
  guideCoverage: number;
  centerOffsetX: number;
  centerOffsetY: number;
  wellFramed: boolean;
};

export type FaceAlignmentState = 'idle' | 'off' | 'near' | 'locked';

export type SuccessReviewState = {
  mode: AttendanceActionMode;
  snapshotDataUrl: string | null;
  recordedAt: string;
  employeeName: string;
  actionLabel: string;
};

export type GeofenceSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};
