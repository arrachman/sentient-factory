import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createMasterItem,
  deleteMasterItem,
  fetchMasterItems,
  fetchMasterUoms,
  updateMasterItem,
} from '@/features/master-item/api/master-item.api';
import {
  initialMasterItemForm,
  type MasterDataItem,
  type MasterDataUom,
  type MasterItemFormState,
} from '@/features/master-item/model/types';
import { slugifyCode } from '@/features/master-item/model/utils';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterItemPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/item/add';
  const isUpdateRoute = pathname === '/app/master/item/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [uoms, setUoms] = useState<MasterDataUom[]>([]);
  const [form, setForm] = useState<MasterItemFormState>(initialMasterItemForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUom, setLoadingUom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchList = useCallback(
    async (targetPage = page) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchMasterItems({
          page: safePage,
          limit,
          search,
        });

        if (!result.success) {
          throw new Error(result.message || 'Failed to load data');
        }

        setItems(Array.isArray(result.data) ? result.data : []);
        setPage(typeof result.meta?.page === 'number' ? result.meta.page : safePage);
        setTotalPages(typeof result.meta?.totalPages === 'number' ? result.meta.totalPages : 1);
        setTotalItems(typeof result.meta?.total === 'number' ? result.meta.total : 0);
      } catch (err) {
        setError(extractMessage(err, 'Failed to load data'));
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search],
  );

  const fetchUomOptions = useCallback(async () => {
    setLoadingUom(true);
    setError('');

    try {
      const result = await fetchMasterUoms();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load UOM data');
      }

      const nextUoms = Array.isArray(result.data) ? result.data : [];
      setUoms(nextUoms);
      setForm((state) => {
        if (state.uomId || nextUoms.length === 0) {
          return state;
        }
        return { ...state, uomId: nextUoms[0].uuid };
      });
    } catch (err) {
      setError(extractMessage(err, 'Failed to load UOM data'));
    } finally {
      setLoadingUom(false);
    }
  }, []);

  useEffect(() => {
    void fetchList(1);
    void fetchUomOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm || loadingUom) {
      return;
    }

    setEditingUuid(null);
    setForm({
      ...initialMasterItemForm,
      uomId: uoms[0]?.uuid || '',
    });
    setShowForm(true);
  }, [isAddRoute, loadingUom, showForm, uoms]);

  const onEdit = useCallback((item: MasterDataItem) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      category: item.category ?? '',
      uomId: item.uomId ?? item.uom?.uuid ?? '',
      itemType: item.itemType ?? '',
      isActive: item.isActive,
    });
  }, []);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }

    const item = items.find((row) => row.uuid === updateId);
    if (!item) {
      return;
    }

    onEdit(item);
  }, [isUpdateRoute, items, onEdit, showForm, updateId]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        code: form.code.trim() || slugifyCode(form.name),
        name: form.name,
        category: form.category,
        uomId: form.uomId,
        itemType: form.itemType,
        isActive: form.isActive,
      };

      const result = editingUuid ? await updateMasterItem(editingUuid, payload) : await createMasterItem(payload);

      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      setForm({
        ...initialMasterItemForm,
        uomId: uoms[0]?.uuid || '',
      });
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/item');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  }, [editingUuid, fetchList, form, isAddRoute, isUpdateRoute, page, router, uoms]);

  const onDelete = useCallback(
    async (uuid: string) => {
      const ok = window.confirm('Delete this item?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        const result = await deleteMasterItem(uuid);
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete data');
        }

        if (editingUuid === uuid) {
          setEditingUuid(null);
          setForm({
            ...initialMasterItemForm,
            uomId: uoms[0]?.uuid || '',
          });
          setShowForm(false);
          if (isAddRoute || isUpdateRoute) {
            router.push('/app/master/item');
          }
        }

        await fetchList(page);
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete data'));
      }
    },
    [editingUuid, fetchList, isAddRoute, isUpdateRoute, page, router, uoms],
  );

  const applySearch = useCallback(() => {
    setPage(1);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  }, []);

  const refreshList = useCallback(async () => {
    await fetchList(page);
  }, [fetchList, page]);

  const changePage = useCallback((nextPage: number) => {
    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }
    void fetchList(nextPage);
  }, [fetchList]);

  const openAddRoute = useCallback(() => {
    router.push('/app/master/item/add');
  }, [router]);

  const openEditRoute = useCallback(
    (item: MasterDataItem) => {
      router.push(`/app/master/item/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
    },
    [router],
  );

  const backToList = useCallback(() => {
    setEditingUuid(null);
    setForm({
      ...initialMasterItemForm,
      uomId: uoms[0]?.uuid || '',
    });
    setShowForm(false);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/item');
    }
  }, [isAddRoute, isUpdateRoute, router, uoms]);

  const uomOptions = useMemo(
    () =>
      uoms.map((uom) => ({
        value: uom.uuid,
        label: `${uom.code} - ${uom.name}`,
      })),
    [uoms],
  );

  return {
    items,
    uoms,
    uomOptions,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingUom,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    openAddRoute,
    openEditRoute,
    onSubmit,
    onDelete,
    backToList,
  };
}
