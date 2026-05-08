/**
 * Service Worker untuk Althea Psychology PWA
 *
 * Strategy:
 * - App shell cache (precache static routes + assets pada install)
 * - Network-first untuk /api/* (selalu fresh data)
 * - Cache-first untuk static assets
 * - Stale-while-revalidate untuk pages
 *
 * Slice 14 — minimal viable offline support. Future enhancements:
 * - Background sync untuk offline mutations
 * - Push notifications
 * - Periodic sync untuk update data
 */

const CACHE_VERSION = 'althea-v1';
const APP_SHELL = [
  '/',
  '/login',
  '/manifest.webmanifest',
];

// ============================================================================
// Install — precache app shell
// ============================================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

// ============================================================================
// Activate — cleanup old caches
// ============================================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('althea-') && k !== CACHE_VERSION)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ============================================================================
// Fetch — routing strategy per request type
// ============================================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET (POST/PATCH/DELETE always go through network)
  if (request.method !== 'GET') return;

  // Skip cross-origin (don't intercept, let browser handle)
  if (url.origin !== self.location.origin) return;

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets (Next.js _next/*, fonts, images)
  if (
    url.pathname.startsWith('/_next/') ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for pages (HTML)
  event.respondWith(staleWhileRevalidate(request));
});

// ============================================================================
// Strategies
// ============================================================================

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Don't cache API responses (always fresh)
    return response;
  } catch (err) {
    // Offline fallback — return any cached version (rare for API)
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline',
        message: 'Tidak ada koneksi internet. Coba lagi setelah online.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone()).catch(() => undefined);
    }
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    })
    .catch(() => null);

  // Return cached immediately, update in background
  if (cached) {
    networkPromise; // fire-and-forget update
    return cached;
  }
  return (await networkPromise) ?? new Response('Offline', { status: 503 });
}
