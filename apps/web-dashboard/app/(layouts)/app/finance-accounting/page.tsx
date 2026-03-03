'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SidebarMenuApiItem = {
  path: string | null;
  children?: SidebarMenuApiItem[];
};

type SidebarMenuApiResponse = {
  success?: boolean;
  data?: SidebarMenuApiItem[];
};

const FINANCE_PREFIX = '/app/finance-accounting/';

function findFirstFinancePath(items: SidebarMenuApiItem[] | undefined): string | null {
  if (!Array.isArray(items)) {
    return null;
  }

  for (const item of items) {
    if (typeof item.path === 'string' && item.path.startsWith(FINANCE_PREFIX)) {
      return item.path;
    }
    const childPath = findFirstFinancePath(item.children);
    if (childPath) {
      return childPath;
    }
  }

  return null;
}

export default function FinanceAccountingIndexPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function resolveFinanceLanding() {
      try {
        const response = await fetch('/api/menus/sidebar', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
        });
        const payload = (await response.json().catch(() => null)) as SidebarMenuApiResponse | null;
        const targetPath = findFirstFinancePath(payload?.data);
        if (!cancelled) {
          router.replace(targetPath ?? '/app');
        }
      } catch {
        if (!cancelled) {
          router.replace('/app');
        }
      }
    }

    void resolveFinanceLanding();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
