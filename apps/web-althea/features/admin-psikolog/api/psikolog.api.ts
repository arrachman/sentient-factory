import { apiClient } from '@/lib/api-client';
import type {
  CreatePsikologInput,
  DayAvailability,
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

  /** Self-service: psikolog update jadwal availability sendiri. */
  updateMyAvailability: (weeklyAvailability: Record<string, DayAvailability>) =>
    apiClient.patch<SingleResponse>('/psikolog/me/availability', { weeklyAvailability }),

  // ----- Self-service: Date overrides -----

  listMyDateOverrides: (range?: { from?: string; to?: string }) => {
    const usp = new URLSearchParams();
    if (range?.from) usp.set('from', range.from);
    if (range?.to) usp.set('to', range.to);
    const qs = usp.toString();
    return apiClient.get<{
      success: boolean;
      data: Array<{
        id: number;
        date: string;
        isOpen: boolean;
        slotIndices: number[] | null;
        reason: string | null;
        createdAt: string;
        updatedAt: string;
      }>;
    }>(`/psikolog/me/date-overrides${qs ? `?${qs}` : ''}`);
  },

  upsertMyDateOverride: (input: {
    date: string;
    isOpen: boolean;
    slotIndices?: number[] | null;
    reason?: string | null;
  }) =>
    apiClient.post<{ success: boolean; data: unknown; message: string }>(
      '/psikolog/me/date-overrides',
      input,
    ),

  deleteMyDateOverride: (date: string) =>
    apiClient.delete<{ success: boolean; message: string }>(
      `/psikolog/me/date-overrides/${encodeURIComponent(date)}`,
    ),

  /**
   * List date overrides untuk psikolog tertentu (admin/wizard).
   * Dipakai DateStrip booking wizard supaya hari yang di-override tampil
   * sebagai available walau weekly-nya tutup.
   */
  listDateOverridesForUser: (
    userId: number,
    range?: { from?: string; to?: string },
  ) => {
    const usp = new URLSearchParams();
    if (range?.from) usp.set('from', range.from);
    if (range?.to) usp.set('to', range.to);
    const qs = usp.toString();
    return apiClient.get<{
      success: boolean;
      data: Array<{
        id: number;
        date: string;
        isOpen: boolean;
        slotIndices: number[] | null;
        reason: string | null;
      }>;
    }>(`/psikolog/by-user/${userId}/date-overrides${qs ? `?${qs}` : ''}`);
  },

  /**
   * Resolve effective availability untuk psikolog tertentu di tanggal tertentu.
   * Merge date override (priority) + weeklyAvailability (fallback).
   * Dipakai booking wizard untuk preview slot mana yang available.
   */
  availabilityForDate: (userId: number, date: string) =>
    apiClient.get<{
      success: boolean;
      data: {
        isOpen: boolean;
        /** null = semua slot tersedia (kalau isOpen). Empty = tidak ada. */
        slotIndices: number[] | null;
        source: 'override' | 'weekly' | 'unset';
        reason: string | null;
        psikologName: string;
      };
    }>(`/psikolog/by-user/${userId}/availability-for-date?date=${encodeURIComponent(date)}`),
};

// Re-export Psikolog type untuk konsumen yang import dari sini
export type { Psikolog };
