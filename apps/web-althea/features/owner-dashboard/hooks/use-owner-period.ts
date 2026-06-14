'use client';

/**
 * URL-synced state untuk filter periode owner (`?period=&date=`).
 *
 * Sinkron antara /owner/dashboard & /owner/analitik supaya pindah tab
 * pertahankan pilihan user.
 */
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type PeriodMode,
  formatRangeLabel,
  resolveRange,
  shiftAnchor,
  todayKey,
} from '../model/period';

const VALID_MODES: PeriodMode[] = ['Harian', 'Mingguan', 'Bulanan'];

function parseMode(raw: string | null): PeriodMode {
  if (raw && (VALID_MODES as string[]).includes(raw)) return raw as PeriodMode;
  return 'Harian';
}

function parseAnchor(raw: string | null): string {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return '';
}

export function useOwnerPeriod() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const initialMode = parseMode(search.get('period'));
  const initialAnchor = parseAnchor(search.get('date'));

  const [mode, setMode] = useState<PeriodMode>(initialMode);
  const [anchor, setAnchor] = useState<string>(initialAnchor);

  // Hydrate anchor di client only untuk hindari SSR mismatch.
  useEffect(() => {
    if (!anchor) setAnchor(todayKey());
  }, [anchor]);

  // Push back ke URL kalau berubah.
  useEffect(() => {
    if (!anchor) return;
    const params = new URLSearchParams(search.toString());
    params.set('period', mode);
    params.set('date', anchor);
    const next = `${pathname}?${params.toString()}`;
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, anchor, pathname]);

  const range = resolveRange(mode, anchor);
  const rangeLabel = formatRangeLabel(range);

  const onShiftPrev = useCallback(() => {
    if (!anchor) return;
    setAnchor((a) => shiftAnchor(mode, a, -1));
  }, [anchor, mode]);
  const onShiftNext = useCallback(() => {
    if (!anchor) return;
    setAnchor((a) => shiftAnchor(mode, a, 1));
  }, [anchor, mode]);
  const onResetToToday = useCallback(() => setAnchor(todayKey()), []);

  return {
    mode,
    anchor,
    range,
    rangeLabel,
    setMode,
    setAnchor,
    onShiftPrev,
    onShiftNext,
    onResetToToday,
  };
}
