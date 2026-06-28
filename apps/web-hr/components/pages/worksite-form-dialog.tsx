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
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(worksite);

  useEffect(() => {
    if (open) {
      setForm(
        worksite
          ? {
              code: worksite.code,
              name: worksite.name,
              latitude: String(worksite.latitude),
              longitude: String(worksite.longitude),
              radiusMeters: String(worksite.radiusMeters),
              isActive: worksite.isActive,
            }
          : EMPTY,
      );
    }
  }, [open, worksite]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    const payload: CreateWorksitePayload = {
      code: form.code.trim(),
      name: form.name.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radiusMeters: Number(form.radiusMeters),
      isActive: form.isActive,
    };
    if (!payload.code || !payload.name || Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      toast.error('Kode, nama, dan koordinat wajib diisi dengan benar.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit && worksite) await updateWorksite(String(worksite.id), payload);
      else await createWorksite(payload);
      toast.success(isEdit ? 'Worksite diperbarui.' : 'Worksite dibuat.');
      await qc.invalidateQueries({ queryKey: hrQueryKeys.worksites() });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan worksite.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Worksite' : 'Tambah Worksite'}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kode">
              <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="HQ" />
            </Field>
            <Field label="Nama">
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Head Office" />
            </Field>
            <Field label="Latitude">
              <Input value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="-6.2" inputMode="decimal" />
            </Field>
            <Field label="Longitude">
              <Input value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="106.8166" inputMode="decimal" />
            </Field>
            <Field label="Radius (m)">
              <Input value={form.radiusMeters} onChange={(e) => set('radiusMeters', e.target.value)} inputMode="numeric" />
            </Field>
            <Field label="Aktif">
              <label className="flex h-9 items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
                {form.isActive ? 'Ya' : 'Tidak'}
              </label>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
