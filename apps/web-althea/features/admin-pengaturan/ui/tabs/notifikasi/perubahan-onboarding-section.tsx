import { Bell, Lock } from 'lucide-react';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { NotifEventRow } from '../../shared/notif-event-row';

export function PerubahanOnboardingSection({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
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
                on: form.notifRescheduleKlien ?? true,
                onChange: (v) => set('notifRescheduleKlien', v),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: form.notifReschedulePsikolog ?? true,
                onChange: (v) => set('notifReschedulePsikolog', v),
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
                on: form.notifCancelKlien ?? true,
                onChange: (v) => set('notifCancelKlien', v),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: form.notifCancelPsikolog ?? true,
                onChange: (v) => set('notifCancelPsikolog', v),
              },
            ]}
          />
          <NotifEventRow
            title="Ubah ruangan saja (psikolog & jam tetap)"
            hint="Kirim pemberitahuan ruangan baru tanpa mengubah jadwal."
            templates={[
              { id: 't-ruangan-k', label: 'klien' },
              { id: 't-ruangan-p', label: 'psikolog' },
            ]}
            recipients={[
              {
                id: 'klien',
                label: 'WA klien',
                on: form.notifUbahRuanganKlien ?? true,
                onChange: (v) => set('notifUbahRuanganKlien', v),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: form.notifUbahRuanganPsikolog ?? true,
                onChange: (v) => set('notifUbahRuanganPsikolog', v),
              },
            ]}
          />
          <NotifEventRow
            title="Ubah layanan klien (silent edit)"
            hint="Default: tidak kirim WA — admin tidak perlu kontak psikolog manual."
            recipients={[
              {
                id: 'klien',
                label: 'WA klien',
                on: form.notifUbahLayananKlien ?? false,
                onChange: (v) => set('notifUbahLayananKlien', v),
              },
              {
                id: 'psikolog',
                label: 'WA psikolog',
                on: form.notifUbahLayananPsikolog ?? false,
                onChange: (v) => set('notifUbahLayananPsikolog', v),
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
                on: form.notifWelcomeKlien ?? true,
                onChange: (v) => set('notifWelcomeKlien', v),
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
                on: form.notifWelcomePsikolog ?? true,
                onChange: (v) => set('notifWelcomePsikolog', v),
              },
            ]}
          />
          <NotifEventRow
            title="Invite user baru (admin / psikolog / staff)"
            hint="Link aktivasi akun + kata sandi awal"
            templates={[{ id: 't-invite' }]}
            recipients={[
              {
                id: 'staff',
                label: 'WA staff',
                on: form.notifInviteStaff ?? true,
                onChange: (v) => set('notifInviteStaff', v),
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
                on: form.notifOtpUser ?? true,
                onChange: (v) => set('notifOtpUser', v),
              },
            ]}
          />
        </div>
      </FieldRow>

      <FieldRow
        label="Pembayaran"
        hint="Notifikasi WA terkait DP, pelunasan, dan bukti pembayaran"
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            locked
            title="Tagihan DP setelah booking"
            hint="Kirim instruksi pembayaran DP ke klien"
            templates={[{ id: 't-dp' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
            ]}
          />
          <NotifEventRow
            locked
            title="Bukti pembayaran (PDF) setelah pelunasan"
            hint="Lampirkan invoice PDF di pesan WA"
            templates={[{ id: 't-bukti-bayar' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
            ]}
          />
          <NotifEventRow
            locked
            title="Pengingat pelunasan"
            hint="Kalau klien belum lunas H-1 sebelum sesi"
            templates={[{ id: 't-pelunasan' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
            ]}
          />
          <div
            className="flex gap-2"
            style={{
              padding: 10,
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: 6,
              alignItems: 'flex-start',
              marginTop: 2,
            }}
          >
            <Lock
              size={13}
              style={{ color: '#92400e', flexShrink: 0, marginTop: 2 }}
            />
            <span
              className="caption"
              style={{ fontSize: 11.5, color: '#78350f', lineHeight: 1.5 }}
            >
              Notifikasi pembayaran hanya tersedia di{' '}
              <strong>Paket Full</strong> — memerlukan modul payment tracking.
              Pengaturan aktif/nonaktif dikelola di menu{' '}
              <strong>Notifikasi WA</strong>.
            </span>
          </div>
        </div>
      </FieldRow>
    </>
  );
}
