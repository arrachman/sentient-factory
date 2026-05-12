'use client';

import Link from 'next/link';
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Re-export SelfViewPanel so page-view only needs one import location.
export { SelfViewPanel } from './self-view-panel';
export { UserRound } from 'lucide-react';

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

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success': return 'bg-emerald-100 text-emerald-700';
    case 'manual_review': return 'bg-amber-100 text-amber-800';
    case 'warning': return 'bg-orange-100 text-orange-800';
    case 'rejected': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
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

function fmt(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function fmtPct(value: number | null | undefined, digits = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}

function fmtScore(value: number | null | undefined, digits = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return `${(value <= 1 ? value * 100 : value).toFixed(digits)}`;
}

function fmtDec(value: number | null | undefined, digits = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}

export type WorkforceSummaryPanelProps = {
  totalEmployees: number;
  enrolledEmployees: number;
  notEnrolledEmployees: number;
  enrollmentCoverageRate: number;
  activeWorksites: number;
  employeesWithoutWorksite: number;
  clockedInToday: number;
  clockedOutToday: number;
  completionRate: number;
  participationRate: number;
  validationSuccessToday: number;
  validationLowConfidenceToday: number;
  validationFailureToday: number;
  avgFaceScoreToday: number;
  avgEnrollmentQuality: number;
  avgMatchSimilarityToday: number;
  avgLivenessScoreToday: number;
  pendingReviewCount: number;
  clarificationCount: number;
  approvedTodayCount: number;
  rejectedTodayCount: number;
  avgResolutionMinutes: number;
  exceptionSessions: number;
  totalWorkMinutesToday: number;
  avgWorkMinutesToday: number;
  filteredAttendanceLogItems: AttendanceLogItem[];
  onOpenSettings: () => void;
  onSelectLogItem: (item: AttendanceLogItem) => void;
};

export function WorkforceSummaryPanel(props: WorkforceSummaryPanelProps) {
  const {
    totalEmployees, enrolledEmployees, notEnrolledEmployees, enrollmentCoverageRate,
    activeWorksites, employeesWithoutWorksite,
    clockedInToday, clockedOutToday, completionRate, participationRate,
    validationSuccessToday, validationLowConfidenceToday, validationFailureToday,
    avgFaceScoreToday, avgEnrollmentQuality, avgMatchSimilarityToday, avgLivenessScoreToday,
    pendingReviewCount, clarificationCount, approvedTodayCount, rejectedTodayCount,
    avgResolutionMinutes, exceptionSessions,
    totalWorkMinutesToday, avgWorkMinutesToday,
    filteredAttendanceLogItems, onOpenSettings, onSelectLogItem,
  } = props;

  const topCards = [
    { label: 'Total Pegawai Aktif', value: fmt(totalEmployees), tone: 'bg-blue-50 text-blue-600', Icon: UserPlus, helper: 'Jumlah pegawai aktif' },
    { label: 'Pegawai Sudah Daftar', value: fmt(enrolledEmployees), tone: 'bg-emerald-50 text-emerald-600', Icon: ScanFace, helper: 'Wajah sudah terverifikasi' },
    { label: 'Pegawai Belum Daftar', value: fmt(notEnrolledEmployees), tone: 'bg-amber-50 text-amber-600', Icon: AlertTriangle, helper: 'Masih perlu pendaftaran wajah' },
    { label: 'Cakupan Pendaftaran', value: fmtPct(enrollmentCoverageRate, 1), tone: 'bg-indigo-50 text-indigo-600', Icon: Settings, helper: `${fmt(enrolledEmployees)} dari ${fmt(totalEmployees)} pegawai` },
  ];

  const dailySummaryCards = [
    { label: 'Absen Masuk', value: fmt(clockedInToday), Icon: Clock3, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Absen Pulang', value: fmt(clockedOutToday), Icon: Timer, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Tingkat Selesai', value: fmtPct(completionRate), Icon: Check, tone: 'text-blue-600 bg-blue-50' },
    { label: 'Tingkat Partisipasi', value: fmtPct(participationRate), Icon: UserPlus, tone: 'text-violet-600 bg-violet-50' },
  ];

  const qualityCards = [
    { label: 'Rata-rata Skor Wajah', value: fmtScore(avgFaceScoreToday), suffix: '/100', tone: 'text-slate-950' },
    { label: 'Rata-rata Kualitas Pendaftaran', value: fmtScore(avgEnrollmentQuality), suffix: '/100', tone: 'text-slate-950' },
    { label: 'Kemiripan Pencocokan Wajah', value: fmtPct(Number.isFinite(avgMatchSimilarityToday) ? (avgMatchSimilarityToday <= 1 ? avgMatchSimilarityToday * 100 : avgMatchSimilarityToday) : null), suffix: '', tone: 'text-emerald-600' },
    { label: 'Skor Liveness', value: fmtDec(avgLivenessScoreToday, 2), suffix: '', tone: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6 rounded-[30px] bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Ringkasan Tenaga Kerja</h2>
          <p className="max-w-2xl text-sm text-slate-600">Cakupan absensi, jangkauan operasional, dan partisipasi harian secara real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm">Hari Ini</div>
          <Button variant="outline" className="h-10 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100" onClick={onOpenSettings}>
            <Settings className="mr-2 size-4" />
            Pengaturan Validasi
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {topCards.map((item) => (
          <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
                <p className="text-xs text-slate-400">{item.helper}</p>
              </div>
              <div className={cn('flex size-10 items-center justify-center rounded-full', item.tone)}>
                <item.Icon className="size-4" />
              </div>
            </div>
            <div className="mt-8 flex items-end gap-3">
              <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
              {item.label === 'Cakupan Pendaftaran' ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">Aktif</span>
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
                <div className="flex size-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm"><MapPin className="size-5" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Lokasi Kerja Aktif</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{fmt(activeWorksites)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50/80 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm"><AlertTriangle className="size-5" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pegawai Tanpa Penugasan</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-amber-600">{fmt(employeesWithoutWorksite)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <p className="text-xl font-semibold text-slate-950">Ringkasan Absensi Harian</p>
            <Badge className="border-0 bg-slate-100 px-3 py-1.5 text-slate-600">Hari Ini</Badge>
          </div>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
            {dailySummaryCards.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-slate-200 bg-white px-5 py-7 shadow-sm">
                <div className={cn('mx-auto flex size-11 items-center justify-center rounded-full', item.tone)}>
                  <item.Icon className="size-5" />
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
            <Badge className="border-0 bg-emerald-100 px-3 py-1.5 text-emerald-700">{fmt(validationSuccessToday)} berhasil</Badge>
            <Badge className="border-0 bg-amber-100 px-3 py-1.5 text-amber-800">{fmt(validationLowConfidenceToday)} keyakinan rendah</Badge>
            <Badge className="border-0 bg-rose-100 px-3 py-1.5 text-rose-700">{fmt(validationFailureToday)} gagal</Badge>
          </div>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
          {qualityCards.map((item) => (
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
                <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><ShieldAlert className="size-4" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Sesi Pengecualian</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-rose-600">{fmt(exceptionSessions)}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Jumlah Antrian</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{fmt(pendingReviewCount)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Waktu Penyelesaian</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{Number.isFinite(avgResolutionMinutes) ? `${fmt(avgResolutionMinutes)}m` : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Klarifikasi</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-600">{fmt(clarificationCount)}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Disetujui</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{fmt(approvedTodayCount)}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Ditolak</p>
                <p className="mt-2 text-2xl font-semibold text-rose-800">{fmt(rejectedTodayCount)}</p>
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
                <span className="text-5xl font-semibold tracking-tight text-slate-950">{fmt(totalWorkMinutesToday)}</span>
                <span className="pb-2 text-sm font-medium text-slate-500">menit</span>
              </div>
            </div>
            <div className="h-px bg-slate-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rata-rata Jam Kerja Harian</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">
                  {Number.isFinite(avgWorkMinutesToday) ? fmtDec(avgWorkMinutesToday / 60, 1) : '-'}
                </span>
                <span className="pb-1 text-sm font-medium text-slate-500">jam / pegawai</span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">Aktivitas Terbaru</span>
                <span className="text-sm font-semibold text-slate-950">{fmt(filteredAttendanceLogItems.length)} item</span>
              </div>
              <div className="mt-4 space-y-3">
                {filteredAttendanceLogItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectLogItem(item)}
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
  );
}
