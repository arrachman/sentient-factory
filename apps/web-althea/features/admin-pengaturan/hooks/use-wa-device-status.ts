'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsApi, type WaDeviceStatus } from '../api/settings.api';

export function useWaDeviceStatus() {
  return useQuery<WaDeviceStatus>({
    queryKey: ['clinic-settings', 'wa-status'],
    queryFn: async () => {
      const res = await settingsApi.getWaStatus();
      return res as WaDeviceStatus;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
