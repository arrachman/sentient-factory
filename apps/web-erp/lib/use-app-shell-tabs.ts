'use client';

// Owns the tab strip state + manipulation callbacks for AppShell.
// Extracted so AppShell stays under 400 lines and so the tab callbacks
// can be expressed with functional setters (no `tabs`/`activeId` in deps),
// which keeps React-Compiler memoization preservation happy.

import * as React from 'react';
import type { ShellTab } from '@/components/organisms/tab-bar';
import { MAX_TABS } from '@/lib/shell-constants';

export interface AppShellTabsApi {
  tabs: ShellTab[];
  activeId: string;
  setTabs: React.Dispatch<React.SetStateAction<ShellTab[]>>;
  setActiveId: React.Dispatch<React.SetStateAction<string>>;
  /** Allocates the next non-colliding tab id (monotonic). */
  nextTabId: () => string;
  /**
   * Re-syncs the internal id counter so freshly minted ids never collide
   * with restored ones. Call after hydrating tabs from persistence.
   */
  syncTabSeq: (tabs: { id: string }[]) => void;
  openTab: (route: string) => void;
  duplicateTab: (id: string) => void;
  navigateInTab: (route: string) => void;
  closeTab: (id: string) => void;
  reloadTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeTabsToRight: (id: string) => void;
}

const INITIAL_TABS: ShellTab[] = [{ id: 't0', route: 'home' }];

/**
 * Tab-strip state machine. All mutators use functional setters so the
 * returned callbacks have empty (stable) closures — required for
 * react-compiler to preserve manual memoization.
 */
export function useAppShellTabs(): AppShellTabsApi {
  const tabSeq = React.useRef(0);
  const [tabs, setTabs] = React.useState<ShellTab[]>(INITIAL_TABS);
  const [activeId, setActiveId] = React.useState<string>('t0');

  const nextTabId = React.useCallback(() => `t${(tabSeq.current += 1)}`, []);

  const syncTabSeq = React.useCallback((restored: { id: string }[]) => {
    const maxSeq = restored.reduce((max, t) => {
      const n = parseInt(t.id.replace('t', ''), 10);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    tabSeq.current = maxSeq;
  }, []);

  const openTab = React.useCallback(
    (route: string) => {
      setTabs((prev) => {
        const existing = prev.find((tb) => tb.route === route);
        if (existing) {
          setActiveId(existing.id);
          return prev;
        }
        if (prev.length >= MAX_TABS) {
          setActiveId(prev[prev.length - 1].id);
          return prev;
        }
        const tab = { id: nextTabId(), route };
        setActiveId(tab.id);
        return [...prev, tab];
      });
    },
    [nextTabId],
  );

  const duplicateTab = React.useCallback(
    (id: string) => {
      setTabs((prev) => {
        const src = prev.find((tb) => tb.id === id) ?? prev[prev.length - 1];
        if (!src || prev.length >= MAX_TABS) return prev;
        const tab = { id: nextTabId(), route: src.route };
        setActiveId(tab.id);
        return [...prev, tab];
      });
    },
    [nextTabId],
  );

  const navigateInTab = React.useCallback((route: string) => {
    setActiveId((curActive) => {
      setTabs((prev) =>
        prev.map((tb) => (tb.id === curActive ? { ...tb, route } : tb)),
      );
      return curActive;
    });
  }, []);

  const closeTab = React.useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((tb) => tb.id === id);
        if (idx === -1) return prev;
        const next = prev.filter((tb) => tb.id !== id);
        if (next.length === 0) {
          const fresh = { id: nextTabId(), route: 'home' };
          setActiveId(fresh.id);
          return [fresh];
        }
        setActiveId((cur) => (cur === id ? next[Math.max(0, idx - 1)].id : cur));
        return next;
      });
    },
    [nextTabId],
  );

  const reloadTab = React.useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((tb) => (tb.id === id ? { ...tb, nonce: (tb.nonce ?? 0) + 1 } : tb)),
    );
    setActiveId(id);
  }, []);

  const closeOtherTabs = React.useCallback((id: string) => {
    setTabs((prev) => {
      const keep = prev.find((tb) => tb.id === id);
      return keep ? [keep] : prev;
    });
    setActiveId(id);
  }, []);

  const closeTabsToRight = React.useCallback((id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((tb) => tb.id === id);
      if (idx === -1) return prev;
      const next = prev.slice(0, idx + 1);
      if (next.length === prev.length) return prev;
      setActiveId((cur) =>
        next.some((tb) => tb.id === cur) ? cur : id,
      );
      return next;
    });
  }, []);

  return {
    tabs,
    activeId,
    setTabs,
    setActiveId,
    nextTabId,
    syncTabSeq,
    openTab,
    duplicateTab,
    navigateInTab,
    closeTab,
    reloadTab,
    closeOtherTabs,
    closeTabsToRight,
  };
}
