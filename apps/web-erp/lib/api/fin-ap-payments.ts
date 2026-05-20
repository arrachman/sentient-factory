// ERP m2 Finance — AP Payments skeleton CRUD client

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export type ErpDocumentStatus = 'DRAFT' | 'POSTED' | 'VOID' | 'CANCELLED';
export type ErpPostingStatus = 'UNPOSTED' | 'POSTED';
export type ErpSettlementStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface ErpApPayment {
  id: string;
  docNumber: string;
  branchId: string;
  transactionDate: string;
  fiscalPeriodId: string;
  partnerId: string;
  description: string;
  currencyId: string;
  exchangeRate: string;
  amount: string;
  allocatedAmount: string;
  paymentStatus: ErpSettlementStatus;
  status: ErpDocumentStatus;
  postingStatus: ErpPostingStatus;
  notes?: string | null;
  contactPerson?: string | null;
  bankAccountId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApPaymentPayload {
  docNumber: string;
  branchId: string;
  transactionDate: string;
  fiscalPeriodId: string;
  partnerId: string;
  description: string;
  currencyId: string;
  exchangeRate: string;
  amount: string;
  allocatedAmount: string;
  paymentStatus?: ErpSettlementStatus;
  status?: ErpDocumentStatus;
  notes?: string;
  bankAccountId?: string;
}

export type UpdateApPaymentPayload = Partial<CreateApPaymentPayload>;

export async function listApPayments(
  params?: PaginationParams,
): Promise<PaginatedResponse<ErpApPayment>> {
  return apiGet<PaginatedResponse<ErpApPayment>>(
    '/fin/ap-payments',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createApPayment(
  payload: CreateApPaymentPayload,
): Promise<ErpApPayment> {
  const res = await apiPost<ApiResponse<ErpApPayment>>(
    '/fin/ap-payments',
    payload,
  );
  return res.data;
}

export async function updateApPayment(
  id: string,
  payload: UpdateApPaymentPayload,
): Promise<ErpApPayment> {
  const res = await apiPatch<ApiResponse<ErpApPayment>>(
    `/fin/ap-payments/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteApPayment(id: string): Promise<void> {
  await apiDelete<void>(`/fin/ap-payments/${id}`);
}
