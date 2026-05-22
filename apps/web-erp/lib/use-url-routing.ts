'use client';

// URL-routing concern for AppShell: owns the Per-page URL toggle, keeps the
// browser URL in sync with the active route, and exposes navigate() which
// replaces the current page in place when the tab strip is hidden.

import * as React from 'react';
import type { ShellTab } from '@/components/organisms/tab-bar';

const APPEARANCE_STORAGE_KEY = 'erp-appearance';

/** Reads the persisted Per-page URL routing preference from localStorage. */
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

interface UseUrlRoutingArgs {
  workspaceId: string;
  activeRoute: string;
  setTabs: React.Dispatch<React.SetStateAction<ShellTab[]>>;
  setActiveId: React.Dispatch<React.SetStateAction<string>>;
  nextTabId: () => string;
  navigateInTab: (route: string) => void;
  openTab: (route: string) => void;
}

export interface UseUrlRoutingApi {
  /** True when Per-page URL mode is active (tab strip hidden, single page). */
  urlRoutingEnabled: boolean;
  /**
   * Navigates to a route: replaces the current page in Per-page URL mode,
   * opens/focuses a tab in Internal mode.
   */
  navigate: (route: string) => void;
}

/**
 * Drives the AppShell URL-routing mode. Switching to Per-page URL collapses
 * the workspace to a single fresh tab; the shell then hides the tab strip and
 * routes every navigation through navigate() (replace-in-place).
 */
export function useUrlRouting({
  workspaceId,
  activeRoute,
  setTabs,
  setActiveId,
  nextTabId,
  navigateInTab,
  openTab,
}: UseUrlRoutingArgs): UseUrlRoutingApi {
  const [urlRoutingEnabled, setUrlRoutingEnabled] = React.useState(false);

  React.useEffect(() => {
    setUrlRoutingEnabled(readUrlRoutingEnabled());
    const onStorage = (e: StorageEvent) => {
      if (e.key === APPEARANCE_STORAGE_KEY) setUrlRoutingEnabled(readUrlRoutingEnabled());
    };
    const onCustom = (e: Event) => {
      setUrlRoutingEnabled(!!(e as CustomEvent<{ enabled: boolean }>).detail?.enabled);
      const freshId = nextTabId();
      setTabs([{ id: freshId, route: 'home' }]);
      setActiveId(freshId);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('erp-set-url-routing', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('erp-set-url-routing', onCustom as EventListener);
    };
  }, [nextTabId, setTabs, setActiveId]);

  React.useEffect(() => {
    if (!urlRoutingEnabled || !activeRoute || activeRoute === 'home') return;
    const target = `/${workspaceId}${activeRoute}`;
    if (window.location.pathname !== target) {
      window.history.replaceState(null, '', target);
    }
  }, [urlRoutingEnabled, activeRoute, workspaceId]);

  // In Per-page URL mode the tab strip is hidden, so navigation must replace
  // the current page in place instead of spawning hidden tabs.
  const navigate = React.useCallback(
    (route: string) => {
      if (urlRoutingEnabled) navigateInTab(route);
      else openTab(route);
    },
    [urlRoutingEnabled, navigateInTab, openTab],
  );

  return { urlRoutingEnabled, navigate };
}
