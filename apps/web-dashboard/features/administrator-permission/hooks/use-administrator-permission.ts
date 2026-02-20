import {
  createPermission,
  deletePermission,
  fetchPermissions,
  updatePermission,
} from '@/features/administrator-permission/api/permission.api';
import type { PermissionFormState } from '@/features/administrator-permission/model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdministratorPermissionListQuery(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ['administrator-permissions', { page, limit, search }],
    queryFn: () => fetchPermissions({ page, limit, search }),
  });
}

export function useCreateAdministratorPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: PermissionFormState) => createPermission(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-permissions'] });
    },
  });
}

export function useUpdateAdministratorPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, form }: { uuid: string; form: PermissionFormState }) =>
      updatePermission(uuid, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-permissions'] });
    },
  });
}

export function useDeleteAdministratorPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deletePermission(uuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-permissions'] });
    },
  });
}
