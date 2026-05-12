/**
 * Main content area Home page (hero, KPI grid, module health, alerts feed,
 * task list, facility status, data freshness). Dipisah dari `page.tsx` agar
 * halaman utama tetap < 100 LOC.
 */
import type { IconName } from '../_data';
import {
  activityStats,
  alerts,
  dataFreshness,
  factoryStatus,
  kpis,
  modules,
  sentiPrompts,
  tasks,
} from '../_data';
import { Icon, Sparkline } from './icons';

const HEALTH_MAP: Record<string, string> = {
  healthy: 'success',
  watch: 'warning',
  alert: 'danger',
};

function sevColor(severity: string) {
  if (severity === 'critical') return 'danger';
  if (severity === 'high') return 'warning';
  if (severity === 'medium') return 'info';
  return 'primary';
}

export function HomeOverview() {
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
              <strong className="sf-warn-text">3 anomali aktif</strong> dalam 1
              jam terakhir di modul Sales, Finance, dan Production.{' '}
              <strong className="sf-ok-text">5 plant online</strong>, semua
              channel notifikasi tersambung.
            </p>
          </div>
          <div className="sf-senti-ask">
            <div className="sf-senti-title">
              <div>
                <Icon name="sparkles" size={14} color="white" />
              </div>
              <strong>Tanya Senti AI</strong>
              <span>⌘K</span>
            </div>
            <div className="sf-senti-input">
              <input placeholder="Ask anything about finance, warehouse, sales..." />
              <button>
                Ask <Icon name="chev" size={11} />
              </button>
            </div>
            <div className="sf-senti-prompts">
              {sentiPrompts.map((prompt) => (
                <span key={prompt.t}>
                  <Icon name={prompt.i as IconName} size={10} /> {prompt.t}
                </span>
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
              <span className={`sf-badge ${kpi.up ? 'success' : 'danger'}`}>
                {kpi.d}
              </span>
            </div>
            <div className="sf-stat-sub">{kpi.sub}</div>
            <Sparkline
              data={kpi.spark}
              color={kpi.up ? '#17c653' : '#f8285a'}
            />
            <div className="icon-tile">
              <Icon name={kpi.icon as IconName} size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="sf-card">
        <div className="sf-card-header">
          <div>
            <h3>Module Health</h3>
            <div className="sub">
              Status, KPI, dan hot signal per modul · klik untuk masuk dashboard
            </div>
          </div>
          <div className="actions">
            <span className="sf-badge success dot">3 healthy</span>
            <span className="sf-badge warning dot">2 watch</span>
            <span className="sf-badge danger dot">1 alert</span>
          </div>
        </div>
        <div className="sf-module-grid">
          {modules.map((module) => (
            <div key={module.name} className="sf-module-card">
              <div className="sf-module-head">
                <div className={`sf-badge ${module.tone} sf-module-icon`}>
                  <Icon name={module.icon as IconName} size={16} />
                </div>
                <div className="sf-module-title">
                  <strong>{module.name}</strong>
                  <span>{module.k}</span>
                </div>
                <span className={`sf-badge ${HEALTH_MAP[module.health]} dot`}>
                  {module.health}
                </span>
              </div>
              <div className="sf-module-kpi">
                <div className="tnum">{module.kpi}</div>
                <span
                  className={`sf-badge ${module.trend >= 0 ? 'success' : 'danger'}`}
                >
                  {module.trend > 0 ? '+' : ''}
                  {module.trend}%
                </span>
                {module.a > 0 ? (
                  <span className="sf-badge danger">
                    {module.a} alert{module.a > 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
              <div className="sf-module-hot">
                <Icon name="bolt" size={11} color="#78808f" /> {module.hot}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sf-mid-grid">
        <CrossModuleActivityCard />
        <LiveAlertFeedCard />
      </div>

      <div className="sf-bottom-grid">
        <TasksCard />
        <FacilityStatusCard />
        <DataFreshnessCard />
      </div>
    </div>
  );
}

function CrossModuleActivityCard() {
  return (
    <div className="sf-card">
      <div className="sf-card-header">
        <div>
          <h3>Cross-module Activity</h3>
          <div className="sub">Last 24 hours · live aggregation</div>
        </div>
        <div className="actions">
          <span className="sf-badge primary">Senti Queries</span>
          <span className="sf-badge success">Resolved</span>
          <span className="sf-badge warning">New Events</span>
        </div>
      </div>
      <div className="sf-card-body">
        <svg viewBox="0 0 600 220" className="sf-activity-chart">
          <defs>
            <linearGradient id="sf-hg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#3e97ff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#3e97ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              x2="590"
              y1={20 + i * 40}
              y2={20 + i * 40}
              stroke="#eef0f5"
            />
          ))}
          <path
            d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40 L580,200 L40,200Z"
            fill="url(#sf-hg)"
          />
          <path
            d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40"
            fill="none"
            stroke="#3e97ff"
            strokeWidth="2.2"
          />
          <path
            d="M40,170 L100,165 L160,155 L220,145 L280,150 L340,130 L400,135 L460,120 L520,115 L580,100"
            fill="none"
            stroke="#17c653"
            strokeWidth="2.2"
          />
          <path
            d="M40,180 L100,178 L160,170 L220,175 L280,165 L340,168 L400,155 L460,160 L520,150 L580,148"
            fill="none"
            stroke="#f6c000"
            strokeWidth="2.2"
          />
          {['00', '04', '08', '12', '16', '20', '24'].map((label, i) => (
            <text
              key={label}
              x={40 + i * 90}
              y="210"
              textAnchor="middle"
              fontSize="10"
              fill="#78808f"
            >
              {label}:00
            </text>
          ))}
          {[0, 40, 80, 120, 160].map((value, i) => (
            <text
              key={value}
              x="32"
              y={204 - i * 40}
              textAnchor="end"
              fontSize="9"
              fill="#a1a8b5"
              fontFamily="var(--sf-font-mono)"
            >
              {value}
            </text>
          ))}
        </svg>
        <div className="sf-activity-stats">
          {activityStats.map((stat) => (
            <div key={stat.l}>
              <span>{stat.l}</span>
              <strong>{stat.v}</strong>
              <em>{stat.d}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveAlertFeedCard() {
  return (
    <div className="sf-card">
      <div className="sf-card-header">
        <div>
          <h3>Live Alert Feed</h3>
          <div className="sub">Cross-module priority</div>
        </div>
        <div className="actions">
          <a>View all →</a>
        </div>
      </div>
      <div className="sf-alert-list">
        {alerts.map((alert) => (
          <div key={alert.t} className="sf-alert-row">
            <span className={`sf-sev-dot sf-sev-${alert.sev}`} />
            <div>
              <strong>{alert.t}</strong>
              <p>
                <span className={`sf-badge ${sevColor(alert.sev)}`}>
                  {alert.m}
                </span>
                <span>{alert.at} ago</span>
              </p>
            </div>
            <button className="sf-btn ghost xs">Ack</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksCard() {
  return (
    <div className="sf-card">
      <div className="sf-card-header">
        <div>
          <h3>Tasks Membutuhkan Aksi</h3>
          <div className="sub">Approval & follow-up · 4 pending</div>
        </div>
      </div>
      <div className="sf-flush-list">
        {tasks.map((task) => (
          <div key={task.t} className="sf-task-row">
            <div className={task.p === 'high' ? 'high' : 'medium'} />
            <section>
              <strong>{task.t}</strong>
              <span>
                {task.who} · {task.due}
              </span>
            </section>
            <button className="sf-btn outline xs">Buka</button>
            <button className="sf-btn dark xs">Approve</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilityStatusCard() {
  return (
    <div className="sf-card">
      <div className="sf-card-header">
        <div>
          <h3>Facility Status</h3>
          <div className="sub">Plants & warehouses · live</div>
        </div>
      </div>
      <div className="sf-card-body sf-status-list">
        {factoryStatus.map((factory) => (
          <div key={factory.name}>
            <span className={`sf-pulse ${factory.st}`} />
            <section>
              <strong>{factory.name}</strong>
              <span>{factory.type}</span>
            </section>
            <div className="sf-load">
              <span style={{ width: `${factory.load}%` }} />
            </div>
            <em>{factory.load}%</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataFreshnessCard() {
  return (
    <div className="sf-card">
      <div className="sf-card-header">
        <div>
          <h3>Data Freshness</h3>
          <div className="sub">Source ingestion latency</div>
        </div>
      </div>
      <div className="sf-card-body sf-fresh-list">
        {dataFreshness.map((source) => (
          <div key={source.src}>
            <Icon
              name="layers"
              size={14}
              color={
                source.st === 'ok'
                  ? 'var(--sf-success-ink)'
                  : 'var(--sf-warning-ink)'
              }
            />
            <strong>{source.src}</strong>
            <span
              className={`sf-badge ${source.st === 'ok' ? 'success' : 'warning'}`}
            >
              {source.ago} ago
            </span>
          </div>
        ))}
        <div className="sf-refresh-note">
          <Icon name="refresh" size={12} color="var(--sf-primary-ink)" />
          <span>Auto-refresh aktif · interval 30s</span>
        </div>
      </div>
    </div>
  );
}
