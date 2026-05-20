// ERP m2 Finance — Cash Disbursements (header + lines) skeleton CRUD client.
// Endpoints: /fin/cash-disbursements

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpCashDisbursement {
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

export interface CreateCashDisbursementPayload {
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

export type UpdateCashDisbursementPayload =
  Partial<CreateCashDisbursementPayload>;

export interface ListCashDisbursementsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listCashDisbursements(
  params?: ListCashDisbursementsParams,
): Promise<PaginatedResponse<ErpCashDisbursement>> {
  return apiGet<PaginatedResponse<ErpCashDisbursement>>(
    '/fin/cash-disbursements',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createCashDisbursement(
  payload: CreateCashDisbursementPayload,
): Promise<ErpCashDisbursement> {
  const res = await apiPost<ApiResponse<ErpCashDisbursement>>(
    '/fin/cash-disbursements',
    payload,
  );
  return res.data;
}

export async function updateCashDisbursement(
  id: string,
  payload: UpdateCashDisbursementPayload,
): Promise<ErpCashDisbursement> {
  const res = await apiPatch<ApiResponse<ErpCashDisbursement>>(
    `/fin/cash-disbursements/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteCashDisbursement(id: string): Promise<void> {
  await apiDelete<void>(`/fin/cash-disbursements/${id}`);
}
