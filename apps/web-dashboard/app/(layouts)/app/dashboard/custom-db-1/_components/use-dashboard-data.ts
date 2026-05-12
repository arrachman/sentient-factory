'use client';

import { useEffect, useRef, useState } from 'react';
import type { DashboardCatalog, QueryResult } from '../_types';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useDashboardData(dashboardKey: string) {
  const [catalog, setCatalog] = useState<DashboardCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queryResults, setQueryResults] = useState<Record<string, QueryResult>>({});
  const silentRefreshTimeoutRef = useRef<number | null>(null);

  async function loadQueryResults(
    nextCatalog: DashboardCatalog,
    options?: { signal?: { cancelled: boolean }; silent?: boolean },
  ) {
    if (!nextCatalog.widgets?.length) {
      if (!options?.signal?.cancelled) setQueryResults({});
      return;
    }
    try {
      const params = Object.fromEntries(
        nextCatalog.filters.map((filter) => [filter.query_param_name, String(filter.default_value ?? '')]),
      );
      const results = await Promise.all(
        nextCatalog.widgets.map(async (widget) => {
          const primaryQuery =
            widget.queries.find((q) => q.query_key === widget.widget_key || widget.is_primary) ?? widget.queries[0];
          if (!primaryQuery) return null;
          const response = await fetch(`/api/dashboard/custom-db/${dashboardKey}/query/${primaryQuery.query_key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params }),
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok || !payload?.success || !payload?.data)
            throw new Error(payload?.message || `Failed to load chart ${widget.title}.`);
          return [widget.widget_id, payload.data as QueryResult] as const;
        }),
      );
      if (!options?.signal?.cancelled) {
        setQueryResults(
          Object.fromEntries(results.filter((entry): entry is readonly [string, QueryResult] => Boolean(entry))),
        );
      }
    } catch (err) {
      if (!options?.signal?.cancelled && !options?.silent)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard charts.');
    }
  }

  async function loadCatalog(options?: { signal?: { cancelled: boolean }; silent?: boolean }) {
    if (!options?.silent) { setLoading(true); setError(''); }
    try {
      const response = await fetch(`/api/dashboard/custom-db/${dashboardKey}`, { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data)
        throw new Error(payload?.message || 'Failed to load custom dashboard.');
      if (!options?.signal?.cancelled) {
        const nextCatalog = payload.data as DashboardCatalog;
        setCatalog(nextCatalog);
        await loadQueryResults(nextCatalog, options);
      }
    } catch (err) {
      if (!options?.signal?.cancelled && !options?.silent)
        setError(err instanceof Error ? err.message : 'Failed to load custom dashboard.');
    } finally {
      if (!options?.signal?.cancelled && !options?.silent) setLoading(false);
    }
  }

  function scheduleSilentRefresh(delayMs = 220) {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (silentRefreshTimeoutRef.current !== null) window.clearTimeout(silentRefreshTimeoutRef.current);
    silentRefreshTimeoutRef.current = window.setTimeout(() => {
      silentRefreshTimeoutRef.current = null;
      void loadCatalog({ silent: true });
    }, delayMs);
  }

  useEffect(() => {
    const signal = { cancelled: false };
    void loadCatalog({ signal });
    const intervalId = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      void loadCatalog({ signal, silent: true });
    }, REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => { if (!document.hidden) void loadCatalog({ signal, silent: true }); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      signal.cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (silentRefreshTimeoutRef.current !== null) { window.clearTimeout(silentRefreshTimeoutRef.current); silentRefreshTimeoutRef.current = null; }
    };
  }, [dashboardKey]);

  return { catalog, setCatalog, loading, error, setError, queryResults, loadCatalog, scheduleSilentRefresh };
}
