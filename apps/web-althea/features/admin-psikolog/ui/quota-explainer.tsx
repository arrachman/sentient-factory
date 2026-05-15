import { Bell } from 'lucide-react';

/**
 * Banner BR-01 — kuota harian psikolog auto-unblock saat reschedule/cancel.
 */
export function QuotaExplainer() {
  return (
    <div style={{ padding: '0 28px 12px' }}>
      <div
        className="flex items-start gap-2 card-althea-flat"
        style={{
          padding: 12,
          background: 'var(--info-soft, #e6f0f7)',
          borderColor: '#cfdde8',
        }}
      >
        <Bell
          size={14}
          style={{
            color: 'var(--info, #4a90c0)',
            flexShrink: 0,
            marginTop: 2,
          }}
        />
        <div className="flex flex-col">
          <span
            className="caption"
            style={{ fontWeight: 600, color: '#2c4a60' }}
          >
            Kuota harian psikolog
          </span>
          <span
            className="caption"
            style={{
              fontSize: 11.5,
              color: '#2c4a60',
              lineHeight: 1.5,
              marginTop: 2,
            }}
          >
            Tiap psikolog default maksimal{' '}
            <strong>4 klien per hari</strong>. Begitu sesi{' '}
            <em>reschedule</em> atau <em>dibatalkan</em>, kuota terbuka
            otomatis — admin bisa langsung menambah klien lain ke psikolog
            tersebut tanpa unblock manual.
          </span>
        </div>
      </div>
    </div>
  );
}
