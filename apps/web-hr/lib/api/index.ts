// Senti HR API client — public surface barrel.
export type {
  ApiError,
  ApiResponse,
  PaginatedMeta,
  PaginatedResponse,
  PaginationParams,
} from './types';

export {
  HrApiError,
  apiGet,
  apiPost,
  apiPatch,
  apiPut,
  apiDelete,
  apiUpload,
  downloadFile,
  buildApiUrl,
} from './client';

export type { HrAuthUser } from './auth';
export { getMe } from './auth';

export type {
  HrWorksite,
  CreateWorksitePayload,
  UpdateWorksitePayload,
  WorksiteQuery,
} from './worksites';
export {
  listWorksites,
  createWorksite,
  updateWorksite,
  deleteWorksite,
} from './worksites';

export type {
  AttendanceDashboardPayload,
  AttendanceDashboardSummary,
  AttendanceHistoryPayload,
  AttendanceHistoryQuery,
  ClockPayload,
} from './attendance';
export {
  getAttendanceDashboard,
  getAttendanceMe,
  getAttendanceHistory,
  clockIn,
  clockOut,
  identifyFace,
  reportAttendanceFailure,
} from './attendance';

export type {
  ReviewStatus,
  ReviewAction,
  AttendanceReviewQuery,
  AttendanceReviewListPayload,
} from './attendance-reviews';
export {
  listAttendanceReviews,
  getAttendanceReviewDetail,
  applyAttendanceReviewAction,
} from './attendance-reviews';

export type { HrEmployee } from './employees';
export { listEmployees, getUserWorksites, updateUserWorksites } from './employees';

export type { FaceEnrollment } from './face-enrollments';
export {
  listFaceEnrollments,
  faceEnrollmentSnapshotUrl,
  attendanceEventSnapshotUrl,
} from './face-enrollments';

export type {
  HrShift,
  CreateShiftPayload,
  UpdateShiftPayload,
  HrShiftAssignment,
  ShiftAssignmentQuery,
  CreateShiftAssignmentPayload,
} from './schedules';
export {
  listShifts,
  createShift,
  updateShift,
  deleteShift,
  listShiftAssignments,
  createShiftAssignment,
  deleteShiftAssignment,
} from './schedules';

export type {
  HrProject,
  CreateProjectPayload,
  UpdateProjectPayload,
  HrProjectTimeEntry,
  ProjectTimeQuery,
  ProjectTimePayload,
  CreateProjectTimePayload,
} from './projects';
export {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  listProjectTime,
  createProjectTime,
  deleteProjectTime,
} from './projects';

export type {
  HrReportColType,
  HrReportColumn,
  HrReportSummaryItem,
  HrReportCatalogItem,
  HrReportDataset,
  HrReportFilters,
  HrReportFormat,
} from './reports';
export { listReportCatalog, getReport, downloadReport } from './reports';

export type {
  KioskRosterEntry,
  KioskAction,
  KioskClockPayload,
  KioskClockResult,
} from './kiosk';
export { listKioskRoster, kioskClock, setKioskPin, clearKioskPin } from './kiosk';

export type {
  HrHoliday,
  HolidayQuery,
  CreateHolidayPayload,
  UpdateHolidayPayload,
} from './holidays';
export { listHolidays, createHoliday, updateHoliday, deleteHoliday } from './holidays';

export type { OvertimePolicy, UpdateOvertimePolicyPayload } from './policy';
export { getOvertimePolicy, updateOvertimePolicy } from './policy';

export type {
  HrUserPreferences,
  HrUserPreferencesMetadata,
  UpdateHrUserPreferencesInput,
} from './user-preferences';
export { getMyPreferences, updateMyPreferences } from './user-preferences';

export type {
  HrRole,
  HrRoleRef,
  UserRoles,
  CreateRolePayload,
  UpdateRolePayload,
} from './roles';
export {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  getUserRoles,
  setUserRoles,
} from './roles';

export { hrQueryKeys, asArray } from './hooks';
