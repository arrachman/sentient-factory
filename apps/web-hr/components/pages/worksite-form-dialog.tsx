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
import { createWorksite, updateWorksite } from '@/lib/api/worksites';
import type { HrWorksite, CreateWorksitePayload } from '@/lib/api/worksites';
import { hrQueryKeys } from '@/lib/api/hooks';

type FormState = {
  code: string;
  name: string;
  latitude: string;
  longitude: string;
  radiusMeters: string;
  isActive: boolean;
};

const EMPTY: FormState = {
  code: '',
  name: '',
  latitude: '',
  longitude: '',
  radiusMeters: '100',
  isActive: true,
};

export function WorksiteFormDialog({
  open,
  onOpenChange,
  worksite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worksite?: HrWorksite | null;
}) {
  const qc = useQueryClient();
  const isEdit = Boolean(worksite);
  const defaults: FormState = worksite
    ? {
        code: worksite.code,
        name: worksite.name,
        latitude: String(worksite.latitude),
        longitude: String(worksite.longitude),
        radiusMeters: String(worksite.radiusMeters),
        isActive: worksite.isActive,
      }
    : EMPTY;
  const formKey = `${open ? 'open' : 'closed'}-${worksite?.id ?? 'new'}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: CreateWorksitePayload = {
      code: String(formData.get('code') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      latitude: Number(formData.get('latitude') ?? ''),
      longitude: Number(formData.get('longitude') ?? ''),
      radiusMeters: Number(formData.get('radiusMeters') ?? ''),
      isActive: formData.get('isActive') === 'on',
    };
    if (!payload.code || !payload.name || Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      toast.error('Kode, nama, dan koordinat wajib diisi dengan benar.');
      return;
    }
    try {
      if (isEdit && worksite) await updateWorksite(String(worksite.id), payload);
      else await createWorksite(payload);
      toast.success(isEdit ? 'Worksite diperbarui.' : 'Worksite dibuat.');
      await qc.invalidateQueries({ queryKey: hrQueryKeys.worksites() });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan worksite.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Worksite' : 'Tambah Worksite'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kode">
                <Input name="code" defaultValue={defaults.code} placeholder="HQ" />
              </Field>
              <Field label="Nama">
                <Input name="name" defaultValue={defaults.name} placeholder="Head Office" />
              </Field>
              <Field label="Latitude">
                <Input name="latitude" defaultValue={defaults.latitude} placeholder="-6.2" inputMode="decimal" />
              </Field>
              <Field label="Longitude">
                <Input name="longitude" defaultValue={defaults.longitude} placeholder="106.8166" inputMode="decimal" />
              </Field>
              <Field label="Radius (m)">
                <Input name="radiusMeters" defaultValue={defaults.radiusMeters} inputMode="numeric" />
              </Field>
              <Field label="Aktif">
                <label className="flex h-9 items-center gap-2 text-sm">
                  <input name="isActive" type="checkbox" defaultChecked={defaults.isActive} />
                  Aktif
                </label>
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
