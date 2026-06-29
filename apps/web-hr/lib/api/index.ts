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

export { hrQueryKeys, asArray } from './hooks';
