import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  deleteInbound,
  fetchInboundDetail,
  fetchInboundList,
  fetchInboundPageOptions,
  upsertInbound,
} from '@/features/logistic-inbound/api/inbound';
import { useInboundDetailModal } from '@/features/logistic-inbound/hooks/use-inbound-detail-modal';
import type {
  InboundForm,
  InboundListItem,
  ItemOption,
  SupplierOption,
  WarehouseOption,
} from '@/features/logistic-inbound/model/types';
import {
  buildInboundRef,
  initialForm,
  parseInboundRef,
} from '@/features/logistic-inbound/model/utils';
import {
  applyOptionsToFormState,
  buildCreateInboundForm,
  buildInboundDetailSummary,
  buildInboundDetailsPayload,
  buildInboundUpdateRoute,
  buildItemOptionMap,
  toSafePage,
} from '@/features/logistic-inbound/hooks/use-logistic-inbound-page.helpers';
import { buildAuthHeader, getClientToken } from '@/shared/auth/token.client';

export function useLogisticInboundPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/logistic/inbound/add';
  const isUpdateRoute = pathname === '/app/logistic/inbound/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseInboundRef(updateRef);
  const updateInboundId = updateUuid || decodedRefId;

  const [items, setItems] = useState<InboundListItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);

  const [form, setForm] = useState<InboundForm>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');
  const [isAdminRole, setIsAdminRole] = useState(false);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getClientToken(), []);
  const headers = useMemo(() => buildAuthHeader(token), [token]);

  const itemOptionMap = useMemo(() => buildItemOptionMap(itemOptions), [itemOptions]);
  const detailSummary = useMemo(() => buildInboundDetailSummary(form.details), [form.details]);

  const {
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    draftItemTotalQty,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftBatchField,
    addDraftBatchRow,
    removeDraftBatchRow,
    saveDraftItem,
    removeDetailRow,
  } = useInboundDetailModal({
    form,
    setForm,
    itemOptions,
  });

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = toSafePage(targetPage);

      setLoading(true);
      setError('');
      try {
        const result = await fetchInboundList({
          page: safePage,
          limit: targetLimit,
          search,
          headers,
        });
        setItems(result.items);
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inbounds');
      } finally {
        setLoading(false);
      }
    },
    [headers, limit, page, search],
  );

  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    setError('');
    try {
      const result = await fetchInboundPageOptions(headers);
      const nextSuppliers = result.suppliers;
      const nextWarehouses = result.warehouses;
      const nextItems = result.items;
      const userId = result.currentUserId;
      const hasGlobalWarehouseAccess = result.isAdminRole;
      const nextLockedWarehouseId = result.lockedWarehouseId;

      setSuppliers(nextSuppliers);
      setWarehouses(nextWarehouses);
      setItemOptions(nextItems);
      setCurrentUserId(userId);
      setIsAdminRole(hasGlobalWarehouseAccess);
      setLockedWarehouseId(nextLockedWarehouseId);

      setForm((state) =>
        applyOptionsToFormState({
          state,
          suppliers: nextSuppliers,
          warehouses: nextWarehouses,
          items: nextItems,
          isAdminRole: hasGlobalWarehouseAccess,
          lockedWarehouseId: nextLockedWarehouseId,
        }),
      );

      if (!hasGlobalWarehouseAccess && !nextLockedWarehouseId) {
        setError('Warehouse user login tidak ditemukan. Hubungi admin untuk assign warehouse.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options');
    } finally {
      setLoadingOptions(false);
    }
  }, [headers]);

  const openCreateForm = useCallback(() => {
    setEditingUuid(null);
    setForm(buildCreateInboundForm({ suppliers, warehouses, lockedWarehouseId }));
    closeItemModal();
    setShowForm(true);
  }, [closeItemModal, lockedWarehouseId, suppliers, warehouses]);

  const openEditForm = useCallback(
    async (uuid: string) => {
      setError('');
      try {
        const data = await fetchInboundDetail(uuid, headers);
        setEditingUuid(uuid);
        setForm(data);
        closeItemModal();
        setShowForm(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inbound detail');
      }
    },
    [closeItemModal, headers],
  );

  const saveInbound = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const detailsPayload = buildInboundDetailsPayload(form.details);

      if (detailsPayload.length === 0) {
        throw new Error('Minimal satu detail item dengan batch valid wajib diisi.');
      }

      const payload = {
        transactionNo: form.transactionNo.trim() || undefined,
        transactionDate: form.transactionDate || undefined,
        supplierId: form.supplierId,
        warehouseId: lockedWarehouseId || form.warehouseId,
        status: 'POSTED',
        notes: form.notes.trim() || undefined,
        details: detailsPayload,
      };

      await upsertInbound({
        editingUuid,
        payload,
        headers,
      });

      setShowForm(false);
      setEditingUuid(null);
      router.push('/app/logistic/inbound');
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save inbound');
    } finally {
      setSubmitting(false);
    }
  }, [editingUuid, fetchList, form, headers, lockedWarehouseId, page, router]);

  const removeInbound = useCallback(
    async (uuid: string) => {
      const ok = window.confirm('Delete this inbound?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        await deleteInbound(uuid, headers);

        await fetchList(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete inbound');
      }
    },
    [fetchList, headers, page],
  );

  const openEditRoute = useCallback(
    (item: InboundListItem) => {
      const nextRoute = buildInboundUpdateRoute(item, buildInboundRef);
      if (!nextRoute) {
        return;
      }
      router.push(nextRoute);
    },
    [router],
  );

  const backToList = useCallback(() => {
    setShowForm(false);
    setEditingUuid(null);
    router.push('/app/logistic/inbound');
  }, [router]);

  const openAddRoute = useCallback(() => {
    router.push('/app/logistic/inbound/add');
  }, [router]);

  useEffect(() => {
    fetchList(1);
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm || loadingOptions) {
      return;
    }
    openCreateForm();
  }, [isAddRoute, loadingOptions, openCreateForm, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || showForm || loadingOptions) {
      return;
    }
    if (!updateInboundId) {
      setError('Inbound reference wajib diisi untuk halaman update.');
      return;
    }
    void openEditForm(updateInboundId);
  }, [isUpdateRoute, loadingOptions, openEditForm, showForm, updateInboundId]);


  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
    void fetchList(1, nextLimit);
  }, [fetchList]);

  return {
    items,
    suppliers,
    warehouses,
    itemOptions,
    form,
    setForm,
    editingUuid,
    showForm,
    currentUserId,
    lockedWarehouseId,
    isAdminRole,
    search,
    setSearch,
    loading,
    loadingOptions,
    submitting,
    error,
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    itemOptionMap,
    detailSummary,
    draftItemTotalQty,
    fetchList,
    openAddRoute,
    openCreateForm,
    openEditRoute,
    saveInbound,
    removeInbound,
    backToList,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftBatchField,
    addDraftBatchRow,
    removeDraftBatchRow,
    saveDraftItem,
    removeDetailRow,
    setError,
  };
}
