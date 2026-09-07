import type { ReactNode } from 'react';

export type BadgeStatus = 'ok' | 'pending' | 'error';

const STATUS_COLOR: Record<BadgeStatus, { bg: string; fg: string }> = {
  ok: { bg: '#e4f1e9', fg: '#1f5c3f' },
  pending: { bg: '#fdf1dc', fg: '#8a5a12' },
  error: { bg: '#fbe4e4', fg: '#8c2626' },
};

export type BadgeProps = {
  children: ReactNode;
  status?: BadgeStatus;
};

export function Badge({ children, status = 'ok' }: BadgeProps) {
  const { bg, fg } = STATUS_COLOR[status];
  return (
    <span
      style={{
        background: bg,
        color: fg,
        borderRadius: 999,
        padding: '0.15rem 0.6rem',
        fontSize: '0.72rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
