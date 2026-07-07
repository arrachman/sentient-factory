// HR Attendance — /api/hr/attendance/*
// Endpoints return raw payloads (no { data } envelope). Shapes are pragmatic;
// dashboard/history payloads are rich and partly dynamic, so they are typed
// loosely and rendered defensively in the pages.
import { apiGet, apiPost } from './client';

// ─── Dashboard ──────────────────────────────────────────────────────────────

export interface AttendanceDashboardSummary {
  totalEmployees?: number;
  activeWorksites?: number;
  enrolledEmployees?: number;
  clockedInToday?: number;
  pendingReviews?: number;
  [key: string]: unknown;
}

export interface AttendanceDashboardPayload {
  summary?: AttendanceDashboardSummary;
  [key: string]: unknown;
}

export async function getAttendanceDashboard(): Promise<AttendanceDashboardPayload> {
  return apiGet<AttendanceDashboardPayload>('/hr/attendance/dashboard');
}

// ─── Personal / current user ──────────────────────────────────────────────────

export async function getAttendanceMe(): Promise<Record<string, unknown>> {
  return apiGet('/hr/attendance/me');
}

// ─── History ────────────────────────────────────────────────────────────────

export interface AttendanceHistoryQuery {
  page?: number;
  limit?: number;
  userId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendanceHistoryPayload {
  data?: unknown[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
  [key: string]: unknown;
}

export async function getAttendanceHistory(
  query?: AttendanceHistoryQuery,
): Promise<AttendanceHistoryPayload> {
  return apiGet<AttendanceHistoryPayload>(
    '/hr/attendance/history',
    query as Record<string, string | number | undefined>,
  );
}

// ─── Clock / verification (used by kiosk / personal portal) ─────────────────

export interface ClockPayload {
  latitude: number;
  longitude: number;
  faceScore?: number;
  livenessScore?: number;
  reasonCode?: string;
  snapshotDataUrl?: string;
  faceEmbedding?: number[];
  faceDetectionCount?: number;
  faceDetectionMode?: string;
  deviceInfo?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function clockIn(payload: ClockPayload): Promise<Record<string, unknown>> {
  return apiPost('/hr/attendance/clock-in', payload);
}

export async function clockOut(payload: ClockPayload): Promise<Record<string, unknown>> {
  return apiPost('/hr/attendance/clock-out', payload);
}

export async function identifyFace(
  payload: { faceEmbedding: number[] },
): Promise<Record<string, unknown>> {
  return apiPost('/hr/attendance/face-identify', payload);
}

export async function reportAttendanceFailure(
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return apiPost('/hr/attendance/report-failure', payload);
}
