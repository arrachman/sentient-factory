'use client';

import * as React from 'react';
import { makeTranslator } from '@/lib/mock';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar, type ShellUser } from '@/components/organisms/topbar';
import { TabBar, type ShellTab } from '@/components/organisms/tab-bar';
import { CommandPalette } from '@/components/organisms/command-palette';
import { ConfirmDialogHost } from '@/components/organisms/confirm-dialog';
import { NotificationDrawer } from '@/components/organisms/notification-drawer';
import { ActivityDrawer } from '@/components/organisms/activity-drawer';
import { LoginPage } from '@/components/pages/login';
import { TabActiveContext } from '@/lib/tab-context';
import { pageMeta, type Crumb } from '@/lib/nav';
import { confirmAction } from '@/lib/feedback';
import { MAX_TABS, USER_STORAGE_KEY, type Lang } from '@/lib/shell-constants';
import { renderRoute } from '@/components/templates/shell-route-renderer';
import { ShortcutsOverlay } from '@/components/templates/shell-shortcuts-overlay';

/**
 * Top-level multi-tab shell — ported from prototype `app.jsx`. Tab/route
 * state is React-local (no router-driven persistence, per scaffold scope).
 *
 * Auth is UI-only: the login gate stores the active `ShellUser` in
 * localStorage so a refresh stays signed-in for the demo, but no token
 * or API call is involved.
 */
export function AppShell() {
  // Deterministic across SSR/client so tab `data-tab` hydrates cleanly.
  const initialTabId = React.useId();
  const tabSeq = React.useRef(0);
  const nextTabId = React.useCallback(() => `t${(tabSeq.current += 1)}`, []);

  // `null` until the client effect has read localStorage; render the
  // shell once hydration finishes so SSR + CSR match.
  const [user, setUser] = React.useState<ShellUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as ShellUser);
    } catch {
      // ignore malformed payloads — user re-authenticates
    }
    setHydrated(true);
  }, []);

  const onLogin = React.useCallback((u: ShellUser) => {
    setUser(u);
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    } catch {
      // best-effort persistence — login still proceeds
    }
  }, []);

  const onLogout = React.useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // best-effort cleanup
    }
  }, []);

  const [lang, setLang] = React.useState<Lang>('id');
  const [tabs, setTabs] = React.useState<ShellTab[]>(() => [
    { id: initialTabId, route: 'home' },
  ]);
  const [activeId, setActiveId] = React.useState<string>(initialTabId);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  const t = React.useMemo(() => makeTranslator(lang), [lang]);

  const activeTab = tabs.find((tb) => tb.id === activeId) ?? tabs[0];
  const activeRoute = activeTab ? activeTab.route : 'home';

  // The prototype CSS keys off these root data-attributes.
  React.useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-density', 'compact');
    el.setAttribute('data-fontscale', 'base');
    el.setAttribute('data-sidebar', 'icon');
    el.setAttribute('data-primary', 'blue');
  }, []);

  const openTab = React.useCallback(
    (route: string) => {
      const existing = tabs.find((tb) => tb.route === route);
      if (existing) {
        setActiveId(existing.id);
        return;
      }
      if (tabs.length >= MAX_TABS) {
        setActiveId(tabs[tabs.length - 1].id);
        return;
      }
      const tab = { id: nextTabId(), route };
      setActiveId(tab.id);
      setTabs((prev) => [...prev, tab]);
    },
    [tabs, nextTabId],
  );

  const duplicateTab = React.useCallback(
    (id: string) => {
      const src = tabs.find((tb) => tb.id === id) ?? tabs[tabs.length - 1];
      if (!src || tabs.length >= MAX_TABS) return;
      const tab = { id: nextTabId(), route: src.route };
      setActiveId(tab.id);
      setTabs((prev) => [...prev, tab]);
    },
    [tabs, nextTabId],
  );

  const navigateInTab = React.useCallback(
    (route: string) => {
      setTabs((prev) =>
        prev.map((tb) => (tb.id === activeId ? { ...tb, route } : tb)),
      );
    },
    [activeId],
  );

  const closeTab = React.useCallback(
    (id: string) => {
      const idx = tabs.findIndex((tb) => tb.id === id);
      if (idx === -1) return;
      const next = tabs.filter((tb) => tb.id !== id);
      if (next.length === 0) {
        const fresh = { id: nextTabId(), route: 'home' };
        setTabs([fresh]);
        setActiveId(fresh.id);
        return;
      }
      setTabs(next);
      setActiveId((cur) => (cur === id ? next[Math.max(0, idx - 1)].id : cur));
    },
    [tabs, nextTabId],
  );

  const confirmClose = React.useCallback(
    (id: string) => {
      const tab = tabs.find((tb) => tb.id === id);
      const label = tab ? pageMeta(tab.route, t).title : 'tab ini';
      confirmAction({
        title: 'Tutup tab?',
        message: `"${label}" akan ditutup.`,
        variant: 'warn',
        confirmLabel: 'Tutup',
        confirmIcon: 'x',
        cancelLabel: 'Batal',
        onConfirm: () => closeTab(id),
      });
    },
    [tabs, t, closeTab],
  );

  // Force-remount this tab's view by bumping its nonce (view is keyed on it).
  const reloadTab = React.useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((tb) =>
        tb.id === id ? { ...tb, nonce: (tb.nonce ?? 0) + 1 } : tb,
      ),
    );
    setActiveId(id);
  }, []);

  // Close every tab except the given one.
  const closeOtherTabs = React.useCallback((id: string) => {
    setTabs((prev) => {
      const keep = prev.find((tb) => tb.id === id);
      return keep ? [keep] : prev;
    });
    setActiveId(id);
  }, []);

  // Close all tabs positioned after the given one.
  const closeTabsToRight = React.useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((tb) => tb.id === id);
        if (idx === -1) return prev;
        const next = prev.slice(0, idx + 1);
        return next.length === prev.length ? prev : next;
      });
      setActiveId((cur) =>
        tabs
          .slice(0, tabs.findIndex((tb) => tb.id === id) + 1)
          .some((tb) => tb.id === cur)
          ? cur
          : id,
      );
    },
    [tabs],
  );

  // Global shortcuts — Cmd/Ctrl+K palette, Cmd/Ctrl+W close, Cmd/Ctrl+1-9 tabs, ? shortcuts.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inEditor = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.metaKey && e.code === 'KeyE') {
        e.preventDefault();
        confirmClose(activeId);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const n = parseInt(e.key, 10);
        // Cmd/Ctrl+9 → last tab (browser convention)
        const target = n === 9 ? tabs[tabs.length - 1] : tabs[n - 1];
        if (target) setActiveId(target.id);
        return;
      }
      if (inEditor) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (e.key.toLowerCase() === 'l') {
        setLang((l) => (l === 'id' ? 'en' : 'id'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeId, closeTab, tabs]);

  // Guard against accidental browser-tab close when Ctrl+W reaches the browser.
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to trigger the native confirmation.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  React.useEffect(() => {
    const sc = () => setShortcutsOpen(true);
    window.addEventListener('open-shortcuts', sc);
    return () => window.removeEventListener('open-shortcuts', sc);
  }, []);

  const onPaletteAction = (id: string) => {
    if (id.startsWith('toggle:')) {
      const what = id.split(':')[1];
      if (what === 'lang') setLang((l) => (l === 'id' ? 'en' : 'id'));
      return;
    }
    if (id.startsWith('new:')) {
      openTab(id.split(':')[1]);
      return;
    }
    openTab(id);
  };

  const crumbs: Crumb[] = pageMeta(activeRoute, t).crumbs;
  const sidebarCurrent = activeRoute;

  // Render nothing until localStorage has been read so the SSR shell
  // and CSR shell agree on whether the user is logged in.
  if (!hydrated) return null;
  if (!user) return <LoginPage onLogin={onLogin} />;

  return (
    <>
      <div className="app">
        <Sidebar current={sidebarCurrent} onNavigate={openTab} t={t} />
        <Topbar
          crumbs={crumbs}
          onOpenPalette={() => setPaletteOpen(true)}
          t={t}
          user={user}
          onNavigate={openTab}
          onLogout={onLogout}
        />
        <main className="main">
          <TabBar
            tabs={tabs}
            activeId={activeId}
            onActivate={setActiveId}
            onClose={confirmClose}
            onReload={reloadTab}
            onCloseOthers={closeOtherTabs}
            onCloseRight={closeTabsToRight}
            onDuplicate={duplicateTab}
            onNew={() => setPaletteOpen(true)}
            t={t}
          />
          <div className="tabviews">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <div
                  key={`${tab.id}:${tab.nonce ?? 0}`}
                  className="tabview"
                  style={{ display: isActive ? 'flex' : 'none' }}
                >
                  <TabActiveContext.Provider value={isActive}>
                    {renderRoute(tab.route, navigateInTab, openTab, t, lang)}
                  </TabActiveContext.Provider>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAction={onPaletteAction}
        t={t}
      />

      <NotificationDrawer onNavigate={openTab} t={t} />
      <ActivityDrawer t={t} />
      <ConfirmDialogHost />

      {shortcutsOpen && (
        <ShortcutsOverlay onClose={() => setShortcutsOpen(false)} />
      )}
    </>
  );
}
