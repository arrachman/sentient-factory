'use client';

import * as React from 'react';
import { makeTranslator } from '@/lib/mock';
import { Dashboard } from '@/components/pages/dashboard';
import { ComingSoon } from '@/components/pages/coming-soon';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar, type ShellUser } from '@/components/organisms/topbar';
import { TabBar, type ShellTab } from '@/components/organisms/tab-bar';
import { CommandPalette } from '@/components/organisms/command-palette';
import { pageMeta, type Crumb } from '@/lib/nav';

const MAX_TABS = 16;

type Lang = 'id' | 'en';

const DEMO_USER: ShellUser = {
  user: 'adi.s',
  name: 'Adi Santoso',
  email: 'adi.santoso@sentient.id',
  initials: 'AS',
};

function renderRoute(route: string, onNavigate: (r: string) => void, t: ReturnType<typeof makeTranslator>) {
  if (route === 'home') return <Dashboard t={t} onNavigate={onNavigate} />;
  return <ComingSoon route={route} />;
}

/**
 * Top-level multi-tab shell — ported from prototype `app.jsx`. Tab/route
 * state is React-local (no router-driven persistence, per scaffold scope).
 */
export function AppShell() {
  // Deterministic across SSR/client so tab `data-tab` hydrates cleanly.
  const initialTabId = React.useId();
  const tabSeq = React.useRef(0);
  const nextTabId = React.useCallback(
    () => `t${(tabSeq.current += 1)}`,
    [],
  );

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
  }, [nextTabId]);

  const duplicateTab = React.useCallback((id: string) => {
    setTabs((prev) => {
      const src = prev.find((tb) => tb.id === id) ?? prev[prev.length - 1];
      if (!src || prev.length >= MAX_TABS) return prev;
      const tab = { id: nextTabId(), route: src.route };
      setActiveId(tab.id);
      return [...prev, tab];
    });
  }, [nextTabId]);

  const navigateInTab = React.useCallback(
    (route: string) => {
      setTabs((prev) =>
        prev.map((tb) => (tb.id === activeId ? { ...tb, route } : tb)),
      );
    },
    [activeId],
  );

  const closeTab = React.useCallback((id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((tb) => tb.id === id);
      if (idx === -1) return prev;
      const next = prev.filter((tb) => tb.id !== id);
      if (next.length === 0) {
        const fresh = { id: nextTabId(), route: 'home' };
        setActiveId(fresh.id);
        return [fresh];
      }
      setActiveId((cur) =>
        cur === id ? next[Math.max(0, idx - 1)].id : cur,
      );
      return next;
    });
  }, [nextTabId]);

  // Global shortcuts — Cmd/Ctrl+K palette, Cmd/Ctrl+W close, ? shortcuts.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inEditor = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        closeTab(activeId);
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
  }, [activeId, closeTab]);

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

  return (
    <>
      <div className="app">
        <Sidebar current={sidebarCurrent} onNavigate={openTab} t={t} />
        <Topbar
          crumbs={crumbs}
          onOpenPalette={() => setPaletteOpen(true)}
          t={t}
          user={DEMO_USER}
          onNavigate={openTab}
          onLogout={() => undefined}
        />
        <main className="main">
          <TabBar
            tabs={tabs}
            activeId={activeId}
            onActivate={setActiveId}
            onClose={closeTab}
            onDuplicate={duplicateTab}
            onNew={() => openTab('home')}
            t={t}
          />
          <div className="tabviews">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <div
                  key={tab.id}
                  className="tabview"
                  style={{ display: isActive ? 'flex' : 'none' }}
                >
                  {renderRoute(tab.route, navigateInTab, t)}
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

      {shortcutsOpen && (
        <div className="sc-overlay" onClick={() => setShortcutsOpen(false)}>
          <div className="sc-card" onClick={(e) => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className="sc-grid">
              <div>Buka command palette</div>
              <div>⌘ K</div>
              <div>Tutup tab aktif</div>
              <div>⌘ W</div>
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
