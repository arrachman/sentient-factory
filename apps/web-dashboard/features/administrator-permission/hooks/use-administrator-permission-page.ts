import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  useAdministratorPermissionListQuery,
  useCreateAdministratorPermissionMutation,
  useDeleteAdministratorPermissionMutation,
  useUpdateAdministratorPermissionMutation,
} from '@/features/administrator-permission/hooks/use-administrator-permission';
import {
  initialPermissionForm,
  type PermissionFormState,
  type PermissionItem,
} from '@/features/administrator-permission/model/types';
import { pickPermissionId } from '@/features/administrator-permission/model/utils';

function extractMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorPermissionPage() {
  const [items, setItems] = useState<PermissionItem[]>([]);
  const [form, setForm] = useState<PermissionFormState>(initialPermissionForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const listQuery = useAdministratorPermissionListQuery(page, limit, search);
  const createMutation = useCreateAdministratorPermissionMutation();
  const updateMutation = useUpdateAdministratorPermissionMutation();
  const deleteMutation = useDeleteAdministratorPermissionMutation();

  const loading = listQuery.isLoading || listQuery.isFetching;
  const submitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const data = listQuery.data;
    if (!data) {
      return;
    }

    setItems(data.items);
    setPage(data.meta.page);
    setTotalPages(data.meta.totalPages);
    setTotalItems(data.meta.total);
  }, [listQuery.data]);

  useEffect(() => {
    if (!listQuery.error) {
      return;
    }

    setError(extractMessage(listQuery.error, 'Failed to load permissions'));
  }, [listQuery.error]);

  const fetchList = (targetPage = page) => {
    const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

    setError('');
    if (safePage !== page) {
      setPage(safePage);
      return;
    }
    void listQuery.refetch();
  };

  const onSubmit = async () => {
    setError('');

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ uuid: editingId, form });
      } else {
        await createMutation.mutateAsync(form);
      }

      setEditingId(null);
      setForm(initialPermissionForm);
      setShowForm(false);
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save permission'));
    }
  };

  const onEdit = (item: PermissionItem) => {
    const permissionId = pickPermissionId(item);
    if (!permissionId) {
      setError('Permission ID is missing');
      return;
    }
    setEditingId(permissionId);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      module: item.module ?? '',
      action: item.action ?? '',
      description: item.description ?? '',
    });
  };

  const onDelete = async (permissionId: string) => {
    const ok = window.confirm('Delete this permission?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMutation.mutateAsync(permissionId);

      if (editingId === permissionId) {
        setEditingId(null);
        setForm(initialPermissionForm);
        setShowForm(false);
      }
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete permission'));
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(initialPermissionForm);
    setShowForm(true);
  };

  const backToList = () => {
    setEditingId(null);
    setForm(initialPermissionForm);
    setShowForm(false);
  };


  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
  }, []);

  return {
    items,
    form,
    setForm,
    editingId,
    showForm,
    search,
    setSearch,
    error,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    loading,
    submitting,
    fetchList,
    onSubmit,
    onEdit,
    onDelete,
    openCreate,
    backToList,
  };
}
