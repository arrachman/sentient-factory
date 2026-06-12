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

/** One sale price tier (legacy "Harga Jual N" + "Diskon Jual N"). */
export interface ItemPriceTier {
  level: number;
  price: string;
  discountPercent: string;
}

/** One item storage placement (legacy "Lokasi" tab: Gudang + Lokasi). */
export interface ItemLocationRow {
  warehouseId: string;
  locationId: string;
  warehouse?: RelationRef | null;
  location?: RelationRef | null;
}

/** One item distributor (legacy "Distributor" tab: a supplier/distributor partner). */
export interface ItemDistributorRow {
  partnerId: string;
  partner?: RelationRef | null;
}

/** One item branch assignment (legacy "Branch" tab: Cabang + Cost Center). */
export interface ItemBranchRow {
  branchId: string;
  costCenterId: string;
  branch?: RelationRef | null;
  costCenter?: RelationRef | null;
}

/** Legacy "Lain-lain" tab — alias names + free-text notes (in metadata.others). */
export interface ItemOthersData {
  aliasName1?: string; aliasName2?: string; aliasName3?: string; aliasName4?: string;
  notesRc?: string;
  catatan?: string;
}

/** Legacy "Custom" tab — production/moulding attributes (in metadata.custom). */
export interface ItemCustomData {
  productionCategory?: string; productionGroup?: string;
  maxQtySo?: string; capacityPerHour?: string; maxQtyRc?: string; allowance?: string;
  wip1?: string; wip2?: string; wip3?: string;
  mouldFinish?: string; moldSemi1?: string; moldSemi2?: string;
  min1?: string; max1?: string; min2?: string; max2?: string;
}

/** Free-form JSON sidecar; ERP item form stores Lain-lain/Custom tabs here. */
export interface ItemMetadata {
  others?: ItemOthersData;
  custom?: ItemCustomData;
  [key: string]: unknown;
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
  designerId?: string | null;
  nozzleId?: string | null;
  oemId?: string | null;
  vendorId?: string | null;
  fieldUnitId?: string | null;
  fieldUnitFactor?: string | null; // 1 satuan jual = N satuan dasar

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
  standardCost?: string | null;      // "Hpp Update" (manual HPP)
  averageCost?: string | null;       // "Hpp rata-rata" (computed, readonly)
  purchasePrice?: string | null;     // "Harga Beli Terakhir"
  purchaseDiscount?: string | null;  // "Diskon Pembelian" (percent)
  salePrice?: string | null;         // "Harga Jual 1" (mirror of tier level 1)
  sellingPrice?: string | null; // legacy alias of salePrice
  prices?: ItemPriceTier[];          // "Harga Jual 1..10" + "Diskon Jual 1..10"
  locations?: ItemLocationRow[];     // "Lokasi" tab: Gudang + Lokasi placements
  distributors?: ItemDistributorRow[]; // "Distributor" tab: supplier partners
  branches?: ItemBranchRow[];        // "Branch" tab: Cabang + Cost Center
  metadata?: ItemMetadata | null;    // "Lain-lain" + "Custom" tabs (JSON sidecar)

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
  salesReturnAccountId?: string | null;
  salesDiscountAccountId?: string | null;
  purchaseReturnAccountId?: string | null;
  purchaseDiscountAccountId?: string | null;
  consignmentAccountId?: string | null;

  // Tax
  purchaseTaxId?: string | null;
  saleTaxId?: string | null;

  // Supplier & physical
  primarySupplierId?: string | null;
  weight?: string | null;

  // Atribut fisik & regulasi (legacy "Atribut")
  length?: string | null;
  width?: string | null;
  height?: string | null;
  volume?: string | null;
  conversionKgPcs?: string | null;
  registrationNo?: string | null;
  isReturnable?: boolean;
  isMobile?: boolean;

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
  salesReturnAccount?: RelationRef | null;
  salesDiscountAccount?: RelationRef | null;
  purchaseReturnAccount?: RelationRef | null;
  purchaseDiscountAccount?: RelationRef | null;
  consignmentAccount?: RelationRef | null;
  purchaseTax?: RelationRef | null;
  saleTax?: RelationRef | null;
  primarySupplier?: RelationRef | null;
  brand?: RelationRef | null;
  material?: RelationRef | null;
  size?: RelationRef | null;
  color?: RelationRef | null;
  section?: RelationRef | null;
  designer?: RelationRef | null;
  nozzle?: RelationRef | null;
  oem?: RelationRef | null;
  vendor?: RelationRef | null;
  fieldUnit?: RelationRef | null;
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
  designerId?: string | null;
  nozzleId?: string | null;
  oemId?: string | null;
  vendorId?: string | null;
  fieldUnitId?: string | null;
  fieldUnitFactor?: string;

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
  purchaseDiscount?: string;
  salePrice?: string;
  prices?: { level: number; price?: string; discountPercent?: string }[];
  locations?: { warehouseId: string; locationId: string }[];
  distributors?: { partnerId: string }[];
  branches?: { branchId: string; costCenterId: string }[];
  others?: ItemOthersData;   // "Lain-lain" tab → metadata.others
  custom?: ItemCustomData;   // "Custom" tab → metadata.custom

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
  salesReturnAccountId?: string | null;
  salesDiscountAccountId?: string | null;
  purchaseReturnAccountId?: string | null;
  purchaseDiscountAccountId?: string | null;
  consignmentAccountId?: string | null;
  purchaseTaxId?: string | null;
  saleTaxId?: string | null;
  primarySupplierId?: string | null;
  weight?: string;

  // Atribut fisik & regulasi (legacy "Atribut")
  length?: string;
  width?: string;
  height?: string;
  volume?: string;
  conversionKgPcs?: string;
  registrationNo?: string | null;
  isReturnable?: boolean;
  isMobile?: boolean;

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
