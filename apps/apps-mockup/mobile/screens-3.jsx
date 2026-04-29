/* global React, SF, MUI */
const { Icon } = SF;
const { SectionHeader, Seg, ChipRow } = MUI;

// 09 — Alert Center
const MAlertCenter = () => {
  const [tab, setTab] = React.useState("Active");
  const alerts = [
    { sev: "critical", t: "Daily sales drop −31.6% di Surabaya", m: "Sales", at: "2m", who: "Auto · sales.region.daily" },
    { sev: "critical", t: "Dead-letter triage requires action", m: "Alerting", at: "5m", who: "System health" },
    { sev: "high", t: "Overdue receivable naik di Jakarta", m: "Finance", at: "8m", who: "AR aging > 90d" },
    { sev: "high", t: "Stock Aluminum Sheet 3mm di bawah min", m: "Warehouse", at: "14m", who: "Safety stock rule" },
    { sev: "medium", t: "Lead time drift PT Cipta Logam", m: "Purchase", at: "21m", who: "Vendor SLA" },
    { sev: "medium", t: "Line C Assembly stopped — maintenance", m: "Production", at: "28m", who: "MES sensor" },
    { sev: "low", t: "Backup integration latency 4m", m: "System", at: "1h", who: "Data freshness" },
  ];
  return (
    <>
      <Seg items={["Active","Acknowledged","Resolved"]} active={tab} onSelect={setTab}/>
      <ChipRow items={["All","Critical","High","Medium","Low"]} active="All"/>
      <div className="m-kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          ["Crit", "2", "danger"], ["High", "2", "warning"], ["Med", "2", "info"], ["Low", "1", "primary"],
        ].map(([l,v,t],i) => (
          <div key={i} className="m-kpi" style={{ padding: 10, textAlign: "center" }}>
            <div className="l">{l}</div>
            <div className="v" style={{ fontSize: 18, color: `var(--${t}-ink)` }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="m-card flush">
        {alerts.map((a,i) => (
          <div key={i} className="m-row">
            <div style={{ width: 4, height: 44, background: a.sev === "critical" ? "var(--danger)" : a.sev === "high" ? "#ff8a3d" : a.sev === "medium" ? "var(--warning)" : "var(--info)", borderRadius: 2 }}/>
            <div className="body">
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                <span className={`m-sev ${a.sev}`}>{a.sev}</span>
                <span style={{ fontSize: 10.5, color: "var(--text-3)" }}>{a.m} · {a.at} ago</span>
              </div>
              <div className="t" style={{ fontSize: 13 }}>{a.t}</div>
              <div className="s">{a.who}</div>
            </div>
            <button className="btn outline xs">Ack</button>
          </div>
        ))}
      </div>
    </>
  );
};

// 10 — Alert Rules
const MAlertRules = () => {
  const rules = [
    { n: "Sales drop > 20%", m: "Sales", on: true, sev: "critical", trig: "8 fired · 7d" },
    { n: "AR Aging > 90 days", m: "Finance", on: true, sev: "high", trig: "12 fired · 7d" },
    { n: "Stock below safety", m: "Warehouse", on: true, sev: "high", trig: "5 fired · 7d" },
    { n: "PO lead time drift", m: "Purchase", on: true, sev: "medium", trig: "3 fired · 7d" },
    { n: "Line downtime > 30m", m: "Production", on: false, sev: "high", trig: "Off" },
    { n: "Yield drop", m: "Production", on: true, sev: "medium", trig: "1 fired · 7d" },
  ];
  return (
    <>
      <ChipRow items={["All","Sales","Finance","Warehouse","Purchase","Production"]} active="All"/>
      <div style={{ padding: "0 16px 12px" }}>
        <button className="btn primary" style={{ width: "100%" }}><Icon name="plus" size={14}/> Buat Rule Baru</button>
      </div>
      <div className="m-card flush">
        {rules.map((r,i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: r.on ? "var(--primary-soft)" : "var(--bg-subtle)", color: r.on ? "var(--primary-ink)" : "var(--text-3)" }}><Icon name="bolt" size={14}/></div>
            <div className="body">
              <div className="t" style={{ fontSize: 13 }}>{r.n}</div>
              <div className="s"><span className={`m-sev ${r.sev}`}>{r.sev}</span> <span style={{ marginLeft: 6 }}>{r.m} · {r.trig}</span></div>
            </div>
            <div style={{ width: 36, height: 22, borderRadius: 999, background: r.on ? "var(--primary)" : "var(--border-strong)", position: "relative", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: 50, background: "white", position: "absolute", top: 2, left: r.on ? 16 : 2, transition: "left 0.2s" }}/>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// 11 — Alert Templates
const MAlertTemplates = () => {
  const tpls = [
    { n: "Critical · Slack", ch: "Slack", emoji: "🚨", body: "[CRITICAL] {{rule}} di {{module}} — {{value}}", uses: 24 },
    { n: "High · Email", ch: "Email", emoji: "⚠️", body: "Alert {{severity}}: {{rule}}", uses: 18 },
    { n: "WhatsApp Daily", ch: "WhatsApp", emoji: "💬", body: "Halo {{name}}, ada {{count}} alert hari ini", uses: 12 },
    { n: "PagerDuty Critical", ch: "PagerDuty", emoji: "📟", body: "Critical incident: {{rule}}", uses: 6 },
  ];
  return (
    <>
      <div style={{ padding: "12px 16px" }}>
        <button className="btn primary" style={{ width: "100%" }}><Icon name="plus" size={14}/> Buat Template</button>
      </div>
      <div className="m-card flush">
        {tpls.map((t,i) => (
          <div key={i} className="m-row" style={{ alignItems: "flex-start" }}>
            <div className="icon-tile" style={{ background: "var(--bg-subtle)", fontSize: 18 }}>{t.emoji}</div>
            <div className="body">
              <div className="t" style={{ fontSize: 13 }}>{t.n}</div>
              <div className="s" style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, padding: "6px 8px", background: "var(--bg-subtle)", borderRadius: 6 }}>{t.body}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span className="badge primary">{t.ch}</span>
                <span className="badge" style={{ background: "var(--bg-subtle)", color: "var(--text-3)" }}>{t.uses} uses</span>
              </div>
            </div>
            <Icon name="chev" size={14} color="var(--text-3)"/>
          </div>
        ))}
      </div>
    </>
  );
};

// 12 — Notification Channels
const MChannels = () => {
  const channels = [
    { n: "Slack — #ops-alerts", icon: "msg", st: "connected", c: "#4a154b", sub: "12 messages today" },
    { n: "Email — alerts@sentient", icon: "mail", st: "connected", c: "#3e97ff", sub: "84 sent · 100% deliver" },
    { n: "WhatsApp Business", icon: "wa", st: "connected", c: "#25d366", sub: "Twilio · 28 sent" },
    { n: "PagerDuty Critical", icon: "bell", st: "warning", c: "#06ac38", sub: "Webhook latency 1.2s" },
    { n: "Microsoft Teams", icon: "msg", st: "disconnected", c: "#5059c9", sub: "Token expired · reconnect" },
  ];
  return (
    <>
      <div style={{ padding: "12px 16px" }}>
        <button className="btn primary" style={{ width: "100%" }}><Icon name="plus" size={14}/> Tambah Channel</button>
      </div>
      <div className="m-card flush">
        {channels.map((c,i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: c.c + "22", color: c.c }}><Icon name={c.icon} size={16}/></div>
            <div className="body">
              <div className="t" style={{ fontSize: 13 }}>{c.n}</div>
              <div className="s">{c.sub}</div>
            </div>
            <span className={`badge ${c.st === "connected" ? "success" : c.st === "warning" ? "warning" : "danger"} dot`}>{c.st}</span>
          </div>
        ))}
      </div>
      <SectionHeader title="Test Tool"/>
      <div className="m-card"><div className="m-card-pad">
        <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>Kirim test notification ke channel</div>
        <select style={{ width: "100%", padding: 10, border: "1px solid var(--border-strong)", borderRadius: 8, fontSize: 13, marginBottom: 8 }}><option>Slack — #ops-alerts</option></select>
        <button className="btn outline" style={{ width: "100%" }}><Icon name="arrowUp" size={13}/> Send Test</button>
      </div></div>
    </>
  );
};

// 13 — Notification Logs
const MLogs = () => {
  const logs = [
    { ch: "Slack", t: "Critical · Sales drop", st: "delivered", at: "14:32" },
    { ch: "Email", t: "AR Aging report", st: "delivered", at: "14:18" },
    { ch: "WhatsApp", t: "Stock alert", st: "delivered", at: "13:54" },
    { ch: "Teams", t: "PO approval reminder", st: "failed", at: "13:32" },
    { ch: "Slack", t: "High · Lead time drift", st: "delivered", at: "13:18" },
    { ch: "PagerDuty", t: "Line C downtime", st: "delivered", at: "12:54" },
    { ch: "Email", t: "Daily digest", st: "queued", at: "12:00" },
  ];
  const stMap = { delivered: "success", failed: "danger", queued: "warning" };
  return (
    <>
      <ChipRow items={["All","Delivered","Failed","Queued"]} active="All"/>
      <div className="m-kpi-grid">
        <div className="m-kpi" style={{ padding: 10 }}><div className="l">Delivered</div><div className="v" style={{ color: "var(--success-ink)", fontSize: 20 }}>98</div></div>
        <div className="m-kpi" style={{ padding: 10 }}><div className="l">Failed</div><div className="v" style={{ color: "var(--danger-ink)", fontSize: 20 }}>2</div></div>
      </div>
      <div className="m-card flush">
        {logs.map((l,i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: "var(--bg-subtle)", color: "var(--text-2)", fontSize: 10, fontWeight: 700 }}>{l.ch.slice(0,2).toUpperCase()}</div>
            <div className="body">
              <div className="t" style={{ fontSize: 13 }}>{l.t}</div>
              <div className="s">{l.ch} · {l.at}</div>
            </div>
            <span className={`badge ${stMap[l.st]} dot`}>{l.st}</span>
          </div>
        ))}
      </div>
    </>
  );
};

// 14 — Settings
const MSettings = () => (
  <>
    <SectionHeader title="Profile"/>
    <div className="m-card"><div className="m-card-pad" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 50, background: "linear-gradient(135deg,#3e97ff,#7239ea)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>NP</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Nadia Pratama</div>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>Factory Admin · nadia@sentient</div>
      </div>
      <Icon name="chev" size={14} color="var(--text-3)"/>
    </div></div>
    <SectionHeader title="Alerting Preferences"/>
    <div className="m-card flush">
      {[
        ["Push Notifications", true, "All severity"],
        ["Email Summary", true, "Daily 17:00"],
        ["Quiet Hours", false, "22:00 → 06:00"],
        ["Auto-acknowledge low", true, "Setelah 4 jam"],
      ].map(([l,on,sub],i) => (
        <div key={i} className="m-row">
          <div className="body"><div className="t" style={{ fontSize: 13 }}>{l}</div><div className="s">{sub}</div></div>
          <div style={{ width: 36, height: 22, borderRadius: 999, background: on ? "var(--primary)" : "var(--border-strong)", position: "relative", flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: 50, background: "white", position: "absolute", top: 2, left: on ? 16 : 2 }}/>
          </div>
        </div>
      ))}
    </div>
    <SectionHeader title="Escalation Policy"/>
    <div className="m-card"><div className="m-card-pad">
      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>Default escalation jika tidak di-acknowledge</div>
      {[
        ["1", "Owner module", "0m"],
        ["2", "Team channel", "5m"],
        ["3", "On-call manager", "15m"],
        ["4", "Director", "30m"],
      ].map(([n,who,t],i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i<3?"1px solid var(--divider)":"none" }}>
          <div style={{ width: 24, height: 24, borderRadius: 50, background: "var(--primary-soft)", color: "var(--primary-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11 }}>{n}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{who}</div>
          <span className="badge" style={{ fontFamily: "var(--font-mono)" }}>+{t}</span>
        </div>
      ))}
    </div></div>
    <SectionHeader title="System"/>
    <div className="m-card flush">
      {[
        ["Audit Log", "external"],
        ["API Keys", "external"],
        ["Data Sources", "external"],
        ["Sign Out", "logout"],
      ].map(([l,ic],i) => (
        <div key={i} className="m-row"><div className="body"><div className="t" style={{ fontSize: 13 }}>{l}</div></div><Icon name="chev" size={14} color="var(--text-3)"/></div>
      ))}
    </div>
  </>
);

window.MAlertCenter = MAlertCenter;
window.MAlertRules = MAlertRules;
window.MAlertTemplates = MAlertTemplates;
window.MChannels = MChannels;
window.MLogs = MLogs;
window.MSettings = MSettings;
