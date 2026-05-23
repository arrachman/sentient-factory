import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { Toggle } from '../../shared/toggle';
import { useWaDeviceStatus } from '../../../hooks/use-wa-device-status';

/**
 * Bagian "Koneksi WhatsApp" + master toggle "Aktifkan kirim WA".
 * Status device di-fetch real-time dari Fonnte via GET /clinic/settings/wa-status.
 */
export function WaConnectionSection({
  form,
  set,
  showNotifWaLink = true,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) => void;
  showNotifWaLink?: boolean;
}) {
  const { data: deviceStatus, isLoading, refetch } = useWaDeviceStatus();

  const displayNumber =
    form.waSenderNumber && form.waSenderNumber.trim() !== ''
      ? form.waSenderNumber
      : deviceStatus?.devicePhone
        ? `+${deviceStatus.devicePhone}`
        : `${form.waCountryCode ?? '+62'} 822 1100 8899`;

  const isConnected = deviceStatus?.connected ?? false;
  const showConnected = form.waSendEnabled && isConnected;

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
              background: showConnected ? 'var(--success-soft)' : 'var(--cream-100, #f3f0e8)',
              border: showConnected ? '1px solid #c8e0ce' : '1px solid var(--sage-200)',
              borderRadius: 8,
            }}
          >
            {isLoading ? (
              <RefreshCw
                className="w-3.5 h-3.5 animate-spin shrink-0"
                style={{ color: 'var(--sage-400)' }}
              />
            ) : (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: showConnected ? 'var(--success)' : 'var(--sage-400, #8aaa91)',
                  boxShadow: showConnected ? '0 0 0 4px rgba(79,140,91,0.18)' : 'none',
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: showConnected ? 'var(--success)' : 'var(--teal-500, #3a6b6b)',
                flex: 1,
              }}
            >
              {isLoading
                ? 'Mengecek status...'
                : showConnected
                  ? 'Tersambung'
                  : form.waSendEnabled && !isConnected
                    ? 'Aktif · Perangkat terputus'
                    : 'Tidak aktif'}{' '}
              · WA Business {displayNumber}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {deviceStatus && (
                <span
                  className={showConnected ? 'badge badge-success' : 'badge badge-neutral'}
                >
                  {showConnected ? 'terverifikasi' : 'tidak terhubung'}
                </span>
              )}
              <button
                type="button"
                onClick={() => refetch()}
                title="Refresh status"
                style={{ padding: 4, borderRadius: 4, color: 'var(--sage-500)' }}
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {deviceStatus?.quota !== undefined && (
            <span className="caption" style={{ fontSize: 11, color: 'var(--teal-500)' }}>
              Kuota Fonnte: {deviceStatus.quota} pesan tersisa
              {deviceStatus.expired ? ` · Aktif hingga ${deviceStatus.expired}` : ''}
            </span>
          )}

          {showNotifWaLink && (
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
          )}
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
