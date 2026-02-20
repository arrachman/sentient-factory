import type { Dispatch, SetStateAction } from 'react';
import { type BatchOption } from '@/features/logistic-transaction/ui/batch-multi-select';
import {
  type CityOption,
  type CitySlaOption,
  type ContactOption,
  type DeliveryOrderForm,
  type DeliveryOrderListItem,
  type DivisionOption,
  type ItemOption,
  type WarehouseOption,
} from '@/features/logistic-transaction/model/types';
import { mapApiDetails, normalizeNumber, pickEntityId, toEntityId } from '@/features/logistic-transaction/model/utils';

type SetState<T> = Dispatch<SetStateAction<T>>;

type FetchListParams = {
  targetPage?: number;
  page: number;
  limit: number;
  search: string;
  statusFilter: string;
  token: string;
  setLoading: SetState<boolean>;
  setError: SetState<string>;
  setItems: SetState<DeliveryOrderListItem[]>;
  setPage: SetState<number>;
  setTotalPages: SetState<number>;
  setTotalItems: SetState<number>;
};

export async function fetchOutboundList({
  targetPage,
  page,
  limit,
  search,
  statusFilter,
  token,
  setLoading,
  setError,
  setItems,
  setPage,
  setTotalPages,
  setTotalItems,
}: FetchListParams) {
  const safePage =
    typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0
      ? targetPage
      : page;

  setLoading(true);
  setError('');
  try {
    const query = new URLSearchParams({ page: String(safePage), limit: String(limit) });
    if (search.trim()) {
      query.set('search', search.trim());
    }
    if (statusFilter) {
      query.set('status', statusFilter);
    }

    const response = await fetch(`/api/outbound?${query.toString()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Failed to load delivery orders');
    }

    const normalizedItems: DeliveryOrderListItem[] = (Array.isArray(payload.data) ? payload.data : []).map(
      (
        row: DeliveryOrderListItem & {
          _count?: { details?: number };
          details?: Array<{ batches?: unknown[] }>;
          total_item_types?: number | string;
          total_batches?: number | string;
          total_kg?: number | string;
        },
      ) => {
        const fallbackTotalItemTypes = normalizeNumber(row?._count?.details);
        const fallbackTotalBatches = Array.isArray(row?.details)
          ? row.details.reduce((sum, detail) => sum + (Array.isArray(detail?.batches) ? detail.batches.length : 0), 0)
          : 0;

        return {
          ...row,
          stdLeadTimeDays: normalizeNumber(row?.stdLeadTimeDays),
          totalItemTypes: normalizeNumber(row?.totalItemTypes ?? row?.total_item_types ?? fallbackTotalItemTypes),
          totalBatches: normalizeNumber(row?.totalBatches ?? row?.total_batches ?? fallbackTotalBatches),
          totalQtyPcs: normalizeNumber(row?.totalQtyPcs),
          totalKg: normalizeNumber(row?.totalKg ?? row?.total_kg),
        };
      },
    );

    setItems(normalizedItems);
    const meta = payload?.meta;
    setPage(typeof meta?.page === 'number' ? meta.page : safePage);
    setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
    setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load delivery orders');
  } finally {
    setLoading(false);
  }
}

type FetchOptionsParams = {
  token: string;
  setLoadingOptions: SetState<boolean>;
  setError: SetState<string>;
  setCustomers: SetState<ContactOption[]>;
  setWarehouses: SetState<WarehouseOption[]>;
  setLockedWarehouseId: SetState<string>;
  setCities: SetState<CityOption[]>;
  setItemOptions: SetState<ItemOption[]>;
  setDivisions: SetState<DivisionOption[]>;
  setCitySlas: SetState<CitySlaOption[]>;
  setForm: SetState<DeliveryOrderForm>;
};

export async function fetchOutboundOptions({
  token,
  setLoadingOptions,
  setError,
  setCustomers,
  setWarehouses,
  setLockedWarehouseId,
  setCities,
  setItemOptions,
  setDivisions,
  setCitySlas,
  setForm,
}: FetchOptionsParams) {
  setLoadingOptions(true);
  setError('');
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const [profileRes, customerRes, warehouseRes, cityRes, itemRes, divisionRes, citySlaRes] = await Promise.all([
      fetch('/api/auth/me', { cache: 'no-store', headers }),
      fetch('/api/master-data-contacts?page=1&limit=100&type=customer', { cache: 'no-store', headers }),
      fetch('/api/master-data-warehouses?page=1&limit=100', { cache: 'no-store', headers }),
      fetch('/api/master-data-cities?page=1&limit=100', { cache: 'no-store', headers }),
      fetch('/api/master-data-items?page=1&limit=100&isActive=true', { cache: 'no-store', headers }),
      fetch('/api/master-data-divisions?page=1&limit=100', { cache: 'no-store', headers }),
      fetch('/api/master-data-city-slas?page=1&limit=100', { cache: 'no-store', headers }),
    ]);

    const [profilePayload, customerPayload, warehousePayload, cityPayload, itemPayload, divisionPayload, citySlaPayload] =
      await Promise.all([
        profileRes.json().catch(() => null),
        customerRes.json().catch(() => null),
        warehouseRes.json().catch(() => null),
        cityRes.json().catch(() => null),
        itemRes.json().catch(() => null),
        divisionRes.json().catch(() => null),
        citySlaRes.json().catch(() => null),
      ]);

    if (!profileRes.ok || !profilePayload?.success) {
      throw new Error(profilePayload?.message || 'Failed to load current user profile');
    }
    if (!customerRes.ok || !customerPayload?.success) {
      throw new Error(customerPayload?.message || 'Failed to load customer options');
    }
    if (!warehouseRes.ok || !warehousePayload?.success) {
      throw new Error(warehousePayload?.message || 'Failed to load warehouse options');
    }
    if (!cityRes.ok || !cityPayload?.success) {
      throw new Error(cityPayload?.message || 'Failed to load city options');
    }
    if (!itemRes.ok || !itemPayload?.success) {
      throw new Error(itemPayload?.message || 'Failed to load item options');
    }
    if (!divisionRes.ok || !divisionPayload?.success) {
      throw new Error(divisionPayload?.message || 'Failed to load division options');
    }
    if (!citySlaRes.ok || !citySlaPayload?.success) {
      throw new Error(citySlaPayload?.message || 'Failed to load city SLA options');
    }

    const nextCustomers: ContactOption[] = Array.isArray(customerPayload.data) ? customerPayload.data : [];
    const nextWarehouses: WarehouseOption[] = Array.isArray(warehousePayload.data) ? warehousePayload.data : [];
    const profileWarehouseId = toEntityId(profilePayload?.data?.warehouseId ?? profilePayload?.data?.user?.warehouseId);
    const filteredWarehouses = profileWarehouseId
      ? nextWarehouses.filter((warehouse) => pickEntityId(warehouse) === profileWarehouseId)
      : nextWarehouses;
    const nextCities: CityOption[] = Array.isArray(cityPayload.data) ? cityPayload.data : [];
    const nextItems: ItemOption[] = Array.isArray(itemPayload.data) ? itemPayload.data : [];
    const nextDivisions: DivisionOption[] = Array.isArray(divisionPayload.data) ? divisionPayload.data : [];
    const nextCitySlas: CitySlaOption[] = Array.isArray(citySlaPayload.data) ? citySlaPayload.data : [];

    setCustomers(nextCustomers);
    setWarehouses(filteredWarehouses);
    setLockedWarehouseId(profileWarehouseId);
    setCities(nextCities);
    setItemOptions(nextItems);
    setDivisions(nextDivisions);
    setCitySlas(nextCitySlas);

    const fallbackCustomerId = pickEntityId(nextCustomers[0]);
    const fallbackWarehouseId = profileWarehouseId || pickEntityId(filteredWarehouses[0]);
    const fallbackCustomer = nextCustomers.find((row) => pickEntityId(row) === fallbackCustomerId);
    const fallbackCustomerCity = String(fallbackCustomer?.city ?? '').trim().toLowerCase();
    const fallbackMatchedCity = nextCities.find((city) => String(city.name ?? '').trim().toLowerCase() === fallbackCustomerCity);
    const fallbackCityId = pickEntityId(fallbackMatchedCity) || pickEntityId(nextCities[0]);
    const fallbackSla = nextCitySlas.find((row) => toEntityId(row.cityId) === fallbackCityId);

    setForm((state) => ({
      ...state,
      customerId: state.customerId || fallbackCustomerId,
      warehouseId: state.warehouseId || fallbackWarehouseId,
      destinationCityId: state.destinationCityId || fallbackCityId,
      stdLeadTimeDays: state.stdLeadTimeDays && state.stdLeadTimeDays !== '0' ? state.stdLeadTimeDays : String(fallbackSla?.stdLeadTimeDays ?? 0),
      stdReturnDoDays: state.stdReturnDoDays && state.stdReturnDoDays !== '0' ? state.stdReturnDoDays : String(fallbackSla?.stdReturnDoDays ?? 0),
      bu: state.bu || nextDivisions[0]?.code || '',
      details: state.details.map((row, index) => ({
        ...row,
        itemId: toEntityId(row.itemId) || (index === 0 ? pickEntityId(nextItems[0]) : toEntityId(row.itemId)),
      })),
    }));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load options');
  } finally {
    setLoadingOptions(false);
  }
}

type OpenEditFormParams = {
  uuid: string;
  token: string;
  setError: SetState<string>;
  setEditingUuid: SetState<string | null>;
  setForm: SetState<DeliveryOrderForm>;
  closeItemModal: () => void;
  fetchBatchOptions: (itemId: string, force?: boolean) => Promise<void>;
  setShowForm: SetState<boolean>;
};

export async function openOutboundEditForm({
  uuid,
  token,
  setError,
  setEditingUuid,
  setForm,
  closeItemModal,
  fetchBatchOptions,
  setShowForm,
}: OpenEditFormParams) {
  setError('');
  try {
    const response = await fetch(`/api/outbound/${uuid}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Failed to load delivery order detail');
    }

    const data = payload.data;
    const detailRows = mapApiDetails(data.details);
    setEditingUuid(uuid);
    setForm({
      doNumber: String(data.doNumber ?? ''),
      doDate: data.doDate ? String(data.doDate).slice(0, 10) : '',
      doReceivedDate: data.doReceivedDate ? String(data.doReceivedDate).slice(0, 10) : '',
      customerId: String(data.customerId ?? ''),
      warehouseId: String(data.warehouseId ?? ''),
      destinationCityId: String(data.destinationCityId ?? ''),
      stdLeadTimeDays: String(data.stdLeadTimeDays ?? 0),
      stdReturnDoDays: String(data.stdReturnDoDays ?? 0),
      shippingDate: data.shippingDate ? String(data.shippingDate).slice(0, 10) : '',
      actualReceivedDate: data.actualReceivedDate ? String(data.actualReceivedDate).slice(0, 10) : '',
      receivedBy: String(data.receivedBy ?? ''),
      doScanReturnDate: data.doScanReturnDate ? String(data.doScanReturnDate).slice(0, 10) : '',
      status: String(data.status ?? 'OPEN'),
      bu: String(data.bu ?? ''),
      notes: String(data.notes ?? ''),
      details: detailRows,
    });
    closeItemModal();
    await Promise.all(
      detailRows
        .map((detail) => toEntityId(detail.itemId))
        .filter(Boolean)
        .map((itemId) => fetchBatchOptions(itemId, true)),
    );
    setShowForm(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load delivery order detail');
  }
}

type FetchBatchOptionsParams = {
  itemId: string;
  force?: boolean;
  lockedWarehouseId: string;
  formWarehouseId: string;
  editingUuid: string | null;
  token: string;
  batchOptionsByItemId: Record<string, BatchOption[]>;
  setBatchOptionsByItemId: SetState<Record<string, BatchOption[]>>;
};

export async function fetchOutboundBatchOptions({
  itemId,
  force = false,
  lockedWarehouseId,
  formWarehouseId,
  editingUuid,
  token,
  batchOptionsByItemId,
  setBatchOptionsByItemId,
}: FetchBatchOptionsParams) {
  const normalizedItemId = toEntityId(itemId);
  if (!normalizedItemId) {
    return;
  }
  const normalizedWarehouseId = toEntityId(lockedWarehouseId || formWarehouseId);

  const existingOptions = batchOptionsByItemId[normalizedItemId];
  if (!force && Array.isArray(existingOptions) && existingOptions.length > 0) {
    return;
  }

  try {
    const query = new URLSearchParams({ itemId: normalizedItemId });
    if (normalizedWarehouseId) {
      query.set('warehouseId', normalizedWarehouseId);
    }
    if (editingUuid) {
      query.set('excludeDoId', editingUuid);
    }
    const response = await fetch(`/api/outbound/batch-options?${query.toString()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Failed to load batch options');
    }

    const nextOptions: BatchOption[] = Array.isArray(payload?.data)
      ? payload.data.map((row: { batchNumber?: string; qtyPcs?: number | string }) => ({
          batchNumber: String(row?.batchNumber ?? ''),
          qtyPcs: Number(row?.qtyPcs ?? 0),
        }))
      : [];
    setBatchOptionsByItemId((state) => ({
      ...state,
      [normalizedItemId]: nextOptions.filter((row) => row.batchNumber),
    }));
  } catch {
    setBatchOptionsByItemId((state) => ({ ...state, [normalizedItemId]: [] }));
  }
}
