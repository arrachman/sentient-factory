'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { psikologApi, type ListParams } from '../api/psikolog.api';
import type {
  CreatePsikologInput,
  DayAvailability,
  UpdatePsikologInput,
} from '../model/types';

const QUERY_KEY = ['clinic', 'psikolog'] as const;

export function usePsikologList(params: ListParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'list', params],
    queryFn: () => psikologApi.list(params),
  });
}

export function usePsikologDetail(id: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => psikologApi.getById(id as number),
    enabled: id !== null,
  });
}

export function useCreatePsikolog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePsikologInput) => psikologApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Psikolog berhasil dibuat');
    },
    onError: (err: Error) => {
      toast.error('Gagal membuat psikolog', { description: err.message });
    },
  });
}

export function useUpdatePsikolog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePsikologInput }) =>
      psikologApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Psikolog berhasil diupdate');
    },
    onError: (err: Error) => {
      toast.error('Gagal update psikolog', { description: err.message });
    },
  });
}

/**
 * Self-service untuk role psikolog: update jadwal availability sendiri.
 * Endpoint: PATCH /clinic/psikolog/me/availability (role-guarded clinic-psikolog).
 */
export function useUpdateMyAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (weeklyAvailability: Record<string, DayAvailability>) =>
      psikologApi.updateMyAvailability(weeklyAvailability),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Jadwal mingguan tersimpan');
    },
    onError: (err: Error) => {
      toast.error('Gagal simpan jadwal', { description: err.message });
    },
  });
}

const OVERRIDES_KEY = ['clinic', 'psikolog', 'my-date-overrides'] as const;

export function useMyDateOverrides(range?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: [...OVERRIDES_KEY, range],
    queryFn: () => psikologApi.listMyDateOverrides(range),
  });
}

export function useUpsertMyDateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      date: string;
      isOpen: boolean;
      slotIndices?: number[] | null;
      reason?: string | null;
    }) => psikologApi.upsertMyDateOverride(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: OVERRIDES_KEY });
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Override tanggal tersimpan');
    },
    onError: (err: Error) => {
      toast.error('Gagal simpan override', { description: err.message });
    },
  });
}

export function useDeleteMyDateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => psikologApi.deleteMyDateOverride(date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: OVERRIDES_KEY });
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Override dihapus, kembali ke jadwal mingguan');
    },
    onError: (err: Error) => {
      toast.error('Gagal hapus override', { description: err.message });
    },
  });
}

/**
 * Resolve effective availability psikolog di tanggal tertentu.
 * Backend merge date override (priority) + weeklyAvailability (fallback).
 * Dipakai booking wizard untuk filter slot picker.
 */
export function usePsikologAvailabilityForDate(
  userId: number | null,
  date: string,
) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'availability-for-date', userId, date],
    queryFn: () => psikologApi.availabilityForDate(userId as number, date),
    enabled: !!userId && !!date,
  });
}

export function useDeletePsikolog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psikologApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Psikolog dihapus');
    },
    onError: (err: Error) => {
      toast.error('Gagal hapus psikolog', { description: err.message });
    },
  });
}
