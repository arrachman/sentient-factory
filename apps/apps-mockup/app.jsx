/* app.jsx — Root app, router, tweaks wiring */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "primary": "#1B84FF",
  "density": "spacious",
  "radius": 12,
  "fontSize": 14,
  "font": "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState(() => {
    const h = (location.hash || '').replace('#', '');
    return h && NAV_ITEMS.find(i => i.id === h) ? h : 'dashboard';
  });

  React.useEffect(() => {
    applyTheme({ theme: t.theme, primary: t.primary, density: t.density, radius: t.radius, fontSize: t.fontSize, font: t.font });
  }, [t.theme, t.primary, t.density, t.radius, t.fontSize, t.font]);

  React.useEffect(() => { location.hash = page; }, [page]);
  React.useEffect(() => {
    const onHash = () => { const h = (location.hash || '').replace('#', ''); if (h) setPage(h); };
    window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const PAGES = {
    dashboard: PageDashboard,
    attendance: PageMyAttendance,
    history: PageHistory,
    reviews: PageReviews,
    face: PageFaceEnrollment,
    worksites: PageWorksites,
  };
  const Page = PAGES[page] || PageDashboard;

  return (
    <>
      <Shell
        current={page}
        onNavigate={setPage}
        user={{ name: 'Andi Pratama', role: 'Production Lead' }}
        theme={t.theme}
        onThemeToggle={() => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark')}
      >
        <div key={page} style={{ animation: 'sf-fade-in .25s ease both' }}>
          <Page />
        </div>
      </Shell>

      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={['light', 'dark']} onChange={v => setTweak('theme', v)} />
        <TweakColor label="Primary color" value={t.primary} onChange={v => setTweak('primary', v)} />
        <TweakRadio label="Density" value={t.density} options={['compact', 'comfortable', 'spacious']} onChange={v => setTweak('density', v)} />
        <TweakSlider label="Card radius" value={t.radius} min={4} max={24} step={1} unit="px" onChange={v => setTweak('radius', v)} />

        <TweakSection label="Typography" />
        <TweakSlider label="Font size" value={t.fontSize} min={12} max={18} step={1} unit="px" onChange={v => setTweak('fontSize', v)} />
        <TweakSelect label="Font family" value={t.font} options={[
          { value: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif', label: 'Inter (default)' },
          { value: 'ui-sans-serif, system-ui, -apple-system, sans-serif', label: 'System' },
          { value: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif', label: 'IBM Plex Sans' },
          { value: '"DM Sans", ui-sans-serif, system-ui, sans-serif', label: 'DM Sans' },
          { value: '"Geist", ui-sans-serif, system-ui, sans-serif', label: 'Geist' },
        ]} onChange={v => setTweak('font', v)} />

        <TweakSection label="Quick presets" />
        <TweakButton onClick={() => { setTweak({ theme: 'light', primary: '#1B84FF', density: 'spacious', radius: 12 }); }}>Sentient default</TweakButton>
        <TweakButton onClick={() => { setTweak({ theme: 'dark', primary: '#7239EA', density: 'comfortable', radius: 14 }); }}>Midnight indigo</TweakButton>
        <TweakButton onClick={() => { setTweak({ theme: 'light', primary: '#0F172A', density: 'compact', radius: 6 }); }}>Enterprise mono</TweakButton>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
