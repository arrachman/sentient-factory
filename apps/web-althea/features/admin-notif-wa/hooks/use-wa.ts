'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { waApi } from '../api/wa.api';
import type { CreateTemplateInput } from '../model/types';

const T_KEY = ['clinic', 'wa', 'template'] as const;
const L_KEY = ['clinic', 'wa', 'log'] as const;

export function useTemplateList(params: Parameters<typeof waApi.listTemplates>[0] = {}) {
  return useQuery({ queryKey: [...T_KEY, params], queryFn: () => waApi.listTemplates(params) });
}

export function useLogList(params: Parameters<typeof waApi.listLogs>[0] = {}) {
  return useQuery({ queryKey: [...L_KEY, params], queryFn: () => waApi.listLogs(params), refetchInterval: 5000 });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => waApi.createTemplate(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: T_KEY }); toast.success('Template dibuat'); },
    onError: (e: Error) => toast.error('Gagal create', { description: e.message }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateTemplateInput> }) =>
      waApi.updateTemplate(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: T_KEY }); toast.success('Template diupdate'); },
    onError: (e: Error) => toast.error('Gagal update', { description: e.message }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => waApi.removeTemplate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: T_KEY }); toast.success('Template dihapus'); },
    onError: (e: Error) => toast.error('Gagal hapus', { description: e.message }),
  });
}

export function useSendTest() {
  return useMutation({
    mutationFn: (input: Parameters<typeof waApi.sendTest>[0]) => waApi.sendTest(input),
    onSuccess: (res) => toast.success(`Test sent: ${res.data.status}`),
    onError: (e: Error) => toast.error('Gagal kirim test', { description: e.message }),
  });
}
