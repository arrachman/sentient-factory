'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const QMS_TABS: readonly { href: string; label: string }[] = [
  { href: '/app/quality', label: 'Inspection Plans' },
  { href: '/app/quality/characteristics', label: 'Characteristics' },
  { href: '/app/quality/inspections', label: 'Inspections' },
  { href: '/app/quality/results', label: 'Results' },
  { href: '/app/quality/nonconformances', label: 'NCR' },
  { href: '/app/quality/capa-actions', label: 'CAPA' },
];

/** Horizontal sub-navigation for the QMS (quality) module. */
export function QmsNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-1 border-b border-border">
      {QMS_TABS.map((t) => {
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
