'use client';

import { useEffect, useRef, useState } from 'react';
import type { RunHistoryItem } from './_types';
import { RUN_HISTORY_LIMIT } from './_utils-format';

const RUN_HISTORY_STORAGE_KEY = 'manager-dashboard-ai-history';

export function useRunHistory() {
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
  const persistTimeoutRef = useRef<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(RUN_HISTORY_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as RunHistoryItem[];
      if (Array.isArray(parsed)) {
        setRunHistory(parsed.slice(0, RUN_HISTORY_LIMIT));
      }
    } catch {
      window.localStorage.removeItem(RUN_HISTORY_STORAGE_KEY);
    }
  }, []);

  // Persist to localStorage with debounce on every change
  useEffect(() => {
    if (persistTimeoutRef.current !== null) {
      window.clearTimeout(persistTimeoutRef.current);
    }
    persistTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(RUN_HISTORY_STORAGE_KEY, JSON.stringify(runHistory));
      persistTimeoutRef.current = null;
    }, 180);
    return () => {
      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
        persistTimeoutRef.current = null;
      }
    };
  }, [runHistory]);

  return { runHistory, setRunHistory };
}
