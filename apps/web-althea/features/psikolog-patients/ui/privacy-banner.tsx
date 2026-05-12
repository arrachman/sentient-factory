import { Eye } from 'lucide-react';

/**
 * Banner BR-04 di top halaman Klien saya — transparansi privasi.
 */
export function PrivacyBanner({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        padding: '8px 12px',
        background: 'var(--info-soft, #e6f0f7)',
        border: '1px solid #cfdde8',
        borderRadius: 8,
      }}
    >
      <Eye
        size={14}
        style={{ color: 'var(--info, #4a90c0)', flexShrink: 0 }}
      />
      <span style={{ fontSize: 12, color: '#2c4a60', lineHeight: 1.4 }}>
        Menampilkan <strong>hanya klien Anda</strong> ({count} klien). Data
        klien psikolog lain tidak bisa diakses sesuai kebijakan privasi
        (BR-04).
      </span>
    </div>
  );
}
