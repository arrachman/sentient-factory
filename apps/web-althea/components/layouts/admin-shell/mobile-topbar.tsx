'use client';

import { Bell } from 'lucide-react';

/**
 * Top bar mobile — mirror prototype "Mobile · Admin Klinik":
 * avatar + nama/role di kiri, judul halaman, bell di kanan.
 * Avatar di-tap untuk membuka menu (sidebar drawer).
 */
export function MobileTopbar({
  roleShort,
  userName,
  initial,
  pageTitle,
  onOpenMenu,
}: {
  roleShort: string;
  userName: string;
  initial: string;
  pageTitle: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex items-center gap-2.5 text-left"
        aria-label="Buka menu"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: 'var(--sage-100, #dde9d8)', color: 'var(--sage-700, #3a5b3f)' }}
        >
          {initial}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-teal-800">{userName}</span>
          <span className="caption text-[11px]">{roleShort}</span>
        </span>
      </button>

      {pageTitle && (
        <span className="brand-mark mx-auto text-base text-teal-800">
          {pageTitle}
        </span>
      )}

      <button
        type="button"
        className="btn btn-ghost btn-icon btn-sm ml-auto"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
