// ERP m2 Finance — Bank Disbursements (header + lines) skeleton CRUD client.
// Endpoints: /fin/bank-disbursements

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpBankDisbursement {
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

export interface CreateBankDisbursementPayload {
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

export type UpdateBankDisbursementPayload =
  Partial<CreateBankDisbursementPayload>;

export interface ListBankDisbursementsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listBankDisbursements(
  params?: ListBankDisbursementsParams,
): Promise<PaginatedResponse<ErpBankDisbursement>> {
  return apiGet<PaginatedResponse<ErpBankDisbursement>>(
    '/fin/bank-disbursements',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createBankDisbursement(
  payload: CreateBankDisbursementPayload,
): Promise<ErpBankDisbursement> {
  const res = await apiPost<ApiResponse<ErpBankDisbursement>>(
    '/fin/bank-disbursements',
    payload,
  );
  return res.data;
}

export async function updateBankDisbursement(
  id: string,
  payload: UpdateBankDisbursementPayload,
): Promise<ErpBankDisbursement> {
  const res = await apiPatch<ApiResponse<ErpBankDisbursement>>(
    `/fin/bank-disbursements/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteBankDisbursement(id: string): Promise<void> {
  await apiDelete<void>(`/fin/bank-disbursements/${id}`);
}
