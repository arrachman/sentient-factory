import { Plus } from 'lucide-react';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { MicroSelect } from '../../shared/micro-select';
import { Toggle } from '../../shared/toggle';

/**
 * Bagian "Pengiriman & retry" + "Email" + "Telegram" + "Default Country Code".
 * Konfigurasi delivery — bukan event, jadi bukan NotifEventRow.
 */
export function PengirimanSection({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) => void;
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
              defaultValue="+62 822 1100 8899"
              style={{ width: 200, height: 32, fontSize: 12 }}
            />
            <span className="badge badge-success">terverifikasi</span>
          </DeliveryRow>
          <DeliveryRow
            title="Jumlah retry otomatis"
            hint="Coba kirim ulang kalau gagal"
          >
            <MicroSelect
              defaultValue="3"
              options={[
                ['0', 'Tidak retry'],
                ['1', '1 kali'],
                ['3', '3 kali'],
                ['5', '5 kali'],
              ]}
            />
          </DeliveryRow>
          <DeliveryRow
            title="Jeda antar retry"
            hint="Tunggu sekian lama sebelum coba lagi"
          >
            <MicroSelect
              defaultValue="5"
              options={[
                ['1', '1 menit'],
                ['5', '5 menit'],
                ['15', '15 menit'],
                ['60', '1 jam'],
              ]}
            />
          </DeliveryRow>
          <DeliveryRow
            title="Jam pengiriman"
            hint="Di luar jam ini, pesan masuk antrian sampai pagi"
          >
            <div className="flex items-center gap-2">
              <input
                className="input-althea"
                defaultValue="07:00"
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
                defaultValue="21:00"
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
            <Toggle on label="Aktif" />
          </DeliveryRow>
        </div>
      </FieldRow>

      <FieldRow label="Email" hint="Untuk invoice & rekap mingguan">
        <div className="flex flex-col gap-3">
          <Toggle on label="Kirim invoice PDF setelah pembayaran" />
          <Toggle on label="Rekap mingguan ke admin (Senin pagi)" />
          <Toggle label="Rekap bulanan ke psikolog" />
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
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
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
