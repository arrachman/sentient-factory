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
import { createProject, updateProject } from '@/lib/api/projects';
import type { HrProject } from '@/lib/api/projects';

export function ProjectDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: HrProject | null;
}) {
  const qc = useQueryClient();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [isBillable, setIsBillable] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(project);

  useEffect(() => {
    if (!open) return;
    setCode(project?.code ?? '');
    setName(project?.name ?? '');
    setClientName(project?.clientName ?? '');
    setIsBillable(project?.isBillable ?? false);
  }, [open, project]);

  async function submit() {
    if (!code.trim() || !name.trim()) {
      toast.error('Kode dan nama proyek wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: code.trim(),
        name: name.trim(),
        clientName: clientName.trim() || undefined,
        isBillable,
      };
      if (isEdit && project) await updateProject(project.id, payload);
      else await createProject(payload);
      toast.success(isEdit ? 'Proyek diperbarui.' : 'Proyek dibuat.');
      await qc.invalidateQueries({ queryKey: ['hr', 'projects'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan proyek.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Proyek' : 'Tambah Proyek'}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Kode</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PROJ-A" />
            </div>
            <div className="space-y-1">
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Implementasi Klien A" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Klien (opsional)</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nama klien…" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Billable (jam dapat ditagih ke klien)
          </label>
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
