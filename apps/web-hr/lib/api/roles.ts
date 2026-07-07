// HR Roles / RBAC — /api/hr/roles + /api/hr/users/:appUserId/roles
import { apiGet, apiPost, apiPatch, apiDelete, apiPut } from './client';

export interface HrRole {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  memberCount?: number;
}

export interface HrRoleRef {
  id: string;
  code: string;
  name: string;
}

export interface UserRoles {
  appUserId: number;
  hrUserId: number;
  roles: HrRoleRef[];
}

export interface CreateRolePayload {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateRolePayload = Partial<Omit<CreateRolePayload, 'code'>> & { code?: string };

export async function listRoles(): Promise<{ data?: HrRole[] } | HrRole[]> {
  return apiGet('/hr/roles');
}

export async function createRole(payload: CreateRolePayload): Promise<Record<string, unknown>> {
  return apiPost('/hr/roles', payload);
}

export async function updateRole(
  id: string,
  payload: UpdateRolePayload,
): Promise<Record<string, unknown>> {
  return apiPatch(`/hr/roles/${id}`, payload);
}

export async function deleteRole(id: string): Promise<Record<string, unknown>> {
  return apiDelete(`/hr/roles/${id}`);
}

export async function getUserRoles(appUserId: string): Promise<{ data: UserRoles } | UserRoles> {
  return apiGet(`/hr/users/${appUserId}/roles`);
}

export async function setUserRoles(
  appUserId: string,
  roleIds: number[],
): Promise<{ data: UserRoles } | UserRoles> {
  return apiPut(`/hr/users/${appUserId}/roles`, { roleIds });
}
