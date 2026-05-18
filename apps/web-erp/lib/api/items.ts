// ERP Item resource API — CRUD for md_items
// Endpoints: /items

import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ErpItemType =
  | 'INVENTORY'
  | 'SERVICE'
  | 'CONSUMABLE'
  | 'ASSET'
  | 'NON_INVENTORY';

export interface ErpItem {
  id: string;
  code: string;
  name: string;
  itemType: ErpItemType;
  categoryId: string;
  unitId: string;
  description?: string | null;
  barcode?: string | null;
  standardCost?: string | null;
  purchasePrice?: string | null;
  sellingPrice?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string } | null;
  unit?: { id: string; code: string; name: string } | null;
}

export interface CreateItemPayload {
  code: string;
  name: string;
  itemType: ErpItemType;
  categoryId: string;
  unitId: string;
  description?: string;
  barcode?: string;
  standardCost?: string;
  purchasePrice?: string;
  sellingPrice?: string;
  isActive?: boolean;
}

export interface UpdateItemPayload {
  code?: string;
  name?: string;
  itemType?: ErpItemType;
  categoryId?: string;
  unitId?: string;
  description?: string;
  barcode?: string;
  standardCost?: string;
  purchasePrice?: string;
  sellingPrice?: string;
  isActive?: boolean;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listItems(
  params?: PaginationParams,
): Promise<PaginatedResponse<ErpItem>> {
  return apiGet<PaginatedResponse<ErpItem>>('/items', params as Record<string, string | number | boolean | undefined>);
}

export async function createItem(
  payload: CreateItemPayload,
): Promise<ErpItem> {
  const res = await apiPost<ApiResponse<ErpItem>>('/items', payload);
  return res.data;
}

export async function updateItem(
  id: string,
  payload: UpdateItemPayload,
): Promise<ErpItem> {
  const res = await apiPatch<ApiResponse<ErpItem>>(`/items/${id}`, payload);
  return res.data;
}

export async function deleteItem(id: string): Promise<void> {
  await apiDelete<void>(`/items/${id}`);
}
