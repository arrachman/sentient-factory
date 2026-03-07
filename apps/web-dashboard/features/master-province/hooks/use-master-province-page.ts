import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  deleteMasterProvince,
  fetchMasterProvinceList,
  saveMasterProvince,
} from '@/features/master-province/api/province';
import {
  initialMasterProvinceForm,
  type MasterDataProvince,
  type MasterProvinceFormState,
} from '@/features/master-province/model/types';
import { extractMessage, getTokenFromCookie } from '@/features/master-province/model/utils';
import { parseEntityRef } from '@/lib/entity-ref';

export function useMasterProvincePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAddRoute = pathname === '/app/master/province/add';
  const isUpdateRoute = pathname === '/app/master/province/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataProvince[]>([]);
  const [form, setForm] = useState<MasterProvinceFormState>(initialMasterProvinceForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const response = await fetchMasterProvinceList({
          page: safePage,
          limit: targetLimit,
          search,
          token,
        });
        setItems(response.items);
        setPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.total);
      } catch (err) {
        setError(extractMessage(err, 'Failed to load data'));
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search, token],
  );

  useEffect(() => {
    void fetchList(1);
  }, [fetchList]);

  const onEdit = useCallback((item: MasterDataProvince) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      isoCode: item.isoCode ?? '',
    });
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingUuid(null);
    setForm(initialMasterProvinceForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

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

  const onSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      await saveMasterProvince({
        uuid: editingUuid,
        form,
        token,
      });

      setForm(initialMasterProvinceForm);
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/province');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this province?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMasterProvince({ uuid, token });

      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm(initialMasterProvinceForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/master/province');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete data'));
    }
  };

  const openCreate = () => {
    router.push('/app/master/province/add');
  };

  const backToList = () => {
    setEditingUuid(null);
    setForm(initialMasterProvinceForm);
    setShowForm(false);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/province');
    }
  };

  const resetSearch = () => {
    setSearch('');
    void fetchList(1);
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
    search,
    setSearch,
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
    openCreate,
    backToList,
    resetSearch,
  };
}
