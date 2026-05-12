'use client';

import { MapPinned } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type WorksiteRow = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
};

export function WorksitesList({
  worksites,
  onEdit,
}: {
  worksites: WorksiteRow[];
  onEdit: (worksite: WorksiteRow) => void;
}) {
  if (worksites.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-5 py-8 text-sm text-slate-500 shadow-sm">
        Belum ada lokasi kerja.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {worksites.map((worksite) => (
        <button
          key={worksite.id}
          type="button"
          className="group w-full rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-100"
          onClick={() => onEdit(worksite)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-800">{worksite.name}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{worksite.code}</p>
            </div>
            <Badge
              className={cn(
                'shrink-0 rounded-lg border-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wide',
                worksite.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500',
              )}
            >
              {worksite.isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <MapPinned className="size-4 text-slate-400" />
              Radius: {worksite.radiusMeters}m
            </p>
            <span className="text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">Edit</span>
          </div>
        </button>
      ))}
    </div>
  );
}
