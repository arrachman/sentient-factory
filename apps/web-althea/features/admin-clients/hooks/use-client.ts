'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientApi } from '../api/client.api';
import type { CreateClientInput } from '../model/types';

const KEY = ['clinic', 'client'] as const;

export function useClientList(params: Parameters<typeof clientApi.list>[0] = {}) {
  return useQuery({ queryKey: [...KEY, 'list', params], queryFn: () => clientApi.list(params) });
}

export function useClientDetail(id: number | null) {
  return useQuery({
    queryKey: [...KEY, 'detail', id],
    queryFn: () => clientApi.get(id as number),
    enabled: id !== null,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) => clientApi.create(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Klien dibuat'); },
    onError: (e: Error) => toast.error('Gagal create', { description: e.message }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateClientInput> }) =>
      clientApi.update(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Klien diupdate'); },
    onError: (e: Error) => toast.error('Gagal update', { description: e.message }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Klien dihapus'); },
    onError: (e: Error) => toast.error('Gagal hapus', { description: e.message }),
  });
}
