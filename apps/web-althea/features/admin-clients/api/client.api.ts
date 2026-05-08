import { apiClient } from '@/lib/api-client';
import type { Client, CreateClientInput, ListResponse } from '../model/types';

type ListParams = { page?: number; limit?: number; search?: string; gender?: string; waOptedOut?: boolean };

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.search) u.set('search', p.search);
  if (p.gender) u.set('gender', p.gender);
  if (typeof p.waOptedOut === 'boolean') u.set('waOptedOut', String(p.waOptedOut));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const clientApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/client${qs(p)}`),
  create: (input: CreateClientInput) => apiClient.post<{ success: boolean; data: Client }>('/client', input),
  update: (id: number, input: Partial<CreateClientInput>) =>
    apiClient.patch<{ success: boolean; data: Client }>(`/client/${id}`, input),
  remove: (id: number) => apiClient.delete<{ success: boolean }>(`/client/${id}`),
};
