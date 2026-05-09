import { apiClient } from '@/lib/api-client';
import type {
  Client,
  ClientCategory,
  ClientStatus,
  ClientWithHistory,
  CreateClientInput,
  ListResponse,
} from '../model/types';

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  category?: ClientCategory;
  status?: ClientStatus;
  waOptedOut?: boolean;
};

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.search) u.set('search', p.search);
  if (p.gender) u.set('gender', p.gender);
  if (p.category) u.set('category', p.category);
  if (p.status) u.set('status', p.status);
  if (typeof p.waOptedOut === 'boolean') u.set('waOptedOut', String(p.waOptedOut));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const clientApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/client${qs(p)}`),
  get: (id: number) =>
    apiClient.get<{ success: boolean; data: ClientWithHistory }>(`/client/${id}`),
  create: (input: CreateClientInput) =>
    apiClient.post<{ success: boolean; data: Client }>('/client', input),
  update: (id: number, input: Partial<CreateClientInput>) =>
    apiClient.patch<{ success: boolean; data: Client }>(`/client/${id}`, input),
  remove: (id: number) => apiClient.delete<{ success: boolean }>(`/client/${id}`),
};
