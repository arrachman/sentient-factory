/* global React, SF */
const { Icon } = SF;

// MobileShell — wraps a screen with topbar, drawer, FAB, bottom tabs
// Props: { active, title, sub, onTab, onBack, hideTab, hideFab, sheetOpen, sheet, drawer, dark, density, labels, children }

const MobileTabBar = ({ active, onTab, labels = true }) => {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "senti", label: "Senti AI", icon: "sparkles" },
    { id: "alerts", label: "Alerts", icon: "bell", badge: 8 },
    { id: "more", label: "More", icon: "grid" },
  ];
  return (
    <div className={`m-tabbar ${labels ? "" : "no-labels"}`}>
      {tabs.map(t => (
        <button key={t.id} className={`tab ${active === t.id ? "active" : ""}`} onClick={() => onTab && onTab(t.id)}>
          <Icon name={t.icon} size={20} />
          {t.badge && <span className="badge-dot">{t.badge}</span>}
          {labels && <span className="label">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};

const MobileDrawer = ({ open, onClose, active, onNav }) => {
  const nav = [
    { sec: "Workspace", items: [
      { id: "home", icon: "home", label: "Home" },
      { id: "senti", icon: "sparkles", label: "Senti AI" },
    ]},
    { sec: "Dashboards", items: [
      { id: "finance", icon: "coin", label: "Finance" },
      { id: "warehouse", icon: "box", label: "Warehouse" },
      { id: "purchase", icon: "cart", label: "Purchase" },
      { id: "sales", icon: "chart", label: "Sales" },
      { id: "production", icon: "factory", label: "Production" },
    ]},
    { sec: "Alerting", items: [
      { id: "alerts", icon: "bell", label: "Alert Center", badge: 8 },
      { id: "rules", icon: "bolt", label: "Alert Rules" },
      { id: "templates", icon: "layers", label: "Templates" },
      { id: "channels", icon: "msg", label: "Channels" },
      { id: "logs", icon: "table", label: "Notification Logs" },
      { id: "settings", icon: "settings", label: "Settings" },
    ]},
  ];
  return (
    <>
      <div className={`m-drawer-backdrop ${open ? "open" : ""}`} onClick={onClose}/>
      <div className={`m-drawer ${open ? "open" : ""}`}>
        <div className="head">
          <div className="brand">
            <div className="logo">SF</div>
            <div>
              <div className="name">Sentient Factory</div>
              <div className="role">Mission Control · v2.1</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, padding: "10px 12px", background: "rgba(255,255,255,0.12)", borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 50, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>NP</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Nadia Pratama</div>
              <div style={{ fontSize: 11, opacity: 0.78 }}>Factory Admin</div>
            </div>
          </div>
        </div>
        <div className="nav">
          {nav.map((s, i) => (
            <div key={i}>
              <div className="nav-section-title">{s.sec}</div>
              {s.items.map(item => (
                <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => { onNav && onNav(item.id); onClose && onClose(); }}>
                  <Icon name={item.icon} size={18}/>
                  <span>{item.label}</span>
                  {item.badge && <span className="badge danger">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const MobileSheet = ({ open, onClose, title, headRight, children }) => (
  <>
    <div className={`m-sheet-backdrop ${open ? "open" : ""}`} onClick={onClose}/>
    <div className={`m-sheet ${open ? "open" : ""}`}>
      <div className="grabber"/>
      <div className="head">
        <div className="title">{title}</div>
        {headRight}
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-3)", padding: 4, cursor: "pointer" }}><Icon name="x" size={18}/></button>
      </div>
      <div className="body">{children}</div>
    </div>
  </>
);

const MobileTopbar = ({ title, sub, onMenu, onBack, trailing }) => (
  <div className="m-topbar">
    {onBack ? (
      <button className="leading" onClick={onBack}><Icon name="chev" size={18} style={{ transform: "rotate(180deg)" }}/></button>
    ) : (
      <button className="leading" onClick={onMenu}><Icon name="sliders" size={18} style={{ transform: "rotate(90deg)" }}/></button>
    )}
    <div className="title-block">
      <div className="title">{title}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {trailing}
  </div>
);

// Senti AI bottom sheet — used from FAB
const SentiSheet = ({ open, onClose }) => {
  const [q, setQ] = React.useState("");
  const prompts = [
    "Top customer di Surabaya bulan ini",
    "Stok yang akan habis 14 hari ke depan",
    "Lead time supplier paling lambat",
    "Cashflow forecast Q2 2026",
  ];
  return (
    <MobileSheet open={open} onClose={onClose} title="Tanya Senti AI">
      <div style={{ padding: 14 }}>
        <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="sparkles" size={16} color="#7239ea"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ketik pertanyaan…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)" }}/>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="arrowUp" size={14}/></button>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "16px 0 8px" }}>Saran</div>
        {prompts.map((p, i) => (
          <div key={i} className="m-row" style={{ borderRadius: 10, marginBottom: 6, border: "1px solid var(--border)" }}>
            <Icon name="sparkles" size={16} color="#7239ea"/>
            <div className="body"><div className="t" style={{ fontSize: 13, fontWeight: 500 }}>{p}</div></div>
            <Icon name="chev" size={14} color="var(--text-3)"/>
          </div>
        ))}
        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "16px 0 8px" }}>Riwayat</div>
        {[
          { t: "Sales Surabaya −31.6% kemarin — kenapa?", at: "10m" },
          { t: "AR Aging 90+ di Jakarta", at: "2h" },
          { t: "Yield production Line C 7 hari", at: "Kemarin" },
        ].map((r,i) => (
          <div key={i} className="m-row" style={{ borderRadius: 10, marginBottom: 6, border: "1px solid var(--border)" }}>
            <Icon name="clock" size={14} color="var(--text-3)"/>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{r.t}</div><div className="s">{r.at} ago</div></div>
          </div>
        ))}
      </div>
    </MobileSheet>
  );
};

const MobileShell = ({
  active = "home", activeNav, title, sub, onBack, trailing,
  hideTab, hideFab, drawerNav, onNav, onTab,
  dark, density, labels = true,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sentiOpen, setSentiOpen] = React.useState(false);
  return (
    <div className={`m-app ${dark ? "dark" : ""} ${density === "compact" ? "density-compact" : ""}`}>
      <MobileTopbar title={title} sub={sub} onMenu={() => setDrawerOpen(true)} onBack={onBack} trailing={trailing}/>
      <div className={`m-content ${density === "compact" ? "compact" : ""}`}>
        {children}
      </div>
      {!hideFab && (
        <button className="m-fab" onClick={() => setSentiOpen(true)} aria-label="Tanya Senti AI">
          <Icon name="sparkles" size={22} color="white"/>
        </button>
      )}
      {!hideTab && <MobileTabBar active={active} onTab={onTab} labels={labels}/>}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={activeNav || active} onNav={onNav}/>
      <SentiSheet open={sentiOpen} onClose={() => setSentiOpen(false)}/>
    </div>
  );
};

window.MobileShell = MobileShell;
window.MobileSheet = MobileSheet;
window.MobileTopbar = MobileTopbar;
