// ERP Item Category resource API — CRUD for md_item_categories
// Endpoints: /item-categories

import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErpItemCategory {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  inventoryAccountId?: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: { id: string; name: string } | null;
}

export interface CreateItemCategoryPayload {
  code: string;
  name: string;
  parentId?: string | null;
  inventoryAccountId?: string | null;
}

export interface UpdateItemCategoryPayload {
  code?: string;
  name?: string;
  parentId?: string | null;
  inventoryAccountId?: string | null;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listItemCategories(
  params?: PaginationParams,
): Promise<PaginatedResponse<ErpItemCategory>> {
  return apiGet<PaginatedResponse<ErpItemCategory>>('/item-categories', params as Record<string, string | number | boolean | undefined>);
}

export async function createItemCategory(
  payload: CreateItemCategoryPayload,
): Promise<ErpItemCategory> {
  const res = await apiPost<ApiResponse<ErpItemCategory>>('/item-categories', payload);
  return res.data;
}

export async function updateItemCategory(
  id: string,
  payload: UpdateItemCategoryPayload,
): Promise<ErpItemCategory> {
  const res = await apiPatch<ApiResponse<ErpItemCategory>>(`/item-categories/${id}`, payload);
  return res.data;
}

export async function deleteItemCategory(id: string): Promise<void> {
  await apiDelete<void>(`/item-categories/${id}`);
}
