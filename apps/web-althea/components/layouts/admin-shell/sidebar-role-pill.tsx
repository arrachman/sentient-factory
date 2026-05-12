import type { RolePillStyle } from './nav-config';

/**
 * Pill role di bawah brand mark — "ADMIN · KLINIK", "STAFF PSIKOLOG", dll.
 * Color tint sage untuk admin/owner, cream untuk role lain.
 */
export function SidebarRolePill({ pill }: { pill: RolePillStyle }) {
  return (
    <div className="px-3 pt-3">
      <div
        className="flex items-center gap-2"
        style={{
          padding: '8px 12px',
          border: `1px solid ${pill.border}`,
          borderRadius: 8,
          background: pill.bg,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: pill.dot,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--teal-800)',
          }}
        >
          {pill.full}
        </span>
      </div>
    </div>
  );
}
