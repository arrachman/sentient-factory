'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { Booking } from '@/features/admin-booking/model/types';
import { EMPTY_FILTERS } from '@/features/admin-schedule/model/constants';
import {
  applyFilters,
  filterCount,
} from '@/features/admin-schedule/model/filters';
import {
  addDays,
  addMonths,
  formatDateLong,
  formatMonth,
  formatWeekRange,
  monthEnd,
  monthStart,
  todayKey,
  toDateKey,
  weekStartMonday,
} from '@/features/admin-schedule/model/format';
import type {
  Filters,
  ViewMode,
} from '@/features/admin-schedule/model/types';
import { useAvailabilityMap } from '@/features/admin-schedule/hooks/use-availability-map';

export interface UseOwnerScheduleReturn {
  date: string;
  setDate: (d: string) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  psikologs: ReturnType<typeof usePsikologList>['data'] extends { data: infer T } ? T : never[];
  rooms: ReturnType<typeof useRoomList>['data'] extends { data: infer T } ? T : never[];
  services: ReturnType<typeof useServiceList>['data'] extends { data: infer T } ? T : never[];
  globalSlots: unknown[];
  filteredBookings: Booking[];
  isLoading: boolean;
  resolveAvailability: ReturnType<typeof useAvailabilityMap>['resolve'];
  psikologsForAvail: UseOwnerScheduleReturn['psikologs'];
  datesToFetch: string[];
  shiftPrev: () => void;
  shiftNext: () => void;
  dateLabel: string;
  activeFilterCount: number;
}

export function useOwnerSchedule() {
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);
  const [view, setView] = useState<ViewMode>('Hari');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const settingsQuery = useSettings();
  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200 });

  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];

  const datesToFetch = useMemo(() => {
    if (!date) return [];
    if (view === 'Hari') return [date];
    if (view === 'Minggu') {
      const start = weekStartMonday(date);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const start = new Date(monthStart(date));
    const end = new Date(monthEnd(date));
    const out: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
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
  const bookingsStamp = dayQueries.map((q) => q.dataUpdatedAt).join(',');
  const allBookings = useMemo<Booking[]>(
    () => dayQueries.flatMap((q) => q.data?.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingsStamp],
  );
  const filteredBookings = useMemo(
    () => applyFilters(allBookings, filters),
    [allBookings, filters],
  );

  const availEnabled = view === 'Hari' || view === 'Minggu';
  const { resolve: resolveAvailability } = useAvailabilityMap({
    psikologs,
    from: datesToFetch[0] ?? '',
    to: datesToFetch[datesToFetch.length - 1] ?? '',
    enabled: availEnabled,
  });
  const psikologsForAvail = useMemo(
    () =>
      filters.psikologIds.size > 0
        ? psikologs.filter((p) => filters.psikologIds.has(p.userId))
        : psikologs,
    [psikologs, filters.psikologIds],
  );

  function shiftPrev() {
    if (view === 'Hari') setDate(addDays(date, -1));
    else if (view === 'Minggu') setDate(addDays(date, -7));
    else setDate(addMonths(date, -1));
  }
  function shiftNext() {
    if (view === 'Hari') setDate(addDays(date, 1));
    else if (view === 'Minggu') setDate(addDays(date, 7));
    else setDate(addMonths(date, 1));
  }

  const dateLabel = !date
    ? ''
    : view === 'Hari'
      ? formatDateLong(date)
      : view === 'Minggu'
        ? formatWeekRange(weekStartMonday(date))
        : formatMonth(date);

  const activeFilterCount = filterCount(filters);

  return {
    date,
    setDate,
    view,
    setView,
    filters,
    setFilters,
    psikologs,
    rooms,
    services,
    globalSlots,
    filteredBookings,
    isLoading,
    resolveAvailability,
    psikologsForAvail,
    datesToFetch,
    shiftPrev,
    shiftNext,
    dateLabel,
    activeFilterCount,
  };
}
