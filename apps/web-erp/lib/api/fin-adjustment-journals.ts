// ERP m2 Finance — Adjustment Journals (header + lines) skeleton CRUD client.
// Endpoints: /fin/adjustment-journals

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpAdjustmentJournal {
  id: string;
  docNumber: string;
  branchId: string;
  locationId?: string | null;
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

export interface CreateAdjustmentJournalPayload {
  docNumber: string;
  branchId: string;
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

export type UpdateAdjustmentJournalPayload =
  Partial<CreateAdjustmentJournalPayload>;

export interface ListAdjustmentJournalsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listAdjustmentJournals(
  params?: ListAdjustmentJournalsParams,
): Promise<PaginatedResponse<ErpAdjustmentJournal>> {
  return apiGet<PaginatedResponse<ErpAdjustmentJournal>>(
    '/fin/adjustment-journals',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createAdjustmentJournal(
  payload: CreateAdjustmentJournalPayload,
): Promise<ErpAdjustmentJournal> {
  const res = await apiPost<ApiResponse<ErpAdjustmentJournal>>(
    '/fin/adjustment-journals',
    payload,
  );
  return res.data;
}

export async function updateAdjustmentJournal(
  id: string,
  payload: UpdateAdjustmentJournalPayload,
): Promise<ErpAdjustmentJournal> {
  const res = await apiPatch<ApiResponse<ErpAdjustmentJournal>>(
    `/fin/adjustment-journals/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteAdjustmentJournal(id: string): Promise<void> {
  await apiDelete<void>(`/fin/adjustment-journals/${id}`);
}
