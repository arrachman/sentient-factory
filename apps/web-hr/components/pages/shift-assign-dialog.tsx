'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShifts, useEmployees } from '@/lib/api/hooks';
import { createShiftAssignment } from '@/lib/api/schedules';

export function ShiftAssignDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const { data: shifts } = useShifts();
  const { data: employees } = useEmployees();
  const [appUserId, setAppUserId] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAppUserId('');
      setShiftId('');
      setWorkDate('');
    }
  }, [open]);

  async function submit() {
    if (!appUserId || !shiftId || !workDate) {
      toast.error('Karyawan, shift, dan tanggal wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await createShiftAssignment({
        appUserId: Number(appUserId),
        shiftId: Number(shiftId),
        workDate,
      });
      toast.success('Jadwal shift tersimpan.');
      await qc.invalidateQueries({ queryKey: ['hr', 'shift-assignments'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan jadwal.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="space-y-1">
            <Label>Karyawan</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={appUserId}
              onChange={(e) => setAppUserId(e.target.value)}
            >
              <option value="">— pilih —</option>
              {(employees ?? []).map((emp) => (
                <option key={emp.appUserId} value={emp.appUserId}>
                  {emp.name}{emp.employeeCode ? ` (${emp.employeeCode})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Shift</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={shiftId}
              onChange={(e) => setShiftId(e.target.value)}
            >
              <option value="">— pilih —</option>
              {(shifts ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.startTime}–{s.endTime})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Tanggal</Label>
            <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="default" onClick={() => onOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button variant="primary" onClick={submit} disabled={saving}>
              {saving ? 'Menyimpan…' : 'Assign'}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
