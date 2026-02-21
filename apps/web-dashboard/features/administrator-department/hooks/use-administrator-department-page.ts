import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type AutocompleteSelectOption } from '@/components/ui/autocomplete-select';
import {
  useAdministratorDepartmentListQuery,
  useCreateAdministratorDepartmentMutation,
  useDeleteAdministratorDepartmentMutation,
  useUpdateAdministratorDepartmentMutation,
} from '@/features/administrator-department/hooks/use-administrator-department';
import {
  initialDepartmentForm,
  type DepartmentFormState,
  type DepartmentItem,
} from '@/features/administrator-department/model/types';
import { pickDepartmentId, toEntityId } from '@/features/administrator-department/model/utils';
import { parseEntityRef } from '@/lib/entity-ref';

function extractMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorDepartmentPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAddRoute = pathname === '/app/administrator/department/add';
  const isUpdateRoute = pathname === '/app/administrator/department/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<DepartmentItem[]>([]);
  const [form, setForm] = useState<DepartmentFormState>(initialDepartmentForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const listQuery = useAdministratorDepartmentListQuery(page, limit, search);
  const createMutation = useCreateAdministratorDepartmentMutation();
  const updateMutation = useUpdateAdministratorDepartmentMutation();
  const deleteMutation = useDeleteAdministratorDepartmentMutation();

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

    setError(extractMessage(listQuery.error, 'Failed to load departments'));
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

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingId(null);
    setForm(initialDepartmentForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }
    const item = items.find((row) => pickDepartmentId(row) === updateId);
    if (!item) {
      return;
    }
    const id = pickDepartmentId(item);
    if (!id) {
      setError('Department ID is missing');
      return;
    }

    setEditingId(id);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      parentId: toEntityId(item.parentId ?? item.parent?.id),
    });
  }, [isUpdateRoute, updateId, showForm, items]);

  const onSubmit = async () => {
    setError('');

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ uuid: editingId, form });
      } else {
        await createMutation.mutateAsync(form);
      }

      setForm(initialDepartmentForm);
      setEditingId(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/administrator/department');
      }
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save department'));
    }
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this department?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMutation.mutateAsync(id);

      if (editingId === id) {
        setEditingId(null);
        setForm(initialDepartmentForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/administrator/department');
        }
      }
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete department'));
    }
  };

  const openCreate = () => {
    router.push('/app/administrator/department/add');
  };

  const backToList = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialDepartmentForm);
    if (isAddRoute || isUpdateRoute) {
      router.push('/app/administrator/department');
    }
  };

  const parentOptions = useMemo<AutocompleteSelectOption[]>(() => {
    return items
      .filter((item) => pickDepartmentId(item) !== editingId)
      .map((item) => ({
        value: pickDepartmentId(item),
        label: `${item.code} - ${item.name}`,
      }))
      .filter((item) => item.value);
  }, [items, editingId]);


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
    setError,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    loading,
    submitting,
    parentOptions,
    fetchList,
    onSubmit,
    onDelete,
    openCreate,
    backToList,
  };
}
