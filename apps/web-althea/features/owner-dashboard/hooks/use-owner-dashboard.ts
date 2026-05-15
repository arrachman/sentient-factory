'use client';

/**
 * Hook orchestrator untuk Owner Dashboard:
 *   - Fetch data: today bookings, last 30d bookings, psikolog, room, service, settings
 *   - Derive: KPI, performa psikolog, weekly trend, room groups, top services, owner note
 *
 * Keep page tipis — semua compute di sini & tipis fungsi pure di model/aggregate.
 */
import { useMemo } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import {
  computeKpi,
  computeOwnerNote,
  computePsikologPerf,
  computeRoomGroups,
  computeTopServices,
  computeWeekTrend,
} from '../model/aggregate';
import { DEFAULT_SLOTS_PER_DAY } from '../model/constants';
import { dateKey, todayKey } from '../model/format';

function rangeFrom35DaysAgo(): { dateFrom: string; dateTo: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 35);
  return { dateFrom: dateKey(from), dateTo: dateKey(to) };
}

export function useOwnerDashboard() {
  const range = rangeFrom35DaysAgo();
  const today = useBookingList({
    date: todayKey(),
    limit: 200,
    includeCancelled: false,
  });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const monthBookings = useBookingList({
    limit: 500,
    includeCancelled: false,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
  });

  const slotsPerDay =
    settingsQuery.data?.data.slotsOfDay?.length || DEFAULT_SLOTS_PER_DAY;
  const todayBookings = today.data?.data ?? [];
  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];
  const allBookings = monthBookings.data?.data ?? [];

  const kpi = useMemo(
    () =>
      computeKpi({
        todayBookings,
        psikologs,
        rooms,
        allBookings,
        slotsPerDay,
      }),
    [todayBookings, psikologs, rooms, allBookings, slotsPerDay],
  );

  const psikologPerf = useMemo(
    () =>
      computePsikologPerf({
        psikologs,
        todayBookings,
        allBookings,
      }),
    [psikologs, todayBookings, allBookings],
  );

  const ownerNote = useMemo(
    () => computeOwnerNote(psikologPerf, slotsPerDay),
    [psikologPerf, slotsPerDay],
  );

  const weekTrend = useMemo(
    () => computeWeekTrend(allBookings),
    [allBookings],
  );

  const roomGroups = useMemo(
    () =>
      computeRoomGroups({
        rooms,
        todayBookings,
        slotsPerDay,
      }),
    [rooms, todayBookings, slotsPerDay],
  );

  const topServices = useMemo(
    () => computeTopServices(allBookings),
    [allBookings],
  );

  const weekTotal = weekTrend.reduce((sum, d) => sum + d.count, 0);
  const weekMax = Math.max(...weekTrend.map((d) => d.count), 1);

  return {
    psikologs,
    rooms,
    todayBookings,
    services,
    isLoadingPsikolog: psikologList.isLoading,
    slotsPerDay,
    kpi,
    psikologPerf,
    ownerNote,
    weekTrend,
    weekTotal,
    weekMax,
    roomGroups,
    topServices,
  };
}
