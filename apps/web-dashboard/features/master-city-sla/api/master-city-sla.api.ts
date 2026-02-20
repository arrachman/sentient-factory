import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { CitySlaFormState, MasterDataCity, MasterDataCitySla } from '@/features/master-city-sla/model/types';

export async function fetchCitySlaList(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ApiEnvelope<MasterDataCitySla[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataCitySla[]>(`/api/master-data-city-slas?${query.toString()}`);
}

export async function fetchAllCitySlaCityIds(): Promise<string[]> {
  const cityIds: string[] = [];
  let pageCursor = 1;
  let totalPagesCursor = 1;

  do {
    const result = await fetchCitySlaList({
      page: pageCursor,
      limit: 100,
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to load city SLA data');
    }

    const rows = Array.isArray(result.data) ? result.data : [];
    rows.forEach((row) => {
      const cityId = String(row?.cityId ?? '');
      if (cityId) {
        cityIds.push(cityId);
      }
    });

    const metaTotalPages = Number(result.meta?.totalPages ?? 1);
    totalPagesCursor = Number.isInteger(metaTotalPages) && metaTotalPages > 0 ? metaTotalPages : 1;
    pageCursor += 1;
  } while (pageCursor <= totalPagesCursor);

  return Array.from(new Set(cityIds));
}

export async function fetchCityOptions(): Promise<ApiEnvelope<MasterDataCity[]>> {
  const query = new URLSearchParams({ page: '1', limit: '100' });
  return requestJson<MasterDataCity[]>(`/api/master-data-cities?${query.toString()}`);
}

export async function createCitySla(payload: CitySlaFormState): Promise<ApiEnvelope<MasterDataCitySla>> {
  return requestJson<MasterDataCitySla>('/api/master-data-city-slas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cityId: payload.cityId,
      stdLeadTimeDays: Number(payload.stdLeadTimeDays || 0),
      stdReturnDoDays: Number(payload.stdReturnDoDays || 0),
    }),
  });
}

export async function updateCitySla(uuid: string, payload: CitySlaFormState): Promise<ApiEnvelope<MasterDataCitySla>> {
  return requestJson<MasterDataCitySla>(`/api/master-data-city-slas/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cityId: payload.cityId,
      stdLeadTimeDays: Number(payload.stdLeadTimeDays || 0),
      stdReturnDoDays: Number(payload.stdReturnDoDays || 0),
    }),
  });
}

export async function deleteCitySla(uuid: string): Promise<ApiEnvelope<MasterDataCitySla>> {
  return requestJson<MasterDataCitySla>(`/api/master-data-city-slas/${uuid}`, {
    method: 'DELETE',
  });
}
