'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  psikologProfileApi,
  type UpdateProfileInput,
  type WeeklyAvailability,
} from '../api/profile.api';

const ME_KEY = ['clinic', 'psikolog', 'me'] as const;
const STATS_KEY = ['clinic', 'psikolog', 'me', 'stats'] as const;

export function usePsikologMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: () => psikologProfileApi.getMe(),
    staleTime: 60 * 1000, // 1 menit cache
  });
}

export function usePsikologStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: () => psikologProfileApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 menit cache (stats jarang berubah)
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

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      psikologProfileApi.updateMe(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] }); // sidebar avatar refresh
      toast.success('Profil tersimpan');
    },
    onError: (e: Error) => {
      toast.error('Gagal simpan profil', { description: e.message });
    },
  });
}
