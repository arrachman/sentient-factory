'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Badge } from '@/components/ui/badge';
import { type BatchOption } from '@/features/logistic-transaction/ui/batch-multi-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import {
  type CityOption,
  type CitySlaOption,
  type CompletedActionState,
  type ContactOption,
  type DeliveredActionState,
  type DeliveryActionState,
  type DeliveryOrderDetailForm,
  type DeliveryOrderForm,
  type DeliveryOrderListItem,
  type DivisionOption,
  initialDetail,
  initialForm,
  type ItemOption,
  type WarehouseOption,
} from '@/features/logistic-transaction/model/types';
import {
  addDays,
  buildEntityRef,
  calculateStandardReceivedDate,
  mapApiDetails,
  normalizeNumber,
  parseEntityRef,
  pickEntityId,
  toEntityId,
} from '@/features/logistic-transaction/model/utils';
import { LogisticTransactionItemDialog } from '@/features/logistic-transaction/ui/logistic-transaction-item-dialog';
import { LogisticTransactionListPanel } from '@/features/logistic-transaction/ui/logistic-transaction-list-panel';
import { getClientToken } from '@/shared/auth/token.client';

function getTokenFromCookie() {
  return getClientToken();
}

export function LogisticTransactionPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOutboundRoute = pathname.startsWith('/app/logistic/outbound');
  const isOutboundAddRoute = pathname === '/app/logistic/outbound/add';
  const isOutboundUpdateRoute = pathname === '/app/logistic/outbound/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedUpdateRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedUpdateRefId;

  const [items, setItems] = useState<DeliveryOrderListItem[]>([]);
  const [customers, setCustomers] = useState<ContactOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citySlas, setCitySlas] = useState<CitySlaOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [batchOptionsByItemId, setBatchOptionsByItemId] = useState<
    Record<string, BatchOption[]>
  >({});
  const [divisions, setDivisions] = useState<DivisionOption[]>([]);
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');

  const [form, setForm] = useState<DeliveryOrderForm>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deliverySubmittingId, setDeliverySubmittingId] = useState<string | null>(null);
  const [deliveredSubmittingId, setDeliveredSubmittingId] = useState<string | null>(null);
  const [completedSubmittingId, setCompletedSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [itemModalError, setItemModalError] = useState('');
  const [draftDetail, setDraftDetail] = useState<DeliveryOrderDetailForm>(initialDetail());
  const [deliveryAction, setDeliveryAction] = useState<DeliveryActionState | null>(null);
  const [deliveredAction, setDeliveredAction] = useState<DeliveredActionState | null>(null);
  const [completedAction, setCompletedAction] = useState<CompletedActionState | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);
  const itemOptionMap = useMemo(() => {
    const map = new Map<string, ItemOption>();
    itemOptions.forEach((item) => {
      const id = pickEntityId(item);
      if (id) {
        map.set(id, item);
      }
    });
    return map;
  }, [itemOptions]);

  const createDefaultDetail = useCallback(
    () => ({
      ...initialDetail(),
      itemId: pickEntityId(itemOptions[0]),
    }),
    [itemOptions],
  );

  const getBatchQtyPcs = useCallback(
    (itemId: string, batchNumber: string) => {
      const options = batchOptionsByItemId[itemId] || [];
      const match = options.find((option) => option.batchNumber === batchNumber);
      const parsed = Number(match?.qtyPcs ?? 0);
      return Number.isFinite(parsed) ? parsed : 0;
    },
    [batchOptionsByItemId],
  );

  const getSelectedBatchQtyPcs = useCallback(
    (
      itemId: string,
      batchNumber: string,
      batchQtyMap: Record<string, string>,
    ) => {
      const raw = batchQtyMap[batchNumber];
      const requestedQty = Math.floor(Number(raw));
      const maxQtyPcs = getBatchQtyPcs(itemId, batchNumber);

      if (Number.isFinite(maxQtyPcs) && maxQtyPcs > 0) {
        if (raw == null || raw === '') {
          return maxQtyPcs;
        }
        if (!Number.isFinite(requestedQty) || requestedQty < 0) {
          return 0;
        }
        return Math.min(requestedQty, maxQtyPcs);
      }

      // Fallback when max from options is unavailable: rely on selected qty input.
      if (!Number.isFinite(requestedQty) || requestedQty < 0) {
        return 0;
      }
      return requestedQty;
    },
    [getBatchQtyPcs],
  );

  const getAutoQtyPcs = useCallback(
    (
      itemId: string,
      batchNumbers: string[],
      batchQtyMap: Record<string, string>,
    ) => {
      if (!itemId || batchNumbers.length === 0) {
        return '';
      }
      const total = batchNumbers.reduce(
        (sum, batchNumber) =>
          sum + getSelectedBatchQtyPcs(itemId, batchNumber, batchQtyMap),
        0,
      );
      return String(total);
    },
    [getSelectedBatchQtyPcs],
  );

  const fetchBatchOptions = useCallback(
    async (itemId: string, force = false) => {
      const normalizedItemId = toEntityId(itemId);
      if (!normalizedItemId) {
        return;
      }
      const normalizedWarehouseId = toEntityId(lockedWarehouseId || form.warehouseId);

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
        const response = await fetch(
          `/api/outbound/batch-options?${query.toString()}`,
          {
            cache: 'no-store',
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          },
        );
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
        setBatchOptionsByItemId((state) => ({
          ...state,
          [normalizedItemId]: [],
        }));
      }
    },
    [batchOptionsByItemId, editingUuid, form.warehouseId, lockedWarehouseId, token],
  );

  const summary = useMemo(() => {
    const activeRows = form.details.filter(
      (row) => toEntityId(row.itemId) && row.batchNumbers.length > 0,
    );
    const itemTypeCount = new Set(activeRows.map((row) => toEntityId(row.itemId)))
      .size;
    const totalBatch = activeRows.reduce(
      (sum, row) => sum + row.batchNumbers.length,
      0,
    );

    let totalPcs = 0;
    let totalKg = 0;
    activeRows.forEach((row) => {
      totalPcs +=
        Number(getAutoQtyPcs(row.itemId, row.batchNumbers, row.batchQtyMap) || 0) ||
        0;
      totalKg += Number(row.qtyKg || 0) || 0;
    });

    return {
      itemTypeCount,
      totalBatch,
      totalPcs,
      totalKg,
    };
  }, [form.details, getAutoQtyPcs]);

  const buOptions = useMemo(() => {
    const existing = divisions.some((division) => division.code === form.bu);
    if (!form.bu || existing) {
      return divisions;
    }
    return [{ uuid: 'current-bu', code: form.bu, name: form.bu }, ...divisions];
  }, [divisions, form.bu]);

  const citySlaByCityId = useMemo(() => {
    return new Map(citySlas.map((row) => [toEntityId(row.cityId), row]));
  }, [citySlas]);

  const resolveDefaultByCustomer = useCallback(
    (customerId: string) => {
      const selectedCustomer = customers.find(
        (row) => pickEntityId(row) === customerId,
      );
      const customerCity = String(selectedCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      if (!customerCity) {
        return null;
      }

      const matchedCity = cities.find(
        (city) => String(city.name ?? '').trim().toLowerCase() === customerCity,
      );
      if (!matchedCity) {
        return null;
      }

      const cityId = pickEntityId(matchedCity);
      const sla = citySlaByCityId.get(cityId);
      return {
        destinationCityId: cityId,
        stdLeadTimeDays: String(sla?.stdLeadTimeDays ?? 0),
        stdReturnDoDays: String(sla?.stdReturnDoDays ?? 0),
      };
    },
    [cities, customers, citySlaByCityId],
  );

  const fetchList = async (targetPage = page) => {
    const safePage =
      typeof targetPage === 'number' &&
      Number.isInteger(targetPage) &&
      targetPage > 0
        ? targetPage
        : 1;

    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({
        page: String(safePage),
        limit: String(limit),
      });
      if (search.trim()) {
        query.set('search', search.trim());
      }
      if (statusFilter) {
        query.set('status', statusFilter);
      }

      const response = await fetch(`/api/outbound?${query.toString()}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load delivery orders');
      }

      const normalizedItems: DeliveryOrderListItem[] = (
        Array.isArray(payload.data) ? payload.data : []
      ).map(
        (
          row: DeliveryOrderListItem & {
            _count?: { details?: number };
            details?: Array<{ batches?: unknown[] }>;
            total_item_types?: number | string;
            total_batches?: number | string;
            total_kg?: number | string;
          },
        ) => {
          const fallbackTotalItemTypes = normalizeNumber(
            row?._count?.details,
          );
          const fallbackTotalBatches = Array.isArray(row?.details)
            ? row.details.reduce(
                (sum, detail) =>
                  sum + (Array.isArray(detail?.batches) ? detail.batches.length : 0),
                0,
              )
            : 0;

          return {
            ...row,
            stdLeadTimeDays: normalizeNumber(row?.stdLeadTimeDays),
            totalItemTypes: normalizeNumber(
              row?.totalItemTypes ?? row?.total_item_types ?? fallbackTotalItemTypes,
            ),
            totalBatches: normalizeNumber(
              row?.totalBatches ?? row?.total_batches ?? fallbackTotalBatches,
            ),
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
      setError(
        err instanceof Error ? err.message : 'Failed to load delivery orders',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    setError('');
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      const [profileRes, customerRes, warehouseRes, cityRes, itemRes, divisionRes, citySlaRes] =
        await Promise.all([
          fetch('/api/auth/me', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-contacts?page=1&limit=100&type=customer', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-warehouses?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-cities?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-items?page=1&limit=100&isActive=true', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-divisions?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-city-slas?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
        ]);

      const [
        profilePayload,
        customerPayload,
        warehousePayload,
        cityPayload,
        itemPayload,
        divisionPayload,
        citySlaPayload,
      ] = await Promise.all([
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
        throw new Error(
          customerPayload?.message || 'Failed to load customer options',
        );
      }
      if (!warehouseRes.ok || !warehousePayload?.success) {
        throw new Error(
          warehousePayload?.message || 'Failed to load warehouse options',
        );
      }
      if (!cityRes.ok || !cityPayload?.success) {
        throw new Error(cityPayload?.message || 'Failed to load city options');
      }
      if (!itemRes.ok || !itemPayload?.success) {
        throw new Error(itemPayload?.message || 'Failed to load item options');
      }
      if (!divisionRes.ok || !divisionPayload?.success) {
        throw new Error(
          divisionPayload?.message || 'Failed to load division options',
        );
      }
      if (!citySlaRes.ok || !citySlaPayload?.success) {
        throw new Error(
          citySlaPayload?.message || 'Failed to load city SLA options',
        );
      }

      const nextCustomers: ContactOption[] = Array.isArray(customerPayload.data)
        ? customerPayload.data
        : [];
      const nextWarehouses: WarehouseOption[] = Array.isArray(warehousePayload.data)
        ? warehousePayload.data
        : [];
      const profileWarehouseId = toEntityId(
        profilePayload?.data?.warehouseId ?? profilePayload?.data?.user?.warehouseId,
      );
      const filteredWarehouses = profileWarehouseId
        ? nextWarehouses.filter(
            (warehouse) => pickEntityId(warehouse) === profileWarehouseId,
          )
        : nextWarehouses;
      const nextCities: CityOption[] = Array.isArray(cityPayload.data)
        ? cityPayload.data
        : [];
      const nextItems: ItemOption[] = Array.isArray(itemPayload.data)
        ? itemPayload.data
        : [];
      const nextDivisions: DivisionOption[] = Array.isArray(
        divisionPayload.data,
      )
        ? divisionPayload.data
        : [];
      const nextCitySlas: CitySlaOption[] = Array.isArray(citySlaPayload.data)
        ? citySlaPayload.data
        : [];

      setCustomers(nextCustomers);
      setWarehouses(filteredWarehouses);
      setLockedWarehouseId(profileWarehouseId);
      setCities(nextCities);
      setItemOptions(nextItems);
      setDivisions(nextDivisions);
      setCitySlas(nextCitySlas);

      const fallbackCustomerId = pickEntityId(nextCustomers[0]);
      const fallbackWarehouseId =
        profileWarehouseId || pickEntityId(filteredWarehouses[0]);
      const fallbackCustomer = nextCustomers.find(
        (row) => pickEntityId(row) === fallbackCustomerId,
      );
      const fallbackCustomerCity = String(fallbackCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      const fallbackMatchedCity = nextCities.find(
        (city) =>
          String(city.name ?? '').trim().toLowerCase() === fallbackCustomerCity,
      );
      const fallbackCityId = pickEntityId(fallbackMatchedCity) || pickEntityId(nextCities[0]);
      const fallbackSla = nextCitySlas.find(
        (row) => toEntityId(row.cityId) === fallbackCityId,
      );

      setForm((state) => ({
        ...state,
        customerId: state.customerId || fallbackCustomerId,
        warehouseId: state.warehouseId || fallbackWarehouseId,
        destinationCityId: state.destinationCityId || fallbackCityId,
        stdLeadTimeDays:
          state.stdLeadTimeDays && state.stdLeadTimeDays !== '0'
            ? state.stdLeadTimeDays
            : String(fallbackSla?.stdLeadTimeDays ?? 0),
        stdReturnDoDays:
          state.stdReturnDoDays && state.stdReturnDoDays !== '0'
            ? state.stdReturnDoDays
            : String(fallbackSla?.stdReturnDoDays ?? 0),
        bu: state.bu || nextDivisions[0]?.code || '',
        details: state.details.map((row, index) => ({
          ...row,
          itemId:
            toEntityId(row.itemId) ||
            (index === 0 ? pickEntityId(nextItems[0]) : toEntityId(row.itemId)),
        })),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options');
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = useCallback(() => {
    const fallbackCustomerId = pickEntityId(customers[0]);
    const fallbackWarehouseId = lockedWarehouseId || pickEntityId(warehouses[0]);
    const defaults = resolveDefaultByCustomer(fallbackCustomerId);
    setEditingUuid(null);
    setForm({
      ...initialForm,
      doDate: new Date().toISOString().slice(0, 10),
      doReceivedDate: new Date().toISOString().slice(0, 10),
      customerId: fallbackCustomerId,
      warehouseId: fallbackWarehouseId,
      destinationCityId: defaults?.destinationCityId || pickEntityId(cities[0]),
      stdLeadTimeDays: defaults?.stdLeadTimeDays || '0',
      stdReturnDoDays: defaults?.stdReturnDoDays || '0',
      bu: divisions[0]?.code || '',
      details: [],
    });
    setIsItemModalOpen(false);
    setEditingDetailIndex(null);
    setItemModalError('');
    setDraftDetail(createDefaultDetail());
    setShowForm(true);
  }, [
    cities,
    createDefaultDetail,
    customers,
    divisions,
    lockedWarehouseId,
    resolveDefaultByCustomer,
    warehouses,
  ]);

  useEffect(() => {
    if (!isOutboundAddRoute || loadingOptions) {
      return;
    }

    if (!showForm || editingUuid) {
      openCreateForm();
    }
  }, [
    editingUuid,
    isOutboundAddRoute,
    loadingOptions,
    openCreateForm,
    showForm,
  ]);

  useEffect(() => {
    if (!isOutboundUpdateRoute || loadingOptions) {
      return;
    }
    if (!updateId) {
      setError('Delivery order reference wajib diisi untuk halaman update.');
      return;
    }
    if (showForm && editingUuid === updateId) {
      return;
    }
    void openEditForm(updateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUuid, isOutboundUpdateRoute, loadingOptions, showForm, updateId]);

  useEffect(() => {
    if (!showForm) {
      return;
    }

    const itemIds = Array.from(
      new Set(
        form.details
          .map((detail) => toEntityId(detail.itemId))
          .filter(Boolean),
      ),
    );
    itemIds.forEach((itemId) => {
      void fetchBatchOptions(itemId, true);
    });
  }, [fetchBatchOptions, form.details, showForm]);

  const closeForm = () => {
    if (isOutboundRoute) {
      router.push('/app/logistic/outbound');
      return;
    }
    setShowForm(false);
  };

  const openEditForm = async (uuid: string) => {
    setError('');
    try {
      const response = await fetch(`/api/outbound/${uuid}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message || 'Failed to load delivery order detail',
        );
      }

      const data = payload.data;
      const detailRows = mapApiDetails(data.details);
      setEditingUuid(uuid);
      setForm({
        doNumber: String(data.doNumber ?? ''),
        doDate: data.doDate ? String(data.doDate).slice(0, 10) : '',
        doReceivedDate: data.doReceivedDate
          ? String(data.doReceivedDate).slice(0, 10)
          : '',
        customerId: String(data.customerId ?? ''),
        warehouseId: String(data.warehouseId ?? ''),
        destinationCityId: String(data.destinationCityId ?? ''),
        stdLeadTimeDays: String(data.stdLeadTimeDays ?? 0),
        stdReturnDoDays: String(data.stdReturnDoDays ?? 0),
        shippingDate: data.shippingDate
          ? String(data.shippingDate).slice(0, 10)
          : '',
        actualReceivedDate: data.actualReceivedDate
          ? String(data.actualReceivedDate).slice(0, 10)
          : '',
        receivedBy: String(data.receivedBy ?? ''),
        doScanReturnDate: data.doScanReturnDate
          ? String(data.doScanReturnDate).slice(0, 10)
          : '',
        status: String(data.status ?? 'OPEN'),
        bu: String(data.bu ?? ''),
        notes: String(data.notes ?? ''),
        details: detailRows,
      });
      setIsItemModalOpen(false);
      setEditingDetailIndex(null);
      setItemModalError('');
      setDraftDetail(createDefaultDetail());
      await Promise.all(
        detailRows
          .map((detail) => toEntityId(detail.itemId))
          .filter(Boolean)
          .map((itemId) => fetchBatchOptions(itemId, true)),
      );
      setShowForm(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load delivery order detail',
      );
    }
  };

  const upsert = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const normalizedDetails = form.details.flatMap((row) => {
        const itemId = toEntityId(row.itemId);
        const batchNumbers = row.batchNumbers
          .map((batchNumber) => String(batchNumber).trim())
          .filter(Boolean);
        const qtyKgRaw = String(row.qtyKg ?? '').trim();
        if (!itemId || batchNumbers.length === 0 || !qtyKgRaw) {
          return [];
        }

        const qtyKgTotal = Number(qtyKgRaw);
        if (!Number.isFinite(qtyKgTotal) || qtyKgTotal <= 0) {
          throw new Error('Qty KG harus lebih dari 0.');
        }

        const normalizedBatches = Array.from(new Set(batchNumbers));
        const batchCount = normalizedBatches.length;
        const qtyKgBase = Math.floor((qtyKgTotal / batchCount) * 1000) / 1000;
        const qtyKgRemainder = Math.round(
          (qtyKgTotal - qtyKgBase * (batchCount - 1)) * 1000,
        ) / 1000;

        return normalizedBatches.map((batchNumber, index) => ({
          itemId,
          batchNumber,
          qtyPcs: getSelectedBatchQtyPcs(itemId, batchNumber, row.batchQtyMap),
          qtyKg: index === batchCount - 1 ? qtyKgRemainder : qtyKgBase,
          notes: String(row.notes ?? '').trim(),
        }));
      });

      const hasInvalidBatchQty = normalizedDetails.some((detail) => detail.qtyPcs <= 0);
      if (hasInvalidBatchQty) {
        throw new Error('Qty PCS per batch harus lebih dari 0.');
      }

      if (normalizedDetails.length === 0) {
        throw new Error('Minimal satu baris detail batch item wajib diisi.');
      }
      const effectiveWarehouseId = lockedWarehouseId || toEntityId(form.warehouseId);
      if (!effectiveWarehouseId) {
        throw new Error('Warehouse wajib dipilih.');
      }

      const payload = {
        doNumber: form.doNumber.trim(),
        doDate: form.doDate,
        doReceivedDate: form.doReceivedDate,
        customerId: form.customerId,
        warehouseId: effectiveWarehouseId,
        destinationCityId: form.destinationCityId || undefined,
        stdLeadTimeDays: Number(form.stdLeadTimeDays || 0),
        stdReturnDoDays: Number(form.stdReturnDoDays || 0),
        shippingDate: form.shippingDate || undefined,
        actualReceivedDate: form.actualReceivedDate || undefined,
        receivedBy: form.receivedBy || undefined,
        doScanReturnDate: form.doScanReturnDate || undefined,
        status: form.status,
        bu: form.bu || undefined,
        notes: form.notes || undefined,
        details: normalizedDetails.map((row) => ({
          itemId: row.itemId,
          batchNumber: row.batchNumber,
          qtyPcs: row.qtyPcs,
          qtyKg: row.qtyKg,
          notes: row.notes || undefined,
        })),
      };

      const endpoint = editingUuid
        ? `/api/outbound/${editingUuid}`
        : '/api/outbound';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save delivery order');
      }

      if (isOutboundAddRoute && !editingUuid) {
        router.push('/app/logistic/outbound');
      } else {
        setShowForm(false);
      }
      setEditingUuid(null);
      await fetchList(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save delivery order',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (uuid: string) => {
    const ok = window.confirm('Delete this Delivery Order?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/outbound/${uuid}`, {
        method: 'DELETE',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete delivery order');
      }

      await fetchList(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete delivery order',
      );
    }
  };

  const buildDeliveryActionState = (rowId: string, item: DeliveryOrderListItem): DeliveryActionState => ({
    id: rowId,
    shippingDate: item.shippingDate
      ? String(item.shippingDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    stdLeadTimeDays: normalizeNumber(item.stdLeadTimeDays),
  });

  const buildDeliveredActionState = (rowId: string, item: DeliveryOrderListItem): DeliveredActionState => ({
    id: rowId,
    shippingDate: item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
    stdLeadTimeDays: normalizeNumber(item.stdLeadTimeDays),
    actualReceivedDate: item.actualReceivedDate
      ? String(item.actualReceivedDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    receivedBy: '',
    doScanReturnDate: item.doScanReturnDate
      ? String(item.doScanReturnDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });

  const buildCompletedActionState = (rowId: string, item: DeliveryOrderListItem): CompletedActionState => ({
    id: rowId,
    shippingDate: item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
    doScanReturnDate: item.doScanReturnDate
      ? String(item.doScanReturnDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    stdReturnDoDays: normalizeNumber(item.stdReturnDoDays),
    stdDoReturnDate: calculateStandardReceivedDate(
      item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
      normalizeNumber(item.stdReturnDoDays),
    ),
  });

  const setToDelivery = async () => {
    if (!deliveryAction) {
      return;
    }
    if (!deliveryAction.shippingDate) {
      setError('Tanggal kirim wajib diisi.');
      return;
    }

    setError('');
    setDeliverySubmittingId(deliveryAction.id);
    try {
      const response = await fetch(`/api/outbound/${deliveryAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          status: 'DELIVERY',
          shippingDate: deliveryAction.shippingDate,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update delivery status');
      }

      setDeliveryAction(null);
      setDeliveredAction(null);
      setCompletedAction(null);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery status');
    } finally {
      setDeliverySubmittingId(null);
    }
  };

  const setToDelivered = async () => {
    if (!deliveredAction) {
      return;
    }
    if (!deliveredAction.actualReceivedDate) {
      setError('Aktual barang diterima wajib diisi.');
      return;
    }
    if (!deliveredAction.receivedBy.trim()) {
      setError('Diterima oleh wajib diisi.');
      return;
    }
    if (!deliveredAction.doScanReturnDate) {
      setError('Tanggal scan DO kembali wajib diisi.');
      return;
    }

    setError('');
    setDeliveredSubmittingId(deliveredAction.id);
    try {
      const response = await fetch(`/api/outbound/${deliveredAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          status: 'DELIVERED',
          actualReceivedDate: deliveredAction.actualReceivedDate,
          receivedBy: deliveredAction.receivedBy.trim(),
          doScanReturnDate: deliveredAction.doScanReturnDate,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update delivered status');
      }

      setDeliveredAction(null);
      setDeliveryAction(null);
      setCompletedAction(null);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivered status');
    } finally {
      setDeliveredSubmittingId(null);
    }
  };

  const setToCompleted = async () => {
    if (!completedAction) {
      return;
    }
    if (!completedAction.doScanReturnDate) {
      setError('Tanggal DO kembali wajib diisi.');
      return;
    }
    if (!completedAction.stdDoReturnDate) {
      setError('STD DO Kembali tidak dapat dihitung. Pastikan Tanggal kirim dan Std return DO terisi.');
      return;
    }

    setError('');
    setCompletedSubmittingId(completedAction.id);
    try {
      const response = await fetch(`/api/outbound/${completedAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          doScanReturnDate: completedAction.doScanReturnDate,
          stdReturnDoDays: completedAction.stdReturnDoDays,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update completed status');
      }

      setCompletedAction(null);
      setDeliveredAction(null);
      setDeliveryAction(null);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update completed status');
    } finally {
      setCompletedSubmittingId(null);
    }
  };

  const draftItemTotalPcs = useMemo(
    () =>
      Number(
        getAutoQtyPcs(
          draftDetail.itemId,
          draftDetail.batchNumbers,
          draftDetail.batchQtyMap,
        ) || 0,
      ) || 0,
    [draftDetail.batchNumbers, draftDetail.batchQtyMap, draftDetail.itemId, getAutoQtyPcs],
  );
  const draftItemId = useMemo(
    () => toEntityId(draftDetail.itemId),
    [draftDetail.itemId],
  );

  useEffect(() => {
    if (!isItemModalOpen || !draftItemId) {
      return;
    }
    void fetchBatchOptions(draftItemId, true);
  }, [draftItemId, fetchBatchOptions, isItemModalOpen]);

  const openAddItemModal = () => {
    setEditingDetailIndex(null);
    setDraftDetail(createDefaultDetail());
    setItemModalError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = async (index: number) => {
    const existing = form.details[index];
    if (!existing) {
      return;
    }
    const itemId = toEntityId(existing.itemId);
    if (itemId) {
      await fetchBatchOptions(itemId, true);
    }
    setEditingDetailIndex(index);
    setDraftDetail({
      ...existing,
      batchNumbers: [...existing.batchNumbers],
      batchQtyMap: { ...existing.batchQtyMap },
    });
    setItemModalError('');
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingDetailIndex(null);
    setItemModalError('');
    setDraftDetail(createDefaultDetail());
  };

  const setDraftField = (key: 'qtyKg' | 'notes', value: string) => {
    setDraftDetail((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const setDraftItemId = async (value: string) => {
    const normalizedItemId = toEntityId(value);
    setDraftDetail((state) => ({
      ...state,
      itemId: normalizedItemId,
      batchNumbers: [],
      batchQtyMap: {},
    }));
    if (normalizedItemId) {
      await fetchBatchOptions(normalizedItemId, true);
    }
  };

  const setDraftBatchNumbers = (batchNumbers: string[]) => {
    setDraftDetail((state) => {
      const normalizedBatchNumbers = Array.from(
        new Set(batchNumbers.map((batchNumber) => String(batchNumber).trim()).filter(Boolean)),
      );
      const nextBatchQtyMap = normalizedBatchNumbers.reduce<Record<string, string>>(
        (acc, batchNumber) => {
          const maxQtyPcs = getBatchQtyPcs(state.itemId, batchNumber);
          const previousValue = state.batchQtyMap[batchNumber];
          if (previousValue == null || previousValue === '') {
            acc[batchNumber] = String(maxQtyPcs);
            return acc;
          }

          const parsed = Math.floor(Number(previousValue));
          if (!Number.isFinite(parsed) || parsed < 0) {
            acc[batchNumber] = String(maxQtyPcs);
            return acc;
          }

          acc[batchNumber] = String(Math.min(parsed, maxQtyPcs));
          return acc;
        },
        {},
      );

      return {
        ...state,
        batchNumbers: normalizedBatchNumbers,
        batchQtyMap: nextBatchQtyMap,
      };
    });
  };

  const setDraftBatchQty = (batchNumber: string, rawValue: string) => {
    setDraftDetail((state) => {
      const maxQtyPcs = getBatchQtyPcs(state.itemId, batchNumber);
      if (rawValue === '') {
        return {
          ...state,
          batchQtyMap: {
            ...state.batchQtyMap,
            [batchNumber]: '',
          },
        };
      }

      const parsed = Math.floor(Number(rawValue));
      if (!Number.isFinite(parsed) || parsed < 0) {
        return state;
      }

      const clamped = Math.min(parsed, maxQtyPcs);
      return {
        ...state,
        batchQtyMap: {
          ...state.batchQtyMap,
          [batchNumber]: String(clamped),
        },
      };
    });
  };

  const saveDraftItem = () => {
    const itemId = toEntityId(draftDetail.itemId);
    if (!itemId) {
      setItemModalError('Item wajib dipilih.');
      return;
    }

    const selectedBatchNumbers = Array.from(
      new Set(
        draftDetail.batchNumbers
          .map((batchNumber) => String(batchNumber).trim())
          .filter(Boolean),
      ),
    );
    if (selectedBatchNumbers.length === 0) {
      setItemModalError('Minimal satu batch wajib dipilih.');
      return;
    }

    const qtyKg = Number(draftDetail.qtyKg || 0);
    if (!Number.isFinite(qtyKg) || qtyKg <= 0) {
      setItemModalError('Qty KG wajib diisi dan harus lebih dari 0.');
      return;
    }

    const nextBatchQtyMap = selectedBatchNumbers.reduce<Record<string, string>>(
      (acc, batchNumber) => {
        const selectedQty = getSelectedBatchQtyPcs(
          itemId,
          batchNumber,
          draftDetail.batchQtyMap,
        );
        acc[batchNumber] = String(selectedQty);
        return acc;
      },
      {},
    );

    const normalizedDetail: DeliveryOrderDetailForm = {
      ...draftDetail,
      itemId,
      batchNumbers: selectedBatchNumbers,
      batchQtyMap: nextBatchQtyMap,
      qtyKg: String(qtyKg),
      notes: draftDetail.notes.trim(),
    };

    setForm((state) => {
      if (editingDetailIndex == null) {
        return {
          ...state,
          details: [...state.details, normalizedDetail],
        };
      }
      return {
        ...state,
        details: state.details.map((detail, index) =>
          index === editingDetailIndex ? normalizedDetail : detail,
        ),
      };
    });

    closeItemModal();
  };

  const removeDetailRow = (index: number) => {
    setForm((state) => ({
      ...state,
      details: state.details.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>
            Logistic Outbound - Delivery Order
          </ToolbarPageTitle>
          <ToolbarDescription>
            Kelola proses logistic outbound: dokumen DO, pengiriman per batch,
            monitoring SLA kirim, dan pengembalian dokumen.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          {!showForm ? (
            <>
              <Button
                onClick={() => {
                  if (isOutboundRoute) {
                    router.push('/app/logistic/outbound/add');
                    return;
                  }
                  openCreateForm();
                }}
              >
                <Plus />
                Add DO
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchList(page)}
                disabled={loading}
              >
                <RefreshCw />
                Refresh
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={closeForm}>
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <LogisticTransactionListPanel
            items={items}
            loading={loading}
            search={search}
            statusFilter={statusFilter}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            deliveryAction={deliveryAction}
            deliveredAction={deliveredAction}
            completedAction={completedAction}
            deliverySubmittingId={deliverySubmittingId}
            deliveredSubmittingId={deliveredSubmittingId}
            completedSubmittingId={completedSubmittingId}
            setDeliveryAction={setDeliveryAction}
            setDeliveredAction={setDeliveredAction}
            setCompletedAction={setCompletedAction}
            buildDeliveryActionState={buildDeliveryActionState}
            buildDeliveredActionState={buildDeliveredActionState}
            buildCompletedActionState={buildCompletedActionState}
            onSetToDelivery={() => {
              void setToDelivery();
            }}
            onSetToDelivered={() => {
              void setToDelivered();
            }}
            onSetToCompleted={() => {
              void setToCompleted();
            }}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onSearchSubmit={() => fetchList(1)}
            onSearchReset={() => {
              setSearch('');
              fetchList(1);
            }}
            onPageChange={fetchList}
            onEditRow={(rowId, item) => {
              if (isOutboundRoute) {
                const ref = buildEntityRef(rowId, item.createdAt);
                router.push(`/app/logistic/outbound/update?ref=${encodeURIComponent(ref)}`);
                return;
              }
              void openEditForm(rowId);
            }}
            onDeleteRow={(rowId) => {
              void remove(rowId);
            }}
          />
        ) : (
          <form onSubmit={upsert} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-5">
                <div className="rounded-lg border p-5">
                  <h3 className="mb-4 text-base font-semibold">
                    Informasi Delivery Order
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nomor DO</Label>
                      <Input
                        value={form.doNumber}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doNumber: e.target.value,
                          }))
                        }
                        placeholder="DO-2026-0001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>BU (Bagian Usaha)</Label>
                      <AutocompleteSelect
                        value={form.bu}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, bu: value }))
                        }
                        options={buOptions.map((division) => ({
                          value: division.code,
                          label: `${division.code} - ${division.name}`,
                        }))}
                        placeholder="Select BU"
                        searchPlaceholder="Search BU..."
                        emptyText="No BU found."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal DO</Label>
                      <Input
                        type="date"
                        value={form.doDate}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Masuk DO</Label>
                      <Input
                        type="date"
                        value={form.doReceivedDate}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doReceivedDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tujuan / Customer</Label>
                      <AutocompleteSelect
                        value={form.customerId}
                        onValueChange={(value) =>
                          setForm((state) => {
                            const normalizedCustomerId = toEntityId(value);
                            const nextState: DeliveryOrderForm = {
                              ...state,
                              customerId: normalizedCustomerId,
                            };
                            if (editingUuid) {
                              return nextState;
                            }

                            const defaults = resolveDefaultByCustomer(normalizedCustomerId);
                            if (!defaults) {
                              return nextState;
                            }

                            return {
                              ...nextState,
                              destinationCityId: defaults.destinationCityId,
                              stdLeadTimeDays: defaults.stdLeadTimeDays,
                              stdReturnDoDays: defaults.stdReturnDoDays,
                            };
                          })
                        }
                        options={customers.flatMap((customer) => {
                          const value = pickEntityId(customer);
                          if (!value) {
                            return [];
                          }
                          return {
                            value,
                            label: String(customer.name ?? ''),
                            keywords: customer.code,
                          };
                        })}
                        placeholder="Select customer"
                        searchPlaceholder="Search customer..."
                        emptyText="No customer found."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warehouse</Label>
                      <AutocompleteSelect
                        value={form.warehouseId}
                        onValueChange={(value) =>
                          setForm((state) => ({
                            ...state,
                            warehouseId: lockedWarehouseId || toEntityId(value),
                          }))
                        }
                        options={warehouses.flatMap((warehouse) => {
                          const value = pickEntityId(warehouse);
                          if (!value) {
                            return [];
                          }
                          const cityName = String(warehouse.city?.name ?? '').trim();
                          return {
                            value,
                            label: cityName
                              ? `${String(warehouse.name ?? '')} - ${cityName}`
                              : String(warehouse.name ?? ''),
                            keywords: warehouse.locationName || undefined,
                          };
                        })}
                        placeholder="Select warehouse"
                        searchPlaceholder="Search warehouse..."
                        emptyText="No warehouse found."
                        disabled={Boolean(lockedWarehouseId)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kota Tujuan</Label>
                      <AutocompleteSelect
                        value={form.destinationCityId}
                        onValueChange={(value) =>
                          setForm((state) => ({
                            ...state,
                            destinationCityId: toEntityId(value),
                          }))
                        }
                        options={cities.flatMap((city) => {
                          const value = pickEntityId(city);
                          if (!value) {
                            return [];
                          }
                          const cityName = String(city.name ?? '');
                          const postalCode = String(city.postalCode ?? '');
                          return {
                            value,
                            label: `${cityName}${postalCode ? ` (${postalCode})` : ''}`,
                          };
                        })}
                        placeholder="Select city"
                        searchPlaceholder="Search city..."
                        emptyText="No city found."
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Catatan</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((state) => ({
                          ...state,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Catatan tambahan DO"
                      rows={3}
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-5">
                <div className="rounded-lg border p-5">
                  <h3 className="mb-3 text-base font-semibold">
                    SLA & KPI Preview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>STD Lead Time (Hari)</span>
                      <span className="font-medium">
                        {`${form.stdLeadTimeDays || '0'} hari`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>SSTD Return DO (Hari)</span>
                      <span className="font-medium">
                        {`${form.stdReturnDoDays || '0'} hari`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Standard Barang Diterima</span>
                      <span className="font-medium">
                        {addDays(form.doDate, form.stdLeadTimeDays)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>STD DO Kembali</span>
                      <span className="font-medium">
                        {addDays(form.doDate, form.stdReturnDoDays)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>KPI 1 Ketepatan Pengiriman</span>
                      <Badge variant="secondary">Auto by system</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>KPI 2 Ketepatan DO Kembali</span>
                      <Badge variant="secondary">Auto by system</Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <h3 className="mb-3 text-base font-semibold">
                    Ringkasan Barang
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total Jenis Barang</span>
                      <span className="font-semibold">
                        {summary.itemTypeCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total Batch</span>
                      <span className="font-semibold">
                        {summary.totalBatch}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total PCS</span>
                      <span className="font-semibold">
                        {summary.totalPcs.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total KG</span>
                      <span className="font-semibold">
                        {summary.totalKg.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-lg border p-5 xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Item List</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openAddItemModal}
                  >
                    <Plus />
                    Add Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">No</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead className="text-right">Total Batch</TableHead>
                      <TableHead className="text-right">Qty PCS</TableHead>
                      <TableHead className="text-right">Qty KG</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.details.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-muted-foreground">
                          Belum ada item. Klik + Add Item untuk mulai input outbound.
                        </TableCell>
                      </TableRow>
                    ) : (
                      form.details.map((detail, index) => {
                        const item = itemOptionMap.get(detail.itemId);
                        const totalQtyPcs = Number(
                          getAutoQtyPcs(detail.itemId, detail.batchNumbers, detail.batchQtyMap) || 0,
                        );
                        return (
                          <TableRow key={`${index}-${detail.itemId}-${detail.batchNumbers.join('|')}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <div className="font-medium">{item?.name || '-'}</div>
                              <div className="text-xs text-muted-foreground">
                                {item?.code || detail.itemId || '-'}
                              </div>
                            </TableCell>
                            <TableCell>{item?.uom?.name || item?.uom?.code || '-'}</TableCell>
                            <TableCell className="text-right">
                              {detail.batchNumbers.length}
                            </TableCell>
                            <TableCell className="text-right">
                              {(Number.isFinite(totalQtyPcs) ? totalQtyPcs : 0).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right">
                              {(Number(detail.qtyKg || 0) || 0).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="max-w-[280px] truncate">
                              {detail.notes || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  aria-label="Edit item"
                                  onClick={() => void openEditItemModal(index)}
                                >
                                  <Pencil />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  aria-label="Remove item"
                                  onClick={() => removeDetailRow(index)}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <LogisticTransactionItemDialog
              open={isItemModalOpen}
              editingDetailIndex={editingDetailIndex}
              draftDetail={draftDetail}
              draftItemId={draftItemId}
              draftItemTotalPcs={draftItemTotalPcs}
              itemModalError={itemModalError}
              itemOptions={itemOptions}
              formDetails={form.details}
              batchOptionsByItemId={batchOptionsByItemId}
              onClose={closeItemModal}
              onSave={saveDraftItem}
              onSetDraftItemId={(value) => {
                void setDraftItemId(value);
              }}
              onSetDraftField={setDraftField}
              onSetDraftBatchNumbers={setDraftBatchNumbers}
              onSetDraftBatchQty={setDraftBatchQty}
              getBatchQtyPcs={getBatchQtyPcs}
              getSelectedBatchQtyPcs={getSelectedBatchQtyPcs}
            />

            {error ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                <ArrowLeft />
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || loadingOptions}>
                <Save />
                {submitting
                  ? 'Saving...'
                  : editingUuid
                    ? 'Update Delivery Order'
                    : 'Create Delivery Order'}
              </Button>
            </div>
          </form>
        )}

        {error && !showForm ? (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default LogisticTransactionPageView;
