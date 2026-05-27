'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ActivateWaDeviceInput,
  type AddWaDeviceInput,
  type GetWaDeviceQrInput,
  type WaDeviceListResponse,
  waDeviceApi,
} from '../api/wa-device.api';

export function useWaDeviceList(opts: { enabled?: boolean } = {}) {
  return useQuery<WaDeviceListResponse>({
    queryKey: ['clinic-settings', 'wa-devices'],
    queryFn: () => waDeviceApi.list(),
    enabled: opts.enabled ?? true,
    staleTime: 10_000,
  });
}

export function useAddWaDevice() {
  return useMutation({
    mutationFn: (input: AddWaDeviceInput) => waDeviceApi.add(input),
  });
}

export function useWaDeviceQr() {
  return useMutation({
    mutationFn: (input: GetWaDeviceQrInput) => waDeviceApi.getQr(input),
  });
}

export function useCheckWaDevice() {
  return useMutation({
    mutationFn: (input: GetWaDeviceQrInput) => waDeviceApi.check(input),
  });
}

export function useActivateWaDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ActivateWaDeviceInput) => waDeviceApi.activate(input),
    onSuccess: () => {
      // Invalidate semua queryKey terkait settings & device status.
      // `useSettings` pakai ['clinic', 'settings']; `useWaDeviceStatus` &
      // `useWaDeviceList` pakai ['clinic-settings', ...]. Invalidate keduanya.
      qc.invalidateQueries({ queryKey: ['clinic', 'settings'] });
      qc.invalidateQueries({ queryKey: ['clinic-settings'] });
    },
  });
}

export function useRemoveWaDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (devicePhone: string) => waDeviceApi.remove(devicePhone),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'settings'] });
      qc.invalidateQueries({ queryKey: ['clinic-settings'] });
    },
  });
}
