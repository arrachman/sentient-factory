import type { ReactNode } from 'react';

/**
 * Baris label-control 220 + 1fr — pola standar di semua tab pengaturan.
 * Label di kiri (judul + hint kecil), control di kanan (input/textarea/dll).
 */
export function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
        padding: '18px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'start',
      }}
    >
      <div className="flex flex-col">
        <span
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}
        >
          {label}
        </span>
        {hint ? (
          <span className="caption" style={{ marginTop: 4 }}>
            {hint}
          </span>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
