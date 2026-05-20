// ERP m2 Finance — Giros skeleton CRUD client

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export type ErpGiroType = 'INCOMING' | 'OUTGOING';
export type ErpGiroStatus = 'OUTSTANDING' | 'CLEARED' | 'BOUNCED' | 'CANCELLED';

export interface ErpGiro {
  id: string;
  giroNumber: string;
  type: ErpGiroType;
  partnerId?: string | null;
  branchId?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  currencyId: string;
  exchangeRate: string;
  amount: string;
  dueDate: string;
  clearedDate?: string | null;
  status: ErpGiroStatus;
  description?: string | null;
  notes?: string | null;
  lineNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGiroPayload {
  giroNumber: string;
  type: ErpGiroType;
  currencyId: string;
  exchangeRate: string;
  amount: string;
  dueDate: string;
  lineNo: number;
  partnerId?: string;
  branchId?: string;
  bankName?: string;
  bankAccountNo?: string;
  status?: ErpGiroStatus;
  description?: string;
  notes?: string;
}

export type UpdateGiroPayload = Partial<CreateGiroPayload>;

export async function listGiros(
  params?: PaginationParams,
): Promise<PaginatedResponse<ErpGiro>> {
  return apiGet<PaginatedResponse<ErpGiro>>(
    '/fin/giros',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createGiro(payload: CreateGiroPayload): Promise<ErpGiro> {
  const res = await apiPost<ApiResponse<ErpGiro>>('/fin/giros', payload);
  return res.data;
}

export async function updateGiro(
  id: string,
  payload: UpdateGiroPayload,
): Promise<ErpGiro> {
  const res = await apiPatch<ApiResponse<ErpGiro>>(
    `/fin/giros/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteGiro(id: string): Promise<void> {
  await apiDelete<void>(`/fin/giros/${id}`);
}
