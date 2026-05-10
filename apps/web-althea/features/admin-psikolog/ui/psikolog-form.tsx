'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import {
  COLOR_PALETTE,
  DAY_KEYS,
  DAY_LABEL,
  SPECIALTY_LABEL,
  SPECIALTY_OPTIONS,
  createPsikologSchema,
  type CreatePsikologInput,
  type DayAvailability,
  type DayKey,
  type Psikolog,
} from '../model/types';

type Props = {
  open: boolean;
  initial: Psikolog | null;
  submitting: boolean;
  onSubmit: (input: CreatePsikologInput) => void;
  onClose: () => void;
};

/** Default seed weekly availability: Sen-Jum buka, Sab+Min tutup. */
const DEFAULT_WEEKLY: Record<DayKey, DayAvailability> = {
  monday: { isOpen: true },
  tuesday: { isOpen: true },
  wednesday: { isOpen: true },
  thursday: { isOpen: true },
  friday: { isOpen: true },
  saturday: { isOpen: false },
  sunday: { isOpen: false },
};

const EMPTY_FORM: CreatePsikologInput = {
  email: '',
  fullName: '',
  username: '',
  password: '',
  title: '',
  specialty: [],
  color: '',
  license: '',
  defaultSlots: 4,
  weeklyAvailability: DEFAULT_WEEKLY,
  bio: '',
  isActive: true,
};

export function PsikologForm({ open, initial, submitting, onSubmit, onClose }: Props) {
  const isEdit = initial !== null;
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePsikologInput>({
    resolver: zodResolver(createPsikologSchema),
    defaultValues: EMPTY_FORM,
  });

  // Hydrate form ketika initial berubah (open edit dialog)
  useEffect(() => {
    if (initial) {
      // Kalau psikolog existing belum punya weeklyAvailability (legacy / new),
      // seed dengan default Sen-Jum buka supaya admin bisa langsung edit.
      const existingWA =
        initial.weeklyAvailability && Object.keys(initial.weeklyAvailability).length > 0
          ? initial.weeklyAvailability
          : DEFAULT_WEEKLY;
      reset({
        email: initial.email,
        fullName: initial.fullName ?? '',
        username: initial.username,
        password: '',
        title: initial.title ?? '',
        specialty: initial.specialty,
        color: initial.color ?? '',
        license: initial.license ?? '',
        defaultSlots: initial.defaultSlots,
        weeklyAvailability: existingWA as Record<DayKey, DayAvailability>,
        bio: initial.bio ?? '',
        isActive: initial.isActive,
      });
    } else {
      reset(EMPTY_FORM);
    }
  }, [initial, reset]);

  const selectedSpecialty = watch('specialty') ?? [];
  const selectedColor = watch('color') ?? '';

  if (!open) return null;

  function toggleSpecialty(s: string) {
    if (selectedSpecialty.includes(s)) {
      setValue(
        'specialty',
        selectedSpecialty.filter((x) => x !== s),
      );
    } else {
      setValue('specialty', [...selectedSpecialty, s]);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="h2">{isEdit ? 'Edit Psikolog' : 'Tambah Psikolog'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="caption mb-1 block">Email *</label>
              <input
                type="email"
                {...register('email')}
                disabled={isEdit}
                className="input-althea"
                placeholder="psikolog@althea.local"
              />
              {errors.email && (
                <p className="caption mt-1 text-danger">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="caption mb-1 block">Nama Lengkap *</label>
              <input {...register('fullName')} className="input-althea" />
              {errors.fullName && (
                <p className="caption mt-1 text-danger">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="caption mb-1 block">Username (opsional)</label>
                <input
                  {...register('username')}
                  className="input-althea"
                  placeholder="auto dari nama"
                />
              </div>
              <div>
                <label className="caption mb-1 block">Password *</label>
                <input
                  type="password"
                  {...register('password')}
                  className="input-althea"
                  placeholder="minimal 8 karakter"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="caption mt-1 text-danger">{errors.password.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="caption mb-1 block">Title</label>
              <input
                {...register('title')}
                className="input-althea"
                placeholder="M.Psi"
              />
            </div>
            <div>
              <label className="caption mb-1 block">License (SIPP)</label>
              <input
                {...register('license')}
                className="input-althea"
                placeholder="SIPP-12345"
              />
            </div>
          </div>

          <div>
            <label className="caption mb-1 block">Spesialisasi</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((s) => {
                const active = selectedSpecialty.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecialty(s)}
                    className={`badge cursor-pointer transition ${
                      active ? 'badge-sage' : 'badge-neutral'
                    }`}
                  >
                    {SPECIALTY_LABEL[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="caption mb-1 block">Warna Avatar</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c)}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    selectedColor === c ? 'border-teal-800 ring-2 ring-sage-300' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Warna ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="caption mb-1 block">Slot per hari (default)</label>
              <input
                type="number"
                min={0}
                max={20}
                {...register('defaultSlots', { valueAsNumber: true })}
                className="input-althea"
              />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Aktif</span>
                  </label>
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label className="caption">Jadwal Mingguan *</label>
              <span className="caption text-fg-muted">Wajib diisi supaya psikolog bisa di-booking</span>
            </div>
            <Controller
              name="weeklyAvailability"
              control={control}
              render={({ field }) => {
                const wa = (field.value ?? {}) as Record<DayKey, DayAvailability>;
                const allEmpty = Object.keys(wa).length === 0;
                return (
                  <div className="rounded-md border border-border bg-cream-50 p-3 flex flex-col gap-1.5">
                    {allEmpty && (
                      <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mb-1">
                        ⚠ Psikolog ini belum punya jadwal — admin tidak akan bisa booking sampai
                        diisi minimal 1 hari kerja.
                      </div>
                    )}
                    {DAY_KEYS.map((day) => {
                      const dayCfg: DayAvailability = wa[day] ?? { isOpen: false };
                      return (
                        <label
                          key={day}
                          className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-card cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={dayCfg.isOpen}
                            onChange={(e) =>
                              field.onChange({
                                ...wa,
                                [day]: { ...dayCfg, isOpen: e.target.checked },
                              })
                            }
                            className="h-4 w-4"
                          />
                          <span
                            className={`text-sm font-medium w-20 ${
                              dayCfg.isOpen ? 'text-teal-800' : 'text-fg-muted'
                            }`}
                          >
                            {DAY_LABEL[day]}
                          </span>
                          <span className="caption">
                            {dayCfg.isOpen ? 'praktik' : 'libur'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                );
              }}
            />
            <p className="caption mt-1.5 text-fg-muted">
              💡 Tahap selanjutnya nanti bisa filter slot per hari (mis. Sabtu hanya ambil slot
              Pagi). Untuk MVP, centang hari kerja saja.
            </p>
          </div>

          <div>
            <label className="caption mb-1 block">Bio</label>
            <textarea
              {...register('bio')}
              rows={3}
              className="input-althea h-auto py-2"
              placeholder="Lulusan ..., fokus pada ..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Batal
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah Psikolog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
