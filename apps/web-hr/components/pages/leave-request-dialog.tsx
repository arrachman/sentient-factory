'use client';

import { useState } from 'react';
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
import { useLeaveTypes } from '@/lib/api/hooks';
import { createLeaveRequest } from '@/lib/api/leave';

export function LeaveRequestDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}) {
  const qc = useQueryClient();
  const { data: types } = useLeaveTypes();
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!leaveTypeId || !startDate || !endDate) {
      toast.error('Tipe cuti dan tanggal wajib diisi.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
      return;
    }
    setSaving(true);
    try {
      await createLeaveRequest({
        leaveTypeId: Number(leaveTypeId),
        startDate,
        endDate,
        reason: reason.trim() || undefined,
      });
      toast.success('Pengajuan cuti terkirim.');
      await qc.invalidateQueries({ queryKey: ['hr', 'leave', 'requests'] });
      onCreated?.();
      onOpenChange(false);
      setLeaveTypeId(''); setStartDate(''); setEndDate(''); setReason('');
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal mengajukan cuti.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajukan Cuti</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="space-y-1">
            <Label>Tipe Cuti</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
            >
              <option value="">— pilih —</option>
              {(types ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.isPaid ? '' : ' (tanpa bayar)'}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Mulai</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Selesai</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Alasan (opsional)</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Keperluan…" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="default" onClick={() => onOpenChange(false)} disabled={saving}>Batal</Button>
            <Button variant="primary" onClick={submit} disabled={saving}>
              {saving ? 'Mengirim…' : 'Ajukan'}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
