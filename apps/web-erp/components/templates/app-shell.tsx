'use client';

import * as React from 'react';
import { makeTranslator } from '@/lib/mock';
import { Dashboard } from '@/components/pages/dashboard';
import { ComingSoon } from '@/components/pages/coming-soon';
import { Statistik } from '@/components/pages/statistik';
import { SettingsPage } from '@/components/pages/settings';
import { AppearancePage } from '@/components/pages/appearance';
import { KasMasukList } from '@/components/pages/kas-masuk-list';
import { GenericList } from '@/components/pages/generic-list';
import { FinancialReport } from '@/components/pages/financial-report';
import { DataList } from '@/components/pages/data-list';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar, type ShellUser } from '@/components/organisms/topbar';
import { TabBar, type ShellTab } from '@/components/organisms/tab-bar';
import { CommandPalette } from '@/components/organisms/command-palette';
import { ConfirmDialogHost } from '@/components/organisms/confirm-dialog';
import { NotificationDrawer } from '@/components/organisms/notification-drawer';
import { ActivityDrawer } from '@/components/organisms/activity-drawer';
import { LoginPage } from '@/components/pages/login';
import { RecordForm } from '@/components/pages/record-form';
import { TrxForm } from '@/components/pages/trx-form';
import { TabActiveContext } from '@/lib/tab-context';
import { REGISTRY, MODULES, REPORTS } from '@/lib/registry';
import { pageMeta, type Crumb } from '@/lib/nav';

const MAX_TABS = 16;
const USER_STORAGE_KEY = 'erp-user';

type Lang = 'id' | 'en';

function resolveNewRoute(route: string): string | null {
  if (!route.endsWith('-new')) return null;
  const baseRoute = route.slice(0, -'-new'.length);
  return baseRoute;
}

function renderRoute(
  route: string,
  onNavigate: (r: string) => void,
  onOpenTab: (r: string) => void,
  t: ReturnType<typeof makeTranslator>,
  lang: Lang,
) {
  if (route === 'home') return <Dashboard t={t} onNavigate={onOpenTab} />;
  if (route === 'statistik') return <Statistik t={t} onNavigate={onOpenTab} />;
  if (route === 'set-prefs') return <SettingsPage t={t} />;
  if (route === 'set-appearance') return <AppearancePage t={t} />;
  const baseRoute = resolveNewRoute(route);
  if (baseRoute) {
    if (MODULES[baseRoute])
      return (
        <TrxForm
          moduleId={baseRoute}
          t={t}
          lang={lang}
          onNavigate={onNavigate}
        />
      );
    if (REGISTRY[baseRoute])
      return <RecordForm moduleId={baseRoute} t={t} onNavigate={onNavigate} />;
    return <ComingSoon route={route} />;
  }
  if (route === 'kas-masuk')
    return (
      <KasMasukList
        t={t}
        lang={lang}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  if (MODULES[route])
    return (
      <GenericList
        moduleId={route}
        t={t}
        lang={lang}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  if (REPORTS[route]) return <FinancialReport moduleId={route} t={t} />;
  if (REGISTRY[route])
    return (
      <DataList
        moduleId={route}
        t={t}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  return <ComingSoon route={route} />;
}

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
  const nextTabId = React.useCallback(
    () => `t${(tabSeq.current += 1)}`,
    [],
  );

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

  const openTab = React.useCallback((route: string) => {
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
  }, [tabs, nextTabId]);

  const duplicateTab = React.useCallback((id: string) => {
    const src = tabs.find((tb) => tb.id === id) ?? tabs[tabs.length - 1];
    if (!src || tabs.length >= MAX_TABS) return;
    const tab = { id: nextTabId(), route: src.route };
    setActiveId(tab.id);
    setTabs((prev) => [...prev, tab]);
  }, [tabs, nextTabId]);

  const navigateInTab = React.useCallback(
    (route: string) => {
      setTabs((prev) =>
        prev.map((tb) => (tb.id === activeId ? { ...tb, route } : tb)),
      );
    },
    [activeId],
  );

  const closeTab = React.useCallback((id: string) => {
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
  }, [tabs, nextTabId]);

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
  const closeTabsToRight = React.useCallback((id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((tb) => tb.id === id);
      if (idx === -1) return prev;
      const next = prev.slice(0, idx + 1);
      return next.length === prev.length ? prev : next;
    });
    setActiveId((cur) =>
      tabs.slice(0, tabs.findIndex((tb) => tb.id === id) + 1).some(
        (tb) => tb.id === cur,
      )
        ? cur
        : id,
    );
  }, [tabs]);

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
        closeTab(activeId);
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
            onClose={closeTab}
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
                    {renderRoute(
                      tab.route,
                      navigateInTab,
                      openTab,
                      t,
                      lang,
                    )}
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
        <div className="sc-overlay" onClick={() => setShortcutsOpen(false)}>
          <div className="sc-card" onClick={(e) => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className="sc-grid">
              <div>Buka command palette</div>
              <div>⌘ K</div>
              <div>Tutup tab aktif</div>
              <div>⌥ W</div>
              <div>Pindah ke tab 1–8</div>
              <div>⌘ 1–8</div>
              <div>Pindah ke tab terakhir</div>
              <div>⌘ 9</div>
              <div>Toggle bahasa ID/EN</div>
              <div>L</div>
              <div>Tampilkan shortcut</div>
              <div>?</div>
              <div>Tutup overlay</div>
              <div>ESC</div>
            </div>
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button
                className="btn"
                onClick={() => setShortcutsOpen(false)}
              >
                Tutup ESC
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
