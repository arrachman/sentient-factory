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
import { createShift, updateShift } from '@/lib/api/schedules';
import type { HrShift } from '@/lib/api/schedules';

export function ShiftDialog({
  open,
  onOpenChange,
  shift,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: HrShift | null;
}) {
  const qc = useQueryClient();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [breakMinutes, setBreakMinutes] = useState('60');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(shift);

  useEffect(() => {
    if (!open) return;
    setCode(shift?.code ?? '');
    setName(shift?.name ?? '');
    setStartTime(shift?.startTime ?? '08:00');
    setEndTime(shift?.endTime ?? '16:00');
    setBreakMinutes(String(shift?.breakMinutes ?? 60));
  }, [open, shift]);

  async function submit() {
    if (!code.trim() || !name.trim()) {
      toast.error('Kode dan nama shift wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: code.trim(),
        name: name.trim(),
        startTime,
        endTime,
        breakMinutes: Number(breakMinutes) || 0,
      };
      if (isEdit && shift) await updateShift(shift.id, payload);
      else await createShift(payload);
      toast.success(isEdit ? 'Shift diperbarui.' : 'Shift dibuat.');
      await qc.invalidateQueries({ queryKey: ['hr', 'shifts'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan shift.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Shift' : 'Tambah Shift'}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Kode</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PAGI" />
            </div>
            <div className="space-y-1">
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shift Pagi" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Mulai</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Selesai</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Istirahat (mnt)</Label>
              <Input
                type="number"
                min={0}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="default" onClick={() => onOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button variant="primary" onClick={submit} disabled={saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
