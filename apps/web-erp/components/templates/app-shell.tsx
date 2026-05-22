'use client';

import * as React from 'react';
import { makeTranslator, setCurrentLang } from '@/lib/mock';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar, type ShellUser } from '@/components/organisms/topbar';
import { NAV, type NavItem } from '@/lib/nav';
import { TabBar } from '@/components/organisms/tab-bar';
import { CommandPalette } from '@/components/organisms/command-palette';
import { ConfirmDialogHost } from '@/components/organisms/confirm-dialog';
import { NotificationDrawer } from '@/components/organisms/notification-drawer';
import { ActivityDrawer } from '@/components/organisms/activity-drawer';
import { LoginPage } from '@/components/pages/login';
import { TabActiveContext } from '@/lib/tab-context';
import { pageMeta, type Crumb } from '@/lib/nav';
import { confirmAction } from '@/lib/feedback';
import { USER_STORAGE_KEY, type Lang } from '@/lib/shell-constants';
import { renderRoute } from '@/components/templates/shell-route-renderer';
import { ShortcutsOverlay } from '@/components/templates/shell-shortcuts-overlay';
import { logout as apiLogout } from '@/lib/api/auth';
import { getMyPreferences } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useErpMe, useErpMyMenus, erpQueryKeys } from '@/lib/api/hooks';
import { useAppShellTabs } from '@/lib/use-app-shell-tabs';
import {
  getOrCreateWorkspace,
  saveWorkspace,
  clearAllWorkspaces,
  setLastActive,
} from '@/lib/workspace';
import { useUrlRouting, readUrlRoutingEnabled } from '@/lib/use-url-routing';

interface AppShellProps {
  /** Omit for global (no-workspace) mode — tabs are in-memory only, no localStorage. */
  workspaceId?: string;
  initialRoute?: string;
}

export function AppShell({ workspaceId, initialRoute }: AppShellProps) {
  const workspaceReady = React.useRef(false);
  const [user, setUser] = React.useState<ShellUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [nav, setNav] = React.useState<NavItem[]>(NAV);
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [lang, setLang] = React.useState<Lang>('id');
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  const {
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
    reorderTabs,
  } = useAppShellTabs();

  const activeTab = tabs.find((tb) => tb.id === activeId) ?? tabs[0];
  const activeRoute = activeTab ? activeTab.route : 'home';

  const { urlRoutingEnabled, navigate } = useUrlRouting({
    workspaceId,
    activeRoute,
    activeId,
    setTabs,
    setActiveId,
    navigateInTab,
    openTab,
  });

  const [storedUserRaw] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem(USER_STORAGE_KEY); } catch { return null; }
  });

  const queryClient = useQueryClient();
  const meQuery = useErpMe({ enabled: !!storedUserRaw, retry: false });
  const myMenusQuery = useErpMyMenus({ enabled: !!user });

  const loadWorkspace = React.useCallback(() => {
    if (!workspaceId) {
      // Global mode: in-memory tabs only — no localStorage reads or writes.
      const defaultTab = { id: 't1', route: 'home' };
      syncTabSeq([defaultTab]);
      setTabs([defaultTab]);
      setActiveId('t1');
      workspaceReady.current = true;
      return;
    }
    const ws = getOrCreateWorkspace(workspaceId);
    setWorkspaceName(ws.meta.name);
    syncTabSeq(ws.tabs);
    setTabs(ws.tabs.map((t) => ({ id: t.id, route: t.route })));
    setActiveId(
      ws.tabs.find((t) => t.id === ws.activeTabId)?.id
        ?? ws.tabs[0]?.id
        ?? nextTabId(),
    );
    workspaceReady.current = true;
    setLastActive(workspaceId);
  }, [workspaceId, nextTabId, syncTabSeq, setTabs, setActiveId]);

  // Ref guard prevents re-running when loadWorkspace ref or meQuery refetches.
  const authInitialized = React.useRef(false);
  React.useEffect(() => {
    if (authInitialized.current) return;
    if (!storedUserRaw) {
      authInitialized.current = true;
      const id = setTimeout(() => setHydrated(true), 0);
      return () => clearTimeout(id);
    }
    if (!meQuery.isSuccess && !meQuery.isError) return; // still pending
    authInitialized.current = true;
    if (meQuery.isSuccess) {
      try {
        setUser(JSON.parse(storedUserRaw) as ShellUser);
        loadWorkspace();
      } catch {
        try { window.localStorage.removeItem(USER_STORAGE_KEY); } catch { /* noop */ }
      }
    } else {
      try { window.localStorage.removeItem(USER_STORAGE_KEY); } catch { /* noop */ }
    }
    setHydrated(true);
  }, [storedUserRaw, meQuery.isSuccess, meQuery.isError, loadWorkspace]);

  React.useEffect(() => {
    if (myMenusQuery.data && myMenusQuery.data.length > 0) {
      setNav(myMenusQuery.data);
    }
  }, [myMenusQuery.data]);

  const onLogin = React.useCallback((u: ShellUser) => {
    setUser(u);
    loadWorkspace();
    // Force fresh menus for the new session (clears any stale cached result).
    queryClient.invalidateQueries({ queryKey: erpQueryKeys.myMenus });
    try { window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u)); } catch { /* noop */ }
  }, [loadWorkspace, queryClient]);

  const onLogout = React.useCallback(() => {
    workspaceReady.current = false;
    setUser(null);
    setNav(NAV);
    try {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      clearAllWorkspaces();
    } catch { /* noop */ }
    // Clear cached session data so next login fetches fresh.
    queryClient.removeQueries({ queryKey: erpQueryKeys.me });
    queryClient.removeQueries({ queryKey: erpQueryKeys.myMenus });
    apiLogout().catch(() => { /* ignore */ });
  }, [queryClient]);

  // Persist workspace state whenever tabs or active tab change (skip in global mode).
  React.useEffect(() => {
    if (!workspaceReady.current || !user || !workspaceId) return;
    const ws = getOrCreateWorkspace(workspaceId);
    saveWorkspace({
      ...ws,
      tabs: tabs.map((t) => ({ id: t.id, route: t.route })),
      activeTabId: activeId,
    });
  }, [tabs, activeId, workspaceId, user]);

  const t = React.useMemo(() => makeTranslator(lang), [lang]);

  // Mirror the current language into the module-level registry so non-React
  // helpers (confirm dialog, toast bulk-action) can translate without props.
  React.useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  const initialRouteHandled = React.useRef(false);
  React.useEffect(() => {
    if (initialRouteHandled.current || !initialRoute || !user) return;
    initialRouteHandled.current = true;
    if (readUrlRoutingEnabled()) navigateInTab(initialRoute);
    else openTab(initialRoute);
  }, [initialRoute, user, openTab, navigateInTab]);

  React.useEffect(() => {
    const el = document.documentElement;
    let stored: Record<string, string> = {};
    try {
      const raw = window.localStorage.getItem('erp-appearance');
      if (raw) stored = JSON.parse(raw) as Record<string, string>;
    } catch {
      stored = {};
    }
    el.setAttribute('data-density', stored.density ?? 'compact');
    el.setAttribute('data-fontscale', stored.fontScale ?? 'base');
    el.setAttribute('data-sidebar', stored.sidebar ?? 'icon');
    el.setAttribute('data-primary', stored.primary ?? 'blue');
  }, []);

  const confirmClose = React.useCallback(
    (id: string) => {
      // Snapshot the label via functional setState so we don't take a
      // dependency on the changing `tabs` array.
      let label = t('tab ini');
      setTabs((prev) => {
        const tab = prev.find((tb) => tb.id === id);
        if (tab) label = pageMeta(tab.route, t).title;
        return prev;
      });
      confirmAction({
        title: t('Tutup tab?'),
        message: t('"{label}" akan ditutup.').replace('{label}', label),
        variant: 'warn',
        confirmLabel: t('Tutup'),
        confirmIcon: 'x',
        cancelLabel: t('Batal'),
        onConfirm: () => closeTab(id),
      });
    },
    [t, closeTab, setTabs],
  );

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
      if (!urlRoutingEnabled && (e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const n = parseInt(e.key, 10);
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
        setLang((l) => (l === 'id' ? 'en' : l === 'en' ? 'ja' : 'id'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeId, tabs, confirmClose, setActiveId, urlRoutingEnabled]);

  React.useEffect(() => {
    const sc = () => setShortcutsOpen(true);
    window.addEventListener('open-shortcuts', sc);
    return () => window.removeEventListener('open-shortcuts', sc);
  }, []);

  // Hydrate lang from server SSOT on login; listen for same-tab lang changes.
  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyPreferences()
      .then((prefs) => {
        if (cancelled || !prefs) return;
        if (prefs.language) {
          const next = prefs.language as Lang;
          if (next === 'id' || next === 'en' || next === 'ja') setLang(next);
        }
        const meta = (prefs.metadata ?? {}) as Record<string, string>;
        const el = document.documentElement;
        if (meta.density === 'compact' || meta.density === 'comfortable') {
          el.setAttribute('data-density', meta.density);
        }
        if (meta.fontScale) el.setAttribute('data-fontscale', meta.fontScale);
        if (meta.sidebar) el.setAttribute('data-sidebar', meta.sidebar);
        if (meta.primary) el.setAttribute('data-primary', meta.primary);
        // Hydrate urlRouting from server SSOT: update localStorage so
        // readUrlRoutingEnabled() returns the correct value on next load,
        // and notify useUrlRouting to update its live state.
        if ('urlRouting' in meta) {
          const urlRouting = !!(meta as unknown as { urlRouting?: boolean }).urlRouting;
          try {
            const raw = window.localStorage.getItem('erp-appearance') ?? '{}';
            const stored = JSON.parse(raw) as Record<string, unknown>;
            stored.urlRouting = urlRouting;
            window.localStorage.setItem('erp-appearance', JSON.stringify(stored));
          } catch { /* ignore */ }
          window.dispatchEvent(
            new CustomEvent('erp-hydrate-url-routing', { detail: { enabled: urlRouting } }),
          );
        }
      })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [user]);

  React.useEffect(() => {
    const onSetLang = (e: Event) => {
      const detail = (e as CustomEvent<{ lang: Lang }>).detail;
      if (!detail) return;
      const next = detail.lang;
      if (next === 'id' || next === 'en' || next === 'ja') setLang(next);
    };
    window.addEventListener('erp-set-lang', onSetLang as EventListener);
    return () => window.removeEventListener('erp-set-lang', onSetLang as EventListener);
  }, []);

  const onPaletteAction = React.useCallback(
    (id: string) => {
      if (id.startsWith('toggle:')) {
        const what = id.split(':')[1];
        if (what === 'lang') setLang((l) => (l === 'id' ? 'en' : l === 'en' ? 'ja' : 'id'));
        return;
      }
      if (id.startsWith('new:')) { navigate(id.split(':')[1]); return; }
      navigate(id);
    },
    [navigate],
  );

  const meta = pageMeta(activeRoute, t);
  const crumbs: Crumb[] = meta.crumbs;
  const sidebarCurrent = activeRoute;

  React.useEffect(() => {
    document.title = `${meta.title} | Sentient ERP`;
  }, [meta.title]);

  if (!hydrated) return null;
  if (!user) return <LoginPage onLogin={onLogin} />;

  return (
    <>
      <div className="app">
        <Sidebar nav={nav} current={sidebarCurrent} onNavigate={navigate} t={t} workspaceId={workspaceId} />
        <Topbar
          crumbs={crumbs}
          onOpenPalette={() => setPaletteOpen(true)}
          t={t}
          user={user}
          onNavigate={navigate}
          onLogout={onLogout}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
        <main className="main">
          {!urlRoutingEnabled && (
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
              onReorder={reorderTabs}
              t={t}
            />
          )}
          <div className="tabviews">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              const viewKey = `${tab.id}:${tab.nonce ?? 0}`;
              return (
                <div
                  key={viewKey}
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
        nav={nav}
        workspaceId={workspaceId}
      />

      <NotificationDrawer onNavigate={navigate} t={t} />
      <ActivityDrawer t={t} />
      <ConfirmDialogHost />

      {shortcutsOpen && (
        <ShortcutsOverlay onClose={() => setShortcutsOpen(false)} urlRoutingEnabled={urlRoutingEnabled} />
      )}
    </>
  );
}
