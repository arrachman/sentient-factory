import React from 'react';
import {
  type IconName,
  kpis,
  modules,
  sentiPrompts,
  alerts,
  tasks,
  factoryStatus,
  dataFreshness,
  HOME_STYLES,
} from './home-data';

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
      <style>{HOME_STYLES}</style>
    </div>
  );
}
