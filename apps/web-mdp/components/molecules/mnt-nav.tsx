'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MNT_TABS: readonly { href: string; label: string }[] = [
  { href: '/app/maintenance', label: 'Work Orders' },
  { href: '/app/maintenance/pm-schedules', label: 'PM Schedules' },
  { href: '/app/maintenance/spare-parts', label: 'Spare Parts' },
  { href: '/app/maintenance/failure-codes', label: 'Failure Codes' },
];

/** Horizontal sub-navigation for the CMMS (maintenance) module. */
export function MntNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-1 border-b border-border">
      {MNT_TABS.map((t) => {
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
