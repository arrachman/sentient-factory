/* global React, SF, MUI */
const { Icon } = SF;
const { Spark, KpiTile, SectionHeader } = MUI;

// 01 — Mobile Home
const MHome = () => {
  const kpis = [
    { l: "Sales MTD", v: "390,5M", d: "+8.0%", up: true, icon: "chart", tone: "success", spark: [12,18,16,22,20,28,32,30,36,42] },
    { l: "Net Cashflow", v: "1,6 M", d: "+20%", up: true, icon: "coin", tone: "primary", spark: [10,14,12,18,22,20,26,28,32,30] },
    { l: "Outstanding AR", v: "845 Jt", d: "−3.2%", up: false, icon: "bolt", tone: "warning", spark: [40,38,42,36,34,30,28,32,28,26] },
    { l: "Yield", v: "94.7%", d: "+0.8%", up: true, icon: "factory", tone: "info", spark: [88,90,89,92,91,93,94,93,95,94] },
  ];
  const modules = [
    { id: "finance", name: "Finance", icon: "coin", tone: "primary", health: "healthy", a: 2 },
    { id: "warehouse", name: "Warehouse", icon: "box", tone: "info", health: "watch", a: 1 },
    { id: "purchase", name: "Purchase", icon: "cart", tone: "warning", health: "watch", a: 1 },
    { id: "sales", name: "Sales", icon: "chart", tone: "success", health: "alert", a: 3 },
    { id: "production", name: "Production", icon: "factory", tone: "info", health: "healthy", a: 0 },
    { id: "delivery", name: "Delivery", icon: "truck", tone: "primary", health: "watch", a: 1 },
  ];
  const alerts = [
    { sev: "critical", t: "Daily sales drop −31.6% di Surabaya", m: "Sales", at: "2m" },
    { sev: "high", t: "Overdue receivable naik di Jakarta", m: "Finance", at: "8m" },
    { sev: "medium", t: "Lead time drift PT Cipta Logam", m: "Purchase", at: "21m" },
  ];
  const healthMap = { healthy: "success", watch: "warning", alert: "danger" };
  return (
    <>
      <div className="m-hero">
        <div className="pulse-row"><span style={{ width: 6, height: 6, borderRadius: 50, background: "#17c653", animation: "pulse 1.6s infinite" }}/> Mission Control · all systems</div>
        <h2>Selamat siang, Nadia.</h2>
        <p><strong style={{ color: "#ffd05a" }}>3 anomali aktif</strong> · 5 plant online · semua channel terkoneksi.</p>
      </div>
      <div className="m-kpi-grid">
        {kpis.map((k,i) => <KpiTile key={i} {...k}/>)}
      </div>
      <SectionHeader title="Module Health" action="Lihat semua →"/>
      <div className="m-card flush">
        {modules.map((m,i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: `var(--${m.tone}-soft)`, color: `var(--${m.tone}-ink)` }}><Icon name={m.icon} size={16}/></div>
            <div className="body"><div className="t">{m.name}</div><div className="s"><span className={`badge ${healthMap[m.health]} dot`}>{m.health}</span>{m.a > 0 && <span style={{ marginLeft: 8 }}>{m.a} alert{m.a>1?"s":""}</span>}</div></div>
            <Icon name="chev" size={14} color="var(--text-3)"/>
          </div>
        ))}
      </div>
      <SectionHeader title="Live Alerts" action="View all →"/>
      <div className="m-card flush">
        {alerts.map((r,i) => (
          <div key={i} className="m-row">
            <div style={{ width: 4, height: 36, background: r.sev === "critical" ? "var(--danger)" : r.sev === "high" ? "#ff8a3d" : "var(--warning)", borderRadius: 2 }}/>
            <div className="body">
              <div className="t" style={{ fontSize: 13 }}>{r.t}</div>
              <div className="s"><span className="m-sev" style={{ marginRight: 6 }}><span className={`m-sev ${r.sev}`}>{r.sev}</span></span>{r.m} · {r.at} ago</div>
            </div>
            <button className="btn ghost xs">Ack</button>
          </div>
        ))}
      </div>
      <SectionHeader title="Tasks · 4 pending"/>
      <div className="m-card flush">
        {[
          { t: "Approve PO-2026-0218", who: "Procurement", due: "Hari ini, 16:00", p: "high" },
          { t: "Verifikasi rekonsiliasi BCA", who: "Finance", due: "Hari ini, 17:30", p: "high" },
          { t: "Review escalation rule", who: "Ops Alert", due: "Besok, 10:00", p: "medium" },
        ].map((t,i) => (
          <div key={i} className="m-row">
            <div style={{ width: 4, height: 36, background: t.p === "high" ? "var(--danger)" : "var(--warning)", borderRadius: 2 }}/>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{t.t}</div><div className="s">{t.who} · {t.due}</div></div>
            <button className="btn dark xs">Buka</button>
          </div>
        ))}
      </div>
    </>
  );
};

// 02 — Senti AI Workspace (empty)
const MSentiEmpty = () => {
  const prompts = [
    { i: "chart", t: "Top customer di Surabaya bulan ini" },
    { i: "coin", t: "Customer berisiko aging > 90 hari" },
    { i: "box", t: "Stok yang akan habis 14 hari ke depan" },
    { i: "cart", t: "Lead time supplier paling lambat" },
    { i: "factory", t: "Yield production Line C 7 hari" },
  ];
  return (
    <>
      <div style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 14, background: "linear-gradient(135deg,#3e97ff,#7239ea)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(114,57,234,0.3)" }}>
          <Icon name="sparkles" size={28} color="white"/>
        </div>
        <h2 style={{ fontSize: 20, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Halo, Nadia</h2>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>Tanyakan apa saja tentang operasi factory.</p>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <Icon name="search" size={16} color="var(--text-3)"/>
          <input placeholder="Ketik atau bicarakan…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)" }}/>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="arrowUp" size={14}/></button>
        </div>
      </div>
      <SectionHeader title="Saran" action="Lihat semua →"/>
      <div className="m-card flush">
        {prompts.map((p,i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: "var(--primary-soft)", color: "var(--primary-ink)" }}><Icon name={p.i} size={14}/></div>
            <div className="body"><div className="t" style={{ fontSize: 13.5, fontWeight: 500 }}>{p.t}</div></div>
            <Icon name="chev" size={14} color="var(--text-3)"/>
          </div>
        ))}
      </div>
      <SectionHeader title="Riwayat" action="Semua riwayat →"/>
      <div className="m-card flush">
        {[
          { t: "Top sales by customer last month", at: "10m ago" },
          { t: "AR Aging > 90 days di Jakarta", at: "2j ago" },
          { t: "Cashflow forecast Q2 2026", at: "Kemarin" },
          { t: "Yield production Line C 7 hari", at: "2 hari lalu" },
        ].map((r,i) => (
          <div key={i} className="m-row">
            <Icon name="clock" size={16} color="var(--text-3)"/>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{r.t}</div><div className="s">{r.at}</div></div>
            <Icon name="chev" size={14} color="var(--text-3)"/>
          </div>
        ))}
      </div>
    </>
  );
};

// 03 — Senti AI live streaming results (chat)
const MSentiResults = () => (
  <>
    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--divider)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#3e97ff,#7239ea)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sparkles" size={14} color="white"/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>Top sales by customer last month</div>
        <div style={{ fontSize: 10.5, color: "var(--text-3)" }}><span style={{ color: "var(--success-ink)", fontWeight: 600 }}>● streaming</span> · 4 sources</div>
      </div>
      <Icon name="more" size={16} color="var(--text-3)"/>
    </div>
    <div style={{ padding: 14 }}>
      {/* user message */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <div style={{ background: "var(--primary)", color: "white", padding: "9px 13px", borderRadius: "16px 16px 4px 16px", maxWidth: "78%", fontSize: 13.5 }}>Top sales by customer last month, breakdown by region.</div>
      </div>
      {/* AI message */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#3e97ff,#7239ea)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sparkles" size={12} color="white"/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 12, borderRadius: "16px 16px 16px 4px", fontSize: 13, lineHeight: 1.5 }}>
            Berikut top 5 customer berdasarkan revenue Februari 2026, dengan trend 6 bulan dan kontribusi per region.
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              <span className="m-chip">Source: Sales</span>
              <span className="m-chip">Periode: Feb 2026</span>
              <span className="m-chip">5 customer</span>
            </div>
          </div>
          {/* Result card: chart */}
          <div style={{ marginTop: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Revenue per customer</div>
              <span className="badge primary">Bar chart</span>
            </div>
            <svg viewBox="0 0 280 120" style={{ width: "100%", height: 120 }}>
              {[
                ["PT Cipta Logam", 88, "#3e97ff"],
                ["CV Sentosa", 72, "#17c653"],
                ["PT Bayu Mfg", 64, "#f6c000"],
                ["UD Karya Jaya", 52, "#ff8a3d"],
                ["PT Mitra Alum", 40, "#7239ea"],
              ].map((row,i) => {
                const [name, w, c] = row;
                return (
                  <g key={i} transform={`translate(0,${i*22+4})`}>
                    <text x="0" y="14" fontSize="9" fill="var(--text-2)">{name}</text>
                    <rect x="100" y="5" width={w*1.6} height="14" fill={c} rx="2"/>
                    <text x={100+w*1.6+4} y="14" fontSize="9" fontWeight="700" fill="var(--text)">{w}M</text>
                  </g>
                );
              })}
            </svg>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn outline xs" style={{ flex: 1 }}>Buka detail</button>
              <button className="btn outline xs" style={{ flex: 1 }}><Icon name="download" size={11}/> Export</button>
            </div>
          </div>
          {/* result table */}
          <div style={{ marginTop: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--divider)", fontSize: 12, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Region breakdown <Icon name="external" size={12} color="var(--text-3)"/></div>
            {[
              ["Jakarta", "Rp 142,3 M", "+12%", true],
              ["Surabaya", "Rp 98,7 M", "−5%", false],
              ["Bandung", "Rp 76,1 M", "+8%", true],
              ["Medan", "Rp 73,4 M", "+22%", true],
            ].map(([r,v,d,up],i) => (
              <div key={i} style={{ display: "flex", padding: "9px 12px", borderBottom: i<3?"1px solid var(--divider)":"none", alignItems: "center", fontSize: 12.5 }}>
                <div style={{ flex: 1, fontWeight: 600 }}>{r}</div>
                <div className="tnum" style={{ marginRight: 10 }}>{v}</div>
                <span className={`badge ${up?"success":"danger"}`}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 10.5, color: "var(--text-3)" }}>Generated 14:32 · 4 sources · <a style={{ color: "var(--primary)" }}>View provenance</a></div>
        </div>
      </div>
      {/* follow-up suggestions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
        {["Customer apa yang turun?", "Compare Jan vs Feb", "Forecast Maret 2026"].map((s,i) => (
          <span key={i} className="m-chip" style={{ cursor: "pointer" }}><Icon name="sparkles" size={10}/> {s}</span>
        ))}
      </div>
    </div>
    {/* composer */}
    <div style={{ position: "sticky", bottom: 0, padding: 12, background: "var(--surface)", borderTop: "1px solid var(--divider)" }}>
      <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 22, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="plus" size={16} color="var(--text-3)"/>
        <input placeholder="Tanya lanjutan…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5 }}/>
        <button style={{ width: 30, height: 30, borderRadius: 50, background: "var(--primary)", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="arrowUp" size={13}/></button>
      </div>
    </div>
  </>
);

window.MHome = MHome;
window.MSentiEmpty = MSentiEmpty;
window.MSentiResults = MSentiResults;
