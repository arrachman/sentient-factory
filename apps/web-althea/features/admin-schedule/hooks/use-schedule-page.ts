'use client';

/**
 * Hook orchestrator untuk halaman Admin · Penjadwalan.
 *   - View state (Hari/Minggu/Bulan) + tanggal aktif
 *   - Filter state + active count
 *   - useQueries untuk fetch booking per tanggal sesuai view (Hari=1, Minggu=7, Bulan=30+)
 *   - Derive: filteredBookings + stats
 *   - Helpers: shiftPrev/Next, dateLabel
 */
import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import type { Booking } from '@/features/admin-booking/model/types';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { EMPTY_FILTERS } from '../model/constants';
import { applyFilters, filterCount } from '../model/filters';
import {
  addDays,
  addMonths,
  formatDateLong,
  formatMonth,
  formatWeekRange,
  monthEnd,
  monthStart,
  toDateKey,
  todayKey,
  weekStartMonday,
} from '../model/format';
import type { Filters, ViewMode } from '../model/types';
import type { ScheduleStats } from '../ui/schedule-stats-strip';

export function useSchedulePage() {
  // Init '' supaya SSR + client hydration konsisten. Set today di useEffect.
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);
  const [view, setView] = useState<ViewMode>('Hari');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const settingsQuery = useSettings();
  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200 });

  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];

  const datesToFetch = useMemo<string[]>(() => {
    if (view === 'Hari') return [date];
    if (view === 'Minggu') {
      const start = weekStartMonday(date);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const start = new Date(monthStart(date));
    const end = new Date(monthEnd(date));
    const out: string[] = [];
    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      out.push(toDateKey(d));
    }
    return out;
  }, [date, view]);

  const dayQueries = useQueries({
    queries: datesToFetch.map((d) => ({
      queryKey: [
        'clinic',
        'booking',
        'list',
        { date: d, limit: 200, includeCancelled: false },
      ],
      queryFn: () =>
        bookingApi.list({ date: d, limit: 200, includeCancelled: false }),
    })),
  });

  const isLoading =
    dayQueries.some((q) => q.isLoading) || psikologList.isLoading;

  // Stable signature: ganti tiap day query selesai refetch.
  const dayQueriesSignature = dayQueries.map((q) => q.dataUpdatedAt).join(',');
  const allBookings = useMemo<Booking[]>(
    () => dayQueries.flatMap((q) => q.data?.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayQueriesSignature],
  );

  const filteredBookings = useMemo(
    () => applyFilters(allBookings, filters),
    [allBookings, filters],
  );

  const stats = useMemo<ScheduleStats>(() => {
    const totalSlots =
      psikologs.length * globalSlots.length * (datesToFetch.length || 1);
    const usedRoomIds = new Set(filteredBookings.map((b) => b.room.id));
    const inProgressCount = filteredBookings.filter(
      (b) => b.status === 'in_progress',
    ).length;
    return {
      sesi: {
        value: filteredBookings.length,
        sub: totalSlots ? `dari ${totalSlots} slot tersedia` : '—',
      },
      psikolog: {
        value: psikologs.length,
        sub: inProgressCount
          ? `${inProgressCount} sedang sesi sekarang`
          : 'siap menerima',
      },
      ruangan: {
        value: `${usedRoomIds.size}/${rooms.length || '—'}`,
        sub: rooms.length
          ? `${Math.max(0, rooms.length - usedRoomIds.size)} ruangan kosong`
          : 'memuat...',
      },
      wa: { value: '—', sub: 'terkirim hari ini' },
    };
  }, [
    psikologs.length,
    filteredBookings,
    rooms.length,
    datesToFetch.length,
  ]);

  const shiftPrev = () => {
    if (view === 'Hari') setDate(addDays(date, -1));
    else if (view === 'Minggu') setDate(addDays(date, -7));
    else setDate(addMonths(date, -1));
  };
  const shiftNext = () => {
    if (view === 'Hari') setDate(addDays(date, 1));
    else if (view === 'Minggu') setDate(addDays(date, 7));
    else setDate(addMonths(date, 1));
  };

  const dateLabel =
    view === 'Hari'
      ? formatDateLong(date)
      : view === 'Minggu'
        ? formatWeekRange(weekStartMonday(date))
        : formatMonth(date);

  return {
    // state
    date,
    setDate,
    view,
    setView,
    wizardOpen,
    setWizardOpen,
    filterOpen,
    setFilterOpen,
    filters,
    setFilters,
    // data
    psikologs,
    rooms,
    services,
    filteredBookings,
    isLoading,
    // derived
    stats,
    dateLabel,
    activeFilterCount: filterCount(filters),
    weekStart: weekStartMonday(date),
    // handlers
    shiftPrev,
    shiftNext,
    resetToToday: () => setDate(todayKey()),
  };
}
