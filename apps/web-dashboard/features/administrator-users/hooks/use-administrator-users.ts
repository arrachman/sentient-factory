import {
  createUser,
  deleteUser,
  fetchDefaultWarehouseId,
  fetchRoleOptions,
  fetchUsers,
  fetchWarehouseOptions,
  updateUser,
} from '@/features/administrator-users/api/users.api';
import type { UserFormState } from '@/features/administrator-users/model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdministratorUsersListQuery(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ['administrator-users', { page, limit, search }],
    queryFn: () => fetchUsers({ page, limit, search }),
  });
}

export function useAdministratorWarehouseOptionsQuery() {
  return useQuery({
    queryKey: ['administrator-users-warehouse-options'],
    queryFn: fetchWarehouseOptions,
  });
}

export function useAdministratorRoleOptionsQuery() {
  return useQuery({
    queryKey: ['administrator-users-role-options'],
    queryFn: fetchRoleOptions,
  });
}

export function useAdministratorDefaultWarehouseQuery() {
  return useQuery({
    queryKey: ['administrator-users-default-warehouse'],
    queryFn: fetchDefaultWarehouseId,
  });
}

export function useCreateAdministratorUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: UserFormState) => createUser(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-users'] });
    },
  });
}

export function useUpdateAdministratorUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, form }: { uuid: string; form: UserFormState }) => updateUser(uuid, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-users'] });
    },
  });
}

export function useDeleteAdministratorUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteUser(uuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-users'] });
    },
  });
}
