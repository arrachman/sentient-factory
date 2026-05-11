'use client';

/**
 * Hook orchestrator untuk halaman Jadwal Saya (psikolog).
 *
 *   - Anchor (date-key) untuk view aktif (init '' supaya SSR-safe)
 *   - View mode (Hari/Minggu/Bulan) — semua active dengan range fetch berbeda
 *   - Dynamic dayQueries via `useQueries` (1 / 6 / ~31 hari)
 *   - Filters (status, category, sesiType, clientQuery) di-apply client-side
 *   - Derived stats: totalBooked, utilisation
 */
import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { useMe } from '@/features/auth/hooks/use-me';
import type { Booking } from '@/features/admin-booking/model/types';
import {
  EMPTY_FILTERS,
  SLOTS,
  type ScheduleFilters,
  type ViewMode,
} from '../model/constants';
import {
  addDays,
  addMonths,
  applyFilters,
  filterCount,
  monthEnd,
  monthStart,
  toDateKey,
  todayKey,
  weekStart,
} from '../model/format';

export function usePsikologSchedule() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  const [anchor, setAnchor] = useState<string>('');
  const [view, setView] = useState<ViewMode>('Minggu');
  const [filters, setFilters] = useState<ScheduleFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  // Init anchor di useEffect supaya SSR + client hydration konsisten.
  useEffect(() => {
    if (!anchor) setAnchor(todayKey());
  }, [anchor]);

  // ---------------------------------------------------------------------
  // Date range computation per view
  // ---------------------------------------------------------------------

  const days = useMemo<Date[]>(() => {
    if (!anchor) return [];
    if (view === 'Hari') {
      return [new Date(anchor)];
    }
    if (view === 'Minggu') {
      const start = weekStart(anchor);
      const arr: Date[] = [];
      // 6 hari kerja (Sen-Sab) — Min skip karena klinik tutup
      for (let i = 0; i < 6; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        arr.push(d);
      }
      return arr;
    }
    // Bulan: semua hari di bulan anchor
    const start = new Date(monthStart(anchor));
    const end = new Date(monthEnd(anchor));
    const arr: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    return arr;
  }, [anchor, view]);

  // ---------------------------------------------------------------------
  // Parallel booking queries (dynamic count via useQueries)
  // ---------------------------------------------------------------------

  const dayQueries = useQueries({
    queries: days.map((d) => ({
      queryKey: [
        'clinic',
        'booking',
        'list',
        {
          psikologUserId: myUserId,
          date: toDateKey(d),
          limit: 50,
        },
      ],
      queryFn: () =>
        bookingApi.list({
          psikologUserId: myUserId!,
          date: toDateKey(d),
          limit: 50,
        }),
      enabled: !!myUserId && !!anchor,
    })),
  });

  const dayBookings = useMemo<Booking[][]>(
    () => dayQueries.map((q) => q.data?.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayQueries.map((q) => q.dataUpdatedAt).join(','), filters],
  );

  // Apply filters per day
  const filteredDayBookings = useMemo<Booking[][]>(
    () => dayBookings.map((bs) => applyFilters(bs, filters)),
    [dayBookings, filters],
  );

  const allBookings = useMemo(
    () => filteredDayBookings.flat(),
    [filteredDayBookings],
  );

  const isLoading = dayQueries.some((q) => q.isLoading);

  // ---------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------

  const todayIdx = days.findIndex((d) => toDateKey(d) === todayKey());
  const totalBooked = allBookings.length;
  const totalSlots = days.length * SLOTS.length;
  const utilisation =
    totalSlots > 0 ? Math.round((totalBooked / totalSlots) * 100) : 0;

  // ---------------------------------------------------------------------
  // Date navigation (view-aware)
  // ---------------------------------------------------------------------

  function shiftPrev() {
    if (!anchor) return;
    if (view === 'Hari') setAnchor(addDays(anchor, -1));
    else if (view === 'Minggu') setAnchor(addDays(anchor, -7));
    else setAnchor(addMonths(anchor, -1));
  }

  function shiftNext() {
    if (!anchor) return;
    if (view === 'Hari') setAnchor(addDays(anchor, 1));
    else if (view === 'Minggu') setAnchor(addDays(anchor, 7));
    else setAnchor(addMonths(anchor, 1));
  }

  function resetToToday() {
    setAnchor(todayKey());
  }

  const activeFilterCount = filterCount(filters);

  const ready = !!anchor;

  return {
    // State
    anchor,
    setAnchor,
    view,
    setView,
    filters,
    setFilters,
    filterOpen,
    setFilterOpen,
    // Date data
    days,
    todayIdx,
    // Bookings
    dayBookings: filteredDayBookings,
    allBookings,
    isLoading,
    // Stats
    totalBooked,
    utilisation,
    activeFilterCount,
    // Actions
    shiftPrev,
    shiftNext,
    resetToToday,
    ready,
  };
}
