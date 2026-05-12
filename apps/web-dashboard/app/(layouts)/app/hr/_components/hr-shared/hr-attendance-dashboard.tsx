'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Check,
  Clock3,
  Timer,
  MapPin,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AttendanceActionMode } from './_types-hr';
import type { AttendanceMePayload, AttendanceHistoryPayload } from './_types-hr';
import {
  getInitials,
  isManualReviewStatus,
} from './_utils-hr';
import {
  statusTone,
  humanizeStatus,
  humanizeReasonCode,
  formatEventLabel,
  formatMinutes,
  formatDateTime,
  formatWorkDate,
} from './formatters';

interface HrAttendanceDashboardProps {
  data: AttendanceMePayload | null;
  historyPreview: AttendanceHistoryPayload['data'];
  today: AttendanceMePayload['today'] | undefined;
  profile: AttendanceMePayload['profile'] | undefined;
  // derived
  presentDays: number;
  fullDays: number;
  totalHistoryMinutes: number;
  avgHistoryHours: number;
  lateArrivals: number;
  earlyDepartures: number;
  outOfGeofenceCount: number;
  pendingReviewEvents: AttendanceMePayload['recentEvents'];
  latestPendingReview: AttendanceMePayload['recentEvents'][number] | null;
  actionMessage: string | null;
  actionMode: AttendanceActionMode | null;
  isEnrolled: boolean;
  canClockIn: boolean;
  canClockOut: boolean;
  showEnrollmentSection: boolean;
  brokenEventImages: Record<number, boolean>;
  setBrokenEventImages: (updater: (prev: Record<number, boolean>) => Record<number, boolean>) => void;
  setActionMode: (mode: AttendanceActionMode | null) => void;
}

export function HrAttendanceDashboard({
  data,
  historyPreview,
  today,
  profile,
  presentDays,
  fullDays,
  totalHistoryMinutes,
  avgHistoryHours,
  lateArrivals,
  earlyDepartures,
  outOfGeofenceCount,
  pendingReviewEvents,
  latestPendingReview,
  actionMessage,
  actionMode,
  isEnrolled,
  canClockIn,
  canClockOut,
  showEnrollmentSection,
  brokenEventImages,
  setBrokenEventImages,
  setActionMode,
}: HrAttendanceDashboardProps) {
  return (
    <>
      <div className="space-y-6 rounded-[30px] bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700">Dashboard Pribadi</p>
            <p className="text-sm text-slate-500">
              Selamat datang kembali, {profile?.fullName ?? profile?.username ?? 'Pegawai'}. Berikut ringkasan absensi Anda hari ini.
            </p>
          </div>
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            Hari ini, {formatWorkDate(today?.work_date)}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_320px]">
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock3 className="size-4 text-blue-600" />
                <p className="text-base font-semibold">Status Absensi Hari Ini</p>
              </div>
              <Badge className={cn('border-0 px-3 py-1.5 text-xs font-semibold', today?.clock_out_at ? 'bg-emerald-100 text-emerald-700' : today?.clock_in_at ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700')}>
                {today?.clock_out_at ? 'SUDAH SELESAI' : today?.clock_in_at ? 'SEDANG BERJALAN' : 'BELUM MULAI'}
              </Badge>
            </div>
            <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Jam Masuk</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(today?.clock_in_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Jam Pulang</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(today?.clock_out_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Jam</p>
                <p className="mt-2 text-lg font-semibold text-blue-600">{formatMinutes(today?.total_work_minutes)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Lokasi Kerja</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <MapPin className="size-4 text-slate-400" />
                  {profile?.defaultWorksiteName ?? '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-900">Aksi Cepat</p>
            <div className="grid gap-3">
              {isEnrolled && (canClockIn || canClockOut || today?.clock_in_at || today?.clock_out_at) ? (
                <Button
                  className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!isEnrolled || !!actionMode || (!canClockIn && !canClockOut)}
                  onClick={() => {
                    if (canClockIn) {
                      setActionMode('clockIn');
                    } else if (canClockOut) {
                      setActionMode('clockOut');
                    }
                  }}
                >
                  Buka Absensi
                </Button>
              ) : (
                <Button asChild className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  <Link href="/app/hr/attendance">Buka Absensi</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-12 rounded-xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200">
                <Link href="/app/hr/attendance-history">Lihat Riwayat</Link>
              </Button>
              <div className={cn('flex items-center justify-between rounded-xl border px-4 py-4', showEnrollmentSection ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700')}>
                <div className="flex items-center gap-2">
                  <UserPlus className="size-4" />
                  <span className="text-sm font-semibold">Pendaftaran Wajah</span>
                </div>
                {showEnrollmentSection ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 text-sm font-semibold text-amber-800 hover:bg-transparent"
                    disabled={!profile || !!actionMode}
                    onClick={() => setActionMode('enroll')}
                  >
                    DAFTAR
                  </Button>
                ) : (
                  <span className="text-sm font-semibold">TERDAFTAR</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Hari Hadir',
              value: `${presentDays} / ${historyPreview.length || 22}`,
              icon: Check,
              tone: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Hari Penuh',
              value: String(fullDays),
              icon: Check,
              tone: 'bg-emerald-50 text-emerald-600',
            },
            {
              label: 'Total Jam',
              value: `${(totalHistoryMinutes / 60).toFixed(totalHistoryMinutes % 60 === 0 ? 0 : 1)}h`,
              icon: Timer,
              tone: 'bg-amber-50 text-amber-600',
            },
            {
              label: 'Rata-rata Jam/Hari',
              value: `${avgHistoryHours.toFixed(avgHistoryHours % 1 === 0 ? 0 : 1)}h`,
              icon: Clock3,
              tone: 'bg-slate-100 text-slate-600',
            },
          ].map((metric) => (
            <div key={metric.label} className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn('flex size-10 items-center justify-center rounded-xl', metric.tone)}>
                  <metric.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_320px]">
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-950">Riwayat Absensi Terbaru</h3>
              <Link href="/app/hr/attendance-history" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Jam Masuk</th>
                    <th className="px-5 py-3">Jam Pulang</th>
                    <th className="px-5 py-3">Durasi</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {historyPreview.slice(0, 5).map((row) => {
                    const statusLabel = row.clock_out_at ? 'PENUH' : row.clock_in_at ? 'BERJALAN' : humanizeStatus(row.clock_out_status ?? row.clock_in_status);
                    const statusClass = row.clock_out_status === 'rejected' || row.clock_in_status === 'rejected'
                      ? 'bg-rose-100 text-rose-700'
                      : isManualReviewStatus(row.clock_out_status) || isManualReviewStatus(row.clock_in_status) || row.clock_out_status === 'warning' || row.clock_in_status === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : row.clock_out_at
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700';
                    return (
                      <tr key={row.id} className="text-slate-700">
                        <td className="px-5 py-3 font-medium text-slate-900">{formatWorkDate(row.work_date)}</td>
                        <td className="px-5 py-3">{formatDateTime(row.clock_in_at)}</td>
                        <td className="px-5 py-3">{formatDateTime(row.clock_out_at)}</td>
                        <td className="px-5 py-3">{formatMinutes(row.total_work_minutes)}</td>
                        <td className="px-5 py-3">
                          <Badge className={cn('border-0', statusClass)}>{statusLabel}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {historyPreview.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-sm text-slate-500">Belum ada riwayat absensi.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">Kehadiran & Kepatuhan</h3>
              <div className="mt-4 space-y-4">
                {[
                  { label: 'Terlambat', value: lateArrivals, tone: 'text-rose-600 bg-rose-100' },
                  { label: 'Pulang Cepat', value: earlyDepartures, tone: 'text-amber-600 bg-amber-100' },
                  { label: 'Di Luar Geofence', value: outOfGeofenceCount, tone: 'text-slate-600 bg-slate-100' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex size-8 items-center justify-center rounded-lg', item.tone)}>
                        <AlertTriangle className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-l-4 border-l-amber-500 border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">Review & Klarifikasi</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {latestPendingReview
                  ? `Anda memiliki ${pendingReviewEvents.length} review tertunda terkait ${humanizeReasonCode(latestPendingReview.reason_code) || formatEventLabel(latestPendingReview.event_type).toLowerCase()} pada ${formatWorkDate(latestPendingReview.event_at)}.`
                  : 'Tidak ada review yang menunggu klarifikasi saat ini.'}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 h-11 w-full rounded-xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <Link href="/app/hr/attendance-history">Buka Detail Review Saya</Link>
              </Button>
            </div>
          </div>
        </div>

        {actionMessage ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Riwayat Event Absensi</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {(data?.recentEvents ?? []).length === 0 ? (
            <div className="py-6 text-sm text-slate-500">Belum ada event absensi.</div>
          ) : (
            (data?.recentEvents ?? []).map((event) => {
              const imageBroken = brokenEventImages[event.id];
              const reason = humanizeReasonCode(event.reason_code);
              return (
                <div key={event.id} className="flex min-h-[52px] items-center gap-3 py-2">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {event.snapshot_url && !imageBroken ? (
                      <a
                        href={`/api/hr/events/${event.id}/snapshot`}
                        target="_blank"
                        rel="noreferrer"
                        className="block h-full w-full"
                      >
                        <img
                          src={`/api/hr/events/${event.id}/snapshot`}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={() =>
                            setBrokenEventImages((current) => ({
                              ...current,
                              [event.id]: true,
                            }))
                          }
                        />
                      </a>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-600">
                        {profile?.fullName || profile?.username ? (
                          <span className="text-sm font-semibold">
                            {getInitials(profile?.fullName ?? profile?.username)}
                          </span>
                        ) : (
                          <UserRound className="size-5" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {formatEventLabel(event.event_type)}
                      </p>
                      <Badge className={cn('border-0', statusTone(event.result))}>{humanizeStatus(event.result)}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(event.event_at)}</p>
                    {reason ? <p className="truncate text-xs text-slate-500">{reason}</p> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
