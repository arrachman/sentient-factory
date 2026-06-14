'use client';

/**
 * Hook orchestrator Owner Dashboard & Analitik dengan filter periode.
 *
 * Input: { period, anchor } — period: Harian/Mingguan/Bulanan, anchor = YYYY-MM-DD.
 * Output: range info + agregat siap pakai komponen UI.
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
  computeTrend,
} from '../model/aggregate';
import { DEFAULT_SLOTS_PER_DAY } from '../model/constants';
import {
  type PeriodMode,
  resolveRange,
} from '../model/period';

const FALLBACK_SLOTS = [
  { start: '08:00', end: '09:30' },
  { start: '09:30', end: '11:00' },
  { start: '11:00', end: '12:30' },
  { start: '13:00', end: '14:30' },
];

export function useOwnerDashboard({
  period,
  anchor,
}: {
  period: PeriodMode;
  anchor: string;
}) {
  const range = useMemo(() => resolveRange(period, anchor), [period, anchor]);

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const periodQuery = useBookingList({
    limit: 500,
    includeCancelled: false,
    dateFrom: range.from || undefined,
    dateTo: range.to || undefined,
  });

  const settings = settingsQuery.data?.data;
  const slotsOfDay = settings?.slotsOfDay?.length
    ? settings.slotsOfDay
    : FALLBACK_SLOTS;
  const slotsPerDay =
    settings?.maxBookingsPerDay ?? slotsOfDay.length ?? DEFAULT_SLOTS_PER_DAY;

  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];
  const periodBookings = periodQuery.data?.data ?? [];
  const rangeDays = Math.max(range.days.length, 1);

  const kpi = useMemo(
    () =>
      computeKpi({
        periodBookings,
        psikologs,
        rooms,
        slotsPerDay,
        rangeDays,
      }),
    [periodBookings, psikologs, rooms, slotsPerDay, rangeDays],
  );

  const psikologPerf = useMemo(
    () => computePsikologPerf({ psikologs, periodBookings }),
    [psikologs, periodBookings],
  );

  const ownerNote = useMemo(
    () => computeOwnerNote(psikologPerf, slotsPerDay, rangeDays),
    [psikologPerf, slotsPerDay, rangeDays],
  );

  const trend = useMemo(
    () => computeTrend({ range, periodBookings, slotsOfDay }),
    [range, periodBookings, slotsOfDay],
  );

  const roomGroups = useMemo(
    () =>
      computeRoomGroups({
        rooms,
        periodBookings,
        slotsPerDay,
        rangeDays,
      }),
    [rooms, periodBookings, slotsPerDay, rangeDays],
  );

  const topServices = useMemo(
    () => computeTopServices(periodBookings),
    [periodBookings],
  );

  const trendTotal = trend.reduce((sum, d) => sum + d.count, 0);
  const trendMax = Math.max(...trend.map((d) => d.count), 1);

  return {
    range,
    psikologs,
    rooms,
    services,
    periodBookings,
    isLoadingPsikolog: psikologList.isLoading,
    isLoadingBookings: periodQuery.isLoading,
    slotsPerDay,
    slotsOfDay,
    kpi,
    psikologPerf,
    ownerNote,
    trend,
    trendTotal,
    trendMax,
    roomGroups,
    topServices,
    rangeDays,
  };
}
