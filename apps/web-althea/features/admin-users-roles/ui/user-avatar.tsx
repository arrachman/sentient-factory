import { userInitial } from '../model/format';
import type { ClinicUser } from '../model/types';

/**
 * Avatar circle dengan inisial — pakai role color sebagai background.
 */
export function UserAvatar({
  u,
  color,
  size = 36,
}: {
  u: ClinicUser;
  color: string;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize: size <= 32 ? 11 : 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {userInitial(u)}
    </span>
  );
}
