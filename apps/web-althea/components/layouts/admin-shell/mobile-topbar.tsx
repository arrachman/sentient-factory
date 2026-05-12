'use client';

import { Menu } from 'lucide-react';

/**
 * Top bar mobile — hamburger button (open menu) + brand + role badge.
 */
export function MobileTopbar({
  roleShort,
  onOpenMenu,
}: {
  roleShort: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="btn btn-ghost btn-icon"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="brand-mark text-lg text-teal-800">Althea</span>
      <span className="badge badge-sage ml-auto">{roleShort}</span>
    </header>
  );
}
