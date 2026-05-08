import { apiClient } from '@/lib/api-client';
import type { ClinicUser, CreateUserInput, ListResponse } from '../model/types';

type ListParams = { page?: number; limit?: number; search?: string; role?: string; isActive?: boolean };

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.search) u.set('search', p.search);
  if (p.role) u.set('role', p.role);
  if (typeof p.isActive === 'boolean') u.set('isActive', String(p.isActive));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const usersApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/users${qs(p)}`),
  create: (input: CreateUserInput) => apiClient.post<{ success: boolean; data: ClinicUser }>('/users', input),
  update: (id: number, input: Partial<CreateUserInput>) =>
    apiClient.patch<{ success: boolean; data: ClinicUser }>(`/users/${id}`, input),
  remove: (id: number) => apiClient.delete<{ success: boolean }>(`/users/${id}`),
};
