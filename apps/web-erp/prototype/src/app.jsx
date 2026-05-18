// Sentient ERP — root app (multi-tab shell)
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "primary": "blue",
  "lang": "id",
  "density": "compact",
  "fontScale": "base",
  "sidebar": "icon"
}/*EDITMODE-END*/;

const MAX_TABS = 16;
let _tabSeq = 1;
const nextTabId = () => `t${_tabSeq++}`;

// Resolve a route to its page component (drill-down stays in the same tab via onNav).
const renderRoute = (route, onNav, onOpen, t, lang, tw) => {
  if (route === 'home') return <Dashboard t={t} onNavigate={onOpen}/>;
  if (route === 'statistik') return <Statistik t={t} onNavigate={onOpen}/>;
  if (route === 'set-prefs') return <SettingsPage t={t}/>;
  if (route === 'set-appearance') return <AppearancePage t={t} tw={tw}/>;
  if (route === 'approval-queue') return <ApprovalQueue t={t} onNavigate={onNav} onOpenTab={onOpen}/>;
  if (route === 'audit-trail') return <AuditTrail t={t}/>;
  if (route.endsWith('-new')) {
    const base = route.slice(0, -4);
    if (window.TRX_CFG && window.TRX_CFG[base]) return <TrxForm moduleId={base} t={t} lang={lang} onNavigate={onNav}/>;
    if (window.DOC_CFG && window.DOC_CFG[base]) return <DocForm moduleId={base} t={t} onNavigate={onNav}/>;
    if (window.REGISTRY && window.REGISTRY[base]) return <RecordForm moduleId={base} t={t} onNavigate={onNav}/>;
  }
  if (route.endsWith('-view') && route.length > 5) {
    const base = route.slice(0, -5);
    return <DetailPage moduleId={base} t={t} onNavigate={onNav} onOpenTab={onOpen}/>;
  }
  if (route === 'kas-masuk') return <KasMasukList t={t} lang={lang} onNavigate={onNav} onOpenTab={onOpen}/>;
  if (window.MODULES && window.MODULES[route]) return <GenericList moduleId={route} t={t} onNavigate={onNav} onOpenTab={onOpen}/>;
  if (window.REPORTS && window.REPORTS[route]) return <FinancialReport moduleId={route} t={t}/>;
  if (window.MODULE_REPORTS_EXT && window.MODULE_REPORTS_EXT[route]) return <ModuleReportExt moduleId={route} t={t}/>;
  if (window.MODULE_REPORTS && window.MODULE_REPORTS[route]) return <ModuleReport moduleId={route} t={t}/>;
  if (window.REGISTRY && window.REGISTRY[route]) return <DataList moduleId={route} t={t} onNavigate={onNav} onOpenTab={onOpen}/>;
  return <div style={{ padding: 32, color: 'var(--fg-muted)' }}>Halaman <strong>{route}</strong> belum tersedia di prototype ini.</div>;
};

const App = () => {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = tw.lang;
  const tx = useT(lang);

  const [tabs, setTabs] = React.useState([{ id: nextTabId(), route: 'home' }]);
  const [activeId, setActiveId] = React.useState(() => tabs[0].id);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [user, setUser] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('erp-user') || 'null'); } catch (e) { return null; }
  });

  const login = React.useCallback((u) => {
    setUser(u);
    try { localStorage.setItem('erp-user', JSON.stringify(u)); } catch (e) {}
  }, []);

  const logout = React.useCallback(() => {
    window.confirmAction({
      title: 'Keluar dari Sentient ERP?',
      message: 'Sesi Anda akan diakhiri dan kembali ke halaman masuk.',
      variant: 'danger', icon: 'arrowleft', confirmLabel: 'Keluar', confirmIcon: 'arrowleft',
      onConfirm: () => {
        setUser(null);
        try { localStorage.removeItem('erp-user'); } catch (e) {}
        window.toast('Anda telah keluar dari sesi.', { type: 'info' });
      },
    });
  }, []);

  const activeTab = tabs.find(tb => tb.id === activeId) || tabs[0];
  const activeRoute = activeTab ? activeTab.route : 'home';

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tw.theme);
    document.documentElement.setAttribute('data-primary', tw.primary);
    document.documentElement.setAttribute('data-density', tw.density);
    document.documentElement.setAttribute('data-fontscale', tw.fontScale || 'base');
    document.documentElement.setAttribute('data-sidebar', tw.sidebar || 'icon');
  }, [tw.theme, tw.primary, tw.density, tw.fontScale, tw.sidebar]);

  // Bridge: in-app Appearance page dispatches tweak edits here.
  React.useEffect(() => {
    const onSet = (e) => { const d = e.detail || {}; setTweak(d.key, d.val); };
    window.addEventListener('app-set-tweak', onSet);
    return () => window.removeEventListener('app-set-tweak', onSet);
  }, [setTweak]);

  // Open-or-focus: reuse an existing tab for this route, else open a new one.
  const openTab = React.useCallback((route) => {
    setTabs(prev => {
      const existing = prev.find(tb => tb.route === route);
      if (existing) { setActiveId(existing.id); return prev; }
      if (prev.length >= MAX_TABS) { setActiveId(prev[prev.length - 1].id); return prev; }
      const tab = { id: nextTabId(), route };
      setActiveId(tab.id);
      return [...prev, tab];
    });
  }, []);

  const duplicateTab = React.useCallback((id) => {
    setTabs(prev => {
      const src = prev.find(tb => tb.id === id) || prev[prev.length - 1];
      if (!src || prev.length >= MAX_TABS) return prev;
      const tab = { id: nextTabId(), route: src.route };
      setActiveId(tab.id);
      return [...prev, tab];
    });
  }, []);

  // In-page drill-down: replace the active tab's route (keeps it one tab).
  const navigateInTab = React.useCallback((route) => {
    setTabs(prev => prev.map(tb => tb.id === activeId ? { ...tb, route } : tb));
  }, [activeId]);

  const closeTab = React.useCallback((id) => {
    setTabs(prev => {
      const idx = prev.findIndex(tb => tb.id === id);
      if (idx === -1) return prev;
      const next = prev.filter(tb => tb.id !== id);
      if (next.length === 0) {
        const fresh = { id: nextTabId(), route: 'home' };
        setActiveId(fresh.id);
        return [fresh];
      }
      setActiveId(cur => cur === id ? next[Math.max(0, idx - 1)].id : cur);
      return next;
    });
  }, []);

  // Global shortcuts (App-level — never tab-gated, default context is active).
  useKey((e) => {
    if (window.__overlay) return;
    const inEditor = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(true); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w') { e.preventDefault(); closeTab(activeId); return; }
    if (inEditor) return;
    if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); setShortcutsOpen(true); return; }
    if (e.key === '/') { e.preventDefault(); document.querySelector('.search-input input')?.focus(); return; }
    if (e.key.toLowerCase() === 't') { setTweak('theme', tw.theme === 'dark' ? 'light' : 'dark'); return; }
    if (e.key.toLowerCase() === 'l') { setTweak('lang', lang === 'id' ? 'en' : 'id'); return; }
    if (e.key.toLowerCase() === 'g') {
      const handler = (ev) => {
        const k = ev.key.toLowerCase();
        const map = { h: 'home', k: 'kas-masuk', c: 'kas-keluar', b: 'bank-masuk', j: 'jurnal-umum', l: 'buku-besar', s: 'statistik' };
        if (map[k]) openTab(map[k]);
        window.removeEventListener('keydown', handler);
      };
      window.addEventListener('keydown', handler, { once: true });
      return;
    }
  });

  React.useEffect(() => {
    const sc = () => setShortcutsOpen(true);
    window.addEventListener('open-shortcuts', sc);
    return () => window.removeEventListener('open-shortcuts', sc);
  }, []);

  const onPaletteAction = (id) => {
    if (id.startsWith('toggle:')) {
      const what = id.split(':')[1];
      if (what === 'theme') setTweak('theme', tw.theme === 'dark' ? 'light' : 'dark');
      if (what === 'lang') setTweak('lang', lang === 'id' ? 'en' : 'id');
      return;
    }
    if (id.startsWith('new:')) {
      const m = id.split(':')[1];
      openTab(`${m}-new`);
      return;
    }
    openTab(id);
  };

  // Breadcrumbs follow the active tab; make the parent of a "new" form clickable.
  const crumbs = (() => {
    const c = window.pageMeta(activeRoute, tx).crumbs.map(x => ({ ...x }));
    if (activeRoute.endsWith('-new') && c.length >= 2) {
      const base = activeRoute.slice(0, -4);
      const idx = c.length - 2; // module label, just before "Baru"
      c[idx] = { ...c[idx], onClick: () => navigateInTab(base) };
    }
    return c;
  })();

  if (!user) {
    return (
      <>
        <LoginPage onLogin={login}/>
        <ToastHost/>
        <ConfirmHost/>
      </>
    );
  }

  const sidebarCurrent = activeRoute.endsWith('-new') ? activeRoute.slice(0, -4) : activeRoute;

  return (
    <>
      <div className="app">
        <Sidebar current={sidebarCurrent} onNavigate={openTab} t={tx}/>
        <Topbar crumbs={crumbs} onOpenPalette={() => setPaletteOpen(true)} lang={lang} t={tx}
          user={user} onNavigate={openTab} onLogout={logout}/>
        <main className="main">
          <TabStrip tabs={tabs} activeId={activeId}
            onActivate={setActiveId} onClose={closeTab}
            onDuplicate={duplicateTab} onNew={() => openTab('home')} t={tx}/>
          <div className="tabviews">
            {tabs.map(tab => {
              const isActive = tab.id === activeId;
              return (
                <div key={tab.id} className="tabview" style={{ display: isActive ? 'flex' : 'none' }}>
                  <TabActiveContext.Provider value={isActive}>
                    {renderRoute(tab.route, navigateInTab, openTab, tx, lang, tw)}
                  </TabActiveContext.Provider>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onAction={onPaletteAction} t={tx}/>

      <NotificationPanel t={tx} onNavigate={openTab}/>
      <ActivityPanel t={tx}/>
      <ToastHost/>
      <ConfirmHost/>

      {shortcutsOpen && (
        <div className="sc-overlay" onClick={() => setShortcutsOpen(false)}>
          <div className="sc-card" onClick={e => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className="sc-grid">
              <div>Buka command palette</div><div><Kbd>⌘</Kbd><Kbd>K</Kbd></div>
              <div>Tutup tab aktif</div><div><Kbd>⌘</Kbd><Kbd>W</Kbd></div>
              <div>Fokus pencarian</div><div><Kbd>/</Kbd></div>
              <div>Toggle dark mode</div><div><Kbd>T</Kbd></div>
              <div>Toggle bahasa ID/EN</div><div><Kbd>L</Kbd></div>
              <div>Buka Dashboard</div><div><Kbd>G</Kbd> <Kbd>H</Kbd></div>
              <div>Buka Kas Masuk</div><div><Kbd>G</Kbd> <Kbd>K</Kbd></div>
              <div>Buka Statistik</div><div><Kbd>G</Kbd> <Kbd>S</Kbd></div>
              <div>Buka Buku Besar</div><div><Kbd>G</Kbd> <Kbd>L</Kbd></div>
              <div>Transaksi baru</div><div><Kbd>N</Kbd></div>
              <div>Pilih/buang baris</div><div><Kbd>X</Kbd> atau <Kbd>Space</Kbd></div>
              <div>Navigasi baris</div><div><Kbd>J</Kbd> / <Kbd>K</Kbd></div>
              <div>Tampilkan shortcut</div><div><Kbd>?</Kbd></div>
              <div>Tutup overlay</div><div><Kbd>ESC</Kbd></div>
            </div>
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button className="btn" onClick={() => setShortcutsOpen(false)}>Tutup <Kbd>ESC</Kbd></button>
            </div>
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tampilan">
          <TweakRadio label="Theme" value={tw.theme} options={['light', 'dark']}
            onChange={v => setTweak('theme', v)}/>
          <TweakColor label="Warna primer" value={tw.primary}
            options={['blue', 'indigo', 'violet', 'fuchsia', 'rose', 'amber', 'emerald', 'teal', 'cyan']}
            onChange={v => setTweak('primary', v)}/>
          <TweakRadio label="Bahasa" value={tw.lang} options={['id', 'en']}
            onChange={v => setTweak('lang', v)}/>
          <TweakRadio label="Density" value={tw.density} options={['compact', 'comfortable']}
            onChange={v => setTweak('density', v)}/>
          <TweakRadio label="Font" value={tw.fontScale} options={['sm', 'base', 'lg', 'xl']}
            onChange={v => setTweak('fontScale', v)}/>
          <TweakRadio label="Sidebar" value={tw.sidebar} options={['icon', 'label']}
            onChange={v => setTweak('sidebar', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
