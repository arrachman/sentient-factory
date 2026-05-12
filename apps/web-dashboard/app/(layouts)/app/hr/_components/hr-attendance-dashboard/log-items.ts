/**
 * Builder untuk attendance log items dari dashboard payload.
 * Menggabungkan exception events + recent sessions ke list seragam yang
 * mudah di-render dan di-filter di UI.
 */
import {
  formatDateTime,
  formatEventLabel,
  formatMinutes,
  humanizeReasonCode,
  humanizeStatus,
} from '../hr-shared';
import type { AttendanceLogItem, DashboardPayload } from './types';

function getDefaultWorksiteName(row: Record<string, unknown>) {
  return typeof row.default_worksite_name === 'string'
    ? row.default_worksite_name
    : 'Belum ada lokasi kerja';
}

function getSessionTime(row: Record<string, unknown>) {
  if (typeof row.clock_out_at === 'string') return row.clock_out_at;
  if (typeof row.clock_in_at === 'string') return row.clock_in_at;
  if (typeof row.work_date === 'string') return row.work_date;
  return null;
}

function getSessionFilter(
  row: Record<string, unknown>,
): AttendanceLogItem['filterGroup'] {
  if (row.clock_out_status === 'rejected' || row.clock_in_status === 'rejected')
    return 'rejected';
  if (
    row.clock_out_status === 'manual_review' ||
    row.clock_in_status === 'manual_review'
  )
    return 'needs_review';
  return 'success';
}

function getEventFilter(
  row: Record<string, unknown>,
): AttendanceLogItem['filterGroup'] {
  if (
    row.reviewStatus === 'pending' ||
    row.reviewStatus === 'needs_clarification' ||
    row.result === 'manual_review'
  )
    return 'needs_review';
  if (row.result === 'rejected') return 'rejected';
  return 'success';
}

function buildEventItem(row: Record<string, unknown>): AttendanceLogItem {
  const eventAt = typeof row.event_at === 'string' ? row.event_at : null;
  const reasonCode =
    typeof row.reason_code === 'string' ? row.reason_code : null;
  return {
    id: `event-${String(row.id ?? '')}`,
    title: String(row.full_name ?? row.username ?? ''),
    subtitle: `${formatEventLabel(String(row.event_type ?? ''))} • ${
      humanizeReasonCode(reasonCode) || '-'
    }`,
    timeLabel: formatDateTime(eventAt),
    status: String(row.reviewStatus ?? row.result ?? ''),
    filterGroup: getEventFilter(row),
    href: `/app/hr/attendance-reviews/${row.id}`,
    typeLabel: 'Review',
    rawDate: String(row.event_at ?? ''),
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    reviewHref: `/app/hr/attendance-reviews/${row.id}`,
    historyHref: row.app_user_id
      ? `/app/hr/attendance-history?userId=${row.app_user_id}`
      : '/app/hr/attendance-history',
    detailRows: [
      { label: 'Kategori', value: 'Event Review' },
      {
        label: 'Jenis Event',
        value: formatEventLabel(String(row.event_type ?? '')),
      },
      {
        label: 'Status',
        value: humanizeStatus(String(row.reviewStatus ?? row.result ?? '')),
      },
      { label: 'Alasan', value: humanizeReasonCode(reasonCode) || '-' },
      { label: 'Waktu', value: formatDateTime(eventAt) },
    ],
  };
}

function buildSessionItem(row: Record<string, unknown>): AttendanceLogItem {
  const time = getSessionTime(row);
  const worksiteName = getDefaultWorksiteName(row);
  const totalWork =
    typeof row.total_work_minutes === 'number' ? row.total_work_minutes : null;
  return {
    id: `session-${String(row.id ?? '')}`,
    title: String(row.full_name ?? row.username ?? ''),
    subtitle: `${worksiteName} • ${formatMinutes(totalWork)}`,
    timeLabel: formatDateTime(time),
    status: String(row.clock_out_status ?? row.clock_in_status ?? 'success'),
    filterGroup: getSessionFilter(row),
    href: '/app/hr/attendance-history',
    typeLabel: 'Sesi',
    rawDate: String(row.clock_out_at ?? row.clock_in_at ?? row.work_date ?? ''),
    snapshotUrl: null,
    reviewHref: null,
    historyHref: row.app_user_id
      ? `/app/hr/attendance-history?userId=${row.app_user_id}`
      : '/app/hr/attendance-history',
    detailRows: [
      { label: 'Kategori', value: 'Sesi Harian' },
      {
        label: 'Status',
        value: humanizeStatus(
          String(row.clock_out_status ?? row.clock_in_status ?? 'success'),
        ),
      },
      { label: 'Lokasi Kerja', value: worksiteName },
      { label: 'Durasi', value: formatMinutes(totalWork) },
      { label: 'Waktu', value: formatDateTime(time) },
    ],
  };
}

export function buildAttendanceLogItems(
  payload: DashboardPayload | null,
): AttendanceLogItem[] {
  if (payload?.mode !== 'admin') return [];

  const events = (payload.exceptionEvents ?? []).map(buildEventItem);
  const sessions = (payload.recentSessions ?? []).map(buildSessionItem);

  return [...events, ...sessions].sort((left, right) =>
    right.rawDate.localeCompare(left.rawDate),
  );
}
