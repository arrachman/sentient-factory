'use client';

/**
 * Modal form Tambah / Edit klien.
 *
 * Field grid 4-col untuk gender/umur/kategori/MRN. WA opt-out dipisah
 * jadi card warning di bawah dengan penjelasan side-effect.
 */
import { X } from 'lucide-react';
import {
  CATEGORY_LABEL,
  CLIENT_CATEGORIES,
  GENDERS,
  GENDER_LABEL,
  type Client,
  type ClientCategory,
  type CreateClientInput,
} from '../model/types';

export function ClientFormDialog({
  editing,
  form,
  submitting,
  onClose,
  onChangeForm,
  onSubmit,
}: {
  editing: Client | null;
  form: CreateClientInput;
  submitting: boolean;
  onClose: () => void;
  onChangeForm: (next: CreateClientInput) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="h2">{editing ? 'Edit Klien' : 'Tambah Klien'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 px-6 py-4">
          <FieldsTopRow form={form} onChange={onChangeForm} />
          <FieldsDemographicsRow form={form} onChange={onChangeForm} />
          <FieldsContactRow form={form} onChange={onChangeForm} />
          <div>
            <label className="caption mb-1 block">Alamat</label>
            <input
              value={form.address ?? ''}
              onChange={(e) =>
                onChangeForm({ ...form, address: e.target.value })
              }
              className="input-althea"
            />
          </div>
          <div>
            <label className="caption mb-1 block">Catatan</label>
            <textarea
              value={form.notes ?? ''}
              onChange={(e) =>
                onChangeForm({ ...form, notes: e.target.value })
              }
              rows={2}
              className="input-althea h-auto py-2"
            />
          </div>
          <WaOptOutBlock form={form} onChange={onChangeForm} />
          <ActiveToggleBlock form={form} onChange={onChangeForm} />
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm"
            >
              {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================================
// Field rows
// =====================================================================

function FieldsTopRow({
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

function FieldsDemographicsRow({
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
        <label className="caption mb-1 block">Umur</label>
        <input
          type="number"
          min={0}
          max={120}
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
        <label className="caption mb-1 block">MRN</label>
        <input
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

function FieldsContactRow({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="caption mb-1 block">Email</label>
        <input
          type="email"
          value={form.email ?? ''}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
          className="input-althea"
        />
      </div>
      <div>
        <label className="caption mb-1 block">Layanan diminati</label>
        <input
          value={form.preferredServiceType ?? ''}
          onChange={(e) =>
            onChange({ ...form, preferredServiceType: e.target.value })
          }
          placeholder="konseling / terapi / tes"
          className="input-althea"
        />
      </div>
    </div>
  );
}

function ActiveToggleBlock({
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

function WaOptOutBlock({
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
