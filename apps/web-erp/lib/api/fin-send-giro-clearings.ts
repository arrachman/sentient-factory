// ERP m2 Finance — Send Giro Clearings (header + lines) skeleton CRUD client.
// Endpoints: /fin/send-giro-clearings

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpSendGiroClearing {
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

export interface CreateSendGiroClearingPayload {
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

export type UpdateSendGiroClearingPayload =
  Partial<CreateSendGiroClearingPayload>;

export interface ListSendGiroClearingsParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listSendGiroClearings(
  params?: ListSendGiroClearingsParams,
): Promise<PaginatedResponse<ErpSendGiroClearing>> {
  return apiGet<PaginatedResponse<ErpSendGiroClearing>>(
    '/fin/send-giro-clearings',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createSendGiroClearing(
  payload: CreateSendGiroClearingPayload,
): Promise<ErpSendGiroClearing> {
  const res = await apiPost<ApiResponse<ErpSendGiroClearing>>(
    '/fin/send-giro-clearings',
    payload,
  );
  return res.data;
}

export async function updateSendGiroClearing(
  id: string,
  payload: UpdateSendGiroClearingPayload,
): Promise<ErpSendGiroClearing> {
  const res = await apiPatch<ApiResponse<ErpSendGiroClearing>>(
    `/fin/send-giro-clearings/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteSendGiroClearing(id: string): Promise<void> {
  await apiDelete<void>(`/fin/send-giro-clearings/${id}`);
}
