'use client';

import {
  CATEGORY_LABEL,
  CLIENT_CATEGORIES,
  GENDERS,
  GENDER_LABEL,
  type ClientCategory,
  type CreateClientInput,
} from '../../model/types';

export function FieldsDemographicsRow({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div>
        <label className="caption mb-1 block">Gender *</label>
        <select
          value={form.gender}
          onChange={(e) =>
            onChange({ ...form, gender: e.target.value as 'L' | 'P' })
          }
          className="input-althea"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {GENDER_LABEL[g]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="caption mb-1 block">Umur *</label>
        <input
          type="number"
          min={0}
          max={120}
          required
          value={form.age ?? ''}
          onChange={(e) =>
            onChange({
              ...form,
              age: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="input-althea"
        />
      </div>
      <div>
        <label className="caption mb-1 block">Kategori</label>
        <select
          value={form.category ?? ''}
          onChange={(e) =>
            onChange({
              ...form,
              category: (e.target.value || undefined) as
                | ClientCategory
                | undefined,
            })
          }
          className="input-althea"
        >
          <option value="">Auto (dari umur)</option>
          {CLIENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="caption mb-1 block">MRN *</label>
        <input
          required
          value={form.medicalRecordNumber ?? ''}
          onChange={(e) =>
            onChange({ ...form, medicalRecordNumber: e.target.value })
          }
          placeholder="MR-..."
          className="input-althea"
        />
      </div>
    </div>
  );
}
