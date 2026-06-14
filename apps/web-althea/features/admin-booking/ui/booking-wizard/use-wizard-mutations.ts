'use client';

import { useMutation } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { bookingApi } from '../../api/booking.api';

interface UseWizardMutationsParams {
  onClose: () => void;
  qc: QueryClient;
}

/**
 * Provides createSingleMut and createPackageMut with full success/error handling.
 * qc (QueryClient) is passed in rather than called here to keep the hook pure.
 */
export function useWizardMutations({ onClose, qc }: UseWizardMutationsParams) {
  const createSingleMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`
      ).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{ success: boolean; data: { id: number } }>(
        '/booking',
        payload,
        { headers: { 'Idempotency-Key': idempotencyKey } },
      );
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Booking #${res.data.id} berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as {
          conflictType?: string;
          conflictBookingId?: number;
        };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description: `Booking #${body?.conflictBookingId} bertabrakan. Pilih slot, psikolog, atau ruangan lain.`,
        });
        return;
      }
      toast.error('Gagal create booking', { description: err.message });
    },
  });

  const createPackageMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`
      ).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{
        success: boolean;
        data: { packageGroupId: string; sessionCount: number };
      }>('/booking/package', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Paket ${res.data.sessionCount} sesi berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; message?: string };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description: body?.message ?? 'Bentrok jadwal — adjust slot atau pilih psikolog/ruangan lain',
        });
        return;
      }
      toast.error('Gagal create paket booking', { description: err.message });
    },
  });

  const editMut = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof bookingApi.editBooking>[1] }) =>
      bookingApi.editBooking(id, input),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(res.message ?? `Booking #${res.data.id} diperbarui`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; conflictBookingId?: number };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description: `Booking #${body?.conflictBookingId} bertabrakan. Pilih slot, psikolog, atau ruangan lain.`,
        });
        return;
      }
      toast.error('Gagal ubah booking', { description: err.message });
    },
  });

  return { createSingleMut, createPackageMut, editMut };
}
