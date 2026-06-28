// HR Attendance Reviews — /api/hr/attendance-reviews
import { apiGet, apiPost } from './client';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs_clarification';
export type ReviewAction = 'approve' | 'reject' | 'request-clarification' | 'reopen';

export interface AttendanceReviewQuery {
  page?: number;
  limit?: number;
  reviewStatus?: ReviewStatus;
  reasonCode?: string;
  search?: string;
}

export interface AttendanceReviewListPayload {
  data?: unknown[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
  [key: string]: unknown;
}

export async function listAttendanceReviews(
  query?: AttendanceReviewQuery,
): Promise<AttendanceReviewListPayload> {
  return apiGet<AttendanceReviewListPayload>(
    '/hr/attendance-reviews',
    query as Record<string, string | number | undefined>,
  );
}

export async function getAttendanceReviewDetail(
  eventId: string,
): Promise<Record<string, unknown>> {
  return apiGet(`/hr/attendance-reviews/${eventId}`);
}

/** Map a review action to its backend POST endpoint and apply it with an optional note. */
export async function applyAttendanceReviewAction(
  eventId: string,
  action: ReviewAction,
  note?: string,
): Promise<Record<string, unknown>> {
  return apiPost(`/hr/attendance-reviews/${eventId}/${action}`, { note });
}
