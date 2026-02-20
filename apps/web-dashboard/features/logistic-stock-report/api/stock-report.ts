import type {
  MutationRow,
  StockBatchRow,
  StockReportOptions,
  StockReportQueryInput,
} from '@/features/logistic-stock-report/model/types';
import { buildReportQuery, extractRoleNames, pickEntityId, toEntityId } from '@/features/logistic-stock-report/model/utils';

type ApiPayload<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

async function parsePayload<T>(response: Response): Promise<ApiPayload<T> | null> {
  return response.json().catch(() => null);
}

function assertSuccess<T>(response: Response, payload: ApiPayload<T> | null, message: string): asserts payload is ApiPayload<T> {
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || message);
  }
}

export async function fetchStockReportOptions(headers?: HeadersInit): Promise<StockReportOptions> {
  const [profileRes, warehouseRes, supplierRes, itemRes] = await Promise.all([
    fetch('/api/auth/me', {
      cache: 'no-store',
      headers,
    }),
    fetch('/api/master-data-warehouses?page=1&limit=100', {
      cache: 'no-store',
      headers,
    }),
    fetch('/api/master-data-contacts?page=1&limit=100&type=supplier', {
      cache: 'no-store',
      headers,
    }),
    fetch('/api/master-data-items?page=1&limit=100', {
      cache: 'no-store',
      headers,
    }),
  ]);

  const [profilePayload, warehousePayload, supplierPayload, itemPayload] = await Promise.all([
    parsePayload<Record<string, unknown>>(profileRes),
    parsePayload<Array<{ id?: string | number; uuid?: string | number; name: string }>>(warehouseRes),
    parsePayload<Array<{ id?: string | number; uuid?: string | number; code?: string; name?: string }>>(supplierRes),
    parsePayload<Array<{ id?: string | number; uuid?: string | number; code?: string; name?: string }>>(itemRes),
  ]);

  assertSuccess(profileRes, profilePayload, 'Failed to load current user');
  assertSuccess(warehouseRes, warehousePayload, 'Failed to load warehouse options');
  assertSuccess(supplierRes, supplierPayload, 'Failed to load supplier options');
  assertSuccess(itemRes, itemPayload, 'Failed to load item options');

  const warehouses = Array.isArray(warehousePayload.data) ? warehousePayload.data : [];
  const suppliers = Array.isArray(supplierPayload.data) ? supplierPayload.data : [];
  const items = Array.isArray(itemPayload.data) ? itemPayload.data : [];

  const profileData = profilePayload.data ?? {};
  const profileRecord = profileData as {
    roles?: unknown[];
    user?: { roles?: unknown[]; warehouseId?: unknown; warehouseUuid?: unknown; warehouse?: { id?: unknown; uuid?: unknown; name?: unknown } };
    warehouseId?: unknown;
    warehouseUuid?: unknown;
    warehouse?: { id?: unknown; uuid?: unknown; name?: unknown };
  };

  const roleNames = extractRoleNames([
    ...(Array.isArray(profileRecord.roles) ? profileRecord.roles : []),
    ...(Array.isArray(profileRecord.user?.roles) ? profileRecord.user?.roles : []),
  ]);
  const hasAdminRole = roleNames.includes('admin') || roleNames.includes('super_admin');

  const warehouseCandidates = [
    profileRecord.warehouseId,
    profileRecord.user?.warehouseId,
    profileRecord.warehouse?.id,
    profileRecord.user?.warehouse?.id,
    profileRecord.warehouseUuid,
    profileRecord.user?.warehouseUuid,
    profileRecord.warehouse?.uuid,
    profileRecord.user?.warehouse?.uuid,
  ]
    .map((value) => toEntityId(value))
    .filter(Boolean);

  const optionIds = new Set(warehouses.map((warehouse) => pickEntityId(warehouse)).filter(Boolean));
  const profileWarehouseName = String(profileRecord.warehouse?.name ?? profileRecord.user?.warehouse?.name ?? '')
    .trim()
    .toLowerCase();
  const warehouseByName = warehouses.find(
    (warehouse) => profileWarehouseName && String(warehouse?.name ?? '').trim().toLowerCase() === profileWarehouseName,
  );

  const defaultWarehouseId =
    warehouseCandidates.find((candidate) => optionIds.has(candidate)) || pickEntityId(warehouseByName) || '';

  return {
    warehouses,
    suppliers,
    items,
    hasAdminRole,
    defaultWarehouseId,
  };
}

export async function fetchStockMutationReport(
  input: StockReportQueryInput,
  headers?: HeadersInit,
): Promise<MutationRow[]> {
  const query = buildReportQuery(input);
  const response = await fetch(`/api/outbound/report-stock-mutation?${query.toString()}`, {
    cache: 'no-store',
    headers,
  });
  const payload = await parsePayload<MutationRow[]>(response);

  assertSuccess(response, payload, 'Failed to load stock mutation report');
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchStockBatchReport(input: StockReportQueryInput, headers?: HeadersInit): Promise<StockBatchRow[]> {
  const query = buildReportQuery(input);
  const response = await fetch(`/api/outbound/report-stock-batch?${query.toString()}`, {
    cache: 'no-store',
    headers,
  });
  const payload = await parsePayload<StockBatchRow[]>(response);

  assertSuccess(response, payload, 'Failed to load stock batch report');
  return Array.isArray(payload.data) ? payload.data : [];
}
