'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLastActiveId } from '@/lib/workspace';
import { DEFAULT_WORKSPACE_ID } from '@/lib/shell-constants';

/**
 * Root entry — redirects to the last active workspace or the default (ws1).
 * Uses client-side localStorage so the redirect is always workspace-aware.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const id = getLastActiveId() ?? DEFAULT_WORKSPACE_ID;
    router.replace(`/${id}`);
  }, [router]);

  return null;
}
