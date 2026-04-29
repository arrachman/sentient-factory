/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ===== Icon set (lucide-style stroked SVGs) =====
const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.8 }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round"
  };
  const paths = {
    home: <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></>,
    sparkles: <><path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9z"/><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    shield: <><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chev: <><path d="m9 6 6 6-6 6"/></>,
    chevDown: <><path d="m6 9 6 6 6-6"/></>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown: <><path d="M12 5v14M19 12l-7 7-7-7"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    paperclip: <><path d="m21 12-9.5 9.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5L9.5 19.5a2 2 0 0 1-3-3L15 8"/></>,
    db: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
    pin: <><path d="M12 2v6"/><path d="M9 8h6l1 8H8z"/><path d="M12 16v6"/></>,
    sidebar: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></>,
    table: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 16h18M9 4v16M15 4v16"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-7"/></>,
    pie: <><path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M21 12a9 9 0 0 0-9-9v9z"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    filter: <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    moreV: <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
    check: <><path d="M5 12l5 5L20 7"/></>,
    x: <><path d="M6 6l12 12M18 6L6 18"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    bolt: <><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    play: <><path d="M6 4l14 8-14 8z"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    trash: <><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    flag: <><path d="M4 21V4M4 4h12l-2 4 2 4H4"/></>,
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 7l2-4h10l2 4v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/></>,
    msg: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    wa: <><path d="M3 21l1.6-5A9 9 0 1 1 8 19.4z"/><path d="M9 9c0 4 2 6 6 6l1.5-1.5-2-1-1 1c-1.5-.4-2.6-1.5-3-3l1-1-1-2z"/></>,
    factory: <><path d="M2 21V9l6 4V9l6 4V9l6 4v8z"/><path d="M9 17h2M14 17h2"/></>,
    sliders: <><path d="M4 21V14M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>,
    layers: <><path d="m12 2 10 6-10 6L2 8z"/><path d="m2 14 10 6 10-6"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></>,
    truck: <><rect x="1" y="6" width="13" height="11" rx="1"/><path d="M14 9h4l3 4v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    cart: <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h2l3 13h12l2-9H6"/></>,
    coin: <><circle cx="12" cy="12" r="9"/><path d="M14 9h-3a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/><path d="M12 7v2M12 15v2"/></>,
    zap: <><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></>
  };
  return <svg {...props}>{paths[name] || paths.box}</svg>;
};

// ===== Sidebar =====
const Sidebar = ({ active, expanded = {} }) => {
  const items = [
    { id: "home", label: "Home", icon: "home", section: "main" },
    { id: "senti", label: "Senti AI", icon: "sparkles", section: "main" },
    { id: "dashboard", label: "Dashboard", icon: "grid", children: [
      { id: "finance", label: "Finance" },
      { id: "warehouse", label: "Warehouse" },
      { id: "purchase", label: "Purchase" },
      { id: "delivery", label: "Delivery" },
      { id: "production", label: "Production" },
      { id: "sales", label: "Sales" },
    ]},
    { id: "alerting", label: "Alerting", icon: "bell", children: [
      { id: "alert-center", label: "Alert Center" },
      { id: "alert-rules", label: "Alert Rules" },
      { id: "alert-templates", label: "Alert Templates" },
      { id: "notif-channels", label: "Notification Channels" },
      { id: "notif-logs", label: "Notification Logs" },
      { id: "alert-settings", label: "Settings" },
    ]},
    { id: "admin", label: "Administrator", icon: "shield", children: [
      { id: "users", label: "Users" },
      { id: "roles", label: "Roles" },
      { id: "audit", label: "Audit Trail" },
    ]},
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div className="brand-text">
          <strong>SENTIENT</strong>
          <span>Factory OS</span>
        </div>
      </div>

      <div className="sidebar-section" style={{ flex: 1, overflowY: "auto" }}>
        <div className="sidebar-section-label">Workspace</div>
        {items.map(item => {
          const isActive = active === item.id || (item.children && item.children.some(c => c.id === active));
          const isExpanded = expanded[item.id] ?? (item.children && item.children.some(c => c.id === active));
          return (
            <div key={item.id}>
              <div className={`nav-item ${isActive ? "active" : ""} ${isExpanded ? "expanded" : ""}`}>
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
                {item.children && <Icon name="chev" size={14} className="chev" />}
              </div>
              {item.children && isExpanded && (
                <div className="nav-children">
                  {item.children.map(c => (
                    <div key={c.id} className={`nav-child ${active === c.id ? "active" : ""}`}>{c.label}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="uavatar">N</div>
        <div className="meta">
          <strong>Nadia Pratama</strong>
          <span>Factory Admin</span>
        </div>
      </div>
    </aside>
  );
};

// ===== Topbar =====
const Topbar = ({ title, crumbs = [], showSearch = true, actions = null }) => (
  <div className="topbar">
    <div>
      <h1>{title}</h1>
      {crumbs.length > 0 && (
        <div className="crumbs" style={{ marginTop: 2 }}>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chev" size={11} />}
              {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
    {showSearch && (
      <div className="search-bar" style={{ marginLeft: 24 }}>
        <Icon name="search" size={15} color="#a1a8b5" />
        <input placeholder="Search anything…" />
        <span className="kbd">⌘K</span>
      </div>
    )}
    <div className="topbar-right">
      {actions}
      <button className="icon-btn" title="Notifications">
        <Icon name="bell" size={17} />
        <span className="dot"></span>
      </button>
      <button className="icon-btn" title="Settings">
        <Icon name="settings" size={17} />
      </button>
      <div className="user-chip">
        <div className="av">SA</div>
        <div>
          <div className="uname">Senti Admin</div>
          <span className="urole">admin@sentient.id</span>
        </div>
      </div>
    </div>
  </div>
);

window.SF = { Icon, Sidebar, Topbar };
