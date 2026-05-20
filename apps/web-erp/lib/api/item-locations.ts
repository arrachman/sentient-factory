// ERP Item Location resource API — CRUD for md_item_locations
import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export interface ErpItemLocation {
  id: string;
  code: string;
  name: string;
  warehouseId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateErpItemLocationPayload {
  code: string;
  name: string;
  warehouseId?: string;
  isActive?: boolean;
}

export type UpdateErpItemLocationPayload = Partial<CreateErpItemLocationPayload>;

const BASE = '/item-locations';

export async function listItemLocations(params?: PaginationParams): Promise<PaginatedResponse<ErpItemLocation>> {
  return apiGet<PaginatedResponse<ErpItemLocation>>(BASE, params as Record<string, string | number | boolean | undefined>);
}

export async function createErpItemLocation(payload: CreateErpItemLocationPayload): Promise<ErpItemLocation> {
  const res = await apiPost<ApiResponse<ErpItemLocation>>(BASE, payload);
  return res.data;
}

export async function updateErpItemLocation(id: string, payload: UpdateErpItemLocationPayload): Promise<ErpItemLocation> {
  const res = await apiPatch<ApiResponse<ErpItemLocation>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteErpItemLocation(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}

export async function bulkUpdateErpItemLocationStatus(ids: string[], isActive: boolean): Promise<{ affected: number }> {
  const res = await apiPatch<{ success: boolean; affected: number }>(`${BASE}/bulk/status`, { ids, isActive });
  return { affected: res.affected };
}

export async function bulkDeleteErpItemLocations(ids: string[]): Promise<{ affected: number }> {
  const res = await apiDelete<{ success: boolean; affected: number }>(`${BASE}/bulk`, { ids });
  return { affected: res.affected };
}
