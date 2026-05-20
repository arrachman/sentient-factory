// ERP m2 Finance — Receipt Giros (header + lines) skeleton CRUD client.
// Endpoints: /fin/receipt-giros

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpReceiptGiro {
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

export interface CreateReceiptGiroPayload {
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

export type UpdateReceiptGiroPayload = Partial<CreateReceiptGiroPayload>;

export interface ListReceiptGirosParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listReceiptGiros(
  params?: ListReceiptGirosParams,
): Promise<PaginatedResponse<ErpReceiptGiro>> {
  return apiGet<PaginatedResponse<ErpReceiptGiro>>(
    '/fin/receipt-giros',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createReceiptGiro(
  payload: CreateReceiptGiroPayload,
): Promise<ErpReceiptGiro> {
  const res = await apiPost<ApiResponse<ErpReceiptGiro>>(
    '/fin/receipt-giros',
    payload,
  );
  return res.data;
}

export async function updateReceiptGiro(
  id: string,
  payload: UpdateReceiptGiroPayload,
): Promise<ErpReceiptGiro> {
  const res = await apiPatch<ApiResponse<ErpReceiptGiro>>(
    `/fin/receipt-giros/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteReceiptGiro(id: string): Promise<void> {
  await apiDelete<void>(`/fin/receipt-giros/${id}`);
}
