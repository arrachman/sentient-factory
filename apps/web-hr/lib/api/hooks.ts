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
import { listShifts, listShiftAssignments } from './schedules';
import type { HrShift, HrShiftAssignment, ShiftAssignmentQuery } from './schedules';
import { listProjects, listProjectTime } from './projects';
import type { HrProject, ProjectTimeQuery, ProjectTimePayload } from './projects';
import { listReportCatalog, getReport } from './reports';
import type { HrReportCatalogItem, HrReportDataset, HrReportFilters } from './reports';
import { listKioskRoster } from './kiosk';
import type { KioskRosterEntry } from './kiosk';
import { listHolidays } from './holidays';
import type { HrHoliday, HolidayQuery } from './holidays';
import { getOvertimePolicy } from './policy';
import type { OvertimePolicy } from './policy';
import { listRoles } from './roles';
import type { HrRole } from './roles';

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
  shifts: ['hr', 'shifts'] as const,
  shiftAssignments: (q?: ShiftAssignmentQuery) => ['hr', 'shift-assignments', q ?? {}] as const,
  projects: ['hr', 'projects'] as const,
  projectTime: (q?: ProjectTimeQuery) => ['hr', 'project-time', q ?? {}] as const,
  reportCatalog: ['hr', 'reports', 'catalog'] as const,
  report: (key: string, f?: HrReportFilters) => ['hr', 'reports', key, f ?? {}] as const,
  kioskRoster: ['hr', 'kiosk', 'roster'] as const,
  holidays: (q?: HolidayQuery) => ['hr', 'holidays', q ?? {}] as const,
  overtimePolicy: ['hr', 'policy', 'overtime'] as const,
  roles: ['hr', 'roles'] as const,
  userRoles: (appUserId: string) => ['hr', 'user-roles', appUserId] as const,
} as const;

/** Unwrap a {data} envelope or pass through a bare value. */
function unwrap<T>(payload: T | { data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

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

export function useShifts() {
  return useQuery<HrShift[]>({
    queryKey: hrQueryKeys.shifts,
    queryFn: async () => asArray<HrShift>(await listShifts()),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useShiftAssignments(query?: ShiftAssignmentQuery) {
  return useQuery<HrShiftAssignment[]>({
    queryKey: hrQueryKeys.shiftAssignments(query),
    queryFn: async () => asArray<HrShiftAssignment>(await listShiftAssignments(query)),
  });
}

export function useProjects() {
  return useQuery<HrProject[]>({
    queryKey: hrQueryKeys.projects,
    queryFn: async () => asArray<HrProject>(await listProjects()),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useProjectTime(query?: ProjectTimeQuery) {
  return useQuery<ProjectTimePayload>({
    queryKey: hrQueryKeys.projectTime(query),
    queryFn: () => listProjectTime(query),
  });
}

export function useReportCatalog() {
  return useQuery<HrReportCatalogItem[]>({
    queryKey: hrQueryKeys.reportCatalog,
    queryFn: async () => asArray<HrReportCatalogItem>(await listReportCatalog()),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useReport(
  key: string | null,
  filters?: HrReportFilters,
  options?: Partial<UseQueryOptions<HrReportDataset>>,
) {
  return useQuery<HrReportDataset>({
    queryKey: hrQueryKeys.report(key ?? '', filters),
    queryFn: async () => unwrap<HrReportDataset>(await getReport(key as string, filters)),
    enabled: Boolean(key),
    ...options,
  });
}

export function useKioskRoster() {
  return useQuery<KioskRosterEntry[]>({
    queryKey: hrQueryKeys.kioskRoster,
    queryFn: async () => asArray<KioskRosterEntry>(await listKioskRoster()),
  });
}

export function useHolidays(query?: HolidayQuery) {
  return useQuery<HrHoliday[]>({
    queryKey: hrQueryKeys.holidays(query),
    queryFn: async () => asArray<HrHoliday>(await listHolidays(query)),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useOvertimePolicy() {
  return useQuery<OvertimePolicy>({
    queryKey: hrQueryKeys.overtimePolicy,
    queryFn: async () => unwrap<OvertimePolicy>(await getOvertimePolicy()),
    staleTime: STABLE_STALE_TIME,
  });
}

export function useRoles() {
  return useQuery<HrRole[]>({
    queryKey: hrQueryKeys.roles,
    queryFn: async () => asArray<HrRole>(await listRoles()),
    staleTime: STABLE_STALE_TIME,
  });
}
