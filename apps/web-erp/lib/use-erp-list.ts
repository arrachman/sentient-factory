'use client';

// Generic hook for ERP list pages — handles load, reload, and error state.
// Keep this file framework-agnostic (React only, no API calls).

import * as React from 'react';
import { notify } from '@/lib/feedback';
import type { PaginatedResponse } from '@/lib/api/types';

export interface ErpListState<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Fetches a paginated list resource once on mount and whenever `reload()` is
 * called. Surfaces a `notify` toast on error so the user sees feedback.
 */
export function useErpList<T>(
  fetcher: () => Promise<PaginatedResponse<T>>,
): ErpListState<T> {
  const [rows, setRows] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((res) => {
        if (!cancelled) setRows(res.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : 'Gagal memuat data';
          setError(msg);
          notify(msg, 'danger');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const reload = React.useCallback(() => setTick((t) => t + 1), []);

  return { rows, loading, error, reload };
}
