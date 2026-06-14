// ERP Partner resource API — CRUD for md_partners
// Endpoints: /partners

import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export interface ListPartnersParams extends PaginationParams {
  isCustomer?: boolean;
  isSupplier?: boolean;
  categoryId?: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErpPartnerAccountRef {
  id: string;
  code: string;
  name: string;
}

export interface ErpPartner {
  id: string;
  code: string;
  name: string;
  categoryId?: string | null;
  isCustomer: boolean;
  isSupplier: boolean;
  isSalesman: boolean;
  taxNumber?: string | null;
  isTaxable: boolean;
  receivableAccountId?: string | null;
  payableAccountId?: string | null;
  receivableAccount?: ErpPartnerAccountRef | null;
  payableAccount?: ErpPartnerAccountRef | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerPayload {
  code: string;
  name: string;
  categoryId?: string;
  isCustomer?: boolean;
  isSupplier?: boolean;
  isSalesman?: boolean;
  taxNumber?: string;
  isTaxable?: boolean;
  receivableAccountId?: string | null;
  payableAccountId?: string | null;
  isActive?: boolean;
}

export interface UpdatePartnerPayload {
  code?: string;
  name?: string;
  categoryId?: string;
  isCustomer?: boolean;
  isSupplier?: boolean;
  isSalesman?: boolean;
  taxNumber?: string;
  isTaxable?: boolean;
  receivableAccountId?: string | null;
  payableAccountId?: string | null;
  isActive?: boolean;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listPartners(
  params?: ListPartnersParams,
): Promise<PaginatedResponse<ErpPartner>> {
  return apiGet<PaginatedResponse<ErpPartner>>('/partners', params as Record<string, string | number | boolean | undefined>);
}

export async function createPartner(
  payload: CreatePartnerPayload,
): Promise<ErpPartner> {
  const res = await apiPost<ApiResponse<ErpPartner>>('/partners', payload);
  return res.data;
}

export async function updatePartner(
  id: string,
  payload: UpdatePartnerPayload,
): Promise<ErpPartner> {
  const res = await apiPatch<ApiResponse<ErpPartner>>(`/partners/${id}`, payload);
  return res.data;
}

export async function deletePartner(id: string): Promise<void> {
  await apiDelete<void>(`/partners/${id}`);
}

export async function bulkUpdatePartnerStatus(ids: string[], isActive: boolean): Promise<{ affected: number }> {
  const res = await apiPatch<{ success: boolean; affected: number }>('/partners/bulk/status', { ids, isActive });
  return { affected: res.affected };
}

export async function bulkDeletePartners(ids: string[]): Promise<{ affected: number }> {
  const res = await apiDelete<{ success: boolean; affected: number }>('/partners/bulk', { ids });
  return { affected: res.affected };
}
