'use client';

import { useEffect, useState } from 'react';

/**
 * Ticking clock. Returns a `Date` that refreshes every `intervalMs` (default 1s),
 * for live wall-clock displays and elapsed-time counters. SSR-safe: the first
 * render uses the mount time and updates client-side only.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
