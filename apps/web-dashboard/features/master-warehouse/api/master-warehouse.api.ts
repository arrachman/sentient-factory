import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { MasterDataCity, MasterDataWarehouse, WarehouseFormState } from '@/features/master-warehouse/model/types';

export async function fetchWarehouses(params: { page: number; limit: number; search?: string }): Promise<ApiEnvelope<MasterDataWarehouse[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataWarehouse[]>(`/api/master-data-warehouses?${query.toString()}`);
}

export async function fetchWarehouseCities(): Promise<ApiEnvelope<MasterDataCity[]>> {
  const query = new URLSearchParams({ page: '1', limit: '100' });
  return requestJson<MasterDataCity[]>(`/api/master-data-cities?${query.toString()}`);
}

export async function createWarehouse(payload: WarehouseFormState): Promise<ApiEnvelope<MasterDataWarehouse>> {
  return requestJson<MasterDataWarehouse>('/api/master-data-warehouses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      cityId: payload.cityId,
      locationName: payload.locationName || undefined,
      addressDetail: payload.addressDetail || undefined,
    }),
  });
}

export async function updateWarehouse(uuid: string, payload: WarehouseFormState): Promise<ApiEnvelope<MasterDataWarehouse>> {
  return requestJson<MasterDataWarehouse>(`/api/master-data-warehouses/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      cityId: payload.cityId,
      locationName: payload.locationName || undefined,
      addressDetail: payload.addressDetail || undefined,
    }),
  });
}

export async function deleteWarehouse(uuid: string): Promise<ApiEnvelope<MasterDataWarehouse>> {
  return requestJson<MasterDataWarehouse>(`/api/master-data-warehouses/${uuid}`, {
    method: 'DELETE',
  });
}
