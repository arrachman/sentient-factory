'use client';

import { Bell } from 'lucide-react';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { useWaTemplateRecipients } from '../../../hooks/use-wa-template-recipients';
import { FieldRow } from '../../shared/field-row';
import { NotifEventRow } from '../../shared/notif-event-row';

/**
 * Pengaturan WA — section "Perubahan jadwal sesi" + "Onboarding & akun".
 *
 * Recipient toggles bind langsung ke ClinicWaTemplate.recipients via
 * useWaTemplateRecipients() (SSOT). Baris untuk event yang tidak punya
 * template di seed (Ubah Ruangan, Ubah Layanan, Invite Staff, plus 3 row
 * "Pembayaran" yang dulu locked) dihapus.
 */
export function PerubahanOnboardingSection({
  form: _form,
  set: _set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  const { hasRecipient, toggle, isLoading } = useWaTemplateRecipients();

  return (
    <>
      <FieldRow
        label="Perubahan jadwal sesi"
        hint="Dipicu manual saat admin ubah jadwal. Default: kirim ke klien & psikolog."
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Ubah jadwal sesi (reschedule)"
            hint="Kirim pesan jadwal baru ke kedua pihak."
            templates={[
              { id: 't-resched-k', label: 'klien' },
              { id: 't-resched-p', label: 'psikolog' },
            ]}
            recipients={[
              {
                id: 'klien',
                label: 'WA klien',
                on: !isLoading && hasRecipient('Reschedule Booking', 'klien'),
                onChange: () => toggle('Reschedule Booking', 'klien'),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: !isLoading && hasRecipient('Reschedule Booking', 'psikolog'),
                onChange: () => toggle('Reschedule Booking', 'psikolog'),
              },
            ]}
          />
          <NotifEventRow
            title="Batalkan sesi"
            hint="Kirim alasan + slot kosong."
            danger
            templates={[
              { id: 't-cancel-k', label: 'klien' },
              { id: 't-cancel-p', label: 'psikolog' },
            ]}
            recipients={[
              {
                id: 'klien',
                label: 'WA klien',
                on: !isLoading && hasRecipient('Cancel Booking', 'klien'),
                onChange: () => toggle('Cancel Booking', 'klien'),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: !isLoading && hasRecipient('Cancel Booking', 'psikolog'),
                onChange: () => toggle('Cancel Booking', 'psikolog'),
              },
            ]}
          />
          <div
            className="flex gap-2"
            style={{
              padding: 10,
              background: 'var(--info-soft)',
              borderRadius: 6,
              alignItems: 'flex-start',
              marginTop: 4,
            }}
          >
            <Bell
              size={13}
              style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }}
            />
            <span
              className="caption"
              style={{ fontSize: 11.5, color: '#2c4a60', lineHeight: 1.5 }}
            >
              Mematikan WA ke psikolog tidak menonaktifkan notifikasi in-app —
              psikolog tetap melihat update di Dashboard mereka.
            </span>
          </div>
        </div>
      </FieldRow>

      <FieldRow
        label="Onboarding & akun"
        hint="Pesan WA terkait pendaftaran klien dan akun staff"
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Selamat datang klien baru"
            hint="Trigger: setelah klien disimpan pertama kali"
            templates={[{ id: 't-welcome' }]}
            recipients={[
              {
                id: 'klien',
                label: 'WA klien',
                on: !isLoading && hasRecipient('Welcome New Client', 'klien'),
                onChange: () => toggle('Welcome New Client', 'klien'),
              },
            ]}
          />
          <NotifEventRow
            title="Selamat datang psikolog baru"
            hint="Trigger: saat akun psikolog dibuat dan User.phone tersedia"
            templates={[{ id: 't-welcome-psikolog' }]}
            recipients={[
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: !isLoading && hasRecipient('Welcome Psikolog Baru', 'psikolog'),
                onChange: () => toggle('Welcome Psikolog Baru', 'psikolog'),
              },
            ]}
          />
          <NotifEventRow
            title="OTP login (lupa password)"
            hint="Kode 6 digit untuk reset kata sandi (mobile flow)"
            templates={[{ id: 't-otp' }]}
            recipients={[
              {
                id: 'user',
                label: 'WA user',
                on: !isLoading && hasRecipient('OTP Login', 'user'),
                onChange: () => toggle('OTP Login', 'user'),
              },
            ]}
          />
        </div>
      </FieldRow>
    </>
  );
}
