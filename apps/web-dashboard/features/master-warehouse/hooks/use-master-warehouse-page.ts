import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createWarehouse,
  deleteWarehouse,
  fetchWarehouseCities,
  fetchWarehouses,
  updateWarehouse,
} from '@/features/master-warehouse/api/master-warehouse.api';
import {
  initialWarehouseForm,
  type MasterDataCity,
  type MasterDataWarehouse,
  type WarehouseFormState,
} from '@/features/master-warehouse/model/types';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterWarehousePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/warehouse/add';
  const isUpdateRoute = pathname === '/app/master/warehouse/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataWarehouse[]>([]);
  const [cities, setCities] = useState<MasterDataCity[]>([]);
  const [form, setForm] = useState<WarehouseFormState>(initialWarehouseForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchWarehouses({
          page: safePage,
          limit: targetLimit,
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

  const fetchCityOptions = useCallback(async () => {
    setLoadingCity(true);
    setError('');

    try {
      const result = await fetchWarehouseCities();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load city data');
      }

      const nextCities = Array.isArray(result.data) ? result.data : [];
      setCities(nextCities);
      setForm((state) => {
        if (state.cityId || nextCities.length === 0) {
          return state;
        }
        return { ...state, cityId: nextCities[0].uuid };
      });
    } catch (err) {
      setError(extractMessage(err, 'Failed to load city data'));
    } finally {
      setLoadingCity(false);
    }
  }, []);

  useEffect(() => {
    void fetchList(1);
    void fetchCityOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm || loadingCity) {
      return;
    }
    setEditingUuid(null);
    setForm({
      ...initialWarehouseForm,
      cityId: cities[0]?.uuid || '',
    });
    setShowForm(true);
  }, [cities, isAddRoute, loadingCity, showForm]);

  const onEdit = (item: MasterDataWarehouse) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      cityId: item.cityId ?? item.city?.uuid ?? '',
      locationName: item.locationName ?? '',
      addressDetail: item.addressDetail ?? '',
    });
  };

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }
    const item = items.find((row) => row.uuid === updateId);
    if (!item) {
      return;
    }
    onEdit(item);
  }, [isUpdateRoute, items, showForm, updateId]);

  const onSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const result = editingUuid ? await updateWarehouse(editingUuid, form) : await createWarehouse(form);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      setForm({
        ...initialWarehouseForm,
        cityId: cities[0]?.uuid || '',
      });
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/warehouse');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this warehouse?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const result = await deleteWarehouse(uuid);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete data');
      }
      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm({
          ...initialWarehouseForm,
          cityId: cities[0]?.uuid || '',
        });
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/master/warehouse');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete data'));
    }
  };

  const openAddRoute = () => {
    router.push('/app/master/warehouse/add');
  };

  const openEditRoute = (item: MasterDataWarehouse) => {
    router.push(`/app/master/warehouse/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
  };

  const backToList = () => {
    setShowForm(false);
    setEditingUuid(null);
    setForm({
      ...initialWarehouseForm,
      cityId: cities[0]?.uuid || '',
    });
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/warehouse');
    }
  };

  const applySearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const resetSearch = () => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  };


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
    cities,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingCity,
    submitting,
    error,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    fetchList,
    onSubmit,
    onDelete,
    onEdit,
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  };
}
