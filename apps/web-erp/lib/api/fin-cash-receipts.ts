// ERP m2 Finance — Kas Masuk / Cash Receipt (CR).
// Backed by the shared cash-bank-transactions resource with direction=RECEIPT.
// Endpoint: /fin/cash-bank-transactions  (see erp-fin-cash-bank-transactions backend module)

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

const BASE = '/fin/cash-bank-transactions';

export type ErpDocumentStatus =
  | 'DRAFT'
  | 'NEED_APPROVE'
  | 'APPROVED'
  | 'REJECTED'
  | 'POSTED'
  | 'VOID'
  | 'CANCELLED';
export type ErpPostingStatus = 'UNPOSTED' | 'POSTED';
export type CashBankDirection = 'RECEIPT' | 'DISBURSEMENT';

/** Resolved cross-domain reference (partner/account/branch/…): code + name. */
export interface ErpRef {
  id: string;
  code: string;
  name: string;
}

export interface ErpCashBankLine {
  id?: string;
  accountId: string;
  account?: ErpRef | null;
  currencyId?: string;
  exchangeRate?: string;
  amount: string;
  amountFx?: string | null;
  notes?: string | null;
  costCenterId?: string | null;
  divisionId?: string | null;
  subdivisionId?: string | null;
  projectId?: string | null;
  lineNo: number;
}

export interface ErpCashReceipt {
  id: string;
  docNumber: string;
  autoNumber?: string | null;
  direction: CashBankDirection;
  branchId: string;
  branch?: ErpRef | null;
  locationId?: string | null;
  location?: ErpRef | null;
  transactionDate: string;
  fiscalPeriodId: string;
  bankAccountId: string;
  bankAccount?: ErpRef | null;
  partnerId?: string | null;
  partner?: ErpRef | null;
  contactPerson?: string | null;
  description: string;
  notes?: string | null;
  currencyId: string;
  currency?: ErpRef | null;
  exchangeRate: string;
  amount: string;
  status: ErpDocumentStatus;
  postingStatus: ErpPostingStatus;
  postedAt?: string | null;
  legacyCode?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  updatedById?: string | null;
  lines: ErpCashBankLine[];
}

export interface CashBankLinePayload {
  accountId: string;
  amount: string;
  lineNo: number;
  currencyId?: string;
  exchangeRate?: string;
  amountFx?: string;
  notes?: string;
  costCenterId?: string;
  divisionId?: string;
  subdivisionId?: string;
  projectId?: string;
}

export interface CreateCashReceiptPayload {
  docNumber?: string;
  auto?: boolean;
  direction: CashBankDirection;
  branchId: string;
  locationId?: string;
  transactionDate: string;
  fiscalPeriodId?: string;
  bankAccountId: string;
  partnerId?: string;
  contactPerson?: string;
  description: string;
  notes?: string;
  currencyId: string;
  exchangeRate: string;
  legacyCode?: string;
  lines: CashBankLinePayload[];
}

export type UpdateCashReceiptPayload = Partial<CreateCashReceiptPayload>;

export type CashBankTransition =
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'POST'
  | 'REOPEN';

export interface ListCashReceiptsParams extends PaginationParams {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  status?: ErpDocumentStatus;
  dateFrom?: string;
  dateTo?: string;
  branchId?: string;
  locationId?: string;
  partnerId?: string;
  docNumberFrom?: string;
  docNumberTo?: string;
  description?: string;
  notes?: string;
  createdById?: string;
}

type Query = Record<string, string | number | boolean | undefined>;

export function listCashReceipts(
  params?: ListCashReceiptsParams,
): Promise<PaginatedResponse<ErpCashReceipt>> {
  return apiGet<PaginatedResponse<ErpCashReceipt>>(BASE, {
    ...(params as Query),
    direction: 'RECEIPT',
  });
}

export async function getCashReceipt(id: string): Promise<ErpCashReceipt> {
  const res = await apiGet<ApiResponse<ErpCashReceipt>>(`${BASE}/${id}`);
  return res.data;
}

export async function createCashReceipt(
  payload: CreateCashReceiptPayload,
): Promise<ErpCashReceipt> {
  const res = await apiPost<ApiResponse<ErpCashReceipt>>(BASE, payload);
  return res.data;
}

export async function updateCashReceipt(
  id: string,
  payload: UpdateCashReceiptPayload,
): Promise<ErpCashReceipt> {
  const res = await apiPatch<ApiResponse<ErpCashReceipt>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function transitionCashReceipt(
  id: string,
  action: CashBankTransition,
  reason?: string,
): Promise<ErpCashReceipt> {
  const res = await apiPost<ApiResponse<ErpCashReceipt>>(
    `${BASE}/${id}/transition`,
    { action, reason },
  );
  return res.data;
}

export async function deleteCashReceipt(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}
