import { apiClient } from '@/lib/api-client';
import type { CreateServiceInput, ListResponse, Service, UpdateServiceInput } from '../model/types';

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
};

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.search) u.set('search', p.search);
  if (p.category) u.set('category', p.category);
  if (typeof p.isActive === 'boolean') u.set('isActive', String(p.isActive));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const serviceApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/service${qs(p)}`),
  create: (input: CreateServiceInput) =>
    apiClient.post<{ success: boolean; data: Service }>('/service', input),
  update: (id: number, input: UpdateServiceInput) =>
    apiClient.patch<{ success: boolean; data: Service }>(`/service/${id}`, input),
  remove: (id: number) => apiClient.delete<{ success: boolean }>(`/service/${id}`),
};
