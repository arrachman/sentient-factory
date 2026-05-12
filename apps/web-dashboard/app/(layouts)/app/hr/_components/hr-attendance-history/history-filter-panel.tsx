'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AttendanceUserOption = {
  hrUserId: number; appUserId: number; employeeCode: string | null;
  faceEnrollmentStatus: string; employeeRoleType: string; isActive: boolean;
  username: string; fullName: string | null; defaultWorksiteName: string | null;
};

export function HistoryFilterPanel({
  attendanceUsers,
  selectedUserId,
  searchInput,
  dateFrom,
  dateTo,
  quickRange,
  onUserChange,
  onSearchInputChange,
  onSearch,
  onDateFromChange,
  onDateToChange,
  onQuickRange,
  onReset,
}: {
  attendanceUsers: AttendanceUserOption[];
  selectedUserId: string;
  searchInput: string;
  dateFrom: string;
  dateTo: string;
  quickRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  onUserChange: (userId: string) => void;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onQuickRange: (range: 'today' | 'week' | 'month') => void;
  onReset: () => void;
}) {
  const showUserFilter = attendanceUsers.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        {showUserFilter ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pegawai</label>
            <select
              className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0"
              value={selectedUserId}
              onChange={(e) => onUserChange(e.target.value)}
            >
              <option value="all">Semua Pegawai</option>
              {attendanceUsers.map((user) => (
                <option key={user.appUserId} value={String(user.appUserId)}>
                  {user.fullName ?? user.username}{user.employeeCode ? ` • ${user.employeeCode}` : ''}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className={showUserFilter ? '' : 'sm:col-span-2'}>
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cari</label>
          <div className="mt-3 flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Nama, username, atau kode pegawai"
              className="h-11 rounded-xl border-slate-200"
            />
            <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={onSearch}>
              Cari
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Dari Tanggal</label>
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="mt-3 h-11 rounded-xl border-slate-200" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sampai Tanggal</label>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="mt-3 h-11 rounded-xl border-slate-200" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Filter</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {([{ key: 'today', label: 'Hari Ini' }, { key: 'week', label: 'Minggu Ini' }, { key: 'month', label: 'Bulan Ini' }] as const).map((item) => (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              className={cn('h-10 rounded-xl', quickRange === item.key ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700')}
              onClick={() => onQuickRange(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="button" variant="ghost" className="h-10 rounded-xl text-slate-600" onClick={onReset}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
