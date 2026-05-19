import { Bell } from 'lucide-react';

/**
 * Privacy reminder block di footer aside.
 */
export function PrivacyReminder() {
  return (
    <div
      className="flex items-start gap-2"
      style={{
        marginTop: 12,
        padding: 10,
        background: 'var(--info-soft, #e6f0f7)',
        borderRadius: 6,
      }}
    >
      <Bell
        size={12}
        style={{
          color: 'var(--info, #4a90c0)',
          flexShrink: 0,
          marginTop: 2,
        }}
      />
      <span
        style={{ fontSize: 11, color: '#2c4a60', lineHeight: 1.45 }}
      >
        Data klien ini hanya dapat diakses oleh Anda sebagai psikolog
        penanggung.
      </span>
    </div>
  );
}
