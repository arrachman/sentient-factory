'use client';

// URL-routing concern for the HR shell — port of web-erp's lib/use-url-routing.ts,
// adapted to HR's URL-keyed multitab model (lib/use-hr-tabs).
//
// The Per-page URL toggle (Setting → Tampilan → URL Routing) switches the shell
// between two real modes:
//   • Internal (urlRouting = false, default) → multi-tab: the tab strip is shown
//     and each distinct route accumulates as its own tab.
//   • Per-page URL (urlRouting = true) → single-page: the tab strip is hidden and
//     navigation replaces the active page in place (no tab accumulation).
//
// ⚠️ Deviasi sadar dari web-erp (HR filesystem-routed): di ERP, mode Internal
// men-collapse URL browser ke root via history.replaceState. HR tidak bisa
// melakukan itu tanpa merusak deep-link/refresh (URL = sumber view di sini),
// jadi di HR **kedua mode tetap memakai URL asli `/app/<route>`**. Toggle ini
// di HR hanya mengendalikan visibilitas tab strip + akumulasi tab — bukan
// bentuk URL. Lihat apps/web-hr/CLAUDE.md §Setting → Tampilan.
//
// The flag is read from the same localStorage mirror the appearance hook owns
// (`hr-appearance`) so it stays in sync without lifting state. The appearance
// hook fires custom events on change/hydration so the shell re-renders live.

import { useEffect, useState } from 'react';

const APPEARANCE_STORAGE_KEY = 'hr-appearance';
export const SET_EVENT = 'hr-set-url-routing';
export const HYDRATE_EVENT = 'hr-hydrate-url-routing';

/** Reads the persisted Per-page URL preference from localStorage (false on miss/SSR). */
export function readUrlRoutingEnabled(): boolean {
  try {
    const raw =
      typeof window !== 'undefined' && window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return false;
    return !!(JSON.parse(raw) as { urlRouting?: boolean }).urlRouting;
  } catch {
    return false;
  }
}

/**
 * Live `urlRouting` flag for the shell. Initializes synchronously from
 * localStorage (no tab-strip flash), then re-syncs on:
 *   - `storage` event (cross-tab), and
 *   - custom events fired by use-appearance on toggle (`${SET_EVENT}`) and
 *     post-hydration (`${HYDRATE_EVENT}`).
 */
export function useUrlRoutingFlag(): boolean {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Read on mount (avoids SSR/client hydration mismatch — server has no
    // localStorage, so initial render is `false` on both sides, then we adopt
    // the persisted value here). Mirrors use-appearance.ts / use-hr-tabs.ts.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only flag adoption
    setEnabled(readUrlRoutingEnabled());
    const onStorage = (e: StorageEvent) => {
      if (e.key === APPEARANCE_STORAGE_KEY) setEnabled(readUrlRoutingEnabled());
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled?: boolean }>).detail;
      setEnabled(!!detail?.enabled);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SET_EVENT, onCustom as EventListener);
    window.addEventListener(HYDRATE_EVENT, onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SET_EVENT, onCustom as EventListener);
      window.removeEventListener(HYDRATE_EVENT, onCustom as EventListener);
    };
  }, []);

  return enabled;
}
