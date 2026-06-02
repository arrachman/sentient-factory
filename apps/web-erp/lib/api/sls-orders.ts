// ERP m5 Sales — Sales Order (SO).
// Master-detail document (header + item lines) on the erp-sls-orders backend.
// Endpoint: /sls/orders  (see apps/api-gateway/src/erp-sls-orders).

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

const BASE = '/sls/orders';

export type ErpDocumentStatus =
  | 'DRAFT'
  | 'NEED_APPROVE'
  | 'APPROVED'
  | 'REJECTED'
  | 'POSTED'
  | 'VOID'
  | 'CANCELLED';
export type ErpPostingStatus = 'UNPOSTED' | 'POSTED';
export type ErpPriceMode = 'TAX_INCLUSIVE' | 'TAX_EXCLUSIVE';

/** Resolved cross-domain reference (customer/item/unit/…): code + name. */
export interface ErpRef {
  id: string;
  code: string;
  name: string;
}

export interface ErpSlsOrderLine {
  id?: string;
  itemId: string;
  item?: ErpRef | null;
  quantity: string;
  unitId: string;
  unit?: ErpRef | null;
  unitPrice: string;
  discountPercent?: string | null;
  discountAmount?: string | null;
  tax1Id?: string | null;
  tax1?: ErpRef | null;
  tax1Amount?: string | null;
  tax2Id?: string | null;
  tax2?: ErpRef | null;
  tax2Amount?: string | null;
  warehouseId?: string | null;
  warehouse?: ErpRef | null;
  inventoryAccountId?: string | null;
  costCenterId?: string | null;
  divisionId?: string | null;
  subdivisionId?: string | null;
  projectId?: string | null;
  notes?: string | null;
  lineNo: number;
}

export interface ErpSlsOrder {
  id: string;
  code: string;
  docNumber: string;
  autoNumber?: string | null;
  branchId: string;
  branch?: ErpRef | null;
  locationId?: string | null;
  location?: ErpRef | null;
  warehouseId?: string | null;
  warehouse?: ErpRef | null;
  docDate: string;
  fiscalPeriodId: string;
  customerId?: string | null;
  customer?: ErpRef | null;
  paymentTermId?: string | null;
  paymentTerm?: ErpRef | null;
  dueDate?: string | null;
  currencyId: string;
  currency?: ErpRef | null;
  exchangeRate: string;
  priceMode: ErpPriceMode;
  subtotal: string;
  discountPercent?: string | null;
  discountAmount?: string | null;
  tax1Amount?: string | null;
  tax2Amount?: string | null;
  otherCostAmount?: string | null;
  grandTotal: string;
  description?: string | null;
  notes?: string | null;
  referenceNo?: string | null;
  referenceDate?: string | null;
  salesDeptId?: string | null;
  salesDept?: ErpRef | null;
  receivableAccountId?: string | null;
  receivableAccount?: ErpRef | null;
  status: ErpDocumentStatus;
  postingStatus: ErpPostingStatus;
  postedAt?: string | null;
  legacyCode?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  updatedById?: string | null;
  lines: ErpSlsOrderLine[];
}

export interface SlsOrderLinePayload {
  itemId: string;
  quantity: string;
  unitId: string;
  unitPrice?: string;
  discountPercent?: string;
  discountAmount?: string;
  tax1Id?: string;
  tax1Amount?: string;
  tax2Id?: string;
  tax2Amount?: string;
  warehouseId?: string;
  inventoryAccountId?: string;
  costCenterId?: string;
  divisionId?: string;
  subdivisionId?: string;
  projectId?: string;
  notes?: string;
  lineNo: number;
}

export interface CreateSlsOrderPayload {
  docNumber?: string;
  auto?: boolean;
  docDate: string;
  fiscalPeriodId?: string;
  branchId: string;
  locationId?: string;
  warehouseId?: string;
  customerId?: string;
  paymentTermId?: string;
  dueDate?: string;
  currencyId: string;
  exchangeRate: string;
  priceMode?: ErpPriceMode;
  description?: string;
  notes?: string;
  referenceNo?: string;
  referenceDate?: string;
  receivableAccountId?: string;
  salesDeptId?: string;
  discountPercent?: string;
  discountAmount?: string;
  tax1Amount?: string;
  tax2Amount?: string;
  otherCostAmount?: string;
  legacyCode?: string;
  lines: SlsOrderLinePayload[];
}

export type UpdateSlsOrderPayload = Partial<CreateSlsOrderPayload>;

export type SlsOrderTransition = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'POST' | 'REOPEN';

export interface ListSlsOrdersParams extends PaginationParams {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  status?: ErpDocumentStatus;
  dateFrom?: string;
  dateTo?: string;
  branchId?: string;
  customerId?: string;
  locationId?: string;
  docNumberFrom?: string;
  docNumberTo?: string;
  description?: string;
  createdById?: string;
}

type Query = Record<string, string | number | boolean | undefined>;

export function listSlsOrders(
  params?: ListSlsOrdersParams,
): Promise<PaginatedResponse<ErpSlsOrder>> {
  return apiGet<PaginatedResponse<ErpSlsOrder>>(BASE, params as Query);
}

export async function getSlsOrder(id: string): Promise<ErpSlsOrder> {
  const res = await apiGet<ApiResponse<ErpSlsOrder>>(`${BASE}/${id}`);
  return res.data;
}

export async function createSlsOrder(payload: CreateSlsOrderPayload): Promise<ErpSlsOrder> {
  const res = await apiPost<ApiResponse<ErpSlsOrder>>(BASE, payload);
  return res.data;
}

export async function updateSlsOrder(
  id: string,
  payload: UpdateSlsOrderPayload,
): Promise<ErpSlsOrder> {
  const res = await apiPatch<ApiResponse<ErpSlsOrder>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function transitionSlsOrder(
  id: string,
  action: SlsOrderTransition,
  reason?: string,
): Promise<ErpSlsOrder> {
  const res = await apiPost<ApiResponse<ErpSlsOrder>>(`${BASE}/${id}/transition`, {
    action,
    reason,
  });
  return res.data;
}

export async function deleteSlsOrder(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}
