// ERP Item Information resource API — CRUD for md_item_informations
import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

export interface ErpItemInformation {
  id: string;
  itemId: string;
  longDescription?: string;
  specifications?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  warrantyPeriodMonths?: number;
  tags?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  item?: { id: string; code: string; name: string } | null;
}

export interface CreateErpItemInformationPayload {
  itemId: string;
  longDescription?: string;
  specifications?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  warrantyPeriodMonths?: number;
  tags?: string;
  notes?: string;
}

export type UpdateErpItemInformationPayload = Partial<CreateErpItemInformationPayload>;

const BASE = '/item-informations';

export async function listItemInformations(params?: PaginationParams): Promise<PaginatedResponse<ErpItemInformation>> {
  return apiGet<PaginatedResponse<ErpItemInformation>>(BASE, params as Record<string, string | number | boolean | undefined>);
}

export async function createErpItemInformation(payload: CreateErpItemInformationPayload): Promise<ErpItemInformation> {
  const res = await apiPost<ApiResponse<ErpItemInformation>>(BASE, payload);
  return res.data;
}

export async function updateErpItemInformation(id: string, payload: UpdateErpItemInformationPayload): Promise<ErpItemInformation> {
  const res = await apiPatch<ApiResponse<ErpItemInformation>>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteErpItemInformation(id: string): Promise<void> {
  await apiDelete<void>(`${BASE}/${id}`);
}
