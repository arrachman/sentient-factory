import { Plus } from 'lucide-react';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { MicroSelect } from '../../shared/micro-select';
import { Toggle } from '../../shared/toggle';

export function PengirimanSection({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  return (
    <>
      <FieldRow
        label="Pengiriman & retry"
        hint="Bagaimana sistem menangani pengiriman & kegagalan"
      >
        <div className="flex flex-col gap-3" style={{ maxWidth: 580 }}>
          <DeliveryRow title="Pengirim WA" hint="Nomor terdaftar di WA Business API">
            <input
              className="input-althea"
              value={form.waSenderNumber ?? ''}
              onChange={(e) => set('waSenderNumber', e.target.value)}
              placeholder="+6282211008899"
              style={{ width: 200, height: 32, fontSize: 12 }}
            />
          </DeliveryRow>
          <DeliveryRow
            title="Jumlah retry otomatis"
            hint="Coba kirim ulang kalau gagal"
          >
            <MicroSelect
              value={String(form.waRetryCount ?? 3)}
              options={[
                ['0', 'Tidak retry'],
                ['1', '1 kali'],
                ['3', '3 kali'],
                ['5', '5 kali'],
              ]}
              onChange={(v) => set('waRetryCount', Number(v))}
            />
          </DeliveryRow>
          <DeliveryRow
            title="Jeda antar retry"
            hint="Tunggu sekian lama sebelum coba lagi"
          >
            <MicroSelect
              value={String(form.waRetryDelayMinutes ?? 5)}
              options={[
                ['1', '1 menit'],
                ['5', '5 menit'],
                ['15', '15 menit'],
                ['60', '1 jam'],
              ]}
              onChange={(v) => set('waRetryDelayMinutes', Number(v))}
            />
          </DeliveryRow>
          <DeliveryRow
            title="Jam pengiriman"
            hint="Di luar jam ini, pesan masuk antrian sampai pagi"
          >
            <div className="flex items-center gap-2">
              <input
                className="input-althea"
                value={form.waSendWindowStart ?? '07:00'}
                onChange={(e) => set('waSendWindowStart', e.target.value)}
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
              <span className="caption">sampai</span>
              <input
                className="input-althea"
                value={form.waSendWindowEnd ?? '21:00'}
                onChange={(e) => set('waSendWindowEnd', e.target.value)}
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
            </div>
          </DeliveryRow>
          <DeliveryRow
            title="Notif gagal kirim ke admin"
            hint="Email harian rangkuman pesan yang gagal terkirim"
          >
            <Toggle
              on={form.notifFailedSendEmail ?? true}
              label={form.notifFailedSendEmail !== false ? 'Aktif' : 'Nonaktif'}
              onChange={(v) => set('notifFailedSendEmail', v)}
            />
          </DeliveryRow>
        </div>
      </FieldRow>

      <FieldRow label="Email" hint="Untuk invoice & rekap mingguan">
        <div className="flex flex-col gap-3">
          <Toggle
            on={form.emailInvoiceAfterPayment ?? true}
            label="Kirim invoice PDF setelah pembayaran"
            onChange={(v) => set('emailInvoiceAfterPayment', v)}
          />
          <Toggle
            on={form.emailWeeklyRecap ?? true}
            label="Rekap mingguan ke admin (Senin pagi)"
            onChange={(v) => set('emailWeeklyRecap', v)}
          />
          <Toggle
            on={form.emailMonthlyPsikolog ?? false}
            label="Rekap bulanan ke psikolog"
            onChange={(v) => set('emailMonthlyPsikolog', v)}
          />
        </div>
      </FieldRow>

      <FieldRow label="Telegram bot" hint="Notifikasi internal untuk admin">
        <button type="button" className="btn btn-outline btn-sm">
          <Plus size={13} /> Sambungkan Telegram
        </button>
      </FieldRow>

      <FieldRow
        label="Default Country Code"
        hint="Prefix nomor WA untuk normalisasi"
      >
        <input
          className="input-althea"
          value={form.waCountryCode ?? '+62'}
          onChange={(e) => set('waCountryCode', e.target.value)}
          style={{ maxWidth: 120, height: 36, fontSize: 13 }}
        />
      </FieldRow>
    </>
  );
}

function DeliveryRow({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
          {title}
        </span>
        <span className="caption" style={{ marginTop: 2 }}>
          {hint}
        </span>
      </div>
      {children}
    </div>
  );
}
