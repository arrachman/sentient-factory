// Topbar: brand, breadcrumbs, command trigger, user
const Topbar = ({ crumbs, onOpenPalette, lang, t }) => {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo"/>
        <span>Sentient</span>
        <span style={{ color: 'var(--fg-faint)', fontWeight: 400 }}>/ ERP</span>
      </div>
      <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 8px' }}/>
      <nav className="breadcrumb" aria-label="breadcrumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <button className={`crumb crumb-btn ${i === crumbs.length - 1 ? 'active' : ''}`}
              onClick={c.onClick} disabled={!c.onClick}>
              {c.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="spacer"/>
      <button className="cmd-trigger" onClick={onOpenPalette} title="Command palette">
        <Icon name="search" size={13}/>
        <span>{t('Cari semua...')}</span>
        <span className="kbd-row">
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </span>
      </button>
      <button className="iconbtn has-dot" data-tip="Notifications">
        <Icon name="bell" size={14}/>
      </button>
      <button className="iconbtn" data-tip="Aktivitas" onClick={() => window.dispatchEvent(new CustomEvent('toggle-activity'))}>
        <Icon name="activity" size={14}/>
      </button>
      <button className="iconbtn" data-tip="Pintasan (?)" onClick={() => window.dispatchEvent(new CustomEvent('open-shortcuts'))}>
        <Icon name="keyboard" size={14}/>
      </button>
      <div className="user-chip">
        <span className="avatar">AS</span>
        <span style={{ fontSize: 12 }}>adi.s</span>
        <Icon name="chevdown" size={12}/>
      </div>
    </header>
  );
};

window.Topbar = Topbar;
