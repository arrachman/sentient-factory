'use client';

import { type CreateClientInput } from '../../model/types';

export function WaOptOutBlock({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  return (
    <div className="rounded-md border border-border p-3 bg-cream-50">
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.waOptedOut ?? false}
          onChange={(e) =>
            onChange({ ...form, waOptedOut: e.target.checked })
          }
          className="h-4 w-4 mt-0.5 flex-shrink-0"
        />
        <span className="flex flex-col gap-1">
          <span className="font-medium text-teal-800">
            Jangan kirim notifikasi WhatsApp ke klien ini
          </span>
          <span className="caption">
            Centang kalau klien minta tidak menerima WA dari klinik (mis.
            alasan privasi). Sistem akan skip semua reminder, konfirmasi
            booking, dan kiriman struk via WA — admin perlu hubungi manual
            lewat telpon/email.
          </span>
        </span>
      </label>
    </div>
  );
}
