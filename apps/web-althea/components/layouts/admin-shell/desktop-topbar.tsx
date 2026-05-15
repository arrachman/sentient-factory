'use client';

import { Bell, Search } from 'lucide-react';

/**
 * Top header desktop — breadcrumb + page title + search + bell + avatar mini.
 */
export function DesktopTopbar({
  meta,
  searchPlaceholder,
  initial,
  userName,
  avatarUrl,
  avatarColor,
}: {
  meta: { category: string; label: string; title: string } | null;
  searchPlaceholder: string;
  initial: string;
  userName: string;
  avatarUrl?: string | null;
  avatarColor?: string | null;
}) {
  return (
    <header
      className="hidden lg:flex sticky top-0 z-20 items-center justify-between border-b border-border bg-card"
      style={{ height: 64, padding: '0 28px' }}
    >
      <div className="flex flex-col leading-tight">
        {meta ? (
          <span className="caption" style={{ fontSize: 12 }}>
            {meta.category} · {meta.label}
          </span>
        ) : null}
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--teal-800)',
            letterSpacing: '-0.01em',
          }}
        >
          {meta?.title ?? 'Althea Psychology'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div style={{ position: 'relative', width: 240 }}>
          <span style={{ position: 'absolute', left: 11, top: 10 }}>
            <Search size={15} style={{ color: 'var(--fg-muted)' }} />
          </span>
          <input
            className="input-althea"
            placeholder={searchPlaceholder}
            style={{ paddingLeft: 34, height: 36, fontSize: 13 }}
            aria-label="Cari"
          />
        </div>
        <button
          type="button"
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Notifikasi"
          title="Notifikasi"
        >
          <Bell size={17} />
        </button>
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
          title={userName}
          aria-label={`Akun: ${userName}`}
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
      </div>
    </header>
  );
}
