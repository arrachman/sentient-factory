'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock3,
  MapPin,
  ScanFace,
  Settings,
  ShieldAlert,
  Timer,
  UserPlus,
  UserRound,
  Users,
} from 'lucide-react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AttendanceHistoryPayload = {
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

type DashboardPayload = {
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

type AttendanceLogItem = {
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

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
};

const HR_TIME_ZONE = 'Asia/Jakarta';

function SectionShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const showToolbar = title.trim().length > 0 || !!description;

  return (
    <div
      className={cn(
        'mx-auto space-y-6 pb-6',
        wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5',
      )}
    >
      {showToolbar ? (
        <div className="pb-2">
          <ToolbarHeading>
            {title.trim().length > 0 ? <ToolbarPageTitle>{title}</ToolbarPageTitle> : null}
            {description ? <ToolbarDescription>{description}</ToolbarDescription> : null}
          </ToolbarHeading>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  tone = 'default',
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  subtext?: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const toneClasses =
    tone === 'danger'
      ? {
          shell: 'border-rose-200 bg-rose-50/80',
          icon: 'text-rose-600',
          value: 'text-rose-900',
          subtext: 'text-rose-700/80',
        }
      : tone === 'warning'
        ? {
            shell: 'border-amber-200 bg-amber-50/80',
            icon: 'text-amber-600',
            value: 'text-amber-900',
            subtext: 'text-amber-700/80',
          }
        : tone === 'success'
          ? {
              shell: 'border-emerald-200 bg-emerald-50/80',
              icon: 'text-emerald-600',
              value: 'text-emerald-900',
              subtext: 'text-emerald-700/80',
            }
          : {
              shell: 'border-slate-200 bg-white',
              icon: 'text-slate-500',
              value: 'text-slate-900',
              subtext: 'text-slate-500',
            };

  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', toneClasses.shell)}>
      <div className={cn('flex items-center gap-2', toneClasses.icon)}>
        <Icon className="size-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn('mt-3 text-lg font-semibold sm:text-xl', toneClasses.value)}>{value}</p>
      {subtext ? <p className={cn('mt-1 text-xs leading-5', toneClasses.subtext)}>{subtext}</p> : null}
    </div>
  );
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700';
    case 'manual_review':
      return 'bg-amber-100 text-amber-800';
    case 'warning':
      return 'bg-orange-100 text-orange-800';
    case 'rejected':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending':
      return 'Menunggu Review';
    case 'manual_review':
      return 'Perlu Review';
    case 'success':
      return 'Berhasil';
    case 'rejected':
      return 'Ditolak';
    case 'approved':
      return 'Disetujui';
    case 'needs_clarification':
      return 'Perlu Klarifikasi';
    case 'warning':
      return 'Peringatan';
    default:
      if (!value) return '-';
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

function humanizeReasonCode(value: string | null | undefined) {
  switch (value) {
    case 'face_identified_as_other_user':
      return 'Wajah lebih cocok dengan akun pengguna lain';
    case 'face_mismatch':
      return 'Wajah tidak cocok dengan data terdaftar';
    case 'face_embedding_missing':
      return 'Embedding wajah tidak tersedia';
    case 'face_enrollment_reference_missing':
      return 'Referensi wajah terdaftar belum tersedia';
    case 'face_not_centered':
      return 'Wajah belum pas di dalam frame';
    case 'liveness_not_verified':
      return 'Verifikasi wajah asli belum berhasil';
    case 'outside_geofence':
      return 'Di luar radius lokasi';
    case 'already_clocked_in':
      return 'Sudah memiliki sesi absen masuk aktif';
    case 'no_active_session':
      return 'Belum ada sesi absensi aktif';
    case 'gps_denied':
      return 'Akses GPS ditolak';
    case 'camera_denied':
      return 'Akses kamera ditolak';
    case 'gps_timeout':
      return 'GPS timeout';
    case 'gps_unavailable':
      return 'GPS tidak tersedia';
    default:
      return value ?? '';
  }
}

function formatEventLabel(value: string) {
  switch (value) {
    case 'clock_in':
      return 'Absen Masuk';
    case 'clock_out':
      return 'Absen Pulang';
    case 'clock_in_attempt':
    case 'clock_out_attempt':
      return 'Percobaan Absen';
    case 'face_enrollment':
      return 'Pendaftaran Wajah';
    case 'face_enrollment_attempt':
      return 'Percobaan Pendaftaran Wajah';
    default:
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: HR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '0'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '1'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '1'),
  };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseHrWallClock(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/,
  );
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? '0'),
    minute: Number(match[5] ?? '0'),
  };
}

function formatJakartaWallClock(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    timeZone: HR_TIME_ZONE,
    month: 'short',
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));

  return {
    dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`,
    timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`,
    dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
  };
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const wallClock = parseHrWallClock(value);
  if (wallClock) {
    const currentJakarta = getJakartaDayKey(new Date());
    const formatted = formatJakartaWallClock(wallClock);
    return `${formatted.dayKey === currentJakarta ? formatted.timeLabel : `${formatted.dateLabel}, ${formatted.timeLabel}`} WIB`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return (
    new Intl.DateTimeFormat(
      'id-ID',
      isToday
        ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' }
        : { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    ).format(date) + ' WIB'
  );
}

function formatMinutes(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes}m`;
}

function formatCompactInteger(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function formatPercentValue(value: number | null | undefined, digits = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}

function formatScorePercentage(value: number | null | undefined, digits = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  const normalized = value <= 1 ? value * 100 : value;
  return `${normalized.toFixed(digits)}`;
}

function formatDecimalValue(value: number | null | undefined, digits = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === 'object') {
    const decimalLike = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(decimalLike.d)) {
      const serialized = decimalLike.d.join('');
      const exponent = typeof decimalLike.e === 'number' ? decimalLike.e : serialized.length - 1;
      const sign = decimalLike.s === -1 ? -1 : 1;
      const decimal = Number(`${sign < 0 ? '-' : ''}${serialized[0] ?? '0'}${serialized.length > 1 ? `.${serialized.slice(1)}` : ''}e${exponent}`);
      return Number.isFinite(decimal) ? decimal : 0;
    }
  }
  return 0;
}

export function HrAttendanceDashboardPageView() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'needs_review' | 'success' | 'rejected'>('all');
  const [selectedLogItem, setSelectedLogItem] = useState<AttendanceLogItem | null>(null);
  const [quickDetailImageBroken, setQuickDetailImageBroken] = useState(false);
  const [thresholdInput, setThresholdInput] = useState('0.90');
  const [identifyThresholdInput, setIdentifyThresholdInput] = useState('0.82');
  const [verifyThresholdInput, setVerifyThresholdInput] = useState('0.82');

  useEffect(() => {
    let cancelled = false;
    fetchJson<DashboardPayload>('/api/hr/attendance/dashboard').then((data) => {
      if (!cancelled) {
        setPayload(data?.data ?? null);
        setThresholdInput(String(data?.data?.settings?.autoSubmitConfidenceThreshold ?? 0.9));
        setIdentifyThresholdInput(String(data?.data?.settings?.faceIdentifyConfidenceThreshold ?? 0.82));
        setVerifyThresholdInput(String(data?.data?.settings?.faceVerifyConfidenceThreshold ?? 0.82));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleAutoSubmit() {
    const nextValue = !(payload?.settings?.autoSubmitEnabled ?? true);
    setSettingsSaving(true);
    try {
      await fetch('/api/hr/settings/auto_submit_enabled', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: nextValue ? 'true' : 'false' }),
      });

      const data = await fetchJson<DashboardPayload>('/api/hr/attendance/dashboard');
      setPayload(data?.data ?? null);
      setThresholdInput(String(data?.data?.settings?.autoSubmitConfidenceThreshold ?? 0.9));
      setIdentifyThresholdInput(String(data?.data?.settings?.faceIdentifyConfidenceThreshold ?? 0.82));
      setVerifyThresholdInput(String(data?.data?.settings?.faceVerifyConfidenceThreshold ?? 0.82));
    } finally {
      setSettingsSaving(false);
    }
  }

  async function saveValidationSettings() {
    const autoParsed = Number(thresholdInput);
    const identifyParsed = Number(identifyThresholdInput);
    const verifyParsed = Number(verifyThresholdInput);

    if (
      !Number.isFinite(autoParsed) || autoParsed < 0.5 || autoParsed > 0.99 ||
      !Number.isFinite(identifyParsed) || identifyParsed < 0.5 || identifyParsed > 0.99 ||
      !Number.isFinite(verifyParsed) || verifyParsed < 0.5 || verifyParsed > 0.99
    ) {
      return;
    }

    setSettingsSaving(true);
    try {
      await Promise.all([
        fetch('/api/hr/settings/auto_submit_confidence_threshold', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: autoParsed.toFixed(2) }),
        }),
        fetch('/api/hr/settings/face_identify_confidence_threshold', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: identifyParsed.toFixed(2) }),
        }),
        fetch('/api/hr/settings/face_verify_confidence_threshold', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: verifyParsed.toFixed(2) }),
        }),
      ]);

      const data = await fetchJson<DashboardPayload>('/api/hr/attendance/dashboard');
      setPayload(data?.data ?? null);
      setThresholdInput(String(data?.data?.settings?.autoSubmitConfidenceThreshold ?? 0.9));
      setIdentifyThresholdInput(String(data?.data?.settings?.faceIdentifyConfidenceThreshold ?? 0.82));
      setVerifyThresholdInput(String(data?.data?.settings?.faceVerifyConfidenceThreshold ?? 0.82));
      setSettingsOpen(false);
    } finally {
      setSettingsSaving(false);
    }
  }

  const isAdminMode = payload?.mode === 'admin';
  const attendanceLogItems: AttendanceLogItem[] = isAdminMode
    ? [
        ...((payload?.exceptionEvents ?? []).map((row) => ({
          id: `event-${String(row.id ?? '')}`,
          title: String(row.full_name ?? row.username ?? ''),
          subtitle: `${formatEventLabel(String(row.event_type ?? ''))} • ${humanizeReasonCode(typeof row.reason_code === 'string' ? row.reason_code : null) || '-'}`,
          timeLabel: formatDateTime(typeof row.event_at === 'string' ? row.event_at : null),
          status: String(row.reviewStatus ?? row.result ?? ''),
          filterGroup: (
            row.reviewStatus === 'pending' || row.reviewStatus === 'needs_clarification' || row.result === 'manual_review'
              ? 'needs_review'
              : row.result === 'rejected'
                ? 'rejected'
                : 'success'
          ) as AttendanceLogItem['filterGroup'],
          href: `/app/hr/attendance-reviews/${row.id}`,
          typeLabel: 'Review',
          rawDate: String(row.event_at ?? ''),
          snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
          reviewHref: `/app/hr/attendance-reviews/${row.id}`,
          historyHref: row.app_user_id ? `/app/hr/attendance-history?userId=${row.app_user_id}` : '/app/hr/attendance-history',
          detailRows: [
            { label: 'Kategori', value: 'Event Review' },
            { label: 'Jenis Event', value: formatEventLabel(String(row.event_type ?? '')) },
            { label: 'Status', value: humanizeStatus(String(row.reviewStatus ?? row.result ?? '')) },
            { label: 'Alasan', value: humanizeReasonCode(typeof row.reason_code === 'string' ? row.reason_code : null) || '-' },
            { label: 'Waktu', value: formatDateTime(typeof row.event_at === 'string' ? row.event_at : null) },
          ],
        })) ?? []),
        ...((payload?.recentSessions ?? []).map((row) => ({
          id: `session-${String(row.id ?? '')}`,
          title: String(row.full_name ?? row.username ?? ''),
          subtitle: `${typeof row.default_worksite_name === 'string' ? row.default_worksite_name : 'Belum ada lokasi kerja'} • ${formatMinutes(typeof row.total_work_minutes === 'number' ? row.total_work_minutes : null)}`,
          timeLabel: formatDateTime(
            typeof row.clock_out_at === 'string'
              ? row.clock_out_at
              : typeof row.clock_in_at === 'string'
                ? row.clock_in_at
                : typeof row.work_date === 'string'
                  ? row.work_date
                  : null,
          ),
          status: String(row.clock_out_status ?? row.clock_in_status ?? 'success'),
          filterGroup: (
            row.clock_out_status === 'rejected' || row.clock_in_status === 'rejected'
              ? 'rejected'
              : row.clock_out_status === 'manual_review' || row.clock_in_status === 'manual_review'
                ? 'needs_review'
                : 'success'
          ) as AttendanceLogItem['filterGroup'],
          href: '/app/hr/attendance-history',
          typeLabel: 'Sesi',
          rawDate: String(row.clock_out_at ?? row.clock_in_at ?? row.work_date ?? ''),
          snapshotUrl: null,
          reviewHref: null,
          historyHref: row.app_user_id ? `/app/hr/attendance-history?userId=${row.app_user_id}` : '/app/hr/attendance-history',
          detailRows: [
            { label: 'Kategori', value: 'Sesi Harian' },
            { label: 'Status', value: humanizeStatus(String(row.clock_out_status ?? row.clock_in_status ?? 'success')) },
            { label: 'Lokasi Kerja', value: typeof row.default_worksite_name === 'string' ? row.default_worksite_name : 'Belum ada lokasi kerja' },
            { label: 'Durasi', value: formatMinutes(typeof row.total_work_minutes === 'number' ? row.total_work_minutes : null) },
            {
              label: 'Waktu',
              value: formatDateTime(
                typeof row.clock_out_at === 'string'
                  ? row.clock_out_at
                  : typeof row.clock_in_at === 'string'
                    ? row.clock_in_at
                    : typeof row.work_date === 'string'
                      ? row.work_date
                      : null,
              ),
            },
          ],
        })) ?? []),
      ].sort((left, right) => right.rawDate.localeCompare(left.rawDate))
    : [];

  const filteredAttendanceLogItems = attendanceLogItems.filter((item) =>
    activityFilter === 'all' ? true : item.filterGroup === activityFilter,
  );

  const summary = payload?.summary ?? {};
  const qualityOverview = payload?.qualityOverview ?? {};
  const reviewOverview = payload?.reviewOverview ?? {};
  const productivityOverview = payload?.productivityOverview ?? {};
  const totalEmployees = Number(summary.total_employees ?? 0);
  const activeWorksites = Number(summary.active_worksites ?? 0);
  const enrolledEmployees = Number(summary.enrolled_employees ?? 0);
  const employeesWithoutWorksite = Number(summary.employees_without_worksite ?? 0);
  const clockedInToday = Number(summary.clocked_in_today ?? 0);
  const clockedOutToday = Number(summary.clocked_out_today ?? 0);
  const exceptionSessions = Number(summary.exception_sessions ?? 0);
  const validationSuccessToday = Number(summary.validation_success_today ?? 0);
  const validationLowConfidenceToday = Number(summary.validation_low_confidence_today ?? 0);
  const validationFailureToday = Number(summary.validation_failure_today ?? 0);
  const notEnrolledEmployees = Math.max(totalEmployees - enrolledEmployees, 0);
  const enrollmentCoverageRate = totalEmployees > 0 ? (enrolledEmployees / totalEmployees) * 100 : 0;
  const completionRate = clockedInToday > 0 ? (clockedOutToday / clockedInToday) * 100 : 0;
  const participationRate = totalEmployees > 0 ? (clockedInToday / totalEmployees) * 100 : 0;
  const avgFaceScoreToday = qualityOverview.avg_face_score_today == null ? NaN : normalizeNumericValue(qualityOverview.avg_face_score_today);
  const avgEnrollmentQuality = qualityOverview.avg_enrollment_quality == null ? NaN : normalizeNumericValue(qualityOverview.avg_enrollment_quality);
  const avgMatchSimilarityToday = qualityOverview.avg_match_similarity_today == null ? NaN : normalizeNumericValue(qualityOverview.avg_match_similarity_today);
  const avgLivenessScoreToday = qualityOverview.avg_liveness_score_today == null ? NaN : normalizeNumericValue(qualityOverview.avg_liveness_score_today);
  const pendingReviewCount = Number(reviewOverview.pending_review_count ?? 0);
  const clarificationCount = Number(reviewOverview.clarification_count ?? 0);
  const approvedTodayCount = Number(reviewOverview.approved_today_count ?? 0);
  const rejectedTodayCount = Number(reviewOverview.rejected_today_count ?? 0);
  const avgResolutionMinutes = reviewOverview.avg_resolution_minutes == null ? NaN : normalizeNumericValue(reviewOverview.avg_resolution_minutes);
  const totalWorkMinutesToday = Number(productivityOverview.total_work_minutes_today ?? 0);
  const avgWorkMinutesToday = productivityOverview.avg_work_minutes_today == null ? NaN : normalizeNumericValue(productivityOverview.avg_work_minutes_today);

  useEffect(() => {
    setQuickDetailImageBroken(false);
  }, [selectedLogItem?.id]);

  return (
    <SectionShell title={isAdminMode ? '' : 'Attendance Dashboard'} wide>
      {isAdminMode ? (
        <>
          <div className="space-y-6 rounded-[30px] bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Ringkasan Tenaga Kerja</h2>
                <p className="max-w-2xl text-sm text-slate-600">Cakupan absensi, jangkauan operasional, dan partisipasi harian secara real-time.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm">
                  Hari Ini
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="mr-2 size-4" />
                  Pengaturan Validasi
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-4">
              {[
                {
                  label: 'Total Pegawai Aktif',
                  value: formatCompactInteger(totalEmployees),
                  tone: 'bg-blue-50 text-blue-600',
                  icon: Users,
                  helper: 'Jumlah pegawai aktif',
                },
                {
                  label: 'Pegawai Sudah Daftar',
                  value: formatCompactInteger(enrolledEmployees),
                  tone: 'bg-emerald-50 text-emerald-600',
                  icon: ScanFace,
                  helper: 'Wajah sudah terverifikasi',
                },
                {
                  label: 'Pegawai Belum Daftar',
                  value: formatCompactInteger(notEnrolledEmployees),
                  tone: 'bg-amber-50 text-amber-600',
                  icon: AlertTriangle,
                  helper: 'Masih perlu pendaftaran wajah',
                },
                {
                  label: 'Cakupan Pendaftaran',
                  value: formatPercentValue(enrollmentCoverageRate, 1),
                  tone: 'bg-indigo-50 text-indigo-600',
                  icon: Settings,
                  helper: `${formatCompactInteger(enrolledEmployees)} dari ${formatCompactInteger(totalEmployees)} pegawai`,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.helper}</p>
                    </div>
                    <div className={cn('flex size-10 items-center justify-center rounded-full', item.tone)}>
                      <item.icon className="size-4" />
                    </div>
                  </div>
                  <div className="mt-8 flex items-end gap-3">
                    <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                    {item.label === 'Cakupan Pendaftaran' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        Aktif
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.7fr)]">
              <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <p className="text-xl font-semibold text-slate-950">Jangkauan Operasional</p>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <div className="rounded-2xl bg-indigo-50/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Lokasi Kerja Aktif</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{formatCompactInteger(activeWorksites)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-amber-50/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                        <AlertTriangle className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Pegawai Tanpa Penugasan</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-amber-600">{formatCompactInteger(employeesWithoutWorksite)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <p className="text-xl font-semibold text-slate-950">Ringkasan Absensi Harian</p>
                  </div>
                  <Badge className="border-0 bg-slate-100 px-3 py-1.5 text-slate-600">Hari Ini</Badge>
                </div>
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: 'Absen Masuk',
                      value: formatCompactInteger(clockedInToday),
                      icon: Clock3,
                      tone: 'text-emerald-600 bg-emerald-50',
                    },
                    {
                      label: 'Absen Pulang',
                      value: formatCompactInteger(clockedOutToday),
                      icon: Timer,
                      tone: 'text-amber-600 bg-amber-50',
                    },
                    {
                      label: 'Tingkat Selesai',
                      value: formatPercentValue(completionRate),
                      icon: Check,
                      tone: 'text-blue-600 bg-blue-50',
                    },
                    {
                      label: 'Tingkat Partisipasi',
                      value: formatPercentValue(participationRate),
                      icon: UserPlus,
                      tone: 'text-violet-600 bg-violet-50',
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-slate-200 bg-white px-5 py-7 shadow-sm">
                      <div className={cn('mx-auto flex size-11 items-center justify-center rounded-full', item.tone)}>
                        <item.icon className="size-5" />
                      </div>
                      <p className="mt-5 text-center text-sm font-medium text-slate-500">{item.label}</p>
                      <p className="mt-2 text-center text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-950">Ringkasan Validasi & Kualitas</p>
                  <p className="mt-1 text-sm text-slate-500">Kesehatan validasi wajah pada alur operasional hari ini.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-0 bg-emerald-100 px-3 py-1.5 text-emerald-700">{formatCompactInteger(validationSuccessToday)} berhasil</Badge>
                  <Badge className="border-0 bg-amber-100 px-3 py-1.5 text-amber-800">{formatCompactInteger(validationLowConfidenceToday)} keyakinan rendah</Badge>
                  <Badge className="border-0 bg-rose-100 px-3 py-1.5 text-rose-700">{formatCompactInteger(validationFailureToday)} gagal</Badge>
                </div>
              </div>
              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Rata-rata Skor Wajah',
                    value: formatScorePercentage(avgFaceScoreToday),
                    suffix: '/100',
                    tone: 'text-slate-950',
                  },
                  {
                    label: 'Rata-rata Kualitas Pendaftaran',
                    value: formatScorePercentage(avgEnrollmentQuality),
                    suffix: '/100',
                    tone: 'text-slate-950',
                  },
                  {
                    label: 'Kemiripan Pencocokan Wajah',
                    value: formatPercentValue(Number.isFinite(avgMatchSimilarityToday) ? (avgMatchSimilarityToday <= 1 ? avgMatchSimilarityToday * 100 : avgMatchSimilarityToday) : null),
                    suffix: '',
                    tone: 'text-emerald-600',
                  },
                  {
                    label: 'Skor Liveness',
                    value: formatDecimalValue(avgLivenessScoreToday, 2),
                    suffix: '',
                    tone: 'text-blue-600',
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 px-5 py-8 text-center">
                    <div className="flex items-end justify-center gap-1">
                      <span className={cn('text-4xl font-semibold tracking-tight', item.tone)}>{item.value}</span>
                      {item.suffix ? <span className="pb-1 text-sm font-medium text-slate-400">{item.suffix}</span> : null}
                    </div>
                    <p className="mt-3 text-sm font-medium leading-5 text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="text-lg font-semibold text-slate-950">Antrian Review & Pengecualian</p>
                </div>
                <div className="space-y-5 px-5 py-5">
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                        <ShieldAlert className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Sesi Pengecualian</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-rose-600">{formatCompactInteger(exceptionSessions)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Jumlah Antrian</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatCompactInteger(pendingReviewCount)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Waktu Penyelesaian</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{Number.isFinite(avgResolutionMinutes) ? `${formatCompactInteger(avgResolutionMinutes)}m` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Klarifikasi</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-600">{formatCompactInteger(clarificationCount)}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Disetujui</p>
                      <p className="mt-2 text-2xl font-semibold text-emerald-800">{formatCompactInteger(approvedTodayCount)}</p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Ditolak</p>
                      <p className="mt-2 text-2xl font-semibold text-rose-800">{formatCompactInteger(rejectedTodayCount)}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button asChild variant="outline" className="rounded-xl border-slate-200 bg-white">
                      <Link href="/app/hr/attendance-reviews">Buka Review</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="text-lg font-semibold text-slate-950">Produktivitas Agregat</p>
                </div>
                <div className="space-y-6 px-5 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Total Menit Kerja</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-5xl font-semibold tracking-tight text-slate-950">{formatCompactInteger(totalWorkMinutesToday)}</span>
                      <span className="pb-2 text-sm font-medium text-slate-500">menit</span>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rata-rata Jam Kerja Harian</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-4xl font-semibold tracking-tight text-slate-950">
                        {Number.isFinite(avgWorkMinutesToday) ? formatDecimalValue(avgWorkMinutesToday / 60, 1) : '-'}
                      </span>
                      <span className="pb-1 text-sm font-medium text-slate-500">jam / pegawai</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-600">Aktivitas Terbaru</span>
                      <span className="text-sm font-semibold text-slate-950">{formatCompactInteger(filteredAttendanceLogItems.length)} item</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {filteredAttendanceLogItems.slice(0, 3).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedLogItem(item)}
                          className="flex w-full items-start justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-sm transition hover:bg-slate-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.subtitle}</p>
                          </div>
                          <Badge className={cn('shrink-0 border-0', statusTone(item.status))}>{humanizeStatus(item.status)}</Badge>
                        </button>
                      ))}
                      {filteredAttendanceLogItems.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                          Tidak ada aktivitas untuk filter yang dipilih.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
              <DialogHeader className="border-b border-slate-200 px-5 py-4">
                <DialogTitle className="text-lg font-semibold text-slate-900">Pengaturan Validasi</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Konfigurasi threshold dipisahkan dari dashboard monitoring agar operasional harian tetap bersih.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4 px-5 py-4">
                <div className="space-y-1">
                  <Label htmlFor="auto-submit-threshold">Threshold Auto Submit</Label>
                  <Input
                    id="auto-submit-threshold"
                    value={thresholdInput}
                    onChange={(event) => setThresholdInput(event.target.value)}
                    placeholder="0.90"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="identify-threshold">Threshold Identifikasi 1:N</Label>
                  <Input
                    id="identify-threshold"
                    value={identifyThresholdInput}
                    onChange={(event) => setIdentifyThresholdInput(event.target.value)}
                    placeholder="0.82"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="verify-threshold">Threshold Verifikasi 1:1</Label>
                  <Input
                    id="verify-threshold"
                    value={verifyThresholdInput}
                    onChange={(event) => setVerifyThresholdInput(event.target.value)}
                    placeholder="0.82"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  Auto Submit: {(payload?.settings?.autoSubmitEnabled ?? true) ? 'Aktif' : 'Nonaktif'} •
                  {' '}Auto Submit {(payload?.settings?.autoSubmitConfidenceThreshold ?? 0.9).toFixed(2)} •
                  {' '}1:N {(payload?.settings?.faceIdentifyConfidenceThreshold ?? 0.82).toFixed(2)} •
                  {' '}1:1 {(payload?.settings?.faceVerifyConfidenceThreshold ?? 0.82).toFixed(2)}
                </div>
              </DialogBody>
              <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl"
                  disabled={settingsSaving}
                  onClick={() => void toggleAutoSubmit()}
                >
                  {settingsSaving
                    ? 'Menyimpan...'
                    : payload?.settings?.autoSubmitEnabled
                      ? 'Nonaktifkan Auto Submit'
                      : 'Aktifkan Auto Submit'}
                </Button>
                <Button className="h-10 rounded-xl" disabled={settingsSaving} onClick={() => void saveValidationSettings()}>
                  {settingsSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedLogItem} onOpenChange={(open) => !open && setSelectedLogItem(null)}>
            <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
              <DialogHeader className="border-b border-slate-200 px-5 py-4">
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {selectedLogItem?.title ?? 'Detail Cepat'}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {selectedLogItem?.subtitle ?? 'Ringkasan cepat sebelum membuka halaman detail penuh.'}
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-3 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Badge className={cn('border-0', statusTone(selectedLogItem?.status))}>
                    {humanizeStatus(selectedLogItem?.status)}
                  </Badge>
                  {selectedLogItem?.typeLabel ? (
                    <Badge className="border-0 bg-slate-100 text-slate-700">{selectedLogItem.typeLabel}</Badge>
                  ) : null}
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {selectedLogItem?.snapshotUrl && !quickDetailImageBroken ? (
                    <img
                      src={`/api/hr/events/${selectedLogItem.id.replace('event-', '')}/snapshot`}
                      alt=""
                      className="h-44 w-full object-cover"
                      onError={() => setQuickDetailImageBroken(true)}
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-slate-400">
                      <UserRound className="size-10" />
                    </div>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(selectedLogItem?.detailRows ?? []).map((row) => (
                    <div key={`${selectedLogItem?.id}-${row.label}`} className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{row.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{row.value}</p>
                    </div>
                  ))}
                </div>
              </DialogBody>
              <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                <Button variant="outline" className="h-10 rounded-xl" onClick={() => setSelectedLogItem(null)}>
                  Tutup
                </Button>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  {selectedLogItem?.reviewHref ? (
                    <Button asChild variant="outline" className="h-10 rounded-xl">
                      <Link href={selectedLogItem.reviewHref}>Buka Review</Link>
                    </Button>
                  ) : null}
                  {selectedLogItem?.historyHref ? (
                    <Button asChild variant="outline" className="h-10 rounded-xl">
                      <Link href={selectedLogItem.historyHref}>Riwayat Pegawai</Link>
                    </Button>
                  ) : null}
                  {selectedLogItem ? (
                    <Button asChild className="h-10 rounded-xl">
                      <Link href={selectedLogItem.href}>Buka Halaman Detail</Link>
                    </Button>
                  ) : null}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={Clock3}
              label="Masuk Hari Ini"
              value={String(payload?.summary?.clocked_in_today ?? 0)}
              subtext="Status kehadiran hari ini"
            />
            <MetricCard
              icon={Timer}
              label="Pulang Hari Ini"
              value={String(payload?.summary?.clocked_out_today ?? 0)}
              subtext="Status kepulangan hari ini"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Ringkasan Saya</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Hari Kerja</p>
                <p className="mt-1 font-medium text-slate-900">{String(payload?.summary?.total_work_days ?? 0)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Exception</p>
                <p className="mt-1 font-medium text-slate-900">{String(payload?.summary?.exception_sessions ?? 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
