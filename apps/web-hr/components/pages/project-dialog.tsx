'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';
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
  const isEdit = Boolean(project);
  const formKey = `${open ? 'open' : 'closed'}-${project?.id ?? 'new'}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get('code') ?? '').trim();
    const name = String(formData.get('name') ?? '').trim();
    const clientName = String(formData.get('clientName') ?? '').trim();
    const isBillable = formData.get('isBillable') === 'on';
    if (!code || !name) {
      toast.error('Kode dan nama proyek wajib diisi.');
      return;
    }
    try {
      const payload = {
        code,
        name,
        clientName: clientName || undefined,
        isBillable,
      };
      if (isEdit && project) await updateProject(project.id, payload);
      else await createProject(payload);
      toast.success(isEdit ? 'Proyek diperbarui.' : 'Proyek dibuat.');
      await qc.invalidateQueries({ queryKey: ['hr', 'projects'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan proyek.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Proyek' : 'Tambah Proyek'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Kode</Label>
                <Input name="code" defaultValue={project?.code ?? ''} placeholder="PROJ-A" />
              </div>
              <div className="space-y-1">
                <Label>Nama</Label>
                <Input name="name" defaultValue={project?.name ?? ''} placeholder="Implementasi Klien A" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Klien (opsional)</Label>
              <Input name="clientName" defaultValue={project?.clientName ?? ''} placeholder="Nama klien…" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isBillable"
                type="checkbox"
                defaultChecked={project?.isBillable ?? false}
                className="h-4 w-4 rounded border-input"
              />
              Billable (jam dapat ditagih ke klien)
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">Simpan</Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
