'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  UserSquare,
  DoorOpen,
  MessageSquare,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

type Tab = { href: string; label: string; icon: LucideIcon };

/**
 * Bottom tab bar mobile-only (lg:hidden) untuk role admin — mirror prototype
 * "Mobile · Admin Klinik" (Jadwal · Klien · Ruangan · WA · Lainnya).
 * Tab "Lainnya" membuka sidebar drawer (menu lengkap) via onOpenMore.
 */
const TABS: Tab[] = [
  { href: '/admin/jadwal', label: 'Jadwal', icon: CalendarDays },
  { href: '/admin/clients', label: 'Klien', icon: UserSquare },
  { href: '/admin/rooms', label: 'Ruangan', icon: DoorOpen },
  { href: '/admin/notif-wa', label: 'WA', icon: MessageSquare },
];

export function AdminBottomTabs({ onOpenMore }: { onOpenMore: () => void }) {
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
      <button
        type="button"
        onClick={onOpenMore}
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium"
        style={{ color: 'var(--muted-foreground, #6b7280)' }}
      >
        <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
        Lainnya
      </button>
    </nav>
  );
}
