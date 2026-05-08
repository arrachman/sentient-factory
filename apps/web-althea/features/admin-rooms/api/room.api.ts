import { apiClient } from '@/lib/api-client';
import type { CreateRoomInput, ListResponse, Room } from '../model/types';

type ListParams = { page?: number; limit?: number; search?: string; type?: string; isActive?: boolean };

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.search) u.set('search', p.search);
  if (p.type) u.set('type', p.type);
  if (typeof p.isActive === 'boolean') u.set('isActive', String(p.isActive));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const roomApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/room${qs(p)}`),
  create: (input: CreateRoomInput) => apiClient.post<{ success: boolean; data: Room }>('/room', input),
  update: (id: number, input: Partial<CreateRoomInput>) =>
    apiClient.patch<{ success: boolean; data: Room }>(`/room/${id}`, input),
  remove: (id: number) => apiClient.delete<{ success: boolean }>(`/room/${id}`),
};
