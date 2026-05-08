'use client';

import { useEffect } from 'react';

/**
 * Register service worker (`/sw.js`) saat app loaded di browser.
 * Hanya register di production build (skip dev untuk hot-reload).
 *
 * Mount di root layout — fire-and-forget.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        console.warn('[sw] register failed:', err);
      });
  }, []);

  return null;
}
