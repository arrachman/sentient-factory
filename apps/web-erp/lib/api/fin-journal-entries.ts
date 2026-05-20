// ERP m2 Finance — Journal Entries (header + lines) skeleton CRUD client
// Endpoints: /fin/journal-entries

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export type ErpJournalType =
  | 'GENERAL'
  | 'MEMORIAL'
  | 'ADJUSTMENT'
  | 'OPENING_BALANCE'
  | 'CLOSING';

export type ErpDocumentStatus = 'DRAFT' | 'POSTED' | 'VOID' | 'CANCELLED';
export type ErpPostingStatus = 'UNPOSTED' | 'POSTED';

export interface ErpJournalLine {
  id?: string;
  accountId: string;
  currencyId: string;
  exchangeRate: string;
  debit: string;
  credit: string;
  debitFx?: string | null;
  creditFx?: string | null;
  notes?: string | null;
  costCenterId?: string | null;
  divisionId?: string | null;
  subdivisionId?: string | null;
  projectId?: string | null;
  lineNo: number;
}

export interface ErpJournalEntry {
  id: string;
  docNumber: string;
  autoNumber?: string | null;
  journalType: ErpJournalType;
  branchId: string;
  locationId?: string | null;
  source?: string | null;
  entryDate: string;
  fiscalPeriodId: string;
  partnerId?: string | null;
  contactPerson?: string | null;
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

export interface CreateJournalEntryPayload {
  docNumber: string;
  journalType: ErpJournalType;
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

export type UpdateJournalEntryPayload = Partial<CreateJournalEntryPayload>;

export interface ListJournalEntriesParams extends PaginationParams {
  journalType?: ErpJournalType;
  status?: ErpDocumentStatus;
}

export async function listJournalEntries(
  params?: ListJournalEntriesParams,
): Promise<PaginatedResponse<ErpJournalEntry>> {
  return apiGet<PaginatedResponse<ErpJournalEntry>>(
    '/fin/journal-entries',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createJournalEntry(
  payload: CreateJournalEntryPayload,
): Promise<ErpJournalEntry> {
  const res = await apiPost<ApiResponse<ErpJournalEntry>>(
    '/fin/journal-entries',
    payload,
  );
  return res.data;
}

export async function updateJournalEntry(
  id: string,
  payload: UpdateJournalEntryPayload,
): Promise<ErpJournalEntry> {
  const res = await apiPatch<ApiResponse<ErpJournalEntry>>(
    `/fin/journal-entries/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await apiDelete<void>(`/fin/journal-entries/${id}`);
}
