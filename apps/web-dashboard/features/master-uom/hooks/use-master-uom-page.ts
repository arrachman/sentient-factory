import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { deleteMasterUom, fetchMasterUomList, saveMasterUom } from '@/features/master-uom/api/uom';
import { initialMasterUomForm, type MasterDataUom, type MasterUomFormState } from '@/features/master-uom/model/types';
import { extractMessage, getTokenFromCookie } from '@/features/master-uom/model/utils';
import { parseEntityRef } from '@/lib/entity-ref';

export function useMasterUomPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAddRoute = pathname === '/app/master/uom/add';
  const isUpdateRoute = pathname === '/app/master/uom/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<MasterDataUom[]>([]);
  const [form, setForm] = useState<MasterUomFormState>(initialMasterUomForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const fetchList = useCallback(
    async (targetPage = page) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const response = await fetchMasterUomList({
          page: safePage,
          limit,
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

  const onEdit = useCallback((item: MasterDataUom) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      type: item.type ?? '',
    });
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingUuid(null);
    setForm(initialMasterUomForm);
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
      await saveMasterUom({
        uuid: editingUuid,
        form,
        token,
      });

      setForm(initialMasterUomForm);
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/uom');
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this UOM?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMasterUom({ uuid, token });

      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm(initialMasterUomForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/master/uom');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete data'));
    }
  };

  const openCreate = () => {
    router.push('/app/master/uom/add');
  };

  const backToList = () => {
    setEditingUuid(null);
    setForm(initialMasterUomForm);
    setShowForm(false);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/master/uom');
    }
  };

  const resetSearch = () => {
    setSearch('');
    void fetchList(1);
  };

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
