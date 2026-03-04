import {
  createRole,
  deleteRole,
  fetchMenuOptions,
  fetchRoleMenuIds,
  fetchPermissionOptions,
  fetchRolePermissionIds,
  fetchRoles,
  updateRole,
  updateRoleMenus,
  updateRolePermissions,
} from '@/features/administrator-role/api/role.api';
import type { RoleFormState } from '@/features/administrator-role/model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdministratorRoleListQuery(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ['administrator-roles', { page, limit, search }],
    queryFn: () => fetchRoles({ page, limit, search }),
  });
}

export function useAdministratorRolePermissionOptionsQuery() {
  return useQuery({
    queryKey: ['administrator-role-permission-options'],
    queryFn: fetchPermissionOptions,
  });
}

export function useAdministratorRoleMenuOptionsQuery() {
  return useQuery({
    queryKey: ['administrator-role-menu-options'],
    queryFn: fetchMenuOptions,
  });
}

export function useCreateAdministratorRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: RoleFormState) => createRole(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-roles'] });
    },
  });
}

export function useUpdateAdministratorRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, form }: { uuid: string; form: RoleFormState }) => updateRole(uuid, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-roles'] });
    },
  });
}

export function useDeleteAdministratorRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteRole(uuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-roles'] });
    },
  });
}

export function useFetchRolePermissionIdsMutation() {
  return useMutation({
    mutationFn: (uuid: string) => fetchRolePermissionIds(uuid),
  });
}

export function useUpdateRolePermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, permissionIds }: { uuid: string; permissionIds: number[] }) =>
      updateRolePermissions(uuid, permissionIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-roles'] });
    },
  });
}

export function useFetchRoleMenuIdsMutation() {
  return useMutation({
    mutationFn: (uuid: string) => fetchRoleMenuIds(uuid),
  });
}

export function useUpdateRoleMenusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, menuIds }: { uuid: string; menuIds: number[] }) =>
      updateRoleMenus(uuid, menuIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-roles'] });
    },
  });
}
