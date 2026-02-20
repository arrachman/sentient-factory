import type {
  InboundForm,
  InboundListItem,
  ItemOption,
  SupplierOption,
  WarehouseOption,
} from '@/features/logistic-inbound/model/types';
import { mapDetailFromApi, pickEntityId, toEntityId } from '@/features/logistic-inbound/model/utils';

type ApiResult<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
};

function toHeaders(headers?: HeadersInit): HeadersInit | undefined {
  return headers;
}

async function parseJson<T>(response: Response): Promise<ApiResult<T> | null> {
  return response.json().catch(() => null);
}

function assertSuccess<T>(response: Response, payload: ApiResult<T> | null, fallback: string): asserts payload is ApiResult<T> {
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || fallback);
  }
}

export async function fetchInboundList(input: {
  page: number;
  limit: number;
  search: string;
  headers?: HeadersInit;
}): Promise<{ items: InboundListItem[]; page: number; totalPages: number; totalItems: number }> {
  const query = new URLSearchParams({
    page: String(input.page),
    limit: String(input.limit),
  });
  if (input.search.trim()) {
    query.set('search', input.search.trim());
  }

  const response = await fetch(`/api/inbounds?${query.toString()}`, {
    cache: 'no-store',
    headers: toHeaders(input.headers),
  });

  const payload = await parseJson<InboundListItem[]>(response);
  assertSuccess(response, payload, 'Failed to load inbounds');

  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    page: typeof payload.meta?.page === 'number' ? payload.meta.page : input.page,
    totalPages: typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1,
    totalItems: typeof payload.meta?.total === 'number' ? payload.meta.total : 0,
  };
}

export async function fetchInboundPageOptions(headers?: HeadersInit): Promise<{
  suppliers: SupplierOption[];
  warehouses: WarehouseOption[];
  items: ItemOption[];
  currentUserId: string;
  isAdminRole: boolean;
  lockedWarehouseId: string;
}> {
  const [profileRes, supplierRes, warehouseRes, itemRes] = await Promise.all([
    fetch('/api/auth/me', { cache: 'no-store', headers }),
    fetch('/api/master-data-contacts?page=1&limit=100&type=supplier', {
      cache: 'no-store',
      headers,
    }),
    fetch('/api/master-data-warehouses?page=1&limit=100', {
      cache: 'no-store',
      headers,
    }),
    fetch('/api/master-data-items?page=1&limit=100&isActive=true', {
      cache: 'no-store',
      headers,
    }),
  ]);

  const [profilePayload, supplierPayload, warehousePayload, itemPayload] = await Promise.all([
    parseJson<Record<string, unknown>>(profileRes),
    parseJson<SupplierOption[]>(supplierRes),
    parseJson<WarehouseOption[]>(warehouseRes),
    parseJson<ItemOption[]>(itemRes),
  ]);

  assertSuccess(profileRes, profilePayload, 'Failed to load current user');
  assertSuccess(supplierRes, supplierPayload, 'Failed to load supplier options');
  assertSuccess(warehouseRes, warehousePayload, 'Failed to load warehouse options');
  assertSuccess(itemRes, itemPayload, 'Failed to load item options');

  const suppliers = Array.isArray(supplierPayload.data) ? supplierPayload.data : [];
  const allWarehouses = Array.isArray(warehousePayload.data) ? warehousePayload.data : [];
  const items = Array.isArray(itemPayload.data) ? itemPayload.data : [];

  const profileData = (profilePayload.data ?? {}) as {
    id?: unknown;
    warehouseId?: unknown;
    roles?: unknown[];
    user?: {
      warehouseId?: unknown;
      roles?: unknown[];
    };
  };

  const roleNames = [
    ...(Array.isArray(profileData.roles) ? profileData.roles : []),
    ...(Array.isArray(profileData.user?.roles) ? profileData.user?.roles : []),
  ]
    .map((value) => String(value ?? '').trim().toLowerCase())
    .filter(Boolean);

  const isAdminRole = roleNames.includes('super_admin') || roleNames.includes('admin');
  const mappedWarehouseIdRaw = profileData.warehouseId ?? profileData.user?.warehouseId ?? '';
  const mappedWarehouseId = toEntityId(mappedWarehouseIdRaw);

  const matchedWarehouse = allWarehouses.find((warehouse) => {
    const candidateIds = [toEntityId(warehouse.id), toEntityId(warehouse.uuid), pickEntityId(warehouse)].filter(Boolean);
    return candidateIds.includes(mappedWarehouseId);
  });

  const warehouses = isAdminRole
    ? allWarehouses
    : matchedWarehouse
      ? [matchedWarehouse]
      : [];

  return {
    suppliers,
    warehouses,
    items,
    currentUserId: String(profileData.id ?? ''),
    isAdminRole,
    lockedWarehouseId: isAdminRole ? '' : pickEntityId(matchedWarehouse ?? null),
  };
}

export async function fetchInboundDetail(uuid: string, headers?: HeadersInit): Promise<InboundForm> {
  const response = await fetch(`/api/inbounds/${uuid}`, {
    cache: 'no-store',
    headers,
  });
  const payload = await parseJson<Record<string, unknown>>(response);
  assertSuccess(response, payload, 'Failed to load inbound detail');

  const data = (payload.data ?? {}) as {
    transactionNo?: unknown;
    transactionDate?: unknown;
    supplierId?: unknown;
    warehouseId?: unknown;
    status?: unknown;
    notes?: unknown;
    details?: unknown;
  };

  return {
    transactionNo: String(data.transactionNo ?? ''),
    transactionDate: data.transactionDate ? String(data.transactionDate).slice(0, 10) : '',
    supplierId: String(data.supplierId ?? ''),
    warehouseId: String(data.warehouseId ?? ''),
    status: String(data.status ?? 'POSTED') as InboundForm['status'],
    notes: String(data.notes ?? ''),
    details: mapDetailFromApi(Array.isArray(data.details) ? (data.details as never[]) : []),
  };
}

export async function upsertInbound(input: {
  editingUuid: string | null;
  payload: Record<string, unknown>;
  headers?: HeadersInit;
}): Promise<void> {
  const endpoint = input.editingUuid ? `/api/inbounds/${input.editingUuid}` : '/api/inbounds';
  const method = input.editingUuid ? 'PATCH' : 'POST';

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(input.headers ?? {}),
    },
    body: JSON.stringify(input.payload),
  });

  const result = await parseJson<Record<string, unknown>>(response);
  assertSuccess(response, result, 'Failed to save inbound');
}

export async function deleteInbound(uuid: string, headers?: HeadersInit): Promise<void> {
  const response = await fetch(`/api/inbounds/${uuid}`, {
    method: 'DELETE',
    headers,
  });

  const payload = await parseJson<Record<string, unknown>>(response);
  assertSuccess(response, payload, 'Failed to delete inbound');
}
