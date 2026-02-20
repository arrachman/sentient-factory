import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { MasterDataDivision, MasterDivisionFormState } from '@/features/master-division/model/types';

export async function fetchDivisions(params: { page: number; limit: number; search?: string }): Promise<ApiEnvelope<MasterDataDivision[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataDivision[]>(`/api/master-data-divisions?${query.toString()}`);
}

export async function createDivision(payload: MasterDivisionFormState): Promise<ApiEnvelope<MasterDataDivision>> {
  return requestJson<MasterDataDivision>('/api/master-data-divisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code.trim(),
      name: payload.name.trim(),
      description: payload.description.trim() || undefined,
      isActive: payload.isActive,
    }),
  });
}

export async function updateDivision(uuid: string, payload: MasterDivisionFormState): Promise<ApiEnvelope<MasterDataDivision>> {
  return requestJson<MasterDataDivision>(`/api/master-data-divisions/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code.trim(),
      name: payload.name.trim(),
      description: payload.description.trim() || undefined,
      isActive: payload.isActive,
    }),
  });
}

export async function deleteDivision(uuid: string): Promise<ApiEnvelope<MasterDataDivision>> {
  return requestJson<MasterDataDivision>(`/api/master-data-divisions/${uuid}`, {
    method: 'DELETE',
  });
}
