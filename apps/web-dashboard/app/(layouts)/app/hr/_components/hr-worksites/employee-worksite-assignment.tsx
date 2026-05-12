'use client';

import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AssignedWorksiteRow = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

type AttendanceUserOption = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
};

function getInitials(value: string | null | undefined) {
  if (!value) return 'HR';
  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return 'HR';
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

const avatarTones = [
  'bg-blue-100 text-blue-600',
  'bg-indigo-100 text-indigo-600',
  'bg-slate-100 text-slate-600',
  'bg-emerald-100 text-emerald-600',
];

export function EmployeeWorksiteAssignment({
  users,
  userSearch,
  onSearchChange,
  onAssign,
}: {
  users: AttendanceUserOption[];
  userSearch: string;
  onSearchChange: (value: string) => void;
  onAssign: (user: AttendanceUserOption) => void;
}) {
  return (
    <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-100">
      <CardContent className="space-y-4 p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama pegawai, EMP-ID, atau lokasi kerja..."
            className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none"
          />
        </div>
        <div className="max-h-[560px] divide-y divide-slate-100 overflow-auto">
          {users.length === 0 ? (
            <div className="px-1 py-8 text-sm text-slate-500">Pegawai tidak ditemukan.</div>
          ) : (
            users.map((user, index) => {
              const displayName = user.fullName ?? user.username;
              const primaryWorksite = user.assignedWorksites[0];
              return (
                <div key={user.appUserId} className="flex items-center gap-4 px-1 py-4">
                  <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold', avatarTones[index % avatarTones.length])}>
                    {getInitials(displayName)}
                  </div>
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onAssign(user)}>
                    <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {primaryWorksite ? (
                        <>
                          <Badge className="max-w-full rounded-md border-0 bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                            <span className="truncate">{primaryWorksite.name}</span>
                          </Badge>
                          {user.assignedWorksites.length > 1 ? (
                            <Badge className="rounded-md border-0 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                              +{user.assignedWorksites.length - 1}
                            </Badge>
                          ) : null}
                        </>
                      ) : (
                        <Badge className="rounded-md border-0 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">Belum diatur</Badge>
                      )}
                    </div>
                  </button>
                  <Button variant="ghost" className="h-8 rounded-lg px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50" onClick={() => onAssign(user)}>
                    Atur
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
