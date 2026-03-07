import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  useAdministratorRoleMenuOptionsQuery,
  useAdministratorRoleListQuery,
  useAdministratorRolePermissionOptionsQuery,
  useCreateAdministratorRoleMutation,
  useDeleteAdministratorRoleMutation,
  useFetchRoleMenuIdsMutation,
  useFetchRolePermissionIdsMutation,
  useUpdateAdministratorRoleMutation,
  useUpdateRoleMenusMutation,
  useUpdateRolePermissionsMutation,
} from '@/features/administrator-role/hooks/use-administrator-role';
import {
  initialRoleForm,
  type MenuOptionItem,
  type PermissionItem,
  type RoleFormState,
  type RoleItem,
} from '@/features/administrator-role/model/types';
import { pickEntityId } from '@/features/administrator-role/model/utils';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorRolePage() {
  const [items, setItems] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [menus, setMenus] = useState<MenuOptionItem[]>([]);

  const [form, setForm] = useState<RoleFormState>(initialRoleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [permissionDialogRole, setPermissionDialogRole] = useState<{ id: string; name: string } | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [menuDialogRole, setMenuDialogRole] = useState<{ id: string; name: string } | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const listQuery = useAdministratorRoleListQuery(page, limit, search);
  const permissionOptionsQuery = useAdministratorRolePermissionOptionsQuery();
  const menuOptionsQuery = useAdministratorRoleMenuOptionsQuery();
  const createMutation = useCreateAdministratorRoleMutation();
  const updateMutation = useUpdateAdministratorRoleMutation();
  const deleteMutation = useDeleteAdministratorRoleMutation();
  const fetchRolePermissionIdsMutation = useFetchRolePermissionIdsMutation();
  const updateRolePermissionsMutation = useUpdateRolePermissionsMutation();
  const fetchRoleMenuIdsMutation = useFetchRoleMenuIdsMutation();
  const updateRoleMenusMutation = useUpdateRoleMenusMutation();

  const loading = listQuery.isLoading || listQuery.isFetching;
  const submitting = createMutation.isPending || updateMutation.isPending;
  const permissionLoading = fetchRolePermissionIdsMutation.isPending;
  const permissionSubmitting = updateRolePermissionsMutation.isPending;
  const menuLoading = fetchRoleMenuIdsMutation.isPending;
  const menuSubmitting = updateRoleMenusMutation.isPending;

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
    if (!menuOptionsQuery.data) {
      return;
    }
    setMenus(menuOptionsQuery.data);
  }, [menuOptionsQuery.data]);

  useEffect(() => {
    const sourceError =
      listQuery.error ||
      permissionOptionsQuery.error ||
      menuOptionsQuery.error ||
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error ||
      fetchRolePermissionIdsMutation.error ||
      updateRolePermissionsMutation.error ||
      fetchRoleMenuIdsMutation.error ||
      updateRoleMenusMutation.error;

    if (!sourceError) {
      return;
    }

    setError(extractMessage(sourceError, 'Failed to load roles'));
  }, [
    createMutation.error,
    deleteMutation.error,
    fetchRolePermissionIdsMutation.error,
    fetchRoleMenuIdsMutation.error,
    listQuery.error,
    menuOptionsQuery.error,
    permissionOptionsQuery.error,
    updateMutation.error,
    updateRoleMenusMutation.error,
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

  const openMenuDialog = async (item: RoleItem) => {
    const roleId = pickEntityId(item);
    if (!roleId) {
      setError('Role ID is missing');
      return;
    }

    setMenuDialogRole({ id: roleId, name: item.name });
    setError('');
    try {
      const ids = await fetchRoleMenuIdsMutation.mutateAsync(roleId);
      setSelectedMenuIds(ids);
    } catch (err) {
      setError(extractMessage(err, 'Failed to load role menus'));
      setSelectedMenuIds([]);
    }
  };

  const toggleMenu = (menuId: number) => {
    setSelectedMenuIds((state) =>
      state.includes(menuId) ? state.filter((id) => id !== menuId) : [...state, menuId],
    );
  };

  const toggleMenusBulk = (menuIds: number[], checked: boolean) => {
    const normalized = Array.from(
      new Set(menuIds.filter((id) => Number.isInteger(id) && id > 0)),
    );
    if (normalized.length === 0) {
      return;
    }

    setSelectedMenuIds((state) => {
      if (checked) {
        return Array.from(new Set([...state, ...normalized]));
      }
      const next = new Set(state);
      normalized.forEach((id) => next.delete(id));
      return Array.from(next);
    });
  };

  const saveRoleMenus = async () => {
    if (!menuDialogRole) {
      return;
    }

    setError('');
    try {
      await updateRoleMenusMutation.mutateAsync({
        uuid: menuDialogRole.id,
        menuIds: selectedMenuIds,
      });

      setMenuDialogRole(null);
      void listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to update role menus'));
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


  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
  }, []);

  return {
    items,
    permissions,
    menus,
    form,
    setForm,
    editingId,
    showForm,
    permissionDialogRole,
    setPermissionDialogRole,
    selectedPermissionIds,
    menuDialogRole,
    setMenuDialogRole,
    selectedMenuIds,
    searchInput,
    setSearchInput,
    error,
    setError,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    loading,
    submitting,
    permissionLoading,
    permissionSubmitting,
    menuLoading,
    menuSubmitting,
    fetchList,
    onSubmit,
    onEdit,
    onDelete,
    openPermissionDialog,
    togglePermission,
    saveRolePermissions,
    openMenuDialog,
    toggleMenu,
    toggleMenusBulk,
    saveRoleMenus,
    openCreate,
    backToList,
    applySearch,
    resetSearch,
  };
}
