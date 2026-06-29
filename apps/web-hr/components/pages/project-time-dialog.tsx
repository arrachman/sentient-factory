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
import { useProjects } from '@/lib/api/hooks';
import { createProjectTime } from '@/lib/api/projects';

export function ProjectTimeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const { data: projects } = useProjects();
  const [projectId, setProjectId] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [hours, setHours] = useState('');
  const [activity, setActivity] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setProjectId('');
      setWorkDate('');
      setHours('');
      setActivity('');
      setNote('');
    }
  }, [open]);

  async function submit() {
    const hoursNum = Number(hours);
    if (!projectId || !workDate || !hoursNum || hoursNum <= 0) {
      toast.error('Proyek, tanggal, dan durasi (>0) wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await createProjectTime({
        projectId: Number(projectId),
        workDate,
        minutes: Math.round(hoursNum * 60),
        activity: activity.trim() || undefined,
        note: note.trim() || undefined,
      });
      toast.success('Waktu proyek tercatat.');
      await qc.invalidateQueries({ queryKey: ['hr', 'project-time'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal mencatat waktu.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Waktu Proyek</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="space-y-1">
            <Label>Proyek</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">— pilih —</option>
              {(projects ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.isBillable ? ' · billable' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tanggal</Label>
              <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Durasi (jam)</Label>
              <Input
                type="number"
                min={0}
                step={0.25}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="2"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Aktivitas (opsional)</Label>
            <Input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Development, meeting…" />
          </div>
          <div className="space-y-1">
            <Label>Catatan (opsional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Detail…" />
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
