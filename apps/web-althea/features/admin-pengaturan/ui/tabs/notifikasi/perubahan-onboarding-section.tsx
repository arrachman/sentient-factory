import { Bell } from 'lucide-react';
import { FieldRow } from '../../shared/field-row';
import { NotifEventRow } from '../../shared/notif-event-row';

/**
 * Bagian "Perubahan jadwal sesi" + "Onboarding & akun" + "Pembayaran".
 * Disatukan karena semuanya pure NotifEventRow tanpa state khusus.
 */
export function PerubahanOnboardingSection() {
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
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
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
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
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
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Ubah layanan klien (silent edit)"
            hint="Default: tidak kirim WA — admin tidak perlu kontak psikolog manual."
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
              { id: 'psikolog', label: 'WA psikolog', on: false },
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
              style={{
                color: 'var(--info)',
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <span
              className="caption"
              style={{
                fontSize: 11.5,
                color: '#2c4a60',
                lineHeight: 1.5,
              }}
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
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Invite user baru (admin / psikolog / staff)"
            hint="Link aktivasi akun + kata sandi awal"
            templates={[{ id: 't-invite' }]}
            recipients={[{ id: 'staff', label: 'WA staff', on: true }]}
          />
          <NotifEventRow
            title="OTP login (lupa password)"
            hint="Kode 6 digit untuk reset kata sandi (mobile flow)"
            templates={[{ id: 't-otp' }]}
            recipients={[{ id: 'user', label: 'WA user', on: true }]}
          />
        </div>
      </FieldRow>

      <FieldRow
        label="Pembayaran"
        hint="Notifikasi WA terkait DP, pelunasan, dan bukti pembayaran"
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Tagihan DP setelah booking"
            hint="Kirim instruksi pembayaran DP ke klien"
            templates={[{ id: 't-dp' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Bukti pembayaran (PDF) setelah pelunasan"
            hint="Lampirkan invoice PDF di pesan WA"
            badge="add-on"
            templates={[{ id: 't-bukti-bayar' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
          />
          <NotifEventRow
            title="Pengingat pelunasan"
            hint="Kalau klien belum lunas H-1 sebelum sesi"
            templates={[{ id: 't-pelunasan' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
        </div>
      </FieldRow>
    </>
  );
}
