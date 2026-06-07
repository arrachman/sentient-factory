import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export const CREATION_STATUSES = ['DRAFT', 'NEED_APPROVE', 'APPROVED'] as const;
export type CreationStatus = (typeof CREATION_STATUSES)[number];

export interface ErpRoleDocPolicy {
  id: string;
  roleId: string;
  documentType: string;
  allowedStatuses: CreationStatus[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDocPolicyPayload {
  roleId: string;
  documentType: string;
  allowedStatuses: CreationStatus[];
  isActive?: boolean;
}

export type UpdateRoleDocPolicyPayload = Partial<CreateRoleDocPolicyPayload>;

// ─── My allowed statuses (used by transaction forms) ─────────────────────────

export async function getMyAllowedStatuses(documentType: string): Promise<CreationStatus[]> {
  const res = await apiGet<ApiResponse<CreationStatus[]>>(
    '/role-doc-policies/my-allowed-statuses',
    { documentType },
  );
  return res.data;
}

// ─── CRUD (admin only) ────────────────────────────────────────────────────────

export interface RoleDocPolicyQueryParams extends PaginationParams {
  roleId?: string;
  documentType?: string;
}

export async function listRoleDocPolicies(
  params?: RoleDocPolicyQueryParams,
): Promise<PaginatedResponse<ErpRoleDocPolicy>> {
  return apiGet<PaginatedResponse<ErpRoleDocPolicy>>(
    '/role-doc-policies',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createRoleDocPolicy(
  payload: CreateRoleDocPolicyPayload,
): Promise<ErpRoleDocPolicy> {
  const res = await apiPost<ApiResponse<ErpRoleDocPolicy>>('/role-doc-policies', payload);
  return res.data;
}

export async function updateRoleDocPolicy(
  id: string,
  payload: UpdateRoleDocPolicyPayload,
): Promise<ErpRoleDocPolicy> {
  const res = await apiPatch<ApiResponse<ErpRoleDocPolicy>>(`/role-doc-policies/${id}`, payload);
  return res.data;
}

export async function deleteRoleDocPolicy(id: string): Promise<void> {
  await apiDelete<void>(`/role-doc-policies/${id}`);
}
