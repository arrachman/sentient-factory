/* global React, SF */
const { Icon } = SF;

// ============ ALERT RULES + TEMPLATES + CHANNELS + LOGS + SETTINGS ============

const AlertRules = () => {
  const rules = [
    { name: "System Dead-Letter Triage Escalation", code: "system-dead-letter-triage-escalation", mod: "alerting", sev: "high", sched: "15m", recip: "—", st: "active", run: "2026-04-28 13:38:56" },
    { name: "Overdue Receivable Alert", code: "Overdue Receivable Total", mod: "Finance", sev: "high", sched: "hourly", recip: "Finance Lead, Management Distribution", st: "active", run: "2026-04-28 13:38:55" },
    { name: "System Test Send Rule", code: "system-test-send-rule", mod: "alerting", sev: "low", sched: "daily", recip: "—", st: "active", run: "2026-04-28 06:18:50" },
    { name: "Sales Drop Alert", code: "Daily Sales Revenue", mod: "Sales", sev: "critical", sched: "15m", recip: "Ops Alert Group, Management Distribution", st: "active", run: "2026-04-28 13:38:56" },
    { name: "Cashflow Anomaly", code: "cashflow-anomaly", mod: "Finance", sev: "high", sched: "hourly", recip: "Finance Manager", st: "draft", run: "—" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="card">
        <div className="card-header">
          <div><h3>Persisted Alert Rules</h3><div className="sub">These rows now come from the real `alert_rule` and `alert_rule_recipient` tables.</div></div>
          <div className="actions"><span className="badge primary">{rules.length} rules</span></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>Rule</th><th>Module</th><th>Severity</th><th>Schedule</th><th>Recipients</th><th>Status</th><th>Last Run</th><th>Action</th></tr></thead>
            <tbody>
              {rules.map((r,i) => (
                <tr key={i}>
                  <td><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{r.code}</div></td>
                  <td>{r.mod}</td>
                  <td><span className={`badge ${r.sev === "critical" ? "danger" : r.sev === "high" ? "warning" : "info"}`}>{r.sev}</span></td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.sched}</td>
                  <td style={{ fontSize: 12, color: "var(--text-2)" }}>{r.recip}</td>
                  <td><span className={`badge ${r.st === "active" ? "success dot" : "warning"}`}>{r.st}</span></td>
                  <td className="mono" style={{ fontSize: 11.5 }}>{r.run}</td>
                  <td><div style={{ display: "flex", gap: 4 }}>
                    <button className="btn ghost xs" title="View"><Icon name="eye" size={11}/></button>
                    <button className="btn ghost xs" title="Edit"><Icon name="edit" size={11}/></button>
                    <button className="btn ghost xs" title="Run Now"><Icon name="play" size={11}/></button>
                    <button className="btn ghost xs" title="Delete" style={{ color: "var(--danger-ink)" }}><Icon name="trash" size={11}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AlertTemplates = () => {
  const tmpls = [
    { name: "Sales Drop Alert", desc: "Detects revenue drop compared to previous period and notifies sales leadership.", sev: "critical", mod: "Sales", ch: "wa-group, email", recip: "Ops Alert Group, Sales Manager" },
    { name: "Negative Stock Alert", desc: "Flags negative stock balances on selected warehouse or SKU groups.", sev: "critical", mod: "Warehouse", ch: "wa-group", recip: "Ops Alert Group, Warehouse Supervisor" },
    { name: "Overdue Receivable Alert", desc: "Monitors overdue receivables and sends escalation to finance recipients.", sev: "high", mod: "Finance", ch: "wa-personal, email", recip: "Finance Manager, Management Distribution" },
    { name: "Cashflow Anomaly", desc: "Monitors unusual cash-in or cash-out changes across the selected period.", sev: "high", mod: "Finance", ch: "email", recip: "Finance Manager" },
    { name: "Lead Time Drift", desc: "Catches supplier lead-time degradation that risks stock-out.", sev: "medium", mod: "Purchase", ch: "wa-group", recip: "Procurement Lead" },
    { name: "Production Yield Drop", desc: "Notifies operations when daily production yield drops below baseline.", sev: "medium", mod: "Production", ch: "wa-group, email", recip: "Production Manager" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {tmpls.map((t,i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div className={`badge ${t.sev === "critical" ? "danger" : t.sev === "high" ? "warning" : "info"}`} style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center", flexShrink: 0 }}><Icon name="bell" size={16}/></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Module: {t.mod} · Default</div>
                  </div>
                  <span className={`badge ${t.sev === "critical" ? "danger" : t.sev === "high" ? "warning" : "info"}`}>{t.sev}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5, margin: "0 0 10px" }}>{t.desc}</p>
                <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 4 }}>Recommended: <strong style={{ color: "var(--text-2)" }}>{t.ch}</strong></div>
                <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 12 }}>Default Recipients: <strong style={{ color: "var(--text-2)" }}>{t.recip}</strong></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn dark sm">Use Template</button>
                  <button className="btn outline sm">View</button>
                  <button className="btn outline sm">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ alignSelf: "flex-start", position: "sticky", top: 24 }}>
        <div className="card-header"><div><h3>Create Alert Template</h3><div className="sub">Persist reusable presets for faster rule creation.</div></div></div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="field"><label>Template Name</label><input placeholder="e.g. Inventory aging alert"/></div>
          <div className="field"><label>Description</label><textarea rows="3" placeholder="Short summary of what this template does"/></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="field"><label>Module</label><select><option>Sales</option><option>Finance</option><option>Warehouse</option></select></div>
            <div className="field"><label>Severity</label><select><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
          </div>
          <div className="field"><label>Recommended Channels</label><input placeholder="wa-group, email"/></div>
          <div className="field"><label>Default Recipients</label><input placeholder="Ops Alert Group, Sales Manager"/></div>
          <div className="field"><label>Schedule</label><input placeholder="15m"/></div>
          <div className="field"><label>Message Template</label><textarea rows="3" placeholder="{{rule.name}} triggered for {{scope}}"/></div>
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "var(--bg-subtle)", borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Default Template For Module</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Only one active default template is kept per module.</div>
            </div>
            <div className="toggle on" style={{ marginLeft: "auto" }}></div>
          </div>
          <button className="btn dark" style={{ justifyContent: "center" }}>Create Template</button>
        </div>
      </div>
    </div>
  );
};

const NotificationChannels = () => {
  const chans = [
    { name: "Finance Lead", target: "+62812111122222", st: "connected", bound: "Finance Manager", tag: "wa-personal-webhook" },
    { name: "Ops Alert Group", target: "ops-alert-grp", st: "connected", bound: "Operations", tag: "wa-group-webhook" },
    { name: "Management Distribution", target: "management@sentient.id", st: "connected", bound: "C-Suite", tag: "email-smtp" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
      <div className="card">
        <div className="card-header">
          <div><h3>WhatsApp Personal · WhatsApp Group · Email</h3><div className="sub">Manage destination channels for WhatsApp personal, WhatsApp group, and email.</div></div>
          <div className="actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text-2)" }}>Show Inactive</span>
            <div className="toggle"></div>
          </div>
        </div>
        <div style={{ padding: "0 18px", borderBottom: "1px solid var(--divider)" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["WhatsApp Personal", "WhatsApp Group", "Email"].map((t,i) => (
              <div key={i} style={{ padding: "12px 14px", fontSize: 12.5, fontWeight: 600, borderBottom: i === 0 ? "2px solid var(--primary)" : "2px solid transparent", color: i === 0 ? "var(--primary)" : "var(--text-3)", cursor: "pointer" }}>{t}</div>
            ))}
          </div>
        </div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {chans.map((c,i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="badge primary" style={{ width: 32, height: 32, borderRadius: 8, padding: 0, justifyContent: "center" }}><Icon name="wa" size={14}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{c.target}</div>
                </div>
                <span className="badge success dot">{c.st}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                <span className="badge">Bound to: {c.bound}</span>
                <span className="badge success">Active</span>
                <span className="badge warning">Dry Run</span>
                <span className="badge" style={{ fontFamily: "var(--font-mono)" }}>{c.tag}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn dark xs">Test Send</button>
                <button className="btn outline xs">Edit</button>
                <button className="btn outline xs">Deactivate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ alignSelf: "flex-start", position: "sticky", top: 24 }}>
        <div className="card-header"><div><h3>Create User Notification Channel</h3></div></div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="field"><label>Channel Type</label><select><option>WhatsApp Personal</option><option>WhatsApp Group</option><option>Email</option></select></div>
          <div className="field"><label>Ownership</label><select><option>Standalone Channel</option><option>Bound to user</option></select></div>
          <div className="field"><label>Label</label><input placeholder="Finance Lead / Ops Alert Group"/></div>
          <div className="field"><label>Team Key</label><input placeholder="finance-core / ops-l2"/></div>
          <div className="field"><label>Target</label><input placeholder="+62812xxxxxxx"/></div>
          <div className="field"><label>Initial Status</label><select><option>Draft</option><option>Active</option></select></div>
          <div style={{ background: "var(--info-soft)", color: "var(--info-ink)", padding: 10, borderRadius: 8, fontSize: 11.5, lineHeight: 1.5 }}>
            <strong>Proper concept:</strong> store this as a standalone notification channel first. Add optional user binding for owner routing, and use 'team key' only when this channel should be matched by team-based escalation policy.
          </div>
          <button className="btn dark" style={{ justifyContent: "center" }}>Create Channel</button>
        </div>
      </div>
    </div>
  );
};

const NotificationLogs = () => {
  const byCh = [
    { name: "email", total: 5, delivered: 5, failed: 0, queued: 0 },
    { name: "wa-group", total: 7, delivered: 7, failed: 0, queued: 0 },
    { name: "wa-personal", total: 8, delivered: 8, failed: 0, queued: 0 },
  ];
  const logs = [
    { ev: "[CRITICAL] Dead-letter triage requires action", code: "evt-tags-escalate-1-1776652838308005", ch: "wa-personal", to: "+62921110572222", st: "Delivered", retry: "0/3", at: "2026-04-22 18:20:39" },
    { ev: "[CRITICAL] Dead-letter triage requires action", code: "evt-tags-escalate-1-1776652838308005", ch: "email", to: "management@sentient.id", st: "Delivered", retry: "0/3", at: "2026-04-22 18:20:36" },
    { ev: "[CRITICAL] Dead-letter triage requires action", code: "evt-tags-escalate-1-1776652838308005", ch: "wa-group", to: "ops-alert-grp", st: "Delivered", retry: "0/3", at: "2026-04-22 18:20:36" },
    { ev: "[CRITICAL] Dead-letter triage requires action", code: "evt-tags-escalate-1-1776652782304", ch: "wa-personal", to: "+62921110572222", st: "Delivered", retry: "0/3", at: "2026-04-22 16:50:13" },
    { ev: "Overdue receivable increased materially", code: "evt-wa-1-snapshot-2", ch: "email", to: "Management Distrib.", st: "Delivered", retry: "0/3", at: "2026-04-22 06:36:45" },
    { ev: "Daily sales revenue dropped sharply for Surabaya", code: "evt-tally-cdtri-revenue-drop-surabaya", ch: "wa-group", to: "Ops Alert Group", st: "Delivered", retry: "0/3", at: "2026-04-22 04:46:50" },
    { ev: "Daily sales dropped below threshold", code: "evt-daily-sales-drop-1", ch: "wa-group", to: "ops-alert-grp", st: "Retry", retry: "1/3", at: "2026-04-22 04:36:25" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="stat-grid" style={{ marginBottom: 16, gridTemplateColumns: "repeat(6, 1fr)" }}>
        <StatMini label="Total Logs" v="16" />
        <StatMini label="Delivered" v="16" tone="success" />
        <StatMini label="Queued" v="0" />
        <StatMini label="Failed" v="0" />
        <StatMini label="Dead Letters" v="0" />
        <StatMini label="Retried" v="1" tone="warning" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Delivery By Channel</h3><div className="sub">Success and queue profile per channel type</div></div></div>
          <div className="card-body">
            {byCh.map((c,i) => {
              const icon = c.name.startsWith("wa") ? "wa" : "mail";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < byCh.length-1 ? "1px solid var(--divider)" : "none" }}>
                  <div className="badge primary" style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center" }}><Icon name={icon} size={15}/></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>Delivered {c.delivered} · Failed {c.failed} · Queued {c.queued}</div>
                  </div>
                  <div className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>{c.total} <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 400 }}>total</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><h3>Pending Retries</h3><div className="sub">Deliveries waiting for the next retry window</div></div></div>
          <div className="card-body" style={{ minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 12.5 }}>
              <div style={{ width: 44, height: 44, background: "var(--success-soft)", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon name="check" size={20} color="var(--success-ink)"/></div>
              No pending retries are waiting right now.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><div><h3>Dead Letter Dashboard</h3><div className="sub">Deliveries that exhausted retry attempts and need manual recovery</div></div></div>
        <div className="card-body" style={{ minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 12.5 }}>
          No dead-letter deliveries are waiting for action.
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3>Delivery History</h3><div className="sub">These rows now come from the real `alert_delivery_log` table</div></div></div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>Event</th><th>Channel</th><th>Recipient</th><th>Status</th><th>Retry</th><th>Sent At</th></tr></thead>
            <tbody>
              {logs.map((l,i) => (
                <tr key={i}>
                  <td><div style={{ fontSize: 12.5, fontWeight: 600 }}>{l.ev}</div><div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{l.code}</div></td>
                  <td><span className="badge" style={{ fontFamily: "var(--font-mono)" }}>{l.ch}</span></td>
                  <td className="mono" style={{ fontSize: 11.5 }}>{l.to}</td>
                  <td><span className={`badge ${l.st === "Delivered" ? "success" : "warning"}`}>{l.st}</span></td>
                  <td className="mono">{l.retry}</td>
                  <td className="mono" style={{ fontSize: 11.5 }}>{l.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatMini = ({ label, v, tone = "primary" }) => (
  <div className="stat" style={{ padding: 14 }}>
    <div className="label" style={{ fontSize: 10.5 }}>{label}</div>
    <div className="value tnum" style={{ fontSize: 22, marginTop: 2 }}>{v}</div>
  </div>
);

const AlertSettings = () => (
  <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    <div className="card">
      <div className="card-header"><div><h3>Execution Defaults</h3><div className="sub">Scheduler and delivery worker now run from backend intervals and can also be triggered manually.</div></div></div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { i: "clock", t: "Scheduler Interval", v: "60s backend worker interval" },
          { i: "clock", t: "Delivery Interval", v: "30s backend worker interval" },
          { i: "bolt", t: "Triage Escalation Interval", v: "60s backend worker interval" },
        ].map((s,i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--bg-subtle)", borderRadius: 8 }}>
            <div className="badge primary" style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center" }}><Icon name={s.i} size={15}/></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.t}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{s.v}</div>
            </div>
          </div>
        ))}
        <div className="field"><label>Quiet Hours</label><input defaultValue="23:00 – 06:00 UTC"/></div>
        <div className="field"><label>Default Dedup Window</label><input defaultValue="30 minutes"/></div>
        <div className="field"><label>Retry Policy</label><input defaultValue="3 attempts with exponential backoff"/></div>
        <div className="field"><label>Triage SLA</label><input defaultValue="60 minutes"/></div>
        <div className="field"><label>Triage Escalation Policy</label><input defaultValue="Warning at SLA, critical at 2x SLA"/></div>
        <div className="field"><label>Triage Escalation Channel</label><input defaultValue="channel-ops-alert-group"/></div>
        <div className="field"><label>Triage Escalation Cooldown</label><input defaultValue="60 minutes"/></div>

        <div style={{ display: "flex", alignItems: "center", padding: 12, background: "var(--bg-subtle)", borderRadius: 8 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Auto Close Triage On Recovery</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>Resolve triage automatically when a requeued delivery succeeds.</div>
          </div>
          <div className="toggle on" style={{ marginLeft: "auto" }}></div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button className="btn outline sm">Run Scheduler Now</button>
          <button className="btn outline sm">Run Delivery Now</button>
          <button className="btn outline sm">Run Triage Escalation Now</button>
          <button className="btn primary sm" style={{ marginLeft: "auto" }}>Save Settings</button>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header"><div><h3>Severity Mapping</h3><div className="sub">Severity colors stay static, while provider readiness now reflects backend configuration.</div></div></div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { sev: "low", c: "info", txt: "All channels currently fall back to dry run" },
          { sev: "medium", c: "primary", txt: "All channels currently fall back to dry run" },
          { sev: "high", c: "warning", txt: "All channels currently fall back to dry run" },
          { sev: "critical", c: "danger", txt: "All channels currently fall back to dry run" },
        ].map((r,i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, border: "1px solid var(--border)", borderRadius: 8 }}>
            <span className={`badge ${r.c}`} style={{ minWidth: 64, justifyContent: "center" }}>{r.sev}</span>
            <div style={{ fontSize: 12.5, color: "var(--text-2)", flex: 1 }}>{r.txt}</div>
            <div className="toggle"></div>
          </div>
        ))}
        <div style={{ marginTop: 8, padding: 14, background: "var(--bg-subtle)", borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Provider Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { p: "WhatsApp Personal", st: "dry-run", c: "warning" },
              { p: "WhatsApp Group", st: "dry-run", c: "warning" },
              { p: "Email SMTP", st: "live", c: "success" },
              { p: "Webhook", st: "live", c: "success" },
            ].map((p,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: 8, background: "var(--surface)", borderRadius: 6, fontSize: 11.5 }}>
                <span style={{ flex: 1, fontWeight: 500 }}>{p.p}</span>
                <span className={`badge ${p.c}`}>{p.st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.AlertRules = AlertRules;
window.AlertTemplates = AlertTemplates;
window.NotificationChannels = NotificationChannels;
window.NotificationLogs = NotificationLogs;
window.AlertSettings = AlertSettings;
