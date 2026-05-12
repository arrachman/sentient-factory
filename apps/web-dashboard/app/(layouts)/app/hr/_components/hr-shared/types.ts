/**
 * Shared types untuk HR module.
 * Dipakai oleh semua page-view (history, worksites, reviews, dashboard, dll).
 */

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  meta?: ApiMeta;
};

export type AssignedWorksiteRow = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

export type WorksiteRow = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
};

export type AttendanceUserOption = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
};
