import { type MasterDataUom, type MasterUomFormState } from '@/features/master-uom/model/types';

type UomListMeta = {
  page: number;
  totalPages: number;
  total: number;
};

type ApiListPayload = {
  success?: boolean;
  message?: string;
  data?: unknown;
  meta?: {
    page?: unknown;
    totalPages?: unknown;
    total?: unknown;
  };
};

type ApiResultPayload = {
  success?: boolean;
  message?: string;
};

export async function fetchMasterUomList(params: {
  page: number;
  limit: number;
  search: string;
  token: string;
}): Promise<{ items: MasterDataUom[]; meta: UomListMeta }> {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search.trim()) {
    query.set('search', params.search.trim());
  }

  const response = await fetch(`/api/master-data-uoms?${query.toString()}`, {
    cache: 'no-store',
    headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined,
  });

  const payload = (await response.json().catch(() => null)) as ApiListPayload | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Failed to load data');
  }

  const meta = payload.meta;
  return {
    items: Array.isArray(payload.data) ? (payload.data as MasterDataUom[]) : [],
    meta: {
      page: typeof meta?.page === 'number' ? meta.page : params.page,
      totalPages: typeof meta?.totalPages === 'number' ? meta.totalPages : 1,
      total: typeof meta?.total === 'number' ? meta.total : 0,
    },
  };
}

export async function saveMasterUom(params: {
  uuid: string | null;
  form: MasterUomFormState;
  token: string;
}): Promise<void> {
  const endpoint = params.uuid ? `/api/master-data-uoms/${params.uuid}` : '/api/master-data-uoms';
  const method = params.uuid ? 'PATCH' : 'POST';

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
    body: JSON.stringify(params.form),
  });

  const result = (await response.json().catch(() => null)) as ApiResultPayload | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to save data');
  }
}

export async function deleteMasterUom(params: { uuid: string; token: string }): Promise<void> {
  const response = await fetch(`/api/master-data-uoms/${params.uuid}`, {
    method: 'DELETE',
    headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined,
  });

  const result = (await response.json().catch(() => null)) as ApiResultPayload | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to delete data');
  }
}
