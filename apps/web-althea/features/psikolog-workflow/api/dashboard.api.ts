/**
 * API client untuk dashboard psikolog stats.
 *
 * Endpoint: GET /clinic/psikolog/me/dashboard-stats
 *   - JWT identifies psikolog (no path param)
 *   - Returns aggregated today/week/queue payload (server hitung di TZ klinik)
 */
import { apiClient } from '@/lib/api-client';

export type DashboardTodayBucket = {
  total: number;
  completed: number;
  inProgress: number;
  upcoming: number;
  cancelled: number;
};

export type DashboardWeekBucket = {
  /** 7 angka, urut Sen → Min */
  data: number[];
  total: number;
  /** YYYY-MM-DD start of week (Senin) di TZ klinik */
  startDate: string;
};

export type PendingNoteItem = {
  bookingId: number;
  clientName: string;
  serviceName: string;
  /** ISO UTC */
  scheduledStart: string;
};

export type PackageEndingItem = {
  bookingId: number;
  clientName: string;
  sessionN: number;
  sessionTotal: number;
  /** ISO UTC */
  scheduledStart: string;
};

export type DashboardStats = {
  today: DashboardTodayBucket;
  week: DashboardWeekBucket;
  klienAktif: number;
  catatanTertunda: number;
  pendingNotes: PendingNoteItem[];
  packageEndingSoon: PackageEndingItem[];
  /** YYYY-MM-DD anchor di TZ klinik (today saat server hitung) */
  anchorDate: string;
};

export const psikologDashboardApi = {
  getDashboardStats: () =>
    apiClient.get<{ success: boolean; data: DashboardStats }>(
      `/psikolog/me/dashboard-stats`,
    ),
};
