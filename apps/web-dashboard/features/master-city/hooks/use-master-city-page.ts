import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createCity, deleteCity, fetchCities, fetchProvinces, updateCity } from '@/features/master-city/api/master-city.api';
import { initialMasterCityForm, type MasterCityFormState, type MasterDataCity, type MasterDataProvince } from '@/features/master-city/model/types';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterCityPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/city/add';
  const isUpdateRoute = pathname === '/app/master/city/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataCity[]>([]);
  const [provinces, setProvinces] = useState<MasterDataProvince[]>([]);
  const [form, setForm] = useState<MasterCityFormState>(initialMasterCityForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
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
        const result = await fetchCities({
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

  const fetchProvinceOptions = useCallback(async () => {
    setLoadingProvince(true);
    setError('');

    try {
      const result = await fetchProvinces();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load province data');
      }
      const nextProvinces = Array.isArray(result.data) ? result.data : [];
      setProvinces(nextProvinces);
      setForm((state) => {
        if (state.provinceId || nextProvinces.length === 0) {
          return state;
        }
        return { ...state, provinceId: nextProvinces[0].uuid };
      });
    } catch (err) {
      setError(extractMessage(err, 'Failed to load province data'));
    } finally {
      setLoadingProvince(false);
    }
  }, []);

  useEffect(() => {
    void fetchList(1);
    void fetchProvinceOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm || loadingProvince) {
      return;
    }
    setEditingUuid(null);
    setForm({
      ...initialMasterCityForm,
      provinceId: provinces[0]?.uuid || '',
    });
    setShowForm(true);
  }, [isAddRoute, loadingProvince, provinces, showForm]);

  const onEdit = (item: MasterDataCity) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      provinceId: item.provinceId ?? item.province?.uuid ?? '',
      name: item.name ?? '',
      postalCode: item.postalCode ?? '',
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
      const result = editingUuid ? await updateCity(editingUuid, form) : await createCity(form);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      setForm({
        ...initialMasterCityForm,
        provinceId: provinces[0]?.uuid || '',
      });
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/city');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this city?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const result = await deleteCity(uuid);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete data');
      }
      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm({
          ...initialMasterCityForm,
          provinceId: provinces[0]?.uuid || '',
        });
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/master/city');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete data'));
    }
  };

  const openAddRoute = () => {
    router.push('/app/master/city/add');
  };

  const openEditRoute = (item: MasterDataCity) => {
    router.push(`/app/master/city/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
  };

  const backToList = () => {
    setEditingUuid(null);
    setForm({
      ...initialMasterCityForm,
      provinceId: provinces[0]?.uuid || '',
    });
    setShowForm(false);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/city');
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

  return {
    items,
    provinces,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingProvince,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    fetchList,
    onSubmit,
    onDelete,
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  };
}
