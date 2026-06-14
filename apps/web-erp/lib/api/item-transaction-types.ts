// ERP Item Transaction Type resource API — CRUD for md_item_transaction_types
import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export interface ErpItemTransactionType {
  id: string;
  code: string;
  name: string;
  direction?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateErpItemTransactionTypePayload {
  code: string;
  name: string;
  direction?: string;
  isActive?: boolean;
}

export type UpdateErpItemTransactionTypePayload = Partial<CreateErpItemTransactionTypePayload>;

const BASE = '/item-transaction-types';

export async function listItemTransactionTypes(params?: PaginationParams): Promise<PaginatedResponse<ErpItemTransactionType>> {
  return apiGet<PaginatedResponse<ErpItemTransactionType>>(BASE, params as Record<string, string | number | boolean | undefined>);
}

export async function createErpItemTransactionType(payload: CreateErpItemTransactionTypePayload): Promise<ErpItemTransactionType> {
  const res = await apiPost<ApiResponse<ErpItemTransactionType>>(BASE, payload);
  return res.data;
}

export async function updateErpItemTransactionType(id: string, payload: UpdateErpItemTransactionTypePayload): Promise<ErpItemTransactionType> {
  const res = await apiPatch<ApiResponse<ErpItemTransactionType>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteErpItemTransactionType(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}

export async function bulkUpdateErpItemTransactionTypeStatus(ids: string[], isActive: boolean): Promise<{ affected: number }> {
  const res = await apiPatch<{ success: boolean; affected: number }>(`${BASE}/bulk/status`, { ids, isActive });
  return { affected: res.affected };
}

export async function bulkDeleteErpItemTransactionTypes(ids: string[]): Promise<{ affected: number }> {
  const res = await apiDelete<{ success: boolean; affected: number }>(`${BASE}/bulk`, { ids });
  return { affected: res.affected };
}
