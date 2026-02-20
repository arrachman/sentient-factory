import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  updateDepartment,
} from '@/features/administrator-department/api/department.api';
import type { DepartmentFormState } from '@/features/administrator-department/model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdministratorDepartmentListQuery(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ['administrator-departments', { page, limit, search }],
    queryFn: () => fetchDepartments({ page, limit, search }),
  });
}

export function useCreateAdministratorDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: DepartmentFormState) => createDepartment(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-departments'] });
    },
  });
}

export function useUpdateAdministratorDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, form }: { uuid: string; form: DepartmentFormState }) =>
      updateDepartment(uuid, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-departments'] });
    },
  });
}

export function useDeleteAdministratorDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteDepartment(uuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['administrator-departments'] });
    },
  });
}
