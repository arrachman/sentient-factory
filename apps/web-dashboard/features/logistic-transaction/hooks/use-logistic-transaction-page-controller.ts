import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type BatchOption } from '@/features/logistic-transaction/ui/batch-multi-select';
import { type CityOption, type CitySlaOption, type ContactOption, type DeliveryOrderForm, type DeliveryOrderListItem, type DivisionOption, initialDetail, initialForm, type ItemOption, type WarehouseOption } from '@/features/logistic-transaction/model/types';
import { buildEntityRef, parseEntityRef, pickEntityId, toEntityId } from '@/features/logistic-transaction/model/utils';
import { useOutboundStatusActions } from '@/features/logistic-transaction/hooks/use-outbound-status-actions';
import { useLogisticTransactionItemDialog } from '@/features/logistic-transaction/hooks/use-logistic-transaction-item-dialog';
import {
  buildBuOptions,
  buildCreateFormState,
  buildDetailSummary,
  buildItemOptionMap,
  getAutoQtyPcsValue,
  getBatchQtyPcsByItem,
  getSelectedBatchQtyPcsValue,
  resolveDefaultByCustomerId,
} from '@/features/logistic-transaction/hooks/logistic-transaction-page-controller.helpers';
import { fetchOutboundBatchOptions, fetchOutboundList, fetchOutboundOptions, openOutboundEditForm } from '@/features/logistic-transaction/hooks/logistic-transaction-page-queries';
import { removeOutboundOrder, upsertOutboundOrder } from '@/features/logistic-transaction/hooks/logistic-transaction-page-mutations';
import { getClientToken } from '@/shared/auth/token.client';
function getTokenFromCookie() {
  return getClientToken();
}
export function useLogisticTransactionPageController() {
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
  const [batchOptionsByItemId, setBatchOptionsByItemId] = useState<Record<string, BatchOption[]>>({});
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
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const token = useMemo(() => getTokenFromCookie(), []);
  const itemOptionMap = useMemo(() => buildItemOptionMap(itemOptions), [itemOptions]);
  const createDefaultDetail = useCallback(
    () => ({ ...initialDetail(), itemId: pickEntityId(itemOptions[0]) }),
    [itemOptions],
  );
  const getBatchQtyPcs = useCallback(
    (itemId: string, batchNumber: string) => {
      return getBatchQtyPcsByItem(batchOptionsByItemId, itemId, batchNumber);
    },
    [batchOptionsByItemId],
  );
  const getSelectedBatchQtyPcs = useCallback(
    (itemId: string, batchNumber: string, batchQtyMap: Record<string, string>) => {
      return getSelectedBatchQtyPcsValue(itemId, batchNumber, batchQtyMap, getBatchQtyPcs);
    },
    [getBatchQtyPcs],
  );
  const getAutoQtyPcs = useCallback(
    (itemId: string, batchNumbers: string[], batchQtyMap: Record<string, string>) => {
      return getAutoQtyPcsValue(itemId, batchNumbers, batchQtyMap, getSelectedBatchQtyPcs);
    },
    [getSelectedBatchQtyPcs],
  );
  const fetchBatchOptions = useCallback(
    async (itemId: string, force = false) => {
      await fetchOutboundBatchOptions({
        itemId,
        force,
        lockedWarehouseId,
        formWarehouseId: form.warehouseId,
        editingUuid,
        token,
        batchOptionsByItemId,
        setBatchOptionsByItemId,
      });
    },
    [batchOptionsByItemId, editingUuid, form.warehouseId, lockedWarehouseId, token],
  );
  const summary = useMemo(() => buildDetailSummary(form.details, getAutoQtyPcs), [form.details, getAutoQtyPcs]);
  const buOptions = useMemo(() => buildBuOptions(divisions, form.bu), [divisions, form.bu]);
  const citySlaByCityId = useMemo(() => new Map(citySlas.map((row) => [toEntityId(row.cityId), row])), [citySlas]);
  const resolveDefaultByCustomer = useCallback(
    (customerId: string) => {
      return resolveDefaultByCustomerId(customerId, customers, cities, citySlaByCityId);
    },
    [cities, customers, citySlaByCityId],
  );
  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      await fetchOutboundList({
        targetPage,
        page,
        limit: targetLimit,
        search,
        statusFilter,
        token,
        setLoading,
        setError,
        setItems,
        setPage,
        setTotalPages,
        setTotalItems,
      });
    },
    [limit, page, search, statusFilter, token],
  );
  const fetchOptions = useCallback(async () => {
    await fetchOutboundOptions({
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
    });
  }, [token]);
  const {
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    draftItemId,
    draftItemTotalPcs,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftItemId,
    setDraftBatchNumbers,
    setDraftBatchQty,
    saveDraftItem,
    removeDetailRow,
  } = useLogisticTransactionItemDialog({
    formDetails: form.details,
    setFormDetails: (updater) =>
      setForm((state) => ({
        ...state,
        details: updater(state.details),
      })),
    createDefaultDetail,
    fetchBatchOptions,
    getBatchQtyPcs,
    getSelectedBatchQtyPcs,
    getAutoQtyPcs,
  });
  const openCreateForm = useCallback(() => {
    setEditingUuid(null);
    setForm(
      buildCreateFormState({
        customers,
        warehouses,
        cities,
        divisions,
        lockedWarehouseId,
        resolveDefaultByCustomer,
      }),
    );
    closeItemModal();
    setShowForm(true);
  }, [cities, closeItemModal, customers, divisions, lockedWarehouseId, resolveDefaultByCustomer, warehouses]);
  const openEditForm = useCallback(
    async (uuid: string) => {
      await openOutboundEditForm({
        uuid,
        token,
        setError,
        setEditingUuid,
        setForm,
        closeItemModal,
        fetchBatchOptions,
        setShowForm,
      });
    },
    [closeItemModal, fetchBatchOptions, token],
  );
  const closeForm = useCallback(() => {
    if (isOutboundRoute) {
      router.push('/app/logistic/outbound');
      return;
    }
    setShowForm(false);
  }, [isOutboundRoute, router]);
  const upsert = useCallback(
    async (event: FormEvent) => {
      await upsertOutboundOrder({
        event,
        form,
        lockedWarehouseId,
        editingUuid,
        token,
        setSubmitting,
        setError,
        getSelectedBatchQtyPcs,
        isOutboundAddRoute,
        routerPush: router.push,
        setShowForm,
        setEditingUuid,
        fetchList,
        page,
      });
    },
    [editingUuid, fetchList, form, getSelectedBatchQtyPcs, isOutboundAddRoute, lockedWarehouseId, page, router.push, token],
  );
  const remove = useCallback(
    async (uuid: string) => {
      await removeOutboundOrder({ uuid, token, setError, fetchList, page });
    },
    [fetchList, page, token],
  );
  useEffect(() => {
    void fetchList(1);
    void fetchOptions();
  }, [fetchList, fetchOptions]);
  useEffect(() => {
    if (!isOutboundAddRoute || loadingOptions) {
      return;
    }
    if (!showForm || editingUuid) {
      openCreateForm();
    }
  }, [editingUuid, isOutboundAddRoute, loadingOptions, openCreateForm, showForm]);
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
  }, [editingUuid, isOutboundUpdateRoute, loadingOptions, openEditForm, showForm, updateId]);
  useEffect(() => {
    if (!showForm) {
      return;
    }
    const itemIds = Array.from(new Set(form.details.map((detail) => toEntityId(detail.itemId)).filter(Boolean)));
    itemIds.forEach((itemId) => {
      void fetchBatchOptions(itemId, true);
    });
  }, [fetchBatchOptions, form.details, showForm]);
  const outboundStatusActions = useOutboundStatusActions({ token, page, fetchList, setError });

  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
    void fetchList(1, nextLimit);
  }, [fetchList]);

  return {
    router,
    isOutboundRoute,
    isOutboundAddRoute,
    showForm,
    editingUuid,
    items,
    loading,
    search,
    statusFilter,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    setSearch,
    setStatusFilter,
    fetchList,
    openCreateForm,
    closeForm,
    openEditForm,
    remove,
    upsert,
    form,
    buOptions,
    customers,
    warehouses,
    cities,
    lockedWarehouseId,
    setForm,
    summary,
    itemOptionMap,
    getAutoQtyPcs,
    openAddItemModal,
    openEditItemModal,
    removeDetailRow,
    isItemModalOpen,
    editingDetailIndex,
    draftDetail,
    draftItemId,
    draftItemTotalPcs,
    itemModalError,
    itemOptions,
    batchOptionsByItemId,
    closeItemModal,
    saveDraftItem,
    setDraftItemId,
    setDraftField,
    setDraftBatchNumbers,
    setDraftBatchQty,
    getBatchQtyPcs,
    getSelectedBatchQtyPcs,
    error,
    submitting,
    loadingOptions,
    resolveDefaultByCustomer,
    outboundStatusActions,
    buildEntityRef,
    toEntityId,
  };
}
