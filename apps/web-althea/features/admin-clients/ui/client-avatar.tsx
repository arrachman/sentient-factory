'use client';

import type { ClientCategory } from '../model/types';

type Size = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<Size, { px: number; font: number }> = {
  sm: { px: 28, font: 11 },
  md: { px: 36, font: 13 },
  lg: { px: 48, font: 16 },
};

const CATEGORY_COLOR: Record<ClientCategory, { bg: string; fg: string }> = {
  dewasa:   { bg: '#dde9d8', fg: '#3a5b3f' }, // sage
  remaja:   { bg: '#d4e3ee', fg: '#2c4a60' }, // info
  anak:     { bg: '#f1cdb3', fg: '#8b3d2a' }, // rose
  pasangan: { bg: '#cfd9e0', fg: '#3d556d' }, // blue-grey
  keluarga: { bg: '#e6dfb8', fg: '#6b5320' }, // amber-soft
};

const DEFAULT_COLOR = { bg: '#dde9d8', fg: '#3a5b3f' };

function initials(name: string): string {
  const parts = name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ClientAvatar({
  name,
  category,
  size = 'md',
}: {
  name: string;
  category?: ClientCategory;
  size?: Size;
}) {
  const cfg = SIZE_PX[size];
  const color = (category && CATEGORY_COLOR[category]) || DEFAULT_COLOR;
  return (
    <div
      aria-hidden="true"
      style={{
        width: cfg.px,
        height: cfg.px,
        background: color.bg,
        color: color.fg,
        fontSize: cfg.font,
      }}
      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none"
    >
      {initials(name)}
    </div>
  );
}
