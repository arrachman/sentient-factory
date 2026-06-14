'use client';

/**
 * Modal form Tambah / Edit klien.
 *
 * Field grid 4-col untuk gender/umur/kategori/MRN. WA opt-out dipisah
 * jadi card warning di bawah dengan penjelasan side-effect.
 *
 * Field wajib (HTML `required`, backend DTO juga enforce): Nama, WhatsApp,
 * Gender, Umur, Layanan, MRN. Berlaku untuk create maupun edit — klien lama
 * yang field-nya kosong tidak akan bisa di-simpan ulang sampai 3 field ini
 * diisi.
 */
import { X } from 'lucide-react';
import { type Client, type CreateClientInput } from '../model/types';
import { FieldsTopRow } from './fields/fields-top-row';
import { FieldsDemographicsRow } from './fields/fields-demographics-row';
import { EmailRow } from './fields/fields-email';
import { ServicesMultiSelect } from './services/services-multi-select';
import { WaOptOutBlock } from './blocks/wa-opt-out-block';
import { ActiveToggleBlock } from './blocks/active-toggle-block';

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
          <EmailRow form={form} onChange={onChangeForm} />
          <ServicesMultiSelect form={form} onChange={onChangeForm} />
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
