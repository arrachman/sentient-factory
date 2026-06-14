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
        background: u.avatarUrl ? 'transparent' : color,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize: size <= 32 ? 11 : 13,
        fontWeight: 700,
        flexShrink: 0,
        overflow: 'hidden',
      }}
      aria-hidden
    >
      {u.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={u.avatarUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        userInitial(u)
      )}
    </span>
  );
}
