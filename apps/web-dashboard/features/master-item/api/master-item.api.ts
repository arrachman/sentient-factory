import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { MasterDataItem, MasterDataUom, MasterItemFormState } from '@/features/master-item/model/types';

export async function fetchMasterItems(params: { page: number; limit: number; search?: string }): Promise<ApiEnvelope<MasterDataItem[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataItem[]>(`/api/master-data-items?${query.toString()}`);
}

export async function fetchMasterUoms(): Promise<ApiEnvelope<MasterDataUom[]>> {
  const query = new URLSearchParams({ page: '1', limit: '100' });
  return requestJson<MasterDataUom[]>(`/api/master-data-uoms?${query.toString()}`);
}

export async function createMasterItem(payload: MasterItemFormState): Promise<ApiEnvelope<MasterDataItem>> {
  return requestJson<MasterDataItem>('/api/master-data-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function updateMasterItem(uuid: string, payload: MasterItemFormState): Promise<ApiEnvelope<MasterDataItem>> {
  return requestJson<MasterDataItem>(`/api/master-data-items/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteMasterItem(uuid: string): Promise<ApiEnvelope<MasterDataItem>> {
  return requestJson<MasterDataItem>(`/api/master-data-items/${uuid}`, {
    method: 'DELETE',
  });
}
