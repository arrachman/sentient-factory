import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  useAdministratorDefaultWarehouseQuery,
  useAdministratorRoleOptionsQuery,
  useAdministratorUsersListQuery,
  useAdministratorWarehouseOptionsQuery,
  useCreateAdministratorUserMutation,
  useDeleteAdministratorUserMutation,
  useUpdateAdministratorUserMutation,
} from '@/features/administrator-users/hooks/use-administrator-users';
import {
  initialUserForm,
  type AdministratorUser,
  type UserFormState,
  type WarehouseOption,
} from '@/features/administrator-users/model/types';
import { pickUserId, toEntityId } from '@/features/administrator-users/model/utils';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorUsersPage() {
  const [items, setItems] = useState<AdministratorUser[]>([]);
  const [form, setForm] = useState<UserFormState>(initialUserForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [roles, setRoles] = useState<WarehouseOption[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [defaultWarehouseId, setDefaultWarehouseId] = useState('');

  const listQuery = useAdministratorUsersListQuery(page, limit, search);
  const warehouseOptionsQuery = useAdministratorWarehouseOptionsQuery();
  const roleOptionsQuery = useAdministratorRoleOptionsQuery();
  const defaultWarehouseQuery = useAdministratorDefaultWarehouseQuery();
  const createMutation = useCreateAdministratorUserMutation();
  const updateMutation = useUpdateAdministratorUserMutation();
  const deleteMutation = useDeleteAdministratorUserMutation();

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
    if (warehouseOptionsQuery.data) {
      setWarehouses(warehouseOptionsQuery.data);
    }
  }, [warehouseOptionsQuery.data]);

  useEffect(() => {
    if (roleOptionsQuery.data) {
      setRoles(roleOptionsQuery.data);
    }
  }, [roleOptionsQuery.data]);

  useEffect(() => {
    if (typeof defaultWarehouseQuery.data === 'string') {
      setDefaultWarehouseId(defaultWarehouseQuery.data);
    }
  }, [defaultWarehouseQuery.data]);

  useEffect(() => {
    const sourceError =
      listQuery.error ||
      warehouseOptionsQuery.error ||
      roleOptionsQuery.error ||
      defaultWarehouseQuery.error ||
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error;

    if (!sourceError) {
      return;
    }

    setError(extractMessage(sourceError, 'Failed to load users'));
  }, [
    createMutation.error,
    defaultWarehouseQuery.error,
    deleteMutation.error,
    listQuery.error,
    roleOptionsQuery.error,
    updateMutation.error,
    warehouseOptionsQuery.error,
  ]);

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
    if (!showForm || editingUuid || form.warehouseId || !defaultWarehouseId) {
      return;
    }
    setForm((prev) => ({ ...prev, warehouseId: defaultWarehouseId }));
  }, [defaultWarehouseId, editingUuid, form.warehouseId, showForm]);

  const onSubmit = async () => {
    setError('');

    try {
      if (!Array.isArray(form.roleIds) || form.roleIds.length === 0) {
        throw new Error('Please select at least one role');
      }

      if (editingUuid) {
        await updateMutation.mutateAsync({ uuid: editingUuid, form });
      } else {
        await createMutation.mutateAsync(form);
      }

      setForm(initialUserForm);
      setEditingUuid(null);
      setShowForm(false);
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save user'));
    }
  };

  const onEdit = (item: AdministratorUser) => {
    const userId = pickUserId(item);
    if (!userId) {
      setError('User ID is missing');
      return;
    }
    setEditingUuid(userId);
    setShowForm(true);
    setForm({
      email: item.email ?? '',
      username: item.username ?? '',
      fullName: item.fullName ?? '',
      password: '',
      roleIds: Array.isArray(item.roleIds)
        ? item.roleIds.map((value) => toEntityId(value)).filter(Boolean)
        : toEntityId(item.roleId)
          ? [toEntityId(item.roleId)]
          : [],
      warehouseId: toEntityId(item.warehouseId ?? item.warehouse?.id ?? item.warehouse?.uuid),
      isActive: item.isActive,
    });
  };

  const onDelete = async (userId: string) => {
    const ok = window.confirm('Delete this user?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMutation.mutateAsync(userId);
      if (editingUuid === userId) {
        setEditingUuid(null);
        setForm(initialUserForm);
        setShowForm(false);
      }
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete user'));
    }
  };

  const openCreate = () => {
    setEditingUuid(null);
    setForm({ ...initialUserForm, warehouseId: defaultWarehouseId || initialUserForm.warehouseId });
    setShowForm(true);
  };

  const backToList = () => {
    setEditingUuid(null);
    setForm(initialUserForm);
    setShowForm(false);
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
  }, []);

  return {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    error,
    setError,
    warehouses,
    roles,
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
    applySearch,
    resetSearch,
  };
}
