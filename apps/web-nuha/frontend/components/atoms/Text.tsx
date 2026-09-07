import type { CSSProperties, ReactNode } from 'react';

type TextTone = 'default' | 'muted' | 'accent';
type TextVariant = 'title' | 'heading' | 'body' | 'label';

const VARIANT_STYLE: Record<TextVariant, CSSProperties> = {
  title: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
  heading: { fontSize: '1.125rem', fontWeight: 600 },
  body: { fontSize: '0.95rem', fontWeight: 400 },
  label: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
};

const TONE_COLOR: Record<TextTone, string> = {
  default: 'var(--nuha-ink)',
  muted: 'var(--nuha-muted)',
  accent: 'var(--nuha-accent)',
};

export type TextProps = {
  children: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
};

export function Text({ children, variant = 'body', tone = 'default', as: Tag = 'p' }: TextProps) {
  return <Tag style={{ ...VARIANT_STYLE[variant], color: TONE_COLOR[tone], margin: 0 }}>{children}</Tag>;
}
