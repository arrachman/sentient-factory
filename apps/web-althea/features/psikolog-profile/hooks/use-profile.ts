'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  psikologProfileApi,
  type WeeklyAvailability,
} from '../api/profile.api';

const ME_KEY = ['clinic', 'psikolog', 'me'] as const;

export function usePsikologMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: () => psikologProfileApi.getMe(),
    staleTime: 60 * 1000, // 1 menit cache
  });
}

export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (weeklyAvailability: WeeklyAvailability) =>
      psikologProfileApi.updateAvailability(weeklyAvailability),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
      // Booking wizard depends on availability — invalidate juga
      qc.invalidateQueries({ queryKey: ['clinic', 'psikolog'] });
      toast.success('Jadwal tersimpan');
    },
    onError: (e: Error) => {
      toast.error('Gagal simpan jadwal', { description: e.message });
    },
  });
}
