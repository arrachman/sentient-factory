'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const WMS_TABS: readonly { href: string; label: string }[] = [
  { href: '/app/wms', label: 'Tasks' },
  { href: '/app/wms/picks', label: 'Picks' },
  { href: '/app/wms/movements', label: 'Movements' },
  { href: '/app/wms/handling-units', label: 'Handling Units' },
];

/** Horizontal sub-navigation for the WMS execution module. */
export function WmsNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-1 border-b border-border">
      {WMS_TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              '-mb-px border-b-2 px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
