'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MES_TABS: readonly { href: string; label: string }[] = [
  { href: '/app/mes', label: 'Production Orders' },
  { href: '/app/mes/operations', label: 'Operations' },
  { href: '/app/mes/logs', label: 'Production Logs' },
  { href: '/app/mes/consumptions', label: 'Material' },
  { href: '/app/mes/downtime', label: 'Downtime' },
  { href: '/app/mes/labor', label: 'Labor' },
];

/** Horizontal sub-navigation for the MES execution module. */
export function MesNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-1 border-b border-border">
      {MES_TABS.map((t) => {
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
