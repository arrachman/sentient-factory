// TanStack Query hooks + query-key factory for Senti HR.
// Keys are namespaced under ['hr', …] to avoid cross-app cache collisions.
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getMe } from './auth';
import type { HrAuthUser } from './auth';
import { getAttendanceDashboard } from './attendance';
import type { AttendanceDashboardPayload, AttendanceHistoryQuery } from './attendance';
import { getAttendanceHistory } from './attendance';
import type { AttendanceHistoryPayload } from './attendance';
import { listWorksites } from './worksites';
import type { HrWorksite } from './worksites';
import { listAttendanceReviews } from './attendance-reviews';
import type { AttendanceReviewQuery, AttendanceReviewListPayload } from './attendance-reviews';
import { listFaceEnrollments } from './face-enrollments';
import type { FaceEnrollment } from './face-enrollments';
import { listEmployees } from './employees';
import type { HrEmployee } from './employees';
import { listTimesheets } from './timesheets';
import type { TimesheetQuery, TimesheetPayload } from './timesheets';
import { listLeaveTypes, listLeaveRequests } from './leave';
import type { LeaveType, LeaveRequestQuery, LeaveRequestPayload } from './leave';

const STABLE_STALE_TIME = 5 * 60 * 1000;

export const hrQueryKeys = {
  me: ['hr', 'me'] as const,
  dashboard: ['hr', 'attendance', 'dashboard'] as const,
  history: (q?: AttendanceHistoryQuery) => ['hr', 'attendance', 'history', q ?? {}] as const,
  worksites: (q?: object) => ['hr', 'worksites', q ?? {}] as const,
  reviews: (q?: AttendanceReviewQuery) => ['hr', 'attendance-reviews', q ?? {}] as const,
  faceEnrollments: ['hr', 'face-enrollments'] as const,
  employees: ['hr', 'employees'] as const,
  timesheets: (q?: TimesheetQuery) => ['hr', 'timesheets', q ?? {}] as const,
  leaveTypes: ['hr', 'leave', 'types'] as const,
  leaveRequests: (q?: LeaveRequestQuery) => ['hr', 'leave', 'requests', q ?? {}] as const,
} as const;

/** Normalize an array-or-{data} payload into a plain array. */
export function asArray<T>(payload: T[] | { data?: T[] } | undefined | null): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
}

export function useHrMe(options?: Partial<UseQueryOptions<HrAuthUser>>) {
  return useQuery<HrAuthUser>({
    queryKey: hrQueryKeys.me,
    queryFn: getMe,
    staleTime: STABLE_STALE_TIME,
    retry: false,
    ...options,
  });
}

export function useAttendanceDashboard(
  options?: Partial<UseQueryOptions<AttendanceDashboardPayload>>,
) {
  return useQuery<AttendanceDashboardPayload>({
    queryKey: hrQueryKeys.dashboard,
    queryFn: getAttendanceDashboard,
    ...options,
  });
}

export function useAttendanceHistory(
  query?: AttendanceHistoryQuery,
  options?: Partial<UseQueryOptions<AttendanceHistoryPayload>>,
) {
  return useQuery<AttendanceHistoryPayload>({
    queryKey: hrQueryKeys.history(query),
    queryFn: () => getAttendanceHistory(query),
    ...options,
  });
}

export function useWorksites(query?: { search?: string }) {
  return useQuery<HrWorksite[]>({
    queryKey: hrQueryKeys.worksites(query),
    queryFn: async () => asArray<HrWorksite>(await listWorksites(query)),
  });
}

export function useAttendanceReviews(query?: AttendanceReviewQuery) {
  return useQuery<AttendanceReviewListPayload>({
    queryKey: hrQueryKeys.reviews(query),
    queryFn: () => listAttendanceReviews(query),
  });
}

export function useFaceEnrollments() {
  return useQuery<FaceEnrollment[]>({
    queryKey: hrQueryKeys.faceEnrollments,
    queryFn: async () => asArray<FaceEnrollment>(await listFaceEnrollments()),
  });
}

export function useEmployees() {
  return useQuery<HrEmployee[]>({
    queryKey: hrQueryKeys.employees,
    queryFn: async () => asArray<HrEmployee>(await listEmployees()),
  });
}

export function useTimesheets(query?: TimesheetQuery) {
  return useQuery<TimesheetPayload>({
    queryKey: hrQueryKeys.timesheets(query),
    queryFn: () => listTimesheets(query),
  });
}

export function useLeaveTypes() {
  return useQuery<LeaveType[]>({
    queryKey: hrQueryKeys.leaveTypes,
    queryFn: async () => asArray<LeaveType>(await listLeaveTypes()),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useLeaveRequests(query?: LeaveRequestQuery) {
  return useQuery<LeaveRequestPayload>({
    queryKey: hrQueryKeys.leaveRequests(query),
    queryFn: () => listLeaveRequests(query),
  });
}
