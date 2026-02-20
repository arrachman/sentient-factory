import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { MasterDataCity, MasterDataProvince, MasterCityFormState } from '@/features/master-city/model/types';

export async function fetchCities(params: { page: number; limit: number; search?: string }): Promise<ApiEnvelope<MasterDataCity[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataCity[]>(`/api/master-data-cities?${query.toString()}`);
}

export async function fetchProvinces(): Promise<ApiEnvelope<MasterDataProvince[]>> {
  const query = new URLSearchParams({ page: '1', limit: '100' });
  return requestJson<MasterDataProvince[]>(`/api/master-data-provinces?${query.toString()}`);
}

export async function createCity(payload: MasterCityFormState): Promise<ApiEnvelope<MasterDataCity>> {
  return requestJson<MasterDataCity>('/api/master-data-cities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function updateCity(uuid: string, payload: MasterCityFormState): Promise<ApiEnvelope<MasterDataCity>> {
  return requestJson<MasterDataCity>(`/api/master-data-cities/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteCity(uuid: string): Promise<ApiEnvelope<MasterDataCity>> {
  return requestJson<MasterDataCity>(`/api/master-data-cities/${uuid}`, {
    method: 'DELETE',
  });
}
