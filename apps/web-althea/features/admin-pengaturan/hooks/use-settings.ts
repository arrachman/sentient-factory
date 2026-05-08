'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi, type UpdateSettingsInput } from '../api/settings.api';

const KEY = ['clinic', 'settings'] as const;

export function useSettings() {
  return useQuery({ queryKey: KEY, queryFn: () => settingsApi.get() });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSettingsInput) => settingsApi.update(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Pengaturan tersimpan');
    },
    onError: (e: Error) => toast.error('Gagal simpan', { description: e.message }),
  });
}
