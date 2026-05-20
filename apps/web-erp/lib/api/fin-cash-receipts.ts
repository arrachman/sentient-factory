// ERP m2 Finance — Cash Receipts (header + lines) skeleton CRUD client.
// Endpoints: /fin/cash-receipts

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpCashReceipt {
  id: string;
  docNumber: string;
  branchId: string;
  locationId?: string | null;
  cashAccountId: string;
  entryDate: string;
  fiscalPeriodId: string;
  partnerId?: string | null;
  description: string;
  notes?: string | null;
  currencyId: string;
  exchangeRate: string;
  status: ErpDocumentStatus;
  postingStatus: ErpPostingStatus;
  legacyCode?: string | null;
  createdAt: string;
  updatedAt: string;
  lines: ErpJournalLine[];
}

export interface CreateCashReceiptPayload {
  docNumber: string;
  branchId: string;
  cashAccountId: string;
  entryDate: string;
  fiscalPeriodId: string;
  description: string;
  currencyId: string;
  exchangeRate: string;
  status?: ErpDocumentStatus;
  postingStatus?: ErpPostingStatus;
  notes?: string;
  partnerId?: string;
  locationId?: string;
  lines: ErpJournalLine[];
}

export type UpdateCashReceiptPayload = Partial<CreateCashReceiptPayload>;

export interface ListCashReceiptsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listCashReceipts(
  params?: ListCashReceiptsParams,
): Promise<PaginatedResponse<ErpCashReceipt>> {
  return apiGet<PaginatedResponse<ErpCashReceipt>>(
    '/fin/cash-receipts',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createCashReceipt(
  payload: CreateCashReceiptPayload,
): Promise<ErpCashReceipt> {
  const res = await apiPost<ApiResponse<ErpCashReceipt>>(
    '/fin/cash-receipts',
    payload,
  );
  return res.data;
}

export async function updateCashReceipt(
  id: string,
  payload: UpdateCashReceiptPayload,
): Promise<ErpCashReceipt> {
  const res = await apiPatch<ApiResponse<ErpCashReceipt>>(
    `/fin/cash-receipts/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteCashReceipt(id: string): Promise<void> {
  await apiDelete<void>(`/fin/cash-receipts/${id}`);
}
