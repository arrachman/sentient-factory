// ERP Item Permission resource API — CRUD for md_item_permissions
// Pivot table: itemId × roleId × {canView, canSell, canBuy}
import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export interface ErpItemPermission {
  id: string;
  itemId: string;
  roleId: string;
  canView: boolean;
  canSell: boolean;
  canBuy: boolean;
  /** Populated by API join */
  itemName?: string;
  itemCode?: string;
  roleName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateErpItemPermissionPayload {
  itemId: string;
  roleId: string;
  canView?: boolean;
  canSell?: boolean;
  canBuy?: boolean;
}

export type UpdateErpItemPermissionPayload = Partial<Omit<CreateErpItemPermissionPayload, 'itemId' | 'roleId'>> & {
  canView?: boolean;
  canSell?: boolean;
  canBuy?: boolean;
};

const BASE = '/item-permissions';

export async function listItemPermissions(params?: PaginationParams): Promise<PaginatedResponse<ErpItemPermission>> {
  return apiGet<PaginatedResponse<ErpItemPermission>>(BASE, params as Record<string, string | number | boolean | undefined>);
}

export async function createErpItemPermission(payload: CreateErpItemPermissionPayload): Promise<ErpItemPermission> {
  const res = await apiPost<ApiResponse<ErpItemPermission>>(BASE, payload);
  return res.data;
}

export async function updateErpItemPermission(id: string, payload: UpdateErpItemPermissionPayload): Promise<ErpItemPermission> {
  const res = await apiPatch<ApiResponse<ErpItemPermission>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteErpItemPermission(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}
