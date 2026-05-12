'use client';

import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AssignedWorksiteRow = { id: number; name: string; code: string; radiusMeters: number; isPrimary: boolean };

type FaceEnrollmentManagementRow = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  faceTemplateVersion: number;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
  activeEnrollmentId: number | null;
  snapshotUrl: string | null;
  qualityScore: number | null;
  enrolledAt: string | null;
  registeredByUsername: string | null;
  registeredByFullName: string | null;
};

const HR_TIME_ZONE = 'Asia/Jakarta';

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return { year: Number(parts.find((p) => p.type === 'year')?.value ?? '0'), month: Number(parts.find((p) => p.type === 'month')?.value ?? '1'), day: Number(parts.find((p) => p.type === 'day')?.value ?? '1') };
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
  return { dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`, timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`, dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` };
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

const COL_GRID = 'grid-cols-[minmax(230px,1.25fr)_minmax(130px,0.7fr)_minmax(150px,0.85fr)_minmax(150px,0.85fr)_190px]';

export function EnrollmentTable({
  visibleRows,
  filteredTotal,
  rangeStart,
  rangeEnd,
  pageSize,
  activePage,
  totalPages,
  pageNumbers,
  onPageSizeChange,
  onPageChange,
  onOpenWorksiteDialog,
}: {
  visibleRows: FaceEnrollmentManagementRow[];
  filteredTotal: number;
  rangeStart: number;
  rangeEnd: number;
  pageSize: number;
  activePage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onOpenWorksiteDialog: (row: FaceEnrollmentManagementRow) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div className={cn('grid gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500', COL_GRID)}>
            <div>Pegawai / Status</div>
            <div>Kualitas Data</div>
            <div>Didaftarkan Oleh</div>
            <div>Tempat Kerja</div>
            <div className="text-right">Aksi</div>
          </div>
          <div className="divide-y divide-slate-200">
            {visibleRows.map((row) => {
              const enrolled = row.faceEnrollmentStatus === 'enrolled';
              const qualityText = enrolled && typeof row.qualityScore === 'number' ? `${(row.qualityScore * 100).toFixed(0)}%` : 'Menunggu pendaftaran';
              const registeredByText = enrolled ? row.registeredByFullName ?? row.registeredByUsername ?? '-' : '';
              const assignedWorksites = row.assignedWorksites;

              return (
                <div key={row.appUserId} className={cn('grid items-center gap-4 px-5 py-5', COL_GRID)}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-500">
                        {row.snapshotUrl && enrolled ? (
                          <img src={`/api/hr/face-enrollments/${row.activeEnrollmentId}/snapshot`} alt="" className="h-full w-full object-cover" />
                        ) : (
                          ((row.fullName ?? row.username).slice(0, 2) || 'HR').toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{row.fullName ?? row.username}</p>
                        <Badge className={cn('mt-1 rounded-md border-0 px-2 py-1 text-[10px] font-bold uppercase', enrolled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500')}>
                          {enrolled ? 'Terdaftar' : 'Belum Terdaftar'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700">
                    {enrolled ? (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900">v{row.faceTemplateVersion} •</p>
                        <p className="text-sm font-semibold text-slate-800">{qualityText}</p>
                        <p className="text-[11px] text-slate-500">{formatDateTime(row.enrolledAt)}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                  <div className="min-w-0 text-sm text-slate-700">
                    {enrolled ? <span className="block line-clamp-2 font-medium leading-5 text-slate-900">{registeredByText}</span> : <span className="text-slate-400">-</span>}
                  </div>
                  <div className="min-w-0">
                    {assignedWorksites.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="line-clamp-2 text-sm font-medium leading-5 text-slate-700">{assignedWorksites[0]?.name}</span>
                        {assignedWorksites.length > 1 ? <span className="text-xs text-slate-400">+{assignedWorksites.length - 1}</span> : null}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Belum diatur</span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <div className={cn('flex items-center justify-end gap-2', enrolled ? '' : 'w-full')}>
                      {enrolled ? (
                        <Button
                          variant="outline"
                          className="h-12 rounded-lg border-slate-200 bg-white px-4 text-xs font-semibold leading-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          onClick={() => onOpenWorksiteDialog(row)}
                        >
                          Atur Tempat
                          <br />
                          Kerja
                        </Button>
                      ) : null}
                      <Button
                        asChild
                        variant="outline"
                        className={cn(
                          'h-10 rounded-lg px-4 text-sm font-semibold',
                          enrolled
                            ? 'size-9 border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            : 'w-full border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white',
                        )}
                      >
                        <Link href={`/app/hr/attendance?targetUserId=${row.appUserId}&action=enroll`}>
                          {enrolled ? <PencilLine className="size-4" /> : 'Daftarkan Wajah'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredTotal === 0 ? (
        <div className="border-t border-slate-200 px-4 py-6 text-sm text-slate-500">Tidak ada pegawai yang cocok dengan pencarian atau filter.</div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Menampilkan {rangeStart}-{rangeEnd} dari {filteredTotal} pegawai</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Limit</span>
            {[10, 50, 100].map((limit) => (
              <Button
                key={limit}
                variant={pageSize === limit ? 'primary' : 'outline'}
                className={cn('h-8 rounded-lg px-3 text-xs', pageSize === limit && 'bg-blue-600 text-white hover:bg-blue-700')}
                onClick={() => onPageSizeChange(limit)}
              >
                {limit}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="size-8 rounded-lg p-0" disabled={activePage <= 1} onClick={() => onPageChange(Math.max(1, activePage - 1))}>
              ‹
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={activePage === pageNumber ? 'primary' : 'outline'}
                className={cn('size-8 rounded-lg p-0 text-sm', activePage === pageNumber && 'bg-blue-600 text-white hover:bg-blue-700')}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button variant="outline" className="size-8 rounded-lg p-0" disabled={activePage >= totalPages} onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}>
              ›
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
