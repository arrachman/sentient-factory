'use client';

import { Check, X } from 'lucide-react';
import { PengingatSection } from '@/features/admin-pengaturan/ui/tabs/notifikasi/pengingat-section';
import { PerubahanOnboardingSection } from '@/features/admin-pengaturan/ui/tabs/notifikasi/perubahan-onboarding-section';
import { WaConnectionSection } from '@/features/admin-pengaturan/ui/tabs/notifikasi/wa-connection-section';
import { useWaSettingsForm } from '../hooks/use-wa-settings-form';

export function WaSettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { form, set, save, reset, isSubmitting, isLoading, lastSaved } =
    useWaSettingsForm();

  if (!open) return null;

  function handleSave() {
    save();
    onClose();
  }

  function handleCancel() {
    reset();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Pengaturan Notifikasi WA"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="relative flex flex-col bg-[var(--cream-50)] shadow-xl"
        style={{ width: '100%', maxWidth: 680, height: '100%', zIndex: 1 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--sage-100)',
            background: '#fff',
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal-800)' }}
            >
              Pengaturan Notifikasi WA
            </span>
            <span className="caption" style={{ fontSize: 11 }}>
              Terakhir disimpan:{' '}
              <strong style={{ color: 'var(--teal-700)' }}>{lastSaved}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="btn btn-ghost btn-sm"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              <Check size={14} style={{ stroke: '#fff' }} />
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 8px' }}
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '6px 22px 32px' }}>
          {isLoading ? (
            <div className="caption" style={{ padding: '24px 0' }}>
              Memuat pengaturan...
            </div>
          ) : (
            <div className="card-althea" style={{ padding: '6px 22px 22px', marginTop: 16 }}>
              <WaConnectionSection form={form} set={set} showNotifWaLink={false} />
              <PengingatSection form={form} set={set} />
              <PerubahanOnboardingSection form={form} set={set} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
