'use client';

/**
 * Hook orchestrator untuk dashboard psikolog.
 *   - Fetch dashboard-stats agregat (today buckets, week data, queue items)
 *   - Fetch today bookings list untuk jadwal hari ini card (detail per sesi)
 *   - Derive greeting & action queue items dari real data
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, ClipboardEdit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { psikologDashboardApi } from '../api/dashboard.api';
import { formatTime, todayISO } from '../model/format';

export type QueueItem = {
  icon: LucideIcon;
  title: string;
  sub: string;
  href?: string;
};

export function usePsikologDashboard() {
  const meQuery = useMe();
  const psikologId = meQuery.data?.data.id;
  const greetName = (
    meQuery.data?.data.fullName ??
    meQuery.data?.data.username ??
    'Psikolog'
  ).split(' ')[0];

  // Aggregate dashboard stats — single endpoint
  const statsQuery = useQuery({
    queryKey: ['psikolog', 'me', 'dashboard-stats'],
    queryFn: () => psikologDashboardApi.getDashboardStats(),
    enabled: !!psikologId,
    staleTime: 60 * 1000,
  });
  const stats = statsQuery.data?.data;

  // Anchor today from server (TZ-aware) jika tersedia, else compute client-side
  const today = stats?.anchorDate ?? todayISO();

  // Fetch today bookings list — butuh detail (psikolog/klien/service/room/status)
  // supaya TodayScheduleCard bisa render rich row
  const todayBookingsQuery = useBookingList({
    psikologUserId: psikologId,
    date: today,
    limit: 50,
  });
  const todayBookings = useMemo<Booking[]>(
    () => todayBookingsQuery.data?.data ?? [],
    [todayBookingsQuery.data],
  );

  // Build action queue dari real pendingNotes + packageEndingSoon
  const queue = useMemo<QueueItem[]>(() => {
    const q: QueueItem[] = [];
    if (stats?.pendingNotes && stats.pendingNotes.length > 0) {
      const items = stats.pendingNotes.slice(0, 2);
      for (const n of items) {
        q.push({
          icon: ClipboardEdit,
          title: 'Catatan sesi belum diisi',
          sub: `${n.clientName} · ${n.serviceName} · ${formatTime(n.scheduledStart)}`,
          href: '/psikolog/sessions',
        });
      }
    }
    if (stats?.packageEndingSoon && stats.packageEndingSoon.length > 0) {
      const items = stats.packageEndingSoon.slice(0, 2);
      for (const p of items) {
        q.push({
          icon: Bell,
          title: 'Paket akan habis',
          sub: `${p.clientName} · sesi ${p.sessionN}/${p.sessionTotal}`,
          href: '/psikolog/schedule',
        });
      }
    }
    return q;
  }, [stats]);

  // Stat cards values
  const todayTotal = stats?.today.total ?? todayBookings.length;
  const todayDone = stats?.today.completed ?? 0;
  const todayInProgress = stats?.today.inProgress ?? 0;
  const todayHint =
    todayTotal === 0
      ? 'tidak ada sesi hari ini'
      : `${todayDone} selesai · ${todayInProgress} berlangsung`;
  const weekData = stats?.week.data ?? [0, 0, 0, 0, 0, 0, 0];
  const weekTotal = stats?.week.total ?? 0;
  const klienAktif = stats?.klienAktif ?? null;
  const catatanTertunda = stats?.catatanTertunda ?? 0;

  return {
    isLoading: meQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,
    psikologId,
    today,
    greetName,
    // Stats payload
    todayTotal,
    todayDone,
    todayHint,
    weekData,
    weekTotal,
    klienAktif,
    catatanTertunda,
    // Today bookings list (detail)
    todayBookings,
    isTodayLoading: todayBookingsQuery.isLoading,
    // Action queue
    queue,
  };
}
