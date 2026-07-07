// HR Employees (attendance users) — /api/hr/users
import { apiGet, apiPut } from './client';

export interface HrEmployee {
  appUserId: string;
  name: string;
  username?: string;
  employeeCode?: string | null;
  faceEnrollmentStatus?: string;
  defaultWorksiteId?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
}

export async function listEmployees(): Promise<HrEmployee[] | { data: HrEmployee[] }> {
  return apiGet('/hr/users');
}

export async function getUserWorksites(
  appUserId: string,
): Promise<Record<string, unknown>> {
  return apiGet(`/hr/users/${appUserId}/worksites`);
}

export async function updateUserWorksites(
  appUserId: string,
  payload: { worksiteIds: number[]; defaultWorksiteId?: number | null },
): Promise<Record<string, unknown>> {
  return apiPut(`/hr/users/${appUserId}/worksites`, payload);
}
