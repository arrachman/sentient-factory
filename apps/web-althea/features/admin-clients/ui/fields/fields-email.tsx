'use client';

import { type CreateClientInput } from '../../model/types';

export function EmailRow({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Email</label>
      <input
        type="email"
        value={form.email ?? ''}
        onChange={(e) => onChange({ ...form, email: e.target.value })}
        className="input-althea"
      />
    </div>
  );
}
