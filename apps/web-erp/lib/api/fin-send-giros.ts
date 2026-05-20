// ERP m2 Finance — Send Giros (header + lines) skeleton CRUD client.
// Endpoints: /fin/send-giros

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';
import type {
  ErpDocumentStatus,
  ErpPostingStatus,
  ErpJournalLine,
} from './fin-journal-entries';

export interface ErpSendGiro {
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

export interface CreateSendGiroPayload {
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

export type UpdateSendGiroPayload = Partial<CreateSendGiroPayload>;

export interface ListSendGirosParams extends PaginationParams {
  status?: ErpDocumentStatus;
}

export async function listSendGiros(
  params?: ListSendGirosParams,
): Promise<PaginatedResponse<ErpSendGiro>> {
  return apiGet<PaginatedResponse<ErpSendGiro>>(
    '/fin/send-giros',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createSendGiro(
  payload: CreateSendGiroPayload,
): Promise<ErpSendGiro> {
  const res = await apiPost<ApiResponse<ErpSendGiro>>(
    '/fin/send-giros',
    payload,
  );
  return res.data;
}

export async function updateSendGiro(
  id: string,
  payload: UpdateSendGiroPayload,
): Promise<ErpSendGiro> {
  const res = await apiPatch<ApiResponse<ErpSendGiro>>(
    `/fin/send-giros/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteSendGiro(id: string): Promise<void> {
  await apiDelete<void>(`/fin/send-giros/${id}`);
}
