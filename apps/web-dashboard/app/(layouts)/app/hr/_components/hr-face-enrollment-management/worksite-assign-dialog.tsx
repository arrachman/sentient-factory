'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

type FaceEnrollmentManagementRow = {
  appUserId: number;
  fullName: string | null;
  username: string;
};

export function WorksiteAssignDialog({
  open,
  onOpenChange,
  targetRow,
  worksites,
  selectionIds,
  onToggle,
  saving,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetRow: FaceEnrollmentManagementRow | null;
  worksites: WorksiteRow[];
  selectionIds: number[];
  onToggle: (id: number, checked: boolean) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">Atur Tempat Kerja</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Pilih satu atau beberapa tempat kerja untuk {targetRow?.fullName ?? targetRow?.username ?? 'pegawai ini'}.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-4">
          <div className="grid max-h-[50vh] gap-2 overflow-auto pr-1">
            {worksites.map((worksite) => {
              const checked = selectionIds.includes(worksite.id);
              return (
                <label
                  key={worksite.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors',
                    checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(next) => onToggle(worksite.id, next === true)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{worksite.name}</p>
                      <Badge className={cn('border-0 text-[11px]', checked ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>
                        {worksite.code}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Radius {worksite.radiusMeters} m • {worksite.latitude}, {worksite.longitude}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Tempat kerja yang dipilih akan menjadi daftar lokasi yang bisa dipakai pegawai untuk absensi. Lokasi pertama tetap dipakai sebagai lokasi utama.
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <Button variant="outline" className="h-10 rounded-xl" disabled={saving} onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button className="h-10 rounded-xl" disabled={saving || selectionIds.length === 0} onClick={onSave}>
            {selectionIds.length === 0 ? 'Pilih Minimal Satu Lokasi' : saving ? 'Menyimpan...' : 'Simpan Tempat Kerja'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
