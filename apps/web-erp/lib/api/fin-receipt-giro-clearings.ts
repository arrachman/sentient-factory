// ERP m2 Finance — Receipt Giro Clearings (header + lines) skeleton CRUD client.
// Endpoints: /fin/receipt-giro-clearings

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpReceiptGiroClearing {
  id: string;
  docNumber: string;
  branchId: string;
  locationId?: string | null;
  giroNumber: string;
  giroDate: string;
  giroBank: string;
  dueDate: string;
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

export interface CreateReceiptGiroClearingPayload {
  docNumber: string;
  branchId: string;
  giroNumber: string;
  giroDate: string;
  giroBank: string;
  dueDate: string;
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

export type UpdateReceiptGiroClearingPayload =
  Partial<CreateReceiptGiroClearingPayload>;

export interface ListReceiptGiroClearingsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listReceiptGiroClearings(
  params?: ListReceiptGiroClearingsParams,
): Promise<PaginatedResponse<ErpReceiptGiroClearing>> {
  return apiGet<PaginatedResponse<ErpReceiptGiroClearing>>(
    '/fin/receipt-giro-clearings',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createReceiptGiroClearing(
  payload: CreateReceiptGiroClearingPayload,
): Promise<ErpReceiptGiroClearing> {
  const res = await apiPost<ApiResponse<ErpReceiptGiroClearing>>(
    '/fin/receipt-giro-clearings',
    payload,
  );
  return res.data;
}

export async function updateReceiptGiroClearing(
  id: string,
  payload: UpdateReceiptGiroClearingPayload,
): Promise<ErpReceiptGiroClearing> {
  const res = await apiPatch<ApiResponse<ErpReceiptGiroClearing>>(
    `/fin/receipt-giro-clearings/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteReceiptGiroClearing(id: string): Promise<void> {
  await apiDelete<void>(`/fin/receipt-giro-clearings/${id}`);
}
