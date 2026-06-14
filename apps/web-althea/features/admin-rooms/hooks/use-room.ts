'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roomApi } from '../api/room.api';
import type { CreateRoomInput } from '../model/types';

const KEY = ['clinic', 'room'] as const;

export function useRoomList(params: Parameters<typeof roomApi.list>[0] = {}) {
  return useQuery({ queryKey: [...KEY, 'list', params], queryFn: () => roomApi.list(params) });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoomInput) => roomApi.create(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Ruang dibuat'); },
    onError: (e: Error) => toast.error('Gagal create', { description: e.message }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateRoomInput> }) =>
      roomApi.update(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Ruang diupdate'); },
    onError: (e: Error) => toast.error('Gagal update', { description: e.message }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roomApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Ruang dihapus'); },
    onError: (e: Error) => toast.error('Gagal hapus', { description: e.message }),
  });
}

export function useDeactivateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roomApi.update(id, { isActive: false }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Ruangan dinonaktifkan'); },
    onError: (e: Error) => toast.error('Gagal nonaktifkan', { description: e.message }),
  });
}
