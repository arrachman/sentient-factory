'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { serviceApi } from '../api/service.api';
import type { CreateServiceInput, UpdateServiceInput } from '../model/types';

const KEY = ['clinic', 'service'] as const;

export function useServiceList(params: Parameters<typeof serviceApi.list>[0] = {}) {
  return useQuery({
    queryKey: [...KEY, 'list', params],
    queryFn: () => serviceApi.list(params),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) => serviceApi.create(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Layanan dibuat'); },
    onError: (e: Error) => toast.error('Gagal create', { description: e.message }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateServiceInput }) =>
      serviceApi.update(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Layanan diupdate'); },
    onError: (e: Error) => toast.error('Gagal update', { description: e.message }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => serviceApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Layanan dihapus'); },
    onError: (e: Error) => toast.error('Gagal hapus', { description: e.message }),
  });
}
