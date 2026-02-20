import { useCallback, useEffect, useMemo, useState } from 'react';
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
  pickEntityId,
  pickInboundId,
} from '@/features/logistic-inbound/model/utils';
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
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getClientToken(), []);
  const headers = useMemo(() => buildAuthHeader(token), [token]);

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

  const detailSummary = useMemo(() => {
    let totalQty = 0;
    let totalBatch = 0;

    form.details.forEach((detail) => {
      detail.batches.forEach((batch) => {
        totalBatch += 1;
        totalQty += Number(batch.qty || 0) || 0;
      });
    });

    return {
      totalItemTypes: form.details.length,
      totalBatch,
      totalQty,
    };
  }, [form.details]);

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
    async (targetPage = page) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchInboundList({
          page: safePage,
          limit,
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
      const fallbackWarehouseId = pickEntityId(nextWarehouses[0]);

      setSuppliers(nextSuppliers);
      setWarehouses(nextWarehouses);
      setItemOptions(nextItems);
      setCurrentUserId(userId);
      setIsAdminRole(hasGlobalWarehouseAccess);
      setLockedWarehouseId(nextLockedWarehouseId);

      setForm((state) => ({
        ...state,
        supplierId: state.supplierId || pickEntityId(nextSuppliers[0]) || '',
        warehouseId: hasGlobalWarehouseAccess
          ? state.warehouseId || fallbackWarehouseId || ''
          : nextLockedWarehouseId || fallbackWarehouseId || '',
        details: state.details.map((detail, index) => ({
          ...detail,
          itemId: detail.itemId || (index === 0 ? pickEntityId(nextItems[0]) || '' : detail.itemId),
        })),
      }));

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
    setForm({
      ...initialForm,
      transactionDate: new Date().toISOString().slice(0, 10),
      supplierId: pickEntityId(suppliers[0]) || '',
      warehouseId: lockedWarehouseId || pickEntityId(warehouses[0]) || '',
      details: [],
    });
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
      const detailsPayload = form.details
        .map((detail) => {
          const batches = detail.batches
            .map((batch) => ({
              batchIn: batch.batchIn.trim(),
              qty: Number(batch.qty || 0),
              expiredDate: batch.expiredDate || undefined,
              notes: batch.notes.trim() || undefined,
            }))
            .filter((batch) => batch.batchIn && batch.qty > 0);

          const isDetailValid = detail.itemId && batches.length > 0;
          const uomInput = Math.max(0, Math.trunc(Number(detail.uomInput.trim() || 0)));

          return {
            itemId: detail.itemId,
            uomInput: isDetailValid ? uomInput : undefined,
            notes: detail.notes.trim() || undefined,
            qty: batches.reduce((sum, batch) => sum + batch.qty, 0),
            batches,
          };
        })
        .filter((detail) => detail.itemId && detail.batches.length > 0 && detail.qty > 0);

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
      const rowId = pickInboundId(item);
      if (!rowId) {
        return;
      }

      const inboundRef = buildInboundRef(rowId, item.createdAt);
      router.push(`/app/logistic/inbound/update?ref=${encodeURIComponent(inboundRef)}`);
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
