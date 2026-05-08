'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import type { CreateUserInput } from '../model/types';

const KEY = ['clinic', 'users'] as const;

export function useUserList(params: Parameters<typeof usersApi.list>[0] = {}) {
  return useQuery({ queryKey: [...KEY, 'list', params], queryFn: () => usersApi.list(params) });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('User dibuat'); },
    onError: (e: Error) => toast.error('Gagal create', { description: e.message }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateUserInput> }) =>
      usersApi.update(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('User diupdate'); },
    onError: (e: Error) => toast.error('Gagal update', { description: e.message }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('User dihapus'); },
    onError: (e: Error) => toast.error('Gagal hapus', { description: e.message }),
  });
}
