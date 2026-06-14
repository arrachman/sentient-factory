'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarDays,
  UserSquare,
  User,
  type LucideIcon,
} from 'lucide-react';

type Tab = { href: string; label: string; icon: LucideIcon };

/**
 * Bottom tab bar mobile-only (lg:hidden) untuk role psikolog — mirror
 * prototype "Mobile · Staff Psikolog" (Hari ini · Jadwal · Klien · Saya).
 */
const TABS: Tab[] = [
  { href: '/psikolog/dashboard', label: 'Hari ini', icon: Home },
  { href: '/psikolog/schedule', label: 'Jadwal', icon: CalendarDays },
  { href: '/psikolog/patients', label: 'Klien', icon: UserSquare },
  { href: '/psikolog/profile', label: 'Saya', icon: User },
];

export function PsikologBottomTabs() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-border bg-card lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigasi utama"
    >
      {TABS.map((t) => {
        const active = isActive(t.href);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium"
            style={{ color: active ? 'var(--sage-600, #4a7355)' : 'var(--muted-foreground, #6b7280)' }}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
