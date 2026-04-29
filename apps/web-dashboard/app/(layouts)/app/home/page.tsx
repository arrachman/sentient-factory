type IconName =
  | 'home'
  | 'sparkles'
  | 'grid'
  | 'bell'
  | 'shield'
  | 'chev'
  | 'search'
  | 'settings'
  | 'chart'
  | 'coin'
  | 'bolt'
  | 'factory'
  | 'box'
  | 'cart'
  | 'truck'
  | 'layers'
  | 'refresh';

const kpis = [
  { l: 'Sales MTD', v: 'Rp 390,5 M', d: '+8.0%', up: true, sub: 'vs last month', icon: 'chart', tone: 'success', spark: [12, 18, 16, 22, 20, 28, 32, 30, 36, 42] },
  { l: 'Net Cashflow', v: 'Rp 1,6 M', d: '+20.0%', up: true, sub: 'March 2026', icon: 'coin', tone: 'primary', spark: [10, 14, 12, 18, 22, 20, 26, 28, 32, 30] },
  { l: 'Outstanding AR', v: 'Rp 845 Jt', d: '-3.2%', up: false, sub: '92 invoices open', icon: 'bolt', tone: 'warning', spark: [40, 38, 42, 36, 34, 30, 28, 32, 28, 26] },
  { l: 'Production Yield', v: '94.7%', d: '+0.8%', up: true, sub: '5 lines running', icon: 'factory', tone: 'info', spark: [88, 90, 89, 92, 91, 93, 94, 93, 95, 94] },
] as const;

const modules = [
  { name: 'Finance', icon: 'coin', tone: 'primary', health: 'healthy', a: 2, kpi: 'Rp 1,6 M', k: 'Net Flow', trend: 20, hot: 'AR Aging 90+ rising in Jakarta' },
  { name: 'Warehouse', icon: 'box', tone: 'info', health: 'watch', a: 1, kpi: '12,408', k: 'SKU On Hand', trend: 1.2, hot: '7 SKU below safety stock' },
  { name: 'Purchase', icon: 'cart', tone: 'warning', health: 'watch', a: 1, kpi: '184', k: 'Active POs', trend: -3.4, hot: 'PT Cipta Logam lead time drift' },
  { name: 'Sales', icon: 'chart', tone: 'success', health: 'alert', a: 3, kpi: 'Rp 390,5 M', k: 'MTD Revenue', trend: 8, hot: 'Surabaya -31.6% yesterday' },
  { name: 'Production', icon: 'factory', tone: 'info', health: 'healthy', a: 0, kpi: '94.7%', k: 'Yield Rate', trend: 0.8, hot: 'Line C stopped - maintenance' },
  { name: 'Delivery', icon: 'truck', tone: 'primary', health: 'watch', a: 1, kpi: '98.2%', k: 'On-time', trend: -0.4, hot: '2 shipments delayed today' },
] as const;

const sentiPrompts = [
  { i: 'chart', t: 'Sales vs collection 3 bulan terakhir' },
  { i: 'coin', t: 'Customer berisiko aging > 90 hari' },
  { i: 'box', t: 'Stok yang akan habis 14 hari ke depan' },
  { i: 'cart', t: 'Lead time supplier paling lambat' },
] as const;

const alerts = [
  { sev: 'critical', t: 'Daily sales dropped -31.6% di Surabaya', m: 'Sales', at: '2m' },
  { sev: 'critical', t: 'Dead-letter triage requires action', m: 'Alerting', at: '5m' },
  { sev: 'high', t: 'Overdue receivable naik materially di Jakarta', m: 'Finance', at: '8m' },
  { sev: 'high', t: 'Stock Aluminum Sheet 3mm di bawah minimum', m: 'Warehouse', at: '14m' },
  { sev: 'medium', t: 'Lead time drift PT Cipta Logam Nusantara', m: 'Purchase', at: '21m' },
  { sev: 'medium', t: 'Line C Assembly stopped - operator dispatched', m: 'Production', at: '28m' },
] as const;

const tasks = [
  { t: 'Approve PO-2026-0218 (PT Cipta Logam)', who: 'Procurement Lead', due: 'Hari ini, 16:00', p: 'high' },
  { t: 'Verifikasi rekonsiliasi BCA Main Account', who: 'Finance Manager', due: 'Hari ini, 17:30', p: 'high' },
  { t: 'Review escalation rule untuk Sales drop', who: 'Ops Alert Group', due: 'Besok, 10:00', p: 'medium' },
  { t: 'Update jadwal preventive maintenance Line C', who: 'Production Manager', due: 'Besok, 14:00', p: 'medium' },
] as const;

const factoryStatus = [
  { name: 'Cibitung-1', type: 'Plant', st: 'running', load: 86 },
  { name: 'Cibitung-2', type: 'Plant', st: 'running', load: 72 },
  { name: 'Surabaya-A', type: 'Warehouse', st: 'running', load: 64 },
  { name: 'Bekasi-3', type: 'Warehouse', st: 'watch', load: 48 },
  { name: 'Surabaya-B', type: 'Warehouse', st: 'alert', load: 22 },
] as const;

const dataFreshness = [
  { src: 'MyERPPlus - Sales', ago: '12s', st: 'ok' },
  { src: 'MyERPPlus - Finance', ago: '30s', st: 'ok' },
  { src: 'MyERPPlus - Inventory', ago: '1m', st: 'ok' },
  { src: 'WMS Realtime', ago: '8s', st: 'ok' },
  { src: 'Production MES', ago: '4m', st: 'stale' },
] as const;

function Icon({ name, size = 18, color = 'currentColor' }: { name: IconName; size?: number; color?: string }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
    sparkles: <><path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9z" /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    shield: <path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />,
    chev: <path d="m9 6 6 6-6 6" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    chart: <><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-7" /></>,
    coin: <><circle cx="12" cy="12" r="9" /><path d="M14 9h-3a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9" /><path d="M12 7v2M12 15v2" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    factory: <><path d="M2 21V9l6 4V9l6 4V9l6 4v8z" /><path d="M9 17h2M14 17h2" /></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h2l3 13h12l2-9H6" /></>,
    truck: <><rect x="1" y="6" width="13" height="11" rx="1" /><path d="M14 9h4l3 4v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    layers: <><path d="m12 2 10 6-10 6L2 8z" /><path d="m2 14 10 6 10-6" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  };

  return <svg {...props}>{paths[name]}</svg>;
}

function Sparkline({ data, color }: { data: readonly number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((value, index) => `${(index / (data.length - 1)) * 100},${30 - ((value - min) / (max - min || 1)) * 28 - 1}`)
    .join(' ');

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: 32 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Sidebar() {
  const nav = [
    { id: 'home', label: 'Home', icon: 'home' as const },
    { id: 'senti', label: 'Senti AI', icon: 'sparkles' as const },
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' as const, children: ['Finance', 'Warehouse', 'Purchase', 'Delivery', 'Production', 'Sales'] },
    { id: 'alerting', label: 'Alerting', icon: 'bell' as const, children: ['Alert Center', 'Alert Rules', 'Alert Templates', 'Notification Channels', 'Notification Logs', 'Settings'] },
    { id: 'admin', label: 'Administrator', icon: 'shield' as const, children: ['Users', 'Roles', 'Audit Trail'] },
  ];

  return (
    <aside className="sf-sidebar">
      <div className="sf-sidebar-brand">
        <div className="sf-brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div className="sf-brand-text">
          <strong>SENTIENT</strong>
          <span>Factory OS</span>
        </div>
      </div>
      <div className="sf-sidebar-section">
        <div className="sf-sidebar-section-label">Workspace</div>
        {nav.map((item) => {
          const isActive = item.id === 'home';
          const isExpanded = Boolean(item.children?.includes('Finance')) || Boolean(item.children?.includes('Alert Center'));
          return (
            <div key={item.id}>
              <div className={`sf-nav-item ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}>
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
                {item.children ? <Icon name="chev" size={14} /> : null}
              </div>
              {item.children && isExpanded ? (
                <div className="sf-nav-children">
                  {item.children.map((child) => <div key={child} className="sf-nav-child">{child}</div>)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="sf-sidebar-footer">
        <div className="sf-uavatar">N</div>
        <div className="sf-meta">
          <strong>Nadia Pratama</strong>
          <span>Factory Admin</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="sf-topbar">
      <div>
        <h1>Home</h1>
        <div className="sf-crumbs">
          <span>Workspace</span>
          <Icon name="chev" size={11} />
          <strong>Home</strong>
        </div>
      </div>
      <div className="sf-search-bar">
        <Icon name="search" size={15} color="#a1a8b5" />
        <input placeholder="Search anything..." />
        <span className="sf-kbd">⌘K</span>
      </div>
      <div className="sf-topbar-right">
        <button className="sf-btn outline sm"><span className="sf-live-dot" /> Realtime · 30s</button>
        <button className="sf-btn outline sm">Reset Layout</button>
        <select className="sf-month-select"><option>March 2026</option></select>
        <button className="sf-icon-btn" title="Notifications"><Icon name="bell" size={17} /><span className="sf-dot" /></button>
        <button className="sf-icon-btn" title="Settings"><Icon name="settings" size={17} /></button>
        <div className="sf-user-chip">
          <div className="sf-av">SA</div>
          <div>
            <div className="sf-uname">Senti Admin</div>
            <span className="sf-urole">admin@sentient.id</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeOverview() {
  const healthMap: Record<string, string> = { healthy: 'success', watch: 'warning', alert: 'danger' };
  const sevColor = (severity: string) => severity === 'critical' ? 'danger' : severity === 'high' ? 'warning' : severity === 'medium' ? 'info' : 'primary';

  return (
    <div className="sf-home-content">
      <div className="sf-card sf-hero">
        <div className="sf-hero-bg" />
        <div className="sf-hero-inner">
          <div className="sf-hero-copy">
            <div className="sf-hero-status">
              <span />
              <p>Mission Control · All systems operational</p>
            </div>
            <h2>Selamat siang, Nadia.</h2>
            <p>
              <strong className="sf-warn-text">3 anomali aktif</strong> dalam 1 jam terakhir di modul Sales, Finance, dan Production. <strong className="sf-ok-text">5 plant online</strong>, semua channel notifikasi tersambung.
            </p>
          </div>
          <div className="sf-senti-ask">
            <div className="sf-senti-title">
              <div><Icon name="sparkles" size={14} color="white" /></div>
              <strong>Tanya Senti AI</strong>
              <span>⌘K</span>
            </div>
            <div className="sf-senti-input">
              <input placeholder="Ask anything about finance, warehouse, sales..." />
              <button>Ask <Icon name="chev" size={11} /></button>
            </div>
            <div className="sf-senti-prompts">
              {sentiPrompts.map((prompt) => (
                <span key={prompt.t}><Icon name={prompt.i as IconName} size={10} /> {prompt.t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sf-stat-grid">
        {kpis.map((kpi) => (
          <div key={kpi.l} className={`sf-stat t-${kpi.tone}`}>
            <div className="label">{kpi.l}</div>
            <div className="sf-stat-main">
              <div className="value tnum">{kpi.v}</div>
              <span className={`sf-badge ${kpi.up ? 'success' : 'danger'}`}>{kpi.d}</span>
            </div>
            <div className="sf-stat-sub">{kpi.sub}</div>
            <Sparkline data={kpi.spark} color={kpi.up ? '#17c653' : '#f8285a'} />
            <div className="icon-tile"><Icon name={kpi.icon as IconName} size={18} /></div>
          </div>
        ))}
      </div>

      <div className="sf-card">
        <div className="sf-card-header">
          <div><h3>Module Health</h3><div className="sub">Status, KPI, dan hot signal per modul · klik untuk masuk dashboard</div></div>
          <div className="actions"><span className="sf-badge success dot">3 healthy</span><span className="sf-badge warning dot">2 watch</span><span className="sf-badge danger dot">1 alert</span></div>
        </div>
        <div className="sf-module-grid">
          {modules.map((module) => (
            <div key={module.name} className="sf-module-card">
              <div className="sf-module-head">
                <div className={`sf-badge ${module.tone} sf-module-icon`}><Icon name={module.icon as IconName} size={16} /></div>
                <div className="sf-module-title"><strong>{module.name}</strong><span>{module.k}</span></div>
                <span className={`sf-badge ${healthMap[module.health]} dot`}>{module.health}</span>
              </div>
              <div className="sf-module-kpi">
                <div className="tnum">{module.kpi}</div>
                <span className={`sf-badge ${module.trend >= 0 ? 'success' : 'danger'}`}>{module.trend > 0 ? '+' : ''}{module.trend}%</span>
                {module.a > 0 ? <span className="sf-badge danger">{module.a} alert{module.a > 1 ? 's' : ''}</span> : null}
              </div>
              <div className="sf-module-hot"><Icon name="bolt" size={11} color="#78808f" /> {module.hot}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sf-mid-grid">
        <div className="sf-card">
          <div className="sf-card-header">
            <div><h3>Cross-module Activity</h3><div className="sub">Last 24 hours · live aggregation</div></div>
            <div className="actions"><span className="sf-badge primary">Senti Queries</span><span className="sf-badge success">Resolved</span><span className="sf-badge warning">New Events</span></div>
          </div>
          <div className="sf-card-body">
            <svg viewBox="0 0 600 220" className="sf-activity-chart">
              <defs><linearGradient id="sf-hg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3e97ff" stopOpacity="0.25" /><stop offset="1" stopColor="#3e97ff" stopOpacity="0" /></linearGradient></defs>
              {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="40" x2="590" y1={20 + i * 40} y2={20 + i * 40} stroke="#eef0f5" />)}
              <path d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40 L580,200 L40,200Z" fill="url(#sf-hg)" />
              <path d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40" fill="none" stroke="#3e97ff" strokeWidth="2.2" />
              <path d="M40,170 L100,165 L160,155 L220,145 L280,150 L340,130 L400,135 L460,120 L520,115 L580,100" fill="none" stroke="#17c653" strokeWidth="2.2" />
              <path d="M40,180 L100,178 L160,170 L220,175 L280,165 L340,168 L400,155 L460,160 L520,150 L580,148" fill="none" stroke="#f6c000" strokeWidth="2.2" />
              {['00', '04', '08', '12', '16', '20', '24'].map((label, i) => <text key={label} x={40 + i * 90} y="210" textAnchor="middle" fontSize="10" fill="#78808f">{label}:00</text>)}
              {[0, 40, 80, 120, 160].map((value, i) => <text key={value} x="32" y={204 - i * 40} textAnchor="end" fontSize="9" fill="#a1a8b5" fontFamily="var(--sf-font-mono)">{value}</text>)}
            </svg>
            <div className="sf-activity-stats">
              {[
                { l: 'Senti Queries', v: '284', d: '+18%' },
                { l: 'Alerts Triggered', v: '16', d: '+4' },
                { l: 'Resolved', v: '42', d: '+12' },
                { l: 'Notif Delivered', v: '98', d: '100%' },
              ].map((stat) => <div key={stat.l}><span>{stat.l}</span><strong>{stat.v}</strong><em>{stat.d}</em></div>)}
            </div>
          </div>
        </div>

        <div className="sf-card">
          <div className="sf-card-header"><div><h3>Live Alert Feed</h3><div className="sub">Cross-module priority</div></div><div className="actions"><a>View all →</a></div></div>
          <div className="sf-alert-list">
            {alerts.map((alert, index) => (
              <div key={alert.t} className="sf-alert-row">
                <span className={`sf-sev-dot sf-sev-${alert.sev}`} />
                <div><strong>{alert.t}</strong><p><span className={`sf-badge ${sevColor(alert.sev)}`}>{alert.m}</span><span>{alert.at} ago</span></p></div>
                <button className="sf-btn ghost xs">Ack</button>
                {index < alerts.length - 1 ? null : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sf-bottom-grid">
        <div className="sf-card">
          <div className="sf-card-header"><div><h3>Tasks Membutuhkan Aksi</h3><div className="sub">Approval & follow-up · 4 pending</div></div></div>
          <div className="sf-flush-list">
            {tasks.map((task) => (
              <div key={task.t} className="sf-task-row">
                <div className={task.p === 'high' ? 'high' : 'medium'} />
                <section><strong>{task.t}</strong><span>{task.who} · {task.due}</span></section>
                <button className="sf-btn outline xs">Buka</button>
                <button className="sf-btn dark xs">Approve</button>
              </div>
            ))}
          </div>
        </div>

        <div className="sf-card">
          <div className="sf-card-header"><div><h3>Facility Status</h3><div className="sub">Plants & warehouses · live</div></div></div>
          <div className="sf-card-body sf-status-list">
            {factoryStatus.map((factory) => (
              <div key={factory.name}>
                <span className={`sf-pulse ${factory.st}`} />
                <section><strong>{factory.name}</strong><span>{factory.type}</span></section>
                <div className="sf-load"><span style={{ width: `${factory.load}%` }} /></div>
                <em>{factory.load}%</em>
              </div>
            ))}
          </div>
        </div>

        <div className="sf-card">
          <div className="sf-card-header"><div><h3>Data Freshness</h3><div className="sub">Source ingestion latency</div></div></div>
          <div className="sf-card-body sf-fresh-list">
            {dataFreshness.map((source) => (
              <div key={source.src}>
                <Icon name="layers" size={14} color={source.st === 'ok' ? 'var(--sf-success-ink)' : 'var(--sf-warning-ink)'} />
                <strong>{source.src}</strong>
                <span className={`sf-badge ${source.st === 'ok' ? 'success' : 'warning'}`}>{source.ago} ago</span>
              </div>
            ))}
            <div className="sf-refresh-note"><Icon name="refresh" size={12} color="var(--sf-primary-ink)" /><span>Auto-refresh aktif · interval 30s</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppHomePage() {
  return (
    <div className="sf-home">
      <HomeOverview />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes sf-pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        .sf-home {
          --sf-bg: #f4f6fa; --sf-bg-subtle: #f9fafc; --sf-surface: #fff; --sf-surface-2: #fbfbfd;
          --sf-border: #eef0f5; --sf-border-strong: #e1e4ed; --sf-divider: #f1f3f7;
          --sf-text: #131720; --sf-text-2: #4b5263; --sf-text-3: #78808f; --sf-text-muted: #a1a8b5;
          --sf-primary: #3e97ff; --sf-primary-hover: #2b87f0; --sf-primary-soft: #eef6ff; --sf-primary-ink: #0c5fbf;
          --sf-success: #17c653; --sf-success-soft: #dffbe8; --sf-success-ink: #04773c;
          --sf-warning: #f6c000; --sf-warning-soft: #fff5cc; --sf-warning-ink: #8a6c00;
          --sf-danger: #f8285a; --sf-danger-soft: #ffe2ea; --sf-danger-ink: #b91339;
          --sf-info: #7239ea; --sf-info-soft: #efe7fe; --sf-info-ink: #4a1fb8;
          --sf-neutral-soft: #eef0f5; --sf-neutral-ink: #4b5263;
          --sf-sidebar-bg: #11141b; --sf-sidebar-bg-2: #181c25; --sf-sidebar-text: #b6bcc9; --sf-sidebar-text-muted: #6c7280;
          --sf-sidebar-active-bg: rgba(62,151,255,.12); --sf-sidebar-active-text: #fff; --sf-sidebar-border: #1e2330;
          --sf-font-sans: "Inter", "Helvetica Neue", system-ui, -apple-system, sans-serif;
          --sf-font-mono: "JetBrains Mono", "SF Mono", Menlo, monospace;
          width: 100%; min-height: calc(100vh - 84px); background: var(--sf-bg); color: var(--sf-text);
          font-family: var(--sf-font-sans); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-feature-settings: "cv11", "ss01";
        }
        .sf-home * { box-sizing: border-box; }
        .sf-home button { font-family: inherit; cursor: pointer; }
        .sf-app { display: flex; min-height: 100vh; background: var(--sf-bg); }
        .sf-sidebar { width: 260px; flex-shrink: 0; background: var(--sf-sidebar-bg); color: var(--sf-sidebar-text); display: flex; flex-direction: column; border-right: 1px solid var(--sf-sidebar-border); position: sticky; top: 0; height: 100vh; }
        .sf-sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--sf-sidebar-border); }
        .sf-brand-logo { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #3e97ff 0%, #7239ea 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(62,151,255,.4); }
        .sf-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .sf-brand-text strong { color: #fff; font-size: 14px; letter-spacing: .02em; font-weight: 700; }
        .sf-brand-text span { color: var(--sf-sidebar-text-muted); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; margin-top: 2px; }
        .sf-sidebar-section { padding: 16px 12px 4px; flex: 1; overflow-y: auto; }
        .sf-sidebar-section-label { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--sf-sidebar-text-muted); padding: 4px 12px 8px; font-weight: 600; }
        .sf-nav-item { display: flex; align-items: center; gap: 12px; padding: 9px 12px; margin: 1px 0; border-radius: 6px; color: var(--sf-sidebar-text); font-size: 13px; font-weight: 500; transition: background .12s, color .12s; }
        .sf-nav-item svg:last-child { margin-left: auto; opacity: .5; }
        .sf-nav-item:hover { background: var(--sf-sidebar-bg-2); color: white; }
        .sf-nav-item.active { background: var(--sf-sidebar-active-bg); color: var(--sf-sidebar-active-text); position: relative; }
        .sf-nav-item.active:before { content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--sf-primary); border-radius: 0 2px 2px 0; }
        .sf-nav-item.active svg:first-child { color: var(--sf-primary); }
        .sf-nav-children { margin: 2px 0 6px 30px; border-left: 1px solid var(--sf-sidebar-border); padding-left: 10px; }
        .sf-nav-child { display: block; padding: 7px 10px; font-size: 12.5px; color: var(--sf-sidebar-text); border-radius: 5px; }
        .sf-nav-child:hover { color: white; background: var(--sf-sidebar-bg-2); }
        .sf-sidebar-footer { margin-top: auto; padding: 14px; border-top: 1px solid var(--sf-sidebar-border); display: flex; align-items: center; gap: 10px; font-size: 12px; }
        .sf-uavatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #50cd89, #17c653); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
        .sf-meta { line-height: 1.2; }
        .sf-meta strong { color: #fff; display: block; font-weight: 600; }
        .sf-meta span { color: var(--sf-sidebar-text-muted); font-size: 11px; }
        .sf-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .sf-topbar { height: 64px; background: var(--sf-surface); border-bottom: 1px solid var(--sf-border); display: flex; align-items: center; padding: 0 24px; gap: 16px; position: sticky; top: 0; z-index: 50; }
        .sf-topbar h1 { font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -.01em; }
        .sf-crumbs { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--sf-text-3); margin-top: 2px; }
        .sf-crumbs strong { color: var(--sf-text); font-weight: 500; }
        .sf-search-bar { flex: 1; max-width: 360px; display: flex; align-items: center; gap: 8px; background: var(--sf-bg); border: 1px solid var(--sf-border); border-radius: 8px; padding: 0 12px; height: 38px; color: var(--sf-text-3); font-size: 13px; margin-left: 24px; }
        .sf-search-bar input { border: none; background: transparent; outline: none; flex: 1; font-size: 13px; color: var(--sf-text); }
        .sf-kbd { font-family: var(--sf-font-mono); font-size: 10.5px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 4px; padding: 2px 6px; color: var(--sf-text-3); }
        .sf-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .sf-icon-btn { width: 38px; height: 38px; border-radius: 8px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); display: flex; align-items: center; justify-content: center; color: var(--sf-text-2); position: relative; }
        .sf-icon-btn .sf-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--sf-danger); box-shadow: 0 0 0 2px var(--sf-surface); }
        .sf-user-chip { display: flex; align-items: center; gap: 10px; padding: 4px 10px 4px 4px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); border-radius: 999px; }
        .sf-av { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #3e97ff, #7239ea); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 12px; }
        .sf-uname { font-size: 12.5px; font-weight: 600; }
        .sf-urole { font-size: 11px; color: var(--sf-text-3); display: block; line-height: 1; }
        .sf-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 7px; font-size: 13px; font-weight: 600; border: 1px solid transparent; background: var(--sf-surface); color: var(--sf-text); transition: all .12s; }
        .sf-btn.outline { background: transparent; border-color: var(--sf-border-strong); color: var(--sf-text); }
        .sf-btn.ghost { background: transparent; color: var(--sf-text-2); }
        .sf-btn.dark { background: var(--sf-text); color: white; }
        .sf-btn.sm { padding: 6px 10px; font-size: 12px; }
        .sf-btn.xs { padding: 4px 8px; font-size: 11.5px; }
        .sf-month-select { padding: 6px 10px; border: 1px solid var(--sf-border-strong); border-radius: 7px; font-size: 12px; background: var(--sf-surface-2); }
        .sf-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sf-success); display: inline-block; }
        .sf-home-content { padding: 4px 24px 24px; overflow: visible; width: 100%; }
        .sf-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
        .sf-card-header { padding: 16px 18px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--sf-divider); }
        .sf-card-header h3 { font-size: 14px; font-weight: 700; margin: 0; letter-spacing: -.005em; }
        .sf-card-header .sub { font-size: 12px; color: var(--sf-text-3); margin-top: 2px; }
        .sf-card-header .actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }
        .sf-card-header a { color: var(--sf-primary); font-size: 12px; font-weight: 600; cursor: pointer; }
        .sf-card-body { padding: 18px; }
        .sf-hero { margin-bottom: 16px; background: linear-gradient(135deg, #0a1f3d 0%, #11141b 45%, #1e2a4a 100%); border: none; color: white; overflow: hidden; position: relative; }
        .sf-hero-bg { position: absolute; inset: 0; opacity: .06; background-image: radial-gradient(circle at 20% 30%, #3e97ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #7239ea 0, transparent 40%); }
        .sf-hero-inner { padding: 24px 28px; display: flex; align-items: center; gap: 28px; position: relative; }
        .sf-hero-copy { flex: 1; min-width: 0; }
        .sf-hero-status { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .sf-hero-status span { width: 8px; height: 8px; border-radius: 50%; background: var(--sf-success); animation: sf-pulse 1.6s infinite; }
        .sf-hero-status p { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; opacity: .75; font-weight: 600; margin: 0; }
        .sf-hero h2 { font-size: 24px; margin: 0 0 6px; font-weight: 700; letter-spacing: -.015em; }
        .sf-hero-copy > p { font-size: 13px; opacity: .78; margin: 0; max-width: 560px; line-height: 1.55; }
        .sf-warn-text { color: #ffd05a; }
        .sf-ok-text { color: #9bf0ad; }
        .sf-senti-ask { width: 460px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: 14px; backdrop-filter: blur(6px); }
        .sf-senti-title { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .sf-senti-title > div { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg,#3e97ff,#7239ea); display: flex; align-items: center; justify-content: center; }
        .sf-senti-title strong { font-size: 13px; }
        .sf-senti-title span { margin-left: auto; font-size: 10px; opacity: .6; font-family: var(--sf-font-mono); }
        .sf-senti-input { background: rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; display: flex; align-items: center; padding: 8px 12px; margin-bottom: 10px; }
        .sf-senti-input input { flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 13px; }
        .sf-senti-input button { background: var(--sf-primary); border: none; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .sf-senti-prompts { display: flex; flex-wrap: wrap; gap: 5px; }
        .sf-senti-prompts span { font-size: 11px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1); padding: 4px 9px; border-radius: 999px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
        .sf-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--sf-neutral-soft); color: var(--sf-neutral-ink); letter-spacing: .01em; white-space: nowrap; }
        .sf-badge.primary { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
        .sf-badge.success { background: var(--sf-success-soft); color: var(--sf-success-ink); }
        .sf-badge.warning { background: var(--sf-warning-soft); color: var(--sf-warning-ink); }
        .sf-badge.danger { background: var(--sf-danger-soft); color: var(--sf-danger-ink); }
        .sf-badge.info { background: var(--sf-info-soft); color: var(--sf-info-ink); }
        .sf-badge.dot:before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }
        .sf-stat-grid { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); margin-bottom: 16px; }
        .sf-stat { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; padding: 18px; position: relative; overflow: hidden; }
        .sf-stat .label { font-size: 12px; color: var(--sf-text-3); font-weight: 500; text-transform: uppercase; letter-spacing: .06em; }
        .sf-stat .value { font-size: 28px; font-weight: 700; letter-spacing: -.02em; }
        .sf-stat-main { display: flex; align-items: baseline; gap: 8px; margin-top: 4px; }
        .sf-stat-sub { font-size: 11px; color: var(--sf-text-3); margin-top: 4px; margin-bottom: 6px; }
        .sf-stat .icon-tile { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 8px; background: var(--sf-primary-soft); color: var(--sf-primary-ink); display: flex; align-items: center; justify-content: center; }
        .sf-stat.t-success .icon-tile { background: var(--sf-success-soft); color: var(--sf-success-ink); }
        .sf-stat.t-warning .icon-tile { background: var(--sf-warning-soft); color: var(--sf-warning-ink); }
        .sf-stat.t-info .icon-tile { background: var(--sf-info-soft); color: var(--sf-info-ink); }
        .tnum { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        .sf-module-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 14px; margin-bottom: 16px; }
        .sf-module-card { border: 1px solid var(--sf-border); border-radius: 10px; padding: 14px; background: var(--sf-surface); cursor: pointer; transition: all .15s; position: relative; }
        .sf-module-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .sf-module-icon { width: 36px; height: 36px; border-radius: 8px; padding: 0; justify-content: center; }
        .sf-module-title { flex: 1; }
        .sf-module-title strong { font-size: 13px; font-weight: 700; display: block; }
        .sf-module-title span { font-size: 11px; color: var(--sf-text-3); }
        .sf-module-kpi { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
        .sf-module-kpi div { font-size: 20px; font-weight: 700; letter-spacing: -.01em; }
        .sf-module-kpi .sf-badge:last-child { margin-left: auto; }
        .sf-module-hot { font-size: 11.5px; color: var(--sf-text-2); line-height: 1.45; padding: 8px 10px; background: var(--sf-bg-subtle); border-radius: 6px; display: flex; align-items: center; gap: 6px; }
        .sf-mid-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 16px; }
        .sf-activity-chart { width: 100%; height: 220px; }
        .sf-activity-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
        .sf-activity-stats div { padding: 10px 12px; background: var(--sf-bg-subtle); border-radius: 8px; }
        .sf-activity-stats span { display: block; font-size: 10.5px; color: var(--sf-text-3); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
        .sf-activity-stats strong { font-size: 18px; font-weight: 700; margin-right: 6px; }
        .sf-activity-stats em { font-size: 10.5px; color: var(--sf-success-ink); font-weight: 600; font-style: normal; }
        .sf-alert-list { padding: 0; max-height: 360px; overflow-y: auto; }
        .sf-alert-row { padding: 11px 18px; border-bottom: 1px solid var(--sf-divider); display: flex; align-items: flex-start; gap: 10px; }
        .sf-alert-row > div { flex: 1; min-width: 0; }
        .sf-alert-row strong { font-size: 12.5px; font-weight: 600; line-height: 1.4; display: block; }
        .sf-alert-row p { font-size: 11px; color: var(--sf-text-3); margin: 2px 0 0; display: flex; align-items: center; gap: 6px; }
        .sf-sev-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-top: 6px; }
        .sf-sev-critical { background: var(--sf-danger); }
        .sf-sev-high { background: #ff8a3d; }
        .sf-sev-medium { background: var(--sf-warning); }
        .sf-bottom-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 16px; }
        .sf-flush-list { padding: 0; }
        .sf-task-row { padding: 12px 18px; border-bottom: 1px solid var(--sf-divider); display: flex; align-items: center; gap: 10px; }
        .sf-task-row > div { width: 6px; height: 36px; border-radius: 3px; background: var(--sf-warning); }
        .sf-task-row > div.high { background: var(--sf-danger); }
        .sf-task-row section { flex: 1; }
        .sf-task-row strong { font-size: 12.5px; font-weight: 600; display: block; }
        .sf-task-row span { font-size: 11px; color: var(--sf-text-3); margin-top: 2px; display: block; }
        .sf-status-list > div, .sf-fresh-list > div:not(.sf-refresh-note) { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--sf-divider); }
        .sf-status-list section { flex: 1; }
        .sf-status-list strong { font-size: 12.5px; font-weight: 600; display: block; }
        .sf-status-list span:not(.sf-pulse) { font-size: 10.5px; color: var(--sf-text-3); }
        .sf-pulse { width: 8px; height: 8px; border-radius: 50%; animation: sf-pulse 1.8s infinite; }
        .sf-pulse.running { background: var(--sf-success); }
        .sf-pulse.watch { background: var(--sf-warning); }
        .sf-pulse.alert { background: var(--sf-danger); }
        .sf-load { width: 80px; height: 6px; background: var(--sf-bg); border-radius: 3px; }
        .sf-load span { display: block; height: 100%; background: var(--sf-success); border-radius: 3px; }
        .sf-status-list em { font-size: 11px; font-weight: 700; min-width: 30px; text-align: right; font-style: normal; }
        .sf-fresh-list strong { flex: 1; font-size: 12.5px; font-weight: 600; font-family: var(--sf-font-mono); }
        .sf-refresh-note { margin-top: 10px; padding: 8px 10px; background: var(--sf-primary-soft); border-radius: 6px; display: flex; align-items: center; gap: 8px; }
        .sf-refresh-note span { font-size: 11px; color: var(--sf-primary-ink); font-weight: 600; }
      `}</style>
    </div>
  );
}
