'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ENV } from '@/config/env';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

/**
 * Subscribe ke SSE stream `/clinic/booking/stream` untuk realtime booking updates.
 * On event, invalidate booking list query → auto-refetch list.
 *
 * Auth: SSE include cookie via credentials. Pastikan sf_token cookie ter-set
 * di same-origin (atau CORS allow credentials).
 *
 * Note: EventSource native tidak support custom headers. Kalau butuh JWT di
 * header, harus pakai fetch streaming atau library `event-source-polyfill`.
 * Saat ini rely on cookie sf_token.
 */
export function useBookingStream() {
  const qc = useQueryClient();

  useEffect(() => {
    // Skip kalau tidak ada cookie token
    const hasToken = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith(`${TOKEN_COOKIE}=`));
    if (!hasToken) return;

    const url = `${ENV.API_URL}/clinic/booking/stream`;
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      try {
        es = new EventSource(url, { withCredentials: true });

        es.onmessage = () => {
          // Any event → invalidate booking list (auto refetch latest)
          qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
        };

        es.onerror = () => {
          // Auto-reconnect setelah 5s
          es?.close();
          es = null;
          retryTimer = setTimeout(connect, 5000);
        };
      } catch (err) {
        console.warn('[useBookingStream] failed to connect:', err);
      }
    }

    connect();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  }, [qc]);
}
