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

export type ErpCostingMethod = 'AVG' | 'FIFO' | 'STD';

interface RelationRef {
  id: string;
  code?: string;
  name?: string;
}

export interface ErpItem {
  id: string;
  code: string;
  name: string;
  itemType: ErpItemType;
  costMethod: ErpCostingMethod;
  categoryId: string;
  unitId: string;
  description?: string | null;
  barcode?: string | null;

  // Classification
  kindId?: string | null;
  productClassId?: string | null;
  brandId?: string | null;
  materialId?: string | null;
  itemModelId?: string | null;
  sizeId?: string | null;
  colorId?: string | null;
  sectionId?: string | null;

  // GL / org dimensions
  divisionId?: string | null;
  subdivisionId?: string | null;
  departmentId?: string | null;
  subDepartmentId?: string | null;
  branchId?: string | null;
  defaultLocationId?: string | null;
  defaultWarehouseId?: string | null;
  projectId?: string | null;
  costCenterId?: string | null;

  // Costs & prices
  standardCost?: string | null;
  averageCost?: string | null;
  purchasePrice?: string | null;
  salePrice?: string | null;
  sellingPrice?: string | null; // legacy alias of salePrice

  // Stock & tracking
  minStock?: string | null;
  maxStock?: string | null;
  reorderQty?: string | null;
  minOrderQty?: string | null;
  tracksSerial?: boolean;
  tracksBatch?: boolean;
  tracksBin?: boolean;

  // GL accounts
  inventoryAccountId?: string | null;
  salesAccountId?: string | null;
  cogsAccountId?: string | null;

  // Tax
  purchaseTaxId?: string | null;
  saleTaxId?: string | null;

  // Supplier & physical
  primarySupplierId?: string | null;
  weight?: string | null;

  // Validity & flags
  ageCategory?: string | null;
  validUntil?: string | null;
  isVatable: boolean;
  isSpecial: boolean;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Includes
  category?: RelationRef | null;
  unit?: RelationRef | null;
  kind?: RelationRef | null;
  productClass?: RelationRef | null;
  division?: RelationRef | null;
  subdivision?: RelationRef | null;
  department?: RelationRef | null;
  subDepartment?: RelationRef | null;
  branch?: RelationRef | null;
  defaultLocation?: RelationRef | null;
  defaultWarehouse?: RelationRef | null;
  project?: RelationRef | null;
  costCenter?: RelationRef | null;
  inventoryAccount?: RelationRef | null;
  salesAccount?: RelationRef | null;
  cogsAccount?: RelationRef | null;
  purchaseTax?: RelationRef | null;
  saleTax?: RelationRef | null;
  primarySupplier?: RelationRef | null;
}

export interface CreateItemPayload {
  code: string;
  name: string;
  itemType: ErpItemType;
  costMethod?: ErpCostingMethod;
  categoryId: string;
  unitId: string;
  description?: string;
  barcode?: string;

  kindId?: string | null;
  productClassId?: string | null;
  brandId?: string | null;
  materialId?: string | null;
  itemModelId?: string | null;
  sizeId?: string | null;
  colorId?: string | null;
  sectionId?: string | null;

  divisionId?: string | null;
  subdivisionId?: string | null;
  departmentId?: string | null;
  subDepartmentId?: string | null;
  branchId?: string | null;
  defaultLocationId?: string | null;
  defaultWarehouseId?: string | null;
  projectId?: string | null;
  costCenterId?: string | null;

  standardCost?: string;
  purchasePrice?: string;
  salePrice?: string;

  minStock?: string;
  maxStock?: string;
  reorderQty?: string;
  minOrderQty?: string;

  tracksSerial?: boolean;
  tracksBatch?: boolean;
  tracksBin?: boolean;

  inventoryAccountId?: string | null;
  salesAccountId?: string | null;
  cogsAccountId?: string | null;
  purchaseTaxId?: string | null;
  saleTaxId?: string | null;
  primarySupplierId?: string | null;
  weight?: string;

  ageCategory?: string | null;
  validUntil?: string | null;
  isVatable?: boolean;
  isSpecial?: boolean;
  isActive?: boolean;
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

// ─── API functions ────────────────────────────────────────────────────────────

export async function listItems(
  params?: PaginationParams & {
    itemType?: ErpItemType;
    kindId?: string;
    productClassId?: string;
    branchId?: string;
    defaultWarehouseId?: string;
  },
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

export async function bulkUpdateItemStatus(ids: string[], isActive: boolean): Promise<{ affected: number }> {
  const res = await apiPatch<{ success: boolean; affected: number }>('/items/bulk/status', { ids, isActive });
  return { affected: res.affected };
}

export async function bulkDeleteItems(ids: string[]): Promise<{ affected: number }> {
  const res = await apiDelete<{ success: boolean; affected: number }>('/items/bulk', { ids });
  return { affected: res.affected };
}
