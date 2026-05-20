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

interface State<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  tick: number;
}

type Action<T> =
  | { type: 'start' }
  | { type: 'success'; rows: T[] }
  | { type: 'error'; message: string }
  | { type: 'reload' };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'start':
      return { ...state, loading: true, error: null };
    case 'success':
      return { ...state, loading: false, rows: action.rows };
    case 'error':
      return { ...state, loading: false, error: action.message };
    case 'reload':
      return { ...state, tick: state.tick + 1 };
    default:
      return state;
  }
}

/**
 * Fetches a paginated list resource once on mount and whenever `reload()` is
 * called. Surfaces a `notify` toast on error so the user sees feedback.
 *
 * Uses a reducer so the "start loading" transition happens inside the async
 * dispatch chain rather than synchronously in the effect body — keeping the
 * `react-hooks/set-state-in-effect` rule happy.
 */
export function useErpList<T>(
  fetcher: () => Promise<PaginatedResponse<T>>,
): ErpListState<T> {
  const [state, dispatch] = React.useReducer(reducer<T>, {
    rows: [],
    loading: true,
    error: null,
    tick: 0,
  });

  React.useEffect(() => {
    let cancelled = false;

    // Defer the "start" dispatch so we don't synchronously call setState
    // inside the effect body.
    Promise.resolve().then(() => {
      if (cancelled) return;
      dispatch({ type: 'start' });
    });

    fetcher()
      .then((res) => {
        if (!cancelled) dispatch({ type: 'success', rows: res.data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Gagal memuat data';
        dispatch({ type: 'error', message: msg });
        notify(msg, 'danger');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tick]);

  const reload = React.useCallback(() => dispatch({ type: 'reload' }), []);

  return {
    rows: state.rows,
    loading: state.loading,
    error: state.error,
    reload,
  };
}
