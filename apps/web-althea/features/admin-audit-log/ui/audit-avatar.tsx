import { initials } from '../model/format';

/**
 * Avatar circle dengan inisial 1-2 huruf — ukuran sm/md/lg.
 * Background diberi color (warna role) dengan teks putih.
 */
export function AuditAvatar({
  name,
  color,
  size = 'sm',
}: {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim = size === 'lg' ? 44 : size === 'md' ? 36 : 28;
  const fs = size === 'lg' ? 14 : size === 'md' ? 13 : 12;
  return (
    <span
      className="avatar"
      style={{
        width: dim,
        height: dim,
        fontSize: fs,
        background: color,
        color: '#fff',
      }}
    >
      {initials(name)}
    </span>
  );
}
