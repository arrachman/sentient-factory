'use client';

// URL-driven multi-tab state for the HR shell.
//
// Unlike the web-erp shell (in-memory tab ids + hidden keep-alive divs), HR tabs
// are keyed by their `/app/...` pathname so the existing `<Link>`-based views
// navigate natively. The hook lives in the persistent `app/app/layout.tsx`, so
// the tab strip survives client navigations; the catch-all page renders nothing
// (the layout renders the active view). One route = one tab (no duplicate).

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const MAX_TABS = 16;

export interface HrTab {
  /** Full `/app/...` pathname — also the React key + identity. */
  route: string;
}

export interface HrTabsApi {
  tabs: HrTab[];
  activeRoute: string;
  /** Remount nonce for the active route (bumped by `reload`). */
  activeNonce: number;
  activate: (route: string) => void;
  closeTab: (route: string) => void;
  closeOthers: (route: string) => void;
  closeRight: (route: string) => void;
  reload: (route: string) => void;
  reorder: (fromRoute: string, toRoute: string) => void;
}

export interface UseHrTabsOptions {
  /**
   * Per-page URL mode (Setting → Tampilan → URL Routing). When true the shell
   * hides the tab strip and collapses the workspace to a single tab: every
   * navigation replaces the active page in place instead of accumulating tabs.
   */
  singlePage?: boolean;
}

export function useHrTabs(options?: UseHrTabsOptions): HrTabsApi {
  const singlePage = !!options?.singlePage;
  const pathname = usePathname();
  const router = useRouter();
  const activeRoute = pathname;

  const [tabs, setTabs] = useState<HrTab[]>([{ route: pathname }]);
  const [nonces, setNonces] = useState<Record<string, number>>({});

  // Ensure a tab exists for whatever route the URL currently points at. This
  // must run as an effect: navigations also arrive via `<Link>` clicks inside
  // views (not just our `activate()`), so the accumulated tab list can only be
  // synced from the URL here. Guarded to a no-op when the tab already exists.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL→tab sync (see above)
    setTabs((prev) => {
      // Per-page URL mode: keep only the active route (no accumulation). The
      // tab strip is hidden by the shell; navigation replaces in place.
      if (singlePage) {
        return prev.length === 1 && prev[0].route === pathname ? prev : [{ route: pathname }];
      }
      if (prev.some((t) => t.route === pathname)) return prev;
      if (prev.length >= MAX_TABS) {
        // Replace the last tab when the strip is full (matches ERP cap behaviour).
        return [...prev.slice(0, -1), { route: pathname }];
      }
      return [...prev, { route: pathname }];
    });
  }, [pathname, singlePage]);

  const activate = useCallback(
    (route: string) => {
      if (route !== pathname) router.push(route);
    },
    [pathname, router],
  );

  // After removing the active tab we must navigate to a survivor. `pendingNav`
  // carries the target out of the functional setter into an effect.
  const pendingNav = useRef<string | null>(null);

  const closeTab = useCallback(
    (route: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev; // never close the last tab
        const idx = prev.findIndex((t) => t.route === route);
        if (idx === -1) return prev;
        const next = prev.filter((t) => t.route !== route);
        if (route === pathname) {
          pendingNav.current = next[Math.max(0, idx - 1)].route;
        }
        return next;
      });
    },
    [pathname],
  );

  const closeOthers = useCallback((route: string) => {
    setTabs((prev) => (prev.some((t) => t.route === route) ? [{ route }] : prev));
    pendingNav.current = route;
  }, []);

  const closeRight = useCallback(
    (route: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.route === route);
        if (idx === -1) return prev;
        const next = prev.slice(0, idx + 1);
        if (next.length === prev.length) return prev;
        if (!next.some((t) => t.route === pathname)) pendingNav.current = route;
        return next;
      });
    },
    [pathname],
  );

  useEffect(() => {
    if (pendingNav.current && pendingNav.current !== pathname) {
      const target = pendingNav.current;
      pendingNav.current = null;
      router.push(target);
    } else {
      pendingNav.current = null;
    }
  }, [tabs, pathname, router]);

  const reload = useCallback(
    (route: string) => {
      setNonces((prev) => ({ ...prev, [route]: (prev[route] ?? 0) + 1 }));
      if (route !== pathname) router.push(route);
    },
    [pathname, router],
  );

  const reorder = useCallback((fromRoute: string, toRoute: string) => {
    if (fromRoute === toRoute) return;
    setTabs((prev) => {
      const from = prev.findIndex((t) => t.route === fromRoute);
      const to = prev.findIndex((t) => t.route === toRoute);
      if (from === -1 || to === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  return {
    tabs,
    activeRoute,
    activeNonce: nonces[activeRoute] ?? 0,
    activate,
    closeTab,
    closeOthers,
    closeRight,
    reload,
    reorder,
  };
}
