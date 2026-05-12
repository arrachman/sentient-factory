import { psikologInitial } from '../model/page-helpers';
import type { Psikolog } from '../model/types';

/**
 * Avatar circle untuk psikolog — pakai psikolog.color kalau ada, fallback sage.
 */
export function PsikologAvatar({
  p,
  size = 44,
  fontSize = 14,
}: {
  p: Psikolog;
  size?: number;
  fontSize?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: p.color ?? 'var(--sage-500)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {psikologInitial(p)}
    </span>
  );
}
