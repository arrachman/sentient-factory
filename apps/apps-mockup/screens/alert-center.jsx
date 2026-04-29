/* global React, SF */
const { Icon } = SF;

// ============ ALERT CENTER ============
const AlertCenter = () => {
  const events = [
    { sev: "critical", st: "open", title: "[CRITICAL] Dead-letter triage requires action", sub: "System Dead-Letter Triage Escalation", mod: "alerting", time: "2026-04-20 10:18:29", scope: "triage_status: investigating, source_event_id: 5, escalation_level: critical, source_event_key: cot-tue-5-snapshot-2, triage_delivery_id: 3" },
    { sev: "critical", st: "open", title: "[CRITICAL] Dead-letter triage requires action", sub: "System Dead-Letter Triage Escalation", mod: "alerting", time: "2026-04-20 10:18:10", scope: "triage_status: investigating, source_event_id: 5, escalation_level: critical, source_event_key: cot-tue-5-snapshot-2, triage_delivery_id: 3" },
    { sev: "critical", st: "open", title: "[CRITICAL] Dead-letter triage requires action", sub: "System Dead-Letter Triage Escalation", mod: "alerting", time: "2026-04-20 10:09:54", scope: "triage_status: investigating, source_event_id: 5" },
    { sev: "high", st: "open", title: "Overdue receivable increased materially in Jakarta", sub: "Overdue Receivable Total", mod: "Finance", time: "2026-04-20 06:36:45", scope: "branch: Jakarta" },
    { sev: "low", st: "resolved", title: "Test send for Finance Lead Updated", sub: "system Test Send Rule", mod: "alerting", time: "2026-04-20 06:14:05", scope: "test_send: true, channel_id: 1, channel_type: wa-personal, target_value: +6285211567789" },
    { sev: "high", st: "open", title: "Overdue receivable increased materially in Jakarta", sub: "Overdue Receivable Total", mod: "Finance", time: "2026-04-20 04:47:52", scope: "branch: Jakarta" },
    { sev: "critical", st: "ack", title: "Daily sales revenue dropped sharply versus yesterday for Surabaya", sub: "Daily Sales Revenue", mod: "Sales", time: "2026-04-20 04:46:50", scope: "branch: Surabaya" },
    { sev: "critical", st: "open", title: "Daily sales dropped below threshold", sub: "Daily Sales Revenue", mod: "Sales", time: "2026-04-20 04:36:20", scope: "branch: Surabaya, change_pct: -31.6%" },
  ];
  const noisy = [
    { name: "System Dead-Letter Triage Escalation", count: 312, mod: "alerting" },
    { name: "Daily Sales Revenue", count: 184, mod: "Sales" },
    { name: "Overdue Receivable Total", count: 76, mod: "Finance" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      {/* Top stats */}
      <div className="stat-grid" style={{ marginBottom: 16, gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat t-info">
          <div className="label">Active Alerts</div>
          <div className="value tnum">8</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>10 alert events</div>
          <div className="icon-tile"><Icon name="bell" size={18} /></div>
        </div>
        <div className="stat t-danger">
          <div className="label">Critical Alerts</div>
          <div className="value tnum">7</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>severity = critical</div>
          <div className="icon-tile"><Icon name="bolt" size={18} /></div>
        </div>
        <div className="stat t-warning">
          <div className="label">Reviewed Alerts</div>
          <div className="value tnum">1</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>status: acknowledged</div>
          <div className="icon-tile"><Icon name="eye" size={18} /></div>
        </div>
        <div className="stat t-success">
          <div className="label">Resolved Alerts</div>
          <div className="value tnum">1</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>status: resolved</div>
          <div className="icon-tile"><Icon name="check" size={18} /></div>
        </div>
      </div>

      {/* Noisy + Backlog */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div><h3>Noisy Rules</h3><div className="sub">Top rules by event volume in the last 24 hours</div></div>
          </div>
          <div className="card-body">
            {noisy.map((n,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: i < noisy.length-1 ? "1px solid var(--divider)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--danger-soft)", color: "var(--danger-ink)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}><Icon name="zap" size={15}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>module · {n.mod}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>{n.count}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)" }}>events / 24h</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Unresolved By Module</h3><div className="sub">Operations backlog across modules</div></div></div>
          <div className="card-body">
            {[{m: "alerting", v: 4, c: "var(--danger)"}, {m: "Finance", v: 2, c: "#ff8a3d"}, {m: "Sales", v: 2, c: "var(--warning)"}].map((r,i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.m}</span>
                  <span className="tnum" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700 }}>{r.v}</span>
                </div>
                <div style={{ height: 8, background: "var(--bg)", borderRadius: 4 }}>
                  <div style={{ width: `${r.v * 20}%`, height: "100%", background: r.c, borderRadius: 4 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rule Effectiveness */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><div><h3>Rule Effectiveness</h3><div className="sub">Rules with the most execution history and event output</div></div></div>
        <div className="card-body" style={{ padding: 0 }}>
          {[
            { n: "Sales Drop Alert", v: 745, t: "Visible: True · Triggered Events: 745 · Amplified: 100% · Resolution: 0% · Delivery Success: 100% · Last Run: 2026-04-20 13:38:56" },
            { n: "System Dead-Letter Triage Escalation", v: 723, t: "Visible: True · Triggered Events: 723 · Amplified: 100% · Resolution: 0% · Delivery Success: 100% · Last Run: 2026-04-20 13:38:56" },
            { n: "Overdue Receivable Alert", v: 165, t: "Visible: True · Triggered Events: 165 · Amplified: 100% · Resolution: 0% · Delivery Success: 100% · Last Run: 2026-04-20 13:38:56" },
            { n: "System Test Send Rule", v: 2, t: "Visible: True · Triggered Events: 2 · Amplified: 100% · Resolution: 100% · Delivery Success: 100% · Last Run: 2026-04-20 06:18:50" },
          ].map((r,i,arr) => (
            <div key={i} style={{ padding: "14px 18px", borderBottom: i < arr.length-1 ? "1px solid var(--divider)" : "none", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.n}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{r.t}</div>
              </div>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 700 }}>{r.v}<span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 400 }}> runs</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Events */}
      <div className="card">
        <div className="card-header">
          <div><h3>Alert Events</h3><div className="sub">Page rows now backed by real views: alert_event_v1 / alerts_insight_snapshot_v1</div></div>
          <div className="actions">
            <div className="search-bar" style={{ height: 32, padding: "0 10px", maxWidth: 200 }}>
              <Icon name="search" size={12} color="#a1a8b5" />
              <input placeholder="Search event…" style={{ fontSize: 12 }} />
            </div>
            <select style={{ padding: "6px 10px", border: "1px solid var(--border-strong)", borderRadius: 6, fontSize: 12 }}><option>All Severity</option></select>
            <select style={{ padding: "6px 10px", border: "1px solid var(--border-strong)", borderRadius: 6, fontSize: 12 }}><option>All Modules</option></select>
          </div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "38%" }}>Event</th>
                <th>Module</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Detected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e,i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span className={`sev-dot sev-${e.sev}`} style={{ marginTop: 5 }}></span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{e.sub}</div>
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)", maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.scope}</div>
                      </div>
                    </div>
                  </td>
                  <td>{e.mod}</td>
                  <td><span className={`badge ${e.sev === "critical" ? "danger" : e.sev === "high" ? "warning" : "info"}`}>{e.sev}</span></td>
                  <td><span className={`badge ${e.st === "open" ? "danger" : e.st === "ack" ? "warning" : "success"}`}>{e.st === "ack" ? "Acknowledged" : e.st === "open" ? "Open" : "Resolved"}</span></td>
                  <td className="num" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}>{e.time}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn ghost xs"><Icon name="eye" size={11} /> View</button>
                      <button className="btn ghost xs"><Icon name="check" size={11} /> Ack</button>
                      <button className="btn ghost xs" style={{ color: "var(--success-ink)" }}>Resolve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.AlertCenter = AlertCenter;
