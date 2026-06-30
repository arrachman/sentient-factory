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
import { createHoliday, updateHoliday } from '@/lib/api/holidays';
import type { HrHoliday, CreateHolidayPayload } from '@/lib/api/holidays';

export function HolidayDialog({
  open,
  onOpenChange,
  holiday,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday?: HrHoliday | null;
}) {
  const qc = useQueryClient();
  const isEdit = Boolean(holiday);
  const defaults = {
    holidayDate: holiday?.holidayDate?.slice(0, 10) ?? '',
    name: holiday?.name ?? '',
    region: holiday?.region ?? '',
    isRecurring: holiday?.isRecurring ?? false,
    isActive: holiday?.isActive ?? true,
  };
  const formKey = `${open ? 'open' : 'closed'}-${holiday?.id ?? 'new'}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: CreateHolidayPayload = {
      holidayDate: String(formData.get('holidayDate') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      region: String(formData.get('region') ?? '').trim() || undefined,
      isRecurring: formData.get('isRecurring') === 'on',
      isActive: formData.get('isActive') === 'on',
    };
    if (!payload.holidayDate || !payload.name) {
      toast.error('Tanggal dan nama hari libur wajib diisi.');
      return;
    }
    try {
      if (isEdit && holiday) await updateHoliday(String(holiday.id), payload);
      else await createHoliday(payload);
      toast.success(isEdit ? 'Hari libur diperbarui.' : 'Hari libur ditambahkan.');
      await qc.invalidateQueries({ queryKey: ['hr', 'holidays'] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan hari libur.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Hari Libur' : 'Tambah Hari Libur'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal">
                <Input name="holidayDate" type="date" defaultValue={defaults.holidayDate} />
              </Field>
              <Field label="Wilayah">
                <Input name="region" defaultValue={defaults.region} placeholder="Nasional" />
              </Field>
            </div>
            <Field label="Nama">
              <Input name="name" defaultValue={defaults.name} placeholder="Hari Kemerdekaan RI" />
            </Field>
            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <input name="isRecurring" type="checkbox" defaultChecked={defaults.isRecurring} />
                Berulang tiap tahun
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input name="isActive" type="checkbox" defaultChecked={defaults.isActive} />
                Aktif
              </label>
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
