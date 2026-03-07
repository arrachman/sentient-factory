import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createCitySla,
  deleteCitySla,
  fetchAllCitySlaCityIds,
  fetchCityOptions,
  fetchCitySlaList,
  updateCitySla,
} from '@/features/master-city-sla/api/master-city-sla.api';
import {
  type CitySlaFormState,
  initialCitySlaForm,
  type MasterDataCity,
  type MasterDataCitySla,
} from '@/features/master-city-sla/model/types';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterCitySlaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/city-sla/add';
  const isUpdateRoute = pathname === '/app/master/city-sla/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataCitySla[]>([]);
  const [cities, setCities] = useState<MasterDataCity[]>([]);
  const [existingSlaCityIds, setExistingSlaCityIds] = useState<string[]>([]);
  const [form, setForm] = useState<CitySlaFormState>(initialCitySlaForm);
  const [cityAutocompleteOpen, setCityAutocompleteOpen] = useState(false);
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

  const existingSlaCityIdSet = useMemo(() => new Set(existingSlaCityIds), [existingSlaCityIds]);
  const selectableCities = useMemo(
    () => cities.filter((city) => city.uuid === form.cityId || !existingSlaCityIdSet.has(city.uuid)),
    [cities, existingSlaCityIdSet, form.cityId],
  );
  const selectedCityLabel = useMemo(() => {
    const selected = selectableCities.find((city) => city.uuid === form.cityId);
    if (!selected) {
      return '';
    }
    return `${selected.name} (${selected.postalCode})${selected.province ? ` - ${selected.province.name}` : ''}`;
  }, [form.cityId, selectableCities]);
  const addableCities = useMemo(
    () => cities.filter((city) => !existingSlaCityIdSet.has(city.uuid)),
    [cities, existingSlaCityIdSet],
  );

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchCitySlaList({
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

  const fetchCityOptionsWithUsage = useCallback(async () => {
    setLoadingCity(true);
    setError('');

    try {
      const [usedCityIds, citiesResult] = await Promise.all([fetchAllCitySlaCityIds(), fetchCityOptions()]);

      if (!citiesResult.success) {
        throw new Error(citiesResult.message || 'Failed to load city data');
      }

      const usedCityIdSet = new Set(usedCityIds);
      const nextCities = Array.isArray(citiesResult.data) ? citiesResult.data : [];
      setExistingSlaCityIds(usedCityIds);
      setCities(nextCities);

      setForm((state) => {
        if (state.cityId || nextCities.length === 0) {
          return state;
        }
        const firstAddableCity = nextCities.find((city) => !usedCityIdSet.has(city.uuid));
        return { ...state, cityId: firstAddableCity?.uuid || '' };
      });
    } catch (err) {
      setError(extractMessage(err, 'Failed to load city data'));
    } finally {
      setLoadingCity(false);
    }
  }, []);

  useEffect(() => {
    void fetchList(1);
    void fetchCityOptionsWithUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm || loadingCity) {
      return;
    }

    setEditingUuid(null);
    setForm({
      ...initialCitySlaForm,
      cityId: addableCities[0]?.uuid || '',
    });
    setShowForm(true);
  }, [addableCities, isAddRoute, loadingCity, showForm]);

  const onEdit = useCallback((item: MasterDataCitySla) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      cityId: item.cityId ?? item.city?.uuid ?? '',
      stdLeadTimeDays: String(item.stdLeadTimeDays ?? 0),
      stdReturnDoDays: String(item.stdReturnDoDays ?? 0),
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
      const result = editingUuid ? await updateCitySla(editingUuid, form) : await createCitySla(form);

      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      setForm({
        ...initialCitySlaForm,
        cityId: '',
      });
      setEditingUuid(null);
      setShowForm(false);

      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/city-sla');
      }

      await fetchList(page);
      await fetchCityOptionsWithUsage();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  }, [editingUuid, fetchCityOptionsWithUsage, fetchList, form, isAddRoute, isUpdateRoute, page, router]);

  const onDelete = useCallback(
    async (uuid: string) => {
      const ok = window.confirm('Delete this city SLA?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        const result = await deleteCitySla(uuid);
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete data');
        }

        if (editingUuid === uuid) {
          setEditingUuid(null);
          setForm({
            ...initialCitySlaForm,
            cityId: '',
          });
          setShowForm(false);
          if (isAddRoute || isUpdateRoute) {
            router.push('/app/master/city-sla');
          }
        }

        await fetchList(page);
        await fetchCityOptionsWithUsage();
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete data'));
      }
    },
    [editingUuid, fetchCityOptionsWithUsage, fetchList, isAddRoute, isUpdateRoute, page, router],
  );

  const refreshList = useCallback(async () => {
    await fetchList(page);
  }, [fetchList, page]);

  const applySearch = useCallback(() => {
    setPage(1);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  }, []);

  const changePage = useCallback((nextPage: number) => {
    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }
    void fetchList(nextPage);
  }, [fetchList]);

  const openAddRoute = useCallback(() => {
    router.push('/app/master/city-sla/add');
  }, [router]);

  const openEditRoute = useCallback(
    (item: MasterDataCitySla) => {
      router.push(`/app/master/city-sla/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
    },
    [router],
  );

  const backToList = useCallback(() => {
    setShowForm(false);
    setEditingUuid(null);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/city-sla');
    }
  }, [isAddRoute, isUpdateRoute, router]);


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
    addableCities,
    selectableCities,
    selectedCityLabel,
    form,
    setForm,
    cityAutocompleteOpen,
    setCityAutocompleteOpen,
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
