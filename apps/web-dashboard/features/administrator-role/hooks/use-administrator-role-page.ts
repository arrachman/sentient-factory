import { useEffect, useState } from 'react';
import {
  useAdministratorRoleListQuery,
  useAdministratorRolePermissionOptionsQuery,
  useCreateAdministratorRoleMutation,
  useDeleteAdministratorRoleMutation,
  useFetchRolePermissionIdsMutation,
  useUpdateAdministratorRoleMutation,
  useUpdateRolePermissionsMutation,
} from '@/features/administrator-role/hooks/use-administrator-role';
import { initialRoleForm, type PermissionItem, type RoleFormState, type RoleItem } from '@/features/administrator-role/model/types';
import { pickEntityId } from '@/features/administrator-role/model/utils';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorRolePage() {
  const [items, setItems] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);

  const [form, setForm] = useState<RoleFormState>(initialRoleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [permissionDialogRole, setPermissionDialogRole] = useState<{ id: string; name: string } | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const listQuery = useAdministratorRoleListQuery(page, limit, search);
  const permissionOptionsQuery = useAdministratorRolePermissionOptionsQuery();
  const createMutation = useCreateAdministratorRoleMutation();
  const updateMutation = useUpdateAdministratorRoleMutation();
  const deleteMutation = useDeleteAdministratorRoleMutation();
  const fetchRolePermissionIdsMutation = useFetchRolePermissionIdsMutation();
  const updateRolePermissionsMutation = useUpdateRolePermissionsMutation();

  const loading = listQuery.isLoading || listQuery.isFetching;
  const submitting = createMutation.isPending || updateMutation.isPending;
  const permissionLoading = fetchRolePermissionIdsMutation.isPending;
  const permissionSubmitting = updateRolePermissionsMutation.isPending;

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
    if (!permissionOptionsQuery.data) {
      return;
    }
    setPermissions(permissionOptionsQuery.data);
  }, [permissionOptionsQuery.data]);

  useEffect(() => {
    const sourceError =
      listQuery.error ||
      permissionOptionsQuery.error ||
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error ||
      fetchRolePermissionIdsMutation.error ||
      updateRolePermissionsMutation.error;

    if (!sourceError) {
      return;
    }

    setError(extractMessage(sourceError, 'Failed to load roles'));
  }, [
    createMutation.error,
    deleteMutation.error,
    fetchRolePermissionIdsMutation.error,
    listQuery.error,
    permissionOptionsQuery.error,
    updateMutation.error,
    updateRolePermissionsMutation.error,
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

  const onSubmit = async () => {
    setError('');

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ uuid: editingId, form });
      } else {
        await createMutation.mutateAsync(form);
      }

      setEditingId(null);
      setForm(initialRoleForm);
      setShowForm(false);
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save role'));
    }
  };

  const onEdit = (item: RoleItem) => {
    const id = pickEntityId(item);
    if (!id) {
      setError('Role ID is missing');
      return;
    }
    setEditingId(id);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      description: item.description ?? '',
      isSystem: Boolean(item.isSystem),
    });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this role?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      await deleteMutation.mutateAsync(id);

      if (editingId === id) {
        setEditingId(null);
        setForm(initialRoleForm);
        setShowForm(false);
      }
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to delete role'));
    }
  };

  const openPermissionDialog = async (item: RoleItem) => {
    const roleId = pickEntityId(item);
    if (!roleId) {
      setError('Role ID is missing');
      return;
    }

    setPermissionDialogRole({ id: roleId, name: item.name });
    setError('');
    try {
      const ids = await fetchRolePermissionIdsMutation.mutateAsync(roleId);
      setSelectedPermissionIds(ids);
    } catch (err) {
      setError(extractMessage(err, 'Failed to load role permissions'));
      setSelectedPermissionIds([]);
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((state) =>
      state.includes(permissionId) ? state.filter((id) => id !== permissionId) : [...state, permissionId],
    );
  };

  const saveRolePermissions = async () => {
    if (!permissionDialogRole) {
      return;
    }

    setError('');
    try {
      await updateRolePermissionsMutation.mutateAsync({
        uuid: permissionDialogRole.id,
        permissionIds: selectedPermissionIds,
      });

      setPermissionDialogRole(null);
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to update role permissions'));
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(initialRoleForm);
    setShowForm(true);
  };

  const backToList = () => {
    setEditingId(null);
    setForm(initialRoleForm);
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

  return {
    items,
    permissions,
    form,
    setForm,
    editingId,
    showForm,
    permissionDialogRole,
    setPermissionDialogRole,
    selectedPermissionIds,
    searchInput,
    setSearchInput,
    error,
    setError,
    page,
    limit,
    totalPages,
    totalItems,
    loading,
    submitting,
    permissionLoading,
    permissionSubmitting,
    fetchList,
    onSubmit,
    onEdit,
    onDelete,
    openPermissionDialog,
    togglePermission,
    saveRolePermissions,
    openCreate,
    backToList,
    applySearch,
    resetSearch,
  };
}
