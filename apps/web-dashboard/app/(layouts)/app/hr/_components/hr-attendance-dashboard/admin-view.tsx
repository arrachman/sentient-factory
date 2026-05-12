'use client';

/**
 * Admin attendance dashboard view body — workforce overview, KPI grid,
 * validation health, review queue, productivity, dan activity log.
 * Dipisah dari page-view utama supaya halaman tetap < 400 LOC.
 */
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
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  formatCompactInteger,
  formatDecimalValue,
  formatPercentValue,
  formatScorePercentage,
  humanizeStatus,
  statusTone,
} from '../hr-shared';
import type { AttendanceLogItem } from './types';

export type AdminMetrics = Record<
  | 'totalEmployees'
  | 'activeWorksites'
  | 'enrolledEmployees'
  | 'employeesWithoutWorksite'
  | 'clockedInToday'
  | 'clockedOutToday'
  | 'exceptionSessions'
  | 'validationSuccessToday'
  | 'validationLowConfidenceToday'
  | 'validationFailureToday'
  | 'notEnrolledEmployees'
  | 'enrollmentCoverageRate'
  | 'completionRate'
  | 'participationRate'
  | 'avgFaceScoreToday'
  | 'avgEnrollmentQuality'
  | 'avgMatchSimilarityToday'
  | 'avgLivenessScoreToday'
  | 'pendingReviewCount'
  | 'clarificationCount'
  | 'approvedTodayCount'
  | 'rejectedTodayCount'
  | 'avgResolutionMinutes'
  | 'totalWorkMinutesToday'
  | 'avgWorkMinutesToday',
  number
>;

export function AttendanceAdminView({
  metrics,
  filteredAttendanceLogItems,
  onOpenSettings,
  setSelectedLogItem,
}: {
  metrics: AdminMetrics;
  filteredAttendanceLogItems: AttendanceLogItem[];
  onOpenSettings: () => void;
  setSelectedLogItem: (item: AttendanceLogItem | null) => void;
}) {
  const { totalEmployees, activeWorksites, enrolledEmployees, employeesWithoutWorksite, clockedInToday, clockedOutToday, exceptionSessions, validationSuccessToday, validationLowConfidenceToday, validationFailureToday, notEnrolledEmployees, enrollmentCoverageRate, completionRate, participationRate, avgFaceScoreToday, avgEnrollmentQuality, avgMatchSimilarityToday, avgLivenessScoreToday, pendingReviewCount, clarificationCount, approvedTodayCount, rejectedTodayCount, avgResolutionMinutes, totalWorkMinutesToday, avgWorkMinutesToday } = metrics;

  return (
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
          onClick={onOpenSettings}
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
  );
}
