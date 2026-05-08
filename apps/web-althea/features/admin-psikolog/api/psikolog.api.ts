import { apiClient } from '@/lib/api-client';
import type {
  CreatePsikologInput,
  ListResponse,
  Psikolog,
  SingleResponse,
  UpdatePsikologInput,
} from '../model/types';

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  specialty?: string;
};

function buildQuery(params: ListParams): string {
  const usp = new URLSearchParams();
  if (params.page !== undefined) usp.set('page', String(params.page));
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.search) usp.set('search', params.search);
  if (typeof params.isActive === 'boolean') usp.set('isActive', String(params.isActive));
  if (params.specialty) usp.set('specialty', params.specialty);
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

export const psikologApi = {
  list: (params: ListParams = {}) =>
    apiClient.get<ListResponse>(`/psikolog${buildQuery(params)}`),

  getById: (id: number) => apiClient.get<SingleResponse>(`/psikolog/${id}`),

  create: (input: CreatePsikologInput) =>
    apiClient.post<SingleResponse>('/psikolog', input),

  update: (id: number, input: UpdatePsikologInput) =>
    apiClient.patch<SingleResponse>(`/psikolog/${id}`, input),

  remove: (id: number) =>
    apiClient.delete<{ success: boolean; message: string }>(`/psikolog/${id}`),
};

// Re-export Psikolog type untuk konsumen yang import dari sini
export type { Psikolog };
