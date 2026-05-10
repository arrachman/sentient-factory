import Link from 'next/link';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { Toggle } from '../../shared/toggle';

/**
 * Bagian "Koneksi WhatsApp" + master toggle "Aktifkan kirim WA".
 * Status connection ditampilkan sebagai kartu hijau (jika `waSendEnabled`).
 */
export function WaConnectionSection({
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
        label="Koneksi WhatsApp"
        hint="API resmi — semua notif kirim dari nomor ini"
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <div
            className="flex items-center gap-2"
            style={{
              padding: '10px 14px',
              background: 'var(--success-soft)',
              border: '1px solid #c8e0ce',
              borderRadius: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: 'var(--success)',
                boxShadow: '0 0 0 4px rgba(79,140,91,0.18)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--success)',
                flex: 1,
              }}
            >
              {form.waSendEnabled ? 'Tersambung' : 'Tidak aktif'} · WA Business{' '}
              {form.waCountryCode ?? '+62'} 822 1100 8899
            </span>
            <span className="badge badge-success">terverifikasi</span>
          </div>
          <Link
            href="/admin/notif-wa"
            className="caption"
            style={{
              color: 'var(--sage-700)',
              cursor: 'pointer',
              fontSize: 11.5,
            }}
          >
            Buka halaman Notifikasi WA · Log & template untuk edit isi pesan →
          </Link>
        </div>
      </FieldRow>

      <FieldRow
        label="Aktifkan kirim WA"
        hint="Master toggle. Kalau off, semua dispatch di-skip dan ditandai gagal."
      >
        <Toggle
          on={form.waSendEnabled ?? false}
          label={form.waSendEnabled ? 'Aktif' : 'Nonaktif'}
          onChange={(v) => set('waSendEnabled', v)}
        />
      </FieldRow>
    </>
  );
}
