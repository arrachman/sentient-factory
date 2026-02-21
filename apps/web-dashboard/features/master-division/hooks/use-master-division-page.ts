import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createDivision, deleteDivision, fetchDivisions, updateDivision } from '@/features/master-division/api/master-division.api';
import { initialMasterDivisionForm, type MasterDataDivision, type MasterDivisionFormState } from '@/features/master-division/model/types';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterDivisionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/division/add';
  const isUpdateRoute = pathname === '/app/master/division/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataDivision[]>([]);
  const [form, setForm] = useState<MasterDivisionFormState>(initialMasterDivisionForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
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
        const result = await fetchDivisions({
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

  useEffect(() => {
    void fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingUuid(null);
    setForm(initialMasterDivisionForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  const onEdit = (item: MasterDataDivision) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      isActive: item.isActive,
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
      const result = editingUuid ? await updateDivision(editingUuid, form) : await createDivision(form);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      setForm(initialMasterDivisionForm);
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/division');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this division?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const result = await deleteDivision(uuid);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete data');
      }
      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm(initialMasterDivisionForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/master/division');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete data'));
    }
  };

  const openAddRoute = () => {
    router.push('/app/master/division/add');
  };

  const openEditRoute = (item: MasterDataDivision) => {
    router.push(`/app/master/division/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
  };

  const backToList = () => {
    setEditingUuid(null);
    setForm(initialMasterDivisionForm);
    setShowForm(false);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/division');
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
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
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
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  };
}
