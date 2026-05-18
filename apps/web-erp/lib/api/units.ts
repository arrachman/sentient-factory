// ERP Unit of Measure resource API — CRUD for md_units
// Endpoints: /units

import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErpUnit {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitPayload {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface UpdateUnitPayload {
  code?: string;
  name?: string;
  isActive?: boolean;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listUnits(
  params?: PaginationParams,
): Promise<PaginatedResponse<ErpUnit>> {
  return apiGet<PaginatedResponse<ErpUnit>>('/units', params as Record<string, string | number | boolean | undefined>);
}

export async function createUnit(
  payload: CreateUnitPayload,
): Promise<ErpUnit> {
  const res = await apiPost<ApiResponse<ErpUnit>>('/units', payload);
  return res.data;
}

export async function updateUnit(
  id: string,
  payload: UpdateUnitPayload,
): Promise<ErpUnit> {
  const res = await apiPatch<ApiResponse<ErpUnit>>(`/units/${id}`, payload);
  return res.data;
}

export async function deleteUnit(id: string): Promise<void> {
  await apiDelete<void>(`/units/${id}`);
}
