/**
 * Tipe spesifik untuk Attendance Dashboard (payload API + log item).
 */

export type AttendanceHistoryPayload = {
  data: Array<{
    id: number;
    work_date: string;
    clock_in_at: string | null;
    clock_out_at: string | null;
    clock_in_status: string | null;
    clock_out_status: string | null;
    total_work_minutes: number | null;
    clock_in_worksite_name: string | null;
    clock_out_worksite_name: string | null;
    username: string;
    full_name: string | null;
  }>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DashboardPayload = {
  mode: 'self' | 'admin';
  summary: Record<string, unknown>;
  qualityOverview?: Record<string, unknown>;
  reviewOverview?: Record<string, unknown>;
  productivityOverview?: Record<string, unknown>;
  history?: AttendanceHistoryPayload['data'];
  historyMeta?: AttendanceHistoryPayload['meta'];
  recentSessions?: Array<Record<string, unknown>>;
  exceptionEvents?: Array<Record<string, unknown>>;
  settings?: {
    autoSubmitEnabled?: boolean;
    autoSubmitConfidenceThreshold?: number;
    faceIdentifyConfidenceThreshold?: number;
    faceVerifyConfidenceThreshold?: number;
  };
};

export type AttendanceLogItem = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  status: string;
  filterGroup: 'needs_review' | 'success' | 'rejected';
  href: string;
  typeLabel: string;
  rawDate: string;
  snapshotUrl?: string | null;
  reviewHref?: string | null;
  historyHref?: string | null;
  detailRows: Array<{ label: string; value: string }>;
};
