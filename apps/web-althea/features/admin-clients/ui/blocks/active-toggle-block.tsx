'use client';

import { type CreateClientInput } from '../../model/types';

export function ActiveToggleBlock({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  const active = form.isActive ?? true;
  return (
    <div className="rounded-md border border-border p-3 bg-cream-50">
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => onChange({ ...form, isActive: e.target.checked })}
          className="h-4 w-4 mt-0.5 flex-shrink-0"
        />
        <span className="flex flex-col gap-1">
          <span className="font-medium text-teal-800">Aktif</span>
          <span className="caption">
            Uncheck untuk menonaktifkan klien (mis. klien sudah selesai program / tidak
            bisa di-hard-delete karena ada histori booking). Klien nonaktif tidak muncul
            di pilihan booking baru, tapi histori sesi tetap tersimpan untuk audit.
          </span>
        </span>
      </label>
    </div>
  );
}
