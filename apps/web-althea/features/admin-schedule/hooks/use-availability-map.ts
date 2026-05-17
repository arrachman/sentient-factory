'use client';

/**
 * Resolver ketersediaan psikolog untuk grid Penjadwalan.
 *
 * Gabung `weeklyAvailability` (sudah ikut di list psikolog) + date override
 * per-psikolog (fetch range sekali per psikolog) → `DayAvailability`.
 *
 * Logika resolve mirror backend `assertPsikologAvailable` lewat helper
 * `resolveDayAvailability` (SSOT di features/psikolog-schedule).
 */
import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { psikologApi } from '@/features/admin-psikolog/api/psikolog.api';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import {
  resolveDayAvailability,
  type DayAvailability,
} from '@/features/psikolog-schedule/model/availability';

export type AvailabilityResolver = (
  userId: number,
  date: Date,
) => DayAvailability;

type OverrideRow = {
  date: string;
  isOpen: boolean;
  slotIndices: number[] | null;
  reason: string | null;
};

const UNSET: DayAvailability = {
  isOpen: false,
  slotIndices: null,
  source: 'unset',
};

export function useAvailabilityMap({
  psikologs,
  from,
  to,
  enabled,
}: {
  psikologs: Psikolog[];
  from: string;
  to: string;
  enabled: boolean;
}): { resolve: AvailabilityResolver; isLoading: boolean } {
  const range = useMemo(() => ({ from, to }), [from, to]);

  const overrideQueries = useQueries({
    queries: psikologs.map((p) => ({
      queryKey: [
        'clinic',
        'psikolog',
        'date-overrides-for-user',
        p.userId,
        range,
      ],
      queryFn: () => psikologApi.listDateOverridesForUser(p.userId, range),
      enabled: enabled && !!from && !!to,
      staleTime: 30_000,
    })),
  });

  const stamp = overrideQueries.map((q) => q.dataUpdatedAt).join(',');

  // Map userId → { weeklyAvailability, overrides[] }. Re-build saat data
  // override berubah (stamp) atau daftar psikolog berubah.
  const byUser = useMemo(() => {
    const m = new Map<
      number,
      {
        weekly: Psikolog['weeklyAvailability'];
        overrides: OverrideRow[];
      }
    >();
    psikologs.forEach((p, i) => {
      m.set(p.userId, {
        weekly: p.weeklyAvailability ?? {},
        overrides: overrideQueries[i]?.data?.data ?? [],
      });
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psikologs, stamp]);

  const resolve = useMemo<AvailabilityResolver>(
    () => (userId, date) => {
      const entry = byUser.get(userId);
      if (!entry) return UNSET;
      return resolveDayAvailability(date, entry.weekly, entry.overrides);
    },
    [byUser],
  );

  const isLoading = enabled && overrideQueries.some((q) => q.isLoading);

  return { resolve, isLoading };
}
