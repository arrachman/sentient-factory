'use client';

import { useEffect, useState } from 'react';
import {
  WorkforceSummaryPanel,
  SelfViewPanel,
} from './hr-attendance-dashboard/workforce-summary-panel';
import { ValidationSettingsDialog } from './hr-attendance-dashboard/validation-settings-dialog';
import { QuickLogDialog } from './hr-attendance-dashboard/quick-log-dialog';

type DashboardPayload = {
  mode: 'self' | 'admin';
  summary: Record<string, unknown>;
  qualityOverview?: Record<string, unknown>;
  reviewOverview?: Record<string, unknown>;
  productivityOverview?: Record<string, unknown>;
  history?: Array<Record<string, unknown>>;
  historyMeta?: { page: number; limit: number; total: number; totalPages: number };
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

type ApiEnvelope<T> = { success?: boolean; data: T };

const HR_TIME_ZONE = 'Asia/Jakarta';

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending': return 'Menunggu Review';
    case 'manual_review': return 'Perlu Review';
    case 'success': return 'Berhasil';
    case 'rejected': return 'Ditolak';
    case 'approved': return 'Disetujui';
    case 'needs_clarification': return 'Perlu Klarifikasi';
    case 'warning': return 'Peringatan';
    default:
      if (!value) return '-';
      return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

function humanizeReasonCode(value: string | null | undefined) {
  switch (value) {
    case 'face_identified_as_other_user': return 'Wajah lebih cocok dengan akun pengguna lain';
    case 'face_mismatch': return 'Wajah tidak cocok dengan data terdaftar';
    case 'face_embedding_missing': return 'Embedding wajah tidak tersedia';
    case 'face_enrollment_reference_missing': return 'Referensi wajah terdaftar belum tersedia';
    case 'face_not_centered': return 'Wajah belum pas di dalam frame';
    case 'liveness_not_verified': return 'Verifikasi wajah asli belum berhasil';
    case 'outside_geofence': return 'Di luar radius lokasi';
    case 'already_clocked_in': return 'Sudah memiliki sesi absen masuk aktif';
    case 'no_active_session': return 'Belum ada sesi absensi aktif';
    case 'gps_denied': return 'Akses GPS ditolak';
    case 'camera_denied': return 'Akses kamera ditolak';
    case 'gps_timeout': return 'GPS timeout';
    case 'gps_unavailable': return 'GPS tidak tersedia';
    default: return value ?? '';
  }
}

function formatEventLabel(value: string) {
  switch (value) {
    case 'clock_in': return 'Absen Masuk';
    case 'clock_out': return 'Absen Pulang';
    case 'clock_in_attempt':
    case 'clock_out_attempt': return 'Percobaan Absen';
    case 'face_enrollment': return 'Pendaftaran Wajah';
    case 'face_enrollment_attempt': return 'Percobaan Pendaftaran Wajah';
    default: return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return {
    year: Number(parts.find((p) => p.type === 'year')?.value ?? '0'),
    month: Number(parts.find((p) => p.type === 'month')?.value ?? '1'),
    day: Number(parts.find((p) => p.type === 'day')?.value ?? '1'),
  };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseHrWallClock(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4] ?? '0'), minute: Number(match[5] ?? '0') };
}

function formatJakartaWallClock(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, month: 'short' }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));
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
    const formatted = formatJakartaWallClock(wallClock);
    return `${formatted.dayKey === getJakartaDayKey(new Date()) ? formatted.timeLabel : `${formatted.dateLabel}, ${formatted.timeLabel}`} WIB`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return new Intl.DateTimeFormat('id-ID', isToday ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' } : { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date) + ' WIB';
}

function formatMinutes(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}

function normalizeNumericValue(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const p = Number(value); return Number.isFinite(p) ? p : 0; }
  if (value && typeof value === 'object') {
    const d = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(d.d)) {
      const s = d.d.join('');
      const exp = typeof d.e === 'number' ? d.e : s.length - 1;
      const sign = d.s === -1 ? -1 : 1;
      const n = Number(`${sign < 0 ? '-' : ''}${s[0] ?? '0'}${s.length > 1 ? `.${s.slice(1)}` : ''}e${exp}`);
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

export function HrAttendanceDashboardPageView() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLogItem, setSelectedLogItem] = useState<AttendanceLogItem | null>(null);
  const [quickDetailImageBroken, setQuickDetailImageBroken] = useState(false);
  const [thresholdInput, setThresholdInput] = useState('0.90');
  const [identifyThresholdInput, setIdentifyThresholdInput] = useState('0.82');
  const [verifyThresholdInput, setVerifyThresholdInput] = useState('0.82');

  async function refreshPayload() {
    const data = await fetchJson<DashboardPayload>('/api/hr/attendance/dashboard');
    setPayload(data?.data ?? null);
    setThresholdInput(String(data?.data?.settings?.autoSubmitConfidenceThreshold ?? 0.9));
    setIdentifyThresholdInput(String(data?.data?.settings?.faceIdentifyConfidenceThreshold ?? 0.82));
    setVerifyThresholdInput(String(data?.data?.settings?.faceVerifyConfidenceThreshold ?? 0.82));
  }

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
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { setQuickDetailImageBroken(false); }, [selectedLogItem?.id]);

  async function toggleAutoSubmit() {
    const nextValue = !(payload?.settings?.autoSubmitEnabled ?? true);
    setSettingsSaving(true);
    try {
      await fetch('/api/hr/settings/auto_submit_enabled', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: nextValue ? 'true' : 'false' }),
      });
      await refreshPayload();
    } finally { setSettingsSaving(false); }
  }

  async function saveValidationSettings() {
    const autoParsed = Number(thresholdInput);
    const identifyParsed = Number(identifyThresholdInput);
    const verifyParsed = Number(verifyThresholdInput);
    if (!Number.isFinite(autoParsed) || autoParsed < 0.5 || autoParsed > 0.99 ||
      !Number.isFinite(identifyParsed) || identifyParsed < 0.5 || identifyParsed > 0.99 ||
      !Number.isFinite(verifyParsed) || verifyParsed < 0.5 || verifyParsed > 0.99) return;

    setSettingsSaving(true);
    try {
      await Promise.all([
        fetch('/api/hr/settings/auto_submit_confidence_threshold', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: autoParsed.toFixed(2) }) }),
        fetch('/api/hr/settings/face_identify_confidence_threshold', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: identifyParsed.toFixed(2) }) }),
        fetch('/api/hr/settings/face_verify_confidence_threshold', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: verifyParsed.toFixed(2) }) }),
      ]);
      await refreshPayload();
      setSettingsOpen(false);
    } finally { setSettingsSaving(false); }
  }

  const isAdminMode = payload?.mode === 'admin';
  const summary = payload?.summary ?? {};
  const qualityOverview = payload?.qualityOverview ?? {};
  const reviewOverview = payload?.reviewOverview ?? {};
  const productivityOverview = payload?.productivityOverview ?? {};

  const totalEmployees = Number(summary.total_employees ?? 0);
  const enrolledEmployees = Number(summary.enrolled_employees ?? 0);
  const notEnrolledEmployees = Math.max(totalEmployees - enrolledEmployees, 0);
  const enrollmentCoverageRate = totalEmployees > 0 ? (enrolledEmployees / totalEmployees) * 100 : 0;
  const activeWorksites = Number(summary.active_worksites ?? 0);
  const employeesWithoutWorksite = Number(summary.employees_without_worksite ?? 0);
  const clockedInToday = Number(summary.clocked_in_today ?? 0);
  const clockedOutToday = Number(summary.clocked_out_today ?? 0);
  const completionRate = clockedInToday > 0 ? (clockedOutToday / clockedInToday) * 100 : 0;
  const participationRate = totalEmployees > 0 ? (clockedInToday / totalEmployees) * 100 : 0;
  const exceptionSessions = Number(summary.exception_sessions ?? 0);
  const validationSuccessToday = Number(summary.validation_success_today ?? 0);
  const validationLowConfidenceToday = Number(summary.validation_low_confidence_today ?? 0);
  const validationFailureToday = Number(summary.validation_failure_today ?? 0);
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

  const attendanceLogItems: AttendanceLogItem[] = isAdminMode
    ? [
        ...((payload?.exceptionEvents ?? []).map((row) => ({
          id: `event-${String(row.id ?? '')}`,
          title: String(row.full_name ?? row.username ?? ''),
          subtitle: `${formatEventLabel(String(row.event_type ?? ''))} • ${humanizeReasonCode(typeof row.reason_code === 'string' ? row.reason_code : null) || '-'}`,
          timeLabel: formatDateTime(typeof row.event_at === 'string' ? row.event_at : null),
          status: String(row.reviewStatus ?? row.result ?? ''),
          filterGroup: (row.reviewStatus === 'pending' || row.reviewStatus === 'needs_clarification' || row.result === 'manual_review' ? 'needs_review' : row.result === 'rejected' ? 'rejected' : 'success') as AttendanceLogItem['filterGroup'],
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
        }))),
        ...((payload?.recentSessions ?? []).map((row) => ({
          id: `session-${String(row.id ?? '')}`,
          title: String(row.full_name ?? row.username ?? ''),
          subtitle: `${typeof row.default_worksite_name === 'string' ? row.default_worksite_name : 'Belum ada lokasi kerja'} • ${formatMinutes(typeof row.total_work_minutes === 'number' ? row.total_work_minutes : null)}`,
          timeLabel: formatDateTime(typeof row.clock_out_at === 'string' ? row.clock_out_at : typeof row.clock_in_at === 'string' ? row.clock_in_at : typeof row.work_date === 'string' ? row.work_date : null),
          status: String(row.clock_out_status ?? row.clock_in_status ?? 'success'),
          filterGroup: (row.clock_out_status === 'rejected' || row.clock_in_status === 'rejected' ? 'rejected' : row.clock_out_status === 'manual_review' || row.clock_in_status === 'manual_review' ? 'needs_review' : 'success') as AttendanceLogItem['filterGroup'],
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
            { label: 'Waktu', value: formatDateTime(typeof row.clock_out_at === 'string' ? row.clock_out_at : typeof row.clock_in_at === 'string' ? row.clock_in_at : typeof row.work_date === 'string' ? row.work_date : null) },
          ],
        }))),
      ].sort((a, b) => b.rawDate.localeCompare(a.rawDate))
    : [];

  const filteredAttendanceLogItems = attendanceLogItems;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 pb-6 px-4 sm:px-6 xl:px-8">
      {isAdminMode ? (
        <>
          <WorkforceSummaryPanel
            totalEmployees={totalEmployees}
            enrolledEmployees={enrolledEmployees}
            notEnrolledEmployees={notEnrolledEmployees}
            enrollmentCoverageRate={enrollmentCoverageRate}
            activeWorksites={activeWorksites}
            employeesWithoutWorksite={employeesWithoutWorksite}
            clockedInToday={clockedInToday}
            clockedOutToday={clockedOutToday}
            completionRate={completionRate}
            participationRate={participationRate}
            validationSuccessToday={validationSuccessToday}
            validationLowConfidenceToday={validationLowConfidenceToday}
            validationFailureToday={validationFailureToday}
            avgFaceScoreToday={avgFaceScoreToday}
            avgEnrollmentQuality={avgEnrollmentQuality}
            avgMatchSimilarityToday={avgMatchSimilarityToday}
            avgLivenessScoreToday={avgLivenessScoreToday}
            pendingReviewCount={pendingReviewCount}
            clarificationCount={clarificationCount}
            approvedTodayCount={approvedTodayCount}
            rejectedTodayCount={rejectedTodayCount}
            avgResolutionMinutes={avgResolutionMinutes}
            exceptionSessions={exceptionSessions}
            totalWorkMinutesToday={totalWorkMinutesToday}
            avgWorkMinutesToday={avgWorkMinutesToday}
            filteredAttendanceLogItems={filteredAttendanceLogItems}
            onOpenSettings={() => setSettingsOpen(true)}
            onSelectLogItem={setSelectedLogItem}
          />

          <ValidationSettingsDialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            settings={payload?.settings}
            thresholdInput={thresholdInput}
            identifyThresholdInput={identifyThresholdInput}
            verifyThresholdInput={verifyThresholdInput}
            onThresholdChange={setThresholdInput}
            onIdentifyThresholdChange={setIdentifyThresholdInput}
            onVerifyThresholdChange={setVerifyThresholdInput}
            saving={settingsSaving}
            onToggleAutoSubmit={() => void toggleAutoSubmit()}
            onSave={() => void saveValidationSettings()}
          />

          <QuickLogDialog
            selectedLogItem={selectedLogItem}
            imageBroken={quickDetailImageBroken}
            onImageError={() => setQuickDetailImageBroken(true)}
            onClose={() => setSelectedLogItem(null)}
          />
        </>
      ) : (
        <SelfViewPanel summary={summary} />
      )}
    </div>
  );
}
