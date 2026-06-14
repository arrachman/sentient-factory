'use client';

import { type CreateClientInput } from '../../model/types';

export function FieldsTopRow({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="caption mb-1 block">Nama *</label>
        <input
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          required
          className="input-althea"
        />
      </div>
      <div>
        <label className="caption mb-1 block">WhatsApp *</label>
        <input
          value={form.phoneWa}
          onChange={(e) => onChange({ ...form, phoneWa: e.target.value })}
          required
          placeholder="+6281234567890"
          className="input-althea"
        />
      </div>
    </div>
  );
}
