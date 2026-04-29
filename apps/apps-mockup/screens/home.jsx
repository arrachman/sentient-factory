/* global React, SF */
const { Icon } = SF;

// ============ HOME / MISSION CONTROL ============
const HomeOverview = () => {
  const kpis = [
    { l: "Sales MTD", v: "Rp 390,5 M", d: "+8.0%", up: true, sub: "vs last month", icon: "chart", tone: "success", spark: [12,18,16,22,20,28,32,30,36,42] },
    { l: "Net Cashflow", v: "Rp 1,6 M", d: "+20.0%", up: true, sub: "March 2026", icon: "coin", tone: "primary", spark: [10,14,12,18,22,20,26,28,32,30] },
    { l: "Outstanding AR", v: "Rp 845 Jt", d: "−3.2%", up: false, sub: "92 invoices open", icon: "bolt", tone: "warning", spark: [40,38,42,36,34,30,28,32,28,26] },
    { l: "Production Yield", v: "94.7%", d: "+0.8%", up: true, sub: "5 lines running", icon: "factory", tone: "info", spark: [88,90,89,92,91,93,94,93,95,94] },
  ];
  const modules = [
    { name: "Finance", icon: "coin", tone: "primary", health: "healthy", a: 2, kpi: "Rp 1,6 M", k: "Net Flow", trend: 20, hot: "AR Aging 90+ rising in Jakarta" },
    { name: "Warehouse", icon: "box", tone: "info", health: "watch", a: 1, kpi: "12,408", k: "SKU On Hand", trend: 1.2, hot: "7 SKU below safety stock" },
    { name: "Purchase", icon: "cart", tone: "warning", health: "watch", a: 1, kpi: "184", k: "Active POs", trend: -3.4, hot: "PT Cipta Logam lead time drift" },
    { name: "Sales", icon: "chart", tone: "success", health: "alert", a: 3, kpi: "Rp 390,5 M", k: "MTD Revenue", trend: 8, hot: "Surabaya −31.6% yesterday" },
    { name: "Production", icon: "factory", tone: "info", health: "healthy", a: 0, kpi: "94.7%", k: "Yield Rate", trend: 0.8, hot: "Line C stopped — maintenance" },
    { name: "Delivery", icon: "truck", tone: "primary", health: "watch", a: 1, kpi: "98.2%", k: "On-time", trend: -0.4, hot: "2 shipments delayed today" },
  ];
  const sentiPrompts = [
    { i: "chart", t: "Sales vs collection 3 bulan terakhir" },
    { i: "coin", t: "Customer berisiko aging > 90 hari" },
    { i: "box", t: "Stok yang akan habis 14 hari ke depan" },
    { i: "cart", t: "Lead time supplier paling lambat" },
  ];
  const alerts = [
    { sev: "critical", t: "Daily sales dropped −31.6% di Surabaya", m: "Sales", at: "2m" },
    { sev: "critical", t: "Dead-letter triage requires action", m: "Alerting", at: "5m" },
    { sev: "high", t: "Overdue receivable naik materially di Jakarta", m: "Finance", at: "8m" },
    { sev: "high", t: "Stock Aluminum Sheet 3mm di bawah minimum", m: "Warehouse", at: "14m" },
    { sev: "medium", t: "Lead time drift PT Cipta Logam Nusantara", m: "Purchase", at: "21m" },
    { sev: "medium", t: "Line C Assembly stopped — operator dispatched", m: "Production", at: "28m" },
  ];
  const tasks = [
    { t: "Approve PO-2026-0218 (PT Cipta Logam)", who: "Procurement Lead", due: "Hari ini, 16:00", p: "high" },
    { t: "Verifikasi rekonsiliasi BCA Main Account", who: "Finance Manager", due: "Hari ini, 17:30", p: "high" },
    { t: "Review escalation rule untuk Sales drop", who: "Ops Alert Group", due: "Besok, 10:00", p: "medium" },
    { t: "Update jadwal preventive maintenance Line C", who: "Production Manager", due: "Besok, 14:00", p: "medium" },
  ];
  const factoryStatus = [
    { name: "Cibitung-1", type: "Plant", st: "running", load: 86 },
    { name: "Cibitung-2", type: "Plant", st: "running", load: 72 },
    { name: "Surabaya-A", type: "Warehouse", st: "running", load: 64 },
    { name: "Bekasi-3", type: "Warehouse", st: "watch", load: 48 },
    { name: "Surabaya-B", type: "Warehouse", st: "alert", load: 22 },
  ];
  const dataFreshness = [
    { src: "MyERPPlus · Sales", ago: "12s", st: "ok" },
    { src: "MyERPPlus · Finance", ago: "30s", st: "ok" },
    { src: "MyERPPlus · Inventory", ago: "1m", st: "ok" },
    { src: "WMS Realtime", ago: "8s", st: "ok" },
    { src: "Production MES", ago: "4m", st: "stale" },
  ];

  const Sparkline = ({ data, color }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v,i) => `${(i/(data.length-1))*100},${30 - ((v-min)/(max-min||1))*28 - 1}`).join(" ");
    return (
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: 32 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke"/>
      </svg>
    );
  };

  const healthMap = { healthy: "success", watch: "warning", alert: "danger" };
  const sevColor = s => s === "critical" ? "danger" : s === "high" ? "warning" : s === "medium" ? "info" : "primary";

  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      {/* Hero — greeting + system pulse */}
      <div className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, #0a1f3d 0%, #11141b 45%, #1e2a4a 100%)", border: "none", color: "white", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 30%, #3e97ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #7239ea 0, transparent 40%)" }}></div>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 28, position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 50, background: "#17c653", animation: "pulse 1.6s infinite" }}/>
              <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.75, fontWeight: 600 }}>Mission Control · All systems operational</span>
            </div>
            <h2 style={{ fontSize: 24, margin: "0 0 6px", fontWeight: 700, letterSpacing: "-0.015em" }}>Selamat siang, Nadia.</h2>
            <p style={{ fontSize: 13, opacity: 0.78, margin: 0, maxWidth: 560, lineHeight: 1.55 }}>
              <strong style={{ color: "#ffd05a" }}>3 anomali aktif</strong> dalam 1 jam terakhir di modul Sales, Finance, dan Production. <strong style={{ color: "#9bf0ad" }}>5 plant online</strong>, semua channel notifikasi tersambung.
            </p>
          </div>

          {/* Senti Quick Ask */}
          <div style={{ width: 460, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: 14, backdropFilter: "blur(6px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#3e97ff,#7239ea)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sparkles" size={14} color="white"/></div>
              <strong style={{ fontSize: 13 }}>Tanya Senti AI</strong>
              <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.6, fontFamily: "var(--font-mono)" }}>⌘K</span>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, display: "flex", alignItems: "center", padding: "8px 12px", marginBottom: 10 }}>
              <input placeholder="Ask anything about finance, warehouse, sales…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13 }}/>
              <button style={{ background: "#3e97ff", border: "none", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>Ask <Icon name="chev" size={11}/></button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {sentiPrompts.map((p,i) => (
                <span key={i} style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 9px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <Icon name={p.i} size={10}/> {p.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="stat-grid" style={{ marginBottom: 16, gridTemplateColumns: "repeat(4, 1fr)" }}>
        {kpis.map((k,i) => (
          <div key={i} className={`stat t-${k.tone}`} style={{ padding: 18 }}>
            <div className="label">{k.l}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <div className="value tnum" style={{ marginTop: 0 }}>{k.v}</div>
              <span className={`badge ${k.up ? "success" : "danger"}`}>{k.d}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, marginBottom: 6 }}>{k.sub}</div>
            <Sparkline data={k.spark} color={k.up ? "#17c653" : "#f8285a"}/>
            <div className="icon-tile"><Icon name={k.icon} size={18}/></div>
          </div>
        ))}
      </div>

      {/* Module health row */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div><h3>Module Health</h3><div className="sub">Status, KPI, dan hot signal per modul · klik untuk masuk dashboard</div></div>
          <div className="actions">
            <span className="badge success dot">3 healthy</span>
            <span className="badge warning dot">2 watch</span>
            <span className="badge danger dot">1 alert</span>
          </div>
        </div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 14 }}>
          {modules.map((m,i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 14, background: "var(--surface)", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className={`badge ${m.tone}`} style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center" }}><Icon name={m.icon} size={16}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{m.k}</div>
                </div>
                <span className={`badge ${healthMap[m.health]} dot`}>{m.health}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <div className="tnum" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>{m.kpi}</div>
                <span className={`badge ${m.trend >= 0 ? "success" : "danger"}`}>{m.trend > 0 ? "+" : ""}{m.trend}%</span>
                {m.a > 0 && <span className="badge danger" style={{ marginLeft: "auto" }}>{m.a} alert{m.a>1?"s":""}</span>}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.45, padding: "8px 10px", background: "var(--bg-subtle)", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="bolt" size={11} color="#78808f"/> {m.hot}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity stream + Live alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div><h3>Cross-module Activity</h3><div className="sub">Last 24 hours · live aggregation</div></div>
            <div className="actions">
              <span className="badge primary"><span className="sev-dot" style={{background:"var(--primary)"}}/>Senti Queries</span>
              <span className="badge success"><span className="sev-dot" style={{background:"var(--success)"}}/>Resolved</span>
              <span className="badge warning"><span className="sev-dot" style={{background:"var(--warning)"}}/>New Events</span>
            </div>
          </div>
          <div className="card-body">
            <svg viewBox="0 0 600 220" style={{ width: "100%", height: 220 }}>
              <defs>
                <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#3e97ff" stopOpacity="0.25"/>
                  <stop offset="1" stopColor="#3e97ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0,1,2,3,4].map(i => <line key={i} x1="40" x2="590" y1={20+i*40} y2={20+i*40} stroke="#eef0f5"/>)}
              <path d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40 L580,200 L40,200Z" fill="url(#hg)"/>
              <path d="M40,150 L100,140 L160,120 L220,130 L280,80 L340,90 L400,60 L460,75 L520,50 L580,40" fill="none" stroke="#3e97ff" strokeWidth="2.2"/>
              <path d="M40,170 L100,165 L160,155 L220,145 L280,150 L340,130 L400,135 L460,120 L520,115 L580,100" fill="none" stroke="#17c653" strokeWidth="2.2"/>
              <path d="M40,180 L100,178 L160,170 L220,175 L280,165 L340,168 L400,155 L460,160 L520,150 L580,148" fill="none" stroke="#f6c000" strokeWidth="2.2"/>
              {["00","04","08","12","16","20","24"].map((l,i) => (
                <text key={i} x={40+i*90} y="210" textAnchor="middle" fontSize="10" fill="#78808f">{l}:00</text>
              ))}
              {[0,40,80,120,160].map((v,i) => <text key={i} x="32" y={204-i*40} textAnchor="end" fontSize="9" fill="#a1a8b5" fontFamily="var(--font-mono)">{v}</text>)}
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 }}>
              {[
                { l: "Senti Queries", v: "284", d: "+18%" },
                { l: "Alerts Triggered", v: "16", d: "+4" },
                { l: "Resolved", v: "42", d: "+12" },
                { l: "Notif Delivered", v: "98", d: "100%" },
              ].map((s,i) => (
                <div key={i} style={{ padding: "10px 12px", background: "var(--bg-subtle)", borderRadius: 8 }}>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                    <span className="tnum" style={{ fontSize: 18, fontWeight: 700 }}>{s.v}</span>
                    <span style={{ fontSize: 10.5, color: "var(--success-ink)", fontWeight: 600 }}>{s.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Live Alert Feed</h3><div className="sub">Cross-module priority</div></div><div className="actions"><a style={{color:"var(--primary)",fontSize:12,fontWeight:600,cursor:"pointer"}}>View all →</a></div></div>
          <div className="card-body" style={{ padding: 0, maxHeight: 360, overflowY: "auto" }}>
            {alerts.map((r,i) => (
              <div key={i} style={{ padding: "11px 18px", borderBottom: i < alerts.length-1 ? "1px solid var(--divider)" : "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span className={`sev-dot sev-${r.sev}`} style={{ marginTop: 6 }}></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.4 }}>{r.t}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span className={`badge ${sevColor(r.sev)}`}>{r.m}</span>
                    <span>{r.at} ago</span>
                  </div>
                </div>
                <button className="btn ghost xs">Ack</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: tasks + facility status + freshness */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Tasks Membutuhkan Aksi</h3><div className="sub">Approval & follow-up · 4 pending</div></div></div>
          <div className="card-body" style={{ padding: 0 }}>
            {tasks.map((t,i) => (
              <div key={i} style={{ padding: "12px 18px", borderBottom: i < tasks.length-1 ? "1px solid var(--divider)" : "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 36, background: t.p === "high" ? "var(--danger)" : "var(--warning)", borderRadius: 3 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t.t}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{t.who} · {t.due}</div>
                </div>
                <button className="btn outline xs">Buka</button>
                <button className="btn dark xs">Approve</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Facility Status</h3><div className="sub">Plants & warehouses · live</div></div></div>
          <div className="card-body">
            {factoryStatus.map((f,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < factoryStatus.length-1 ? "1px solid var(--divider)" : "none" }}>
                <span style={{ width: 8, height: 8, borderRadius: 50, background: f.st === "running" ? "var(--success)" : f.st === "watch" ? "var(--warning)" : "var(--danger)", animation: "pulse 1.8s infinite" }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)" }}>{f.type}</div>
                </div>
                <div style={{ width: 80, height: 6, background: "var(--bg)", borderRadius: 3 }}>
                  <div style={{ width: `${f.load}%`, height: "100%", background: f.load > 70 ? "var(--success)" : f.load > 40 ? "var(--warning)" : "var(--danger)", borderRadius: 3 }}/>
                </div>
                <span className="tnum" style={{ fontSize: 11, fontWeight: 700, minWidth: 30, textAlign: "right" }}>{f.load}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Data Freshness</h3><div className="sub">Source ingestion latency</div></div></div>
          <div className="card-body">
            {dataFreshness.map((d,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < dataFreshness.length-1 ? "1px solid var(--divider)" : "none" }}>
                <Icon name="layers" size={14} color={d.st === "ok" ? "var(--success-ink)" : "var(--warning-ink)"}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{d.src}</div>
                </div>
                <span className={`badge ${d.st === "ok" ? "success" : "warning"}`}>{d.ago} ago</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "8px 10px", background: "var(--primary-soft)", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="refresh" size={12} color="var(--primary-ink)"/>
              <span style={{ fontSize: 11, color: "var(--primary-ink)", fontWeight: 600 }}>Auto-refresh aktif · interval 30s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.HomeOverview = HomeOverview;
