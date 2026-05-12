// Sentient ERP — root app
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "primary": "blue",
  "lang": "id",
  "density": "compact"
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = t.lang;
  const tx = useT(lang);

  const [route, setRoute] = React.useState('home'); // home | kas-masuk | kas-masuk-new | kas-keluar | ...
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-primary', t.primary);
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.theme, t.primary, t.density]);

  // Global shortcuts
  useKey((e) => {
    const inEditor = ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(true); return; }
    if (inEditor) return;
    if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); setShortcutsOpen(true); return; }
    if (e.key === '/') { e.preventDefault(); document.querySelector('.search-input input')?.focus(); return; }
    if (e.key.toLowerCase() === 't') { setTweak('theme', t.theme === 'dark' ? 'light' : 'dark'); return; }
    if (e.key.toLowerCase() === 'l') { setTweak('lang', lang === 'id' ? 'en' : 'id'); return; }
    // G + X navigation
    if (e.key.toLowerCase() === 'g') {
      const handler = (ev) => {
        const k = ev.key.toLowerCase();
        if (k === 'h') setRoute('home');
        else if (k === 'k') setRoute('kas-masuk');
        else if (k === 'c') setRoute('kas-keluar');
        else if (k === 'b') setRoute('bank-masuk');
        else if (k === 'j') setRoute('jurnal-umum');
        else if (k === 'l') setRoute('buku-besar');
        window.removeEventListener('keydown', handler);
      };
      window.addEventListener('keydown', handler, { once: true });
    }
    if (e.key.toLowerCase() === 'n' && route !== 'kas-masuk-new') {
      const handler = (ev) => {
        const k = ev.key.toLowerCase();
        if (k === 'c') setRoute('kas-masuk-new');
        else if (k === 'd') setRoute('kas-keluar');
        else if (k === 'j') setRoute('jurnal-umum');
        window.removeEventListener('keydown', handler);
      };
      // Only attach if this is a stand-alone N
      if (route === 'kas-masuk' || route === 'home') {
        if (e.shiftKey) return;
        setRoute('kas-masuk-new');
      } else {
        window.addEventListener('keydown', handler, { once: true });
      }
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
      if (what === 'theme') setTweak('theme', t.theme === 'dark' ? 'light' : 'dark');
      if (what === 'lang') setTweak('lang', lang === 'id' ? 'en' : 'id');
      return;
    }
    if (id.startsWith('new:')) {
      const m = id.split(':')[1];
      if (m === 'kas-masuk') setRoute('kas-masuk-new');
      else setRoute(m);
      return;
    }
    setRoute(id);
  };

  // Build crumbs
  const crumbs = (() => {
    if (route === 'home') return [{ label: tx('Dashboard') }];
    const submap = {
      'kas-masuk': 'Kas Masuk', 'kas-masuk-new': 'Kas Masuk',
      'kas-keluar': 'Kas Keluar', 'bank-masuk': 'Bank Masuk', 'bank-keluar': 'Bank Keluar',
      'jurnal-umum': 'Jurnal Umum', 'giro-masuk': 'Giro Masuk', 'giro-keluar': 'Giro Keluar',
      'giro-masuk-batal': 'Giro Masuk Batal', 'giro-keluar-batal': 'Giro Keluar Batal',
      'saldo-awal': 'Saldo Awal Coa', 'buku-besar': 'Buku Besar',
    };
    const parent = { label: tx('Keuangan'), onClick: () => setRoute('home') };
    const trans = { label: tx('Transaksi') };
    const sub = submap[route];
    const arr = [parent, trans, { label: tx(sub || 'Halaman') }];
    if (route === 'kas-masuk-new') arr[arr.length - 1] = { label: tx('Kas Masuk'), onClick: () => setRoute('kas-masuk') };
    if (route === 'kas-masuk-new') arr.push({ label: 'Baru' });
    return arr;
  })();

  let content;
  if (route === 'home') content = <Dashboard t={tx} onNavigate={(id) => id === 'kas-masuk-new' ? setRoute('kas-masuk-new') : setRoute(id)}/>;
  else if (route === 'kas-masuk') content = <KasMasukList t={tx} lang={lang} onNavigate={setRoute}/>;
  else if (route === 'kas-masuk-new') content = <KasMasukForm t={tx} lang={lang} onNavigate={setRoute}/>;
  else if (MODULES[route]) content = <GenericList moduleId={route} t={tx} onNavigate={setRoute}/>;
  else content = <div style={{ padding: 32 }}>Halaman <strong>{route}</strong> belum tersedia di prototype ini.</div>;

  return (
    <>
      <div className="app">
        <Sidebar current={route === 'kas-masuk-new' ? 'kas-masuk' : route} onNavigate={setRoute} t={tx}/>
        <Topbar crumbs={crumbs} onOpenPalette={() => setPaletteOpen(true)} lang={lang} t={tx}/>
        <main className="main">{content}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onAction={onPaletteAction} t={tx}/>

      {shortcutsOpen && (
        <div className="sc-overlay" onClick={() => setShortcutsOpen(false)}>
          <div className="sc-card" onClick={e => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className="sc-grid">
              <div>Buka command palette</div><div><Kbd>⌘</Kbd><Kbd>K</Kbd></div>
              <div>Fokus pencarian</div><div><Kbd>/</Kbd></div>
              <div>Toggle dark mode</div><div><Kbd>T</Kbd></div>
              <div>Toggle bahasa ID/EN</div><div><Kbd>L</Kbd></div>
              <div>Buka Dashboard</div><div><Kbd>G</Kbd> <Kbd>H</Kbd></div>
              <div>Buka Kas Masuk</div><div><Kbd>G</Kbd> <Kbd>K</Kbd></div>
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
          <TweakRadio label="Theme" value={t.theme} options={['light','dark']}
            onChange={v => setTweak('theme', v)}/>
          <TweakColor label="Warna primer" value={t.primary}
            options={['blue','indigo','emerald','violet']}
            onChange={v => setTweak('primary', v)}/>
          <TweakRadio label="Bahasa" value={t.lang} options={['id','en']}
            onChange={v => setTweak('lang', v)}/>
          <TweakRadio label="Density" value={t.density} options={['compact','comfortable']}
            onChange={v => setTweak('density', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
