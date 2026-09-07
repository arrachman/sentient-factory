import type { ReactNode } from 'react';

export type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--nuha-surface)',
        border: '1px solid var(--nuha-border)',
        borderRadius: 12,
        padding: '1rem 1.15rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
      }}
    >
      {children}
    </div>
  );
}
