'use client';

import { Icon, type IconName } from '@/components/ui/icons';

interface QuickActionProps {
  icon: IconName;
  label: string;
  hint: string;
  onClick: () => void;
}

/** Dashboard quick-action button — ported from prototype `QuickAction`. */
export function QuickAction({ icon, label, hint, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 10px',
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        color: 'var(--fg)',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
        fontSize: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--panel-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--panel)';
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: 22,
          height: 22,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--primary-soft)',
          color: 'var(--primary-soft-fg)',
          borderRadius: 4,
        }}
      >
        <Icon name={icon} size={12} />
      </span>
      <span style={{ flex: 1, fontSize: 11.5 }}>{label}</span>
      <span
        style={{
          fontFamily: 'Geist Mono, monospace',
          color: 'var(--fg-subtle)',
          fontSize: 10.5,
        }}
      >
        {hint}
      </span>
    </button>
  );
}
