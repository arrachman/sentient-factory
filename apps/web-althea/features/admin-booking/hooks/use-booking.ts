'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingApi } from '../api/booking.api';

const KEY = ['clinic', 'booking'] as const;

export function useBookingList(params: Parameters<typeof bookingApi.list>[0] = {}) {
  return useQuery({ queryKey: [...KEY, 'list', params], queryFn: () => bookingApi.list(params) });
}

function transitionMutation(name: string, fn: (id: number) => Promise<unknown>) {
  return function useTransition() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => fn(id),
      onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success(`Booking → ${name}`); },
      onError: (e: Error) => toast.error(`Gagal ${name}`, { description: e.message }),
    });
  };
}

export const useStartBooking = transitionMutation('in_progress', bookingApi.start);
export const useCompleteBooking = transitionMutation('completed', bookingApi.complete);

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => bookingApi.cancel(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Booking cancelled'); },
    onError: (e: Error) => toast.error('Gagal cancel', { description: e.message }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof bookingApi.update>[1] }) =>
      bookingApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Booking diperbarui');
    },
    onError: (e: Error) => toast.error('Gagal perbarui booking', { description: e.message }),
  });
}

export function useRescheduleBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof bookingApi.reschedule>[1] }) =>
      bookingApi.reschedule(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Booking di-reschedule');
    },
    onError: (e: Error) =>
      toast.error('Gagal reschedule', { description: e.message }),
  });
}
