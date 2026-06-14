'use client';

import { LogOut } from 'lucide-react';

/**
 * Footer sidebar — avatar inisial + nama + role + tombol logout.
 * Logout butuh konfirmasi di dialog terpisah → on click cuma trigger setOpen.
 */
export function SidebarFooter({
  initial,
  userName,
  userRole,
  onRequestLogout,
  avatarUrl,
  avatarColor,
}: {
  initial: string;
  userName: string;
  userRole: string;
  onRequestLogout: () => void;
  avatarUrl?: string | null;
  avatarColor?: string | null;
}) {
  return (
    <div className="border-t border-border p-3">
      <div
        className="flex items-center gap-3"
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--cream-100)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: avatarUrl ? 'transparent' : (avatarColor ?? 'var(--cream-300)'),
            color: avatarColor ? '#fff' : 'var(--teal-800)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={userName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            initial
          )}
        </div>
        <div
          className="flex flex-col leading-tight"
          style={{ flex: 1, minWidth: 0 }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={userName}
          >
            {userName}
          </span>
          <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>
            {userRole}
          </span>
        </div>
        <button
          type="button"
          onClick={onRequestLogout}
          className="btn btn-ghost btn-icon btn-sm"
          aria-label="Logout"
          title="Logout"
          style={{ flexShrink: 0 }}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
