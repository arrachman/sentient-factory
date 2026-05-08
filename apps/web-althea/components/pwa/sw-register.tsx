'use client';

import { useEffect } from 'react';

/**
 * Register service worker on client-side. Mount once di RootLayout.
 *
 * Skip kalau:
 * - serviceWorker tidak supported (older browser)
 * - dev mode (hot reload tidak compatible dengan SW caching)
 *   override via NEXT_PUBLIC_SW_ENABLED=true kalau mau test SW di dev
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const enabledInDev = process.env.NEXT_PUBLIC_SW_ENABLED === 'true';
    if (process.env.NODE_ENV !== 'production' && !enabledInDev) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // eslint-disable-next-line no-console
        console.log('[sw] registered', reg.scope);

        // Auto-reload kalau ada SW baru ter-install (skipWaiting flow)
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              // eslint-disable-next-line no-console
              console.log('[sw] new version active, consider reload');
            }
          });
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[sw] register failed', err);
      }
    };

    void register();
  }, []);

  return null;
}
