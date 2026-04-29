/* global React, SF, MUI */
const { Icon } = SF;
const { Spark, Bars, Donut, KpiTile, SectionHeader, Seg, ChipRow } = MUI;

// 04 — Finance dashboard
const MFinance = () => {
  const [tab, setTab] = React.useState("Overview");
  const kpis = [
    { l: "Net Cashflow", v: "1,6M", d: "+20%", up: true, icon: "coin", tone: "primary", spark: [10,14,12,18,22,20,26,28,32,30] },
    { l: "Receivable", v: "845Jt", d: "−3.2%", up: false, icon: "bolt", tone: "warning", spark: [40,38,42,36,34,30,28,32,28,26] },
    { l: "Payable", v: "612Jt", d: "+5%", up: true, icon: "cart", tone: "info", spark: [22,24,28,26,30,32,34,32,36,38] },
    { l: "Cash Position", v: "2,4M", d: "+12%", up: true, icon: "chart", tone: "success", spark: [18,22,20,26,28,32,30,34,38,42] },
  ];
  return (
    <>
      <Seg items={["Overview","Cashflow","AR","AP"]} active={tab} onSelect={setTab}/>
      <div className="m-kpi-grid">{kpis.map((k,i) => <KpiTile key={i} {...k}/>)}</div>
      <SectionHeader title="Cash Position 12 Bulan"/>
      <div className="m-card"><div className="m-card-pad">
        <svg viewBox="0 0 320 120" style={{ width: "100%", height: 120 }}>
          <defs><linearGradient id="fg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3e97ff" stopOpacity="0.25"/><stop offset="1" stopColor="#3e97ff" stopOpacity="0"/></linearGradient></defs>
          <path d="M10,100 L40,90 L70,80 L100,85 L130,70 L160,75 L190,55 L220,60 L250,40 L280,45 L310,30 L310,120 L10,120Z" fill="url(#fg)"/>
          <path d="M10,100 L40,90 L70,80 L100,85 L130,70 L160,75 L190,55 L220,60 L250,40 L280,45 L310,30" fill="none" stroke="#3e97ff" strokeWidth="2"/>
        </svg>
      </div></div>
      <SectionHeader title="AR Aging" action="Detail →"/>
      <div className="m-card flush">
        {[
          ["0-30 hari", "Rp 412 Jt", "48%", "success"],
          ["31-60 hari", "Rp 224 Jt", "26%", "info"],
          ["61-90 hari", "Rp 142 Jt", "17%", "warning"],
          ["90+ hari", "Rp 67 Jt", "8%", "danger"],
        ].map(([l,v,p,t],i) => (
          <div key={i} className="m-row">
            <div style={{ width: 4, height: 36, background: `var(--${t})`, borderRadius: 2 }}/>
            <div className="body"><div className="t">{l}</div><div className="s">{p} dari total outstanding</div></div>
            <div className="tnum" style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
      <SectionHeader title="Recent Transactions"/>
      <div className="m-card flush">
        {[
          ["Inv #INV-2026-0428", "PT Cipta Logam", "+Rp 142 Jt", "success"],
          ["Vendor Pmt #VP-218", "PT Mitra Alum", "−Rp 87 Jt", "danger"],
          ["Inv #INV-2026-0427", "CV Sentosa", "+Rp 64 Jt", "success"],
          ["Refund #RF-022", "UD Karya", "−Rp 12 Jt", "danger"],
        ].map(([t,sub,v,k],i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: k === "success" ? "var(--success-soft)" : "var(--danger-soft)", color: k === "success" ? "var(--success-ink)" : "var(--danger-ink)" }}>
              <Icon name={k === "success" ? "arrowDown" : "arrowUp"} size={14}/>
            </div>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{t}</div><div className="s">{sub}</div></div>
            <div className="tnum" style={{ fontSize: 12.5, fontWeight: 700, color: k === "success" ? "var(--success-ink)" : "var(--danger-ink)" }}>{v}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// 05 — Warehouse
const MWarehouse = () => {
  const kpis = [
    { l: "SKU on Hand", v: "12.408", d: "+1.2%", up: true, icon: "box", tone: "info", spark: [22,24,28,26,30,32,34,36,38,40] },
    { l: "Inv Value", v: "8,2M", d: "+0.6%", up: true, icon: "coin", tone: "primary", spark: [60,62,64,66,68,67,70,72,71,73] },
    { l: "Below Min", v: "7", d: "+2", up: false, icon: "bolt", tone: "danger", spark: [3,4,5,4,5,6,5,7,6,7] },
    { l: "Turnover", v: "4.2x", d: "+0.3x", up: true, icon: "refresh", tone: "success", spark: [3.5,3.6,3.7,3.8,3.9,4.0,4.1,4.0,4.1,4.2] },
  ];
  return (
    <>
      <ChipRow items={["All", "Cibitung-1", "Cibitung-2", "Surabaya-A", "Bekasi-3"]} active="All"/>
      <div className="m-kpi-grid">{kpis.map((k,i) => <KpiTile key={i} {...k}/>)}</div>
      <SectionHeader title="Stock Movement 7 Hari"/>
      <div className="m-card"><div className="m-card-pad">
        <Bars data={[42,48,52,46,58,50,62]} color="#3e97ff" h={60}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-3)" }}>
          {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((d,i) => <span key={i}>{d}</span>)}
        </div>
      </div></div>
      <SectionHeader title="Stok Bawah Minimum" action="Reorder →"/>
      <div className="m-card flush">
        {[
          ["Aluminum Sheet 3mm", "12 / 50 pcs", "critical"],
          ["Stainless Bolt M8", "84 / 200 pcs", "high"],
          ["PVC Pipe 4 inch", "32 / 80 pcs", "high"],
          ["Welding Rod 2.5mm", "120 / 300 pcs", "medium"],
        ].map(([n,s,sev],i) => (
          <div key={i} className="m-row">
            <div className="icon-tile" style={{ background: "var(--warning-soft)", color: "var(--warning-ink)" }}><Icon name="box" size={14}/></div>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">{s}</div></div>
            <span className={`m-sev ${sev}`}>{sev}</span>
          </div>
        ))}
      </div>
      <SectionHeader title="Recent Transfers"/>
      <div className="m-card flush">
        {[
          ["TO-2026-0418", "Cibitung-1 → Surabaya-A", "In Transit"],
          ["TO-2026-0417", "Bekasi-3 → Cibitung-2", "Received"],
          ["TO-2026-0416", "Cibitung-2 → Surabaya-B", "Received"],
        ].map(([n,r,s],i) => (
          <div key={i} className="m-row">
            <Icon name="truck" size={16} color="var(--text-3)"/>
            <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">{r}</div></div>
            <span className={`badge ${s === "Received" ? "success" : "warning"}`}>{s}</span>
          </div>
        ))}
      </div>
    </>
  );
};

// 06 — Purchase
const MPurchase = () => (
  <>
    <Seg items={["Active", "Approval", "Delivery"]} active="Active" onSelect={()=>{}}/>
    <div className="m-kpi-grid">
      <KpiTile l="Active POs" v="184" d="−3.4%" up={false} icon="cart" tone="warning" spark={[20,22,24,22,20,18,16,14,15,14]}/>
      <KpiTile l="PO Value" v="3,8M" d="+8%" up={true} icon="coin" tone="primary" spark={[10,12,14,18,16,20,22,24,26,28]}/>
      <KpiTile l="Awaiting" v="12" d="−2" up={true} icon="clock" tone="info" spark={[18,16,14,15,14,12,13,12,13,12]}/>
      <KpiTile l="Lead Time" v="14d" d="+1d" up={false} icon="bolt" tone="warning" spark={[12,12,13,13,12,13,14,13,14,14]}/>
    </div>
    <SectionHeader title="Pending Approval" action="Lihat semua →"/>
    <div className="m-card flush">
      {[
        ["PO-2026-0218", "PT Cipta Logam Nusantara", "Rp 240 Jt", "high"],
        ["PO-2026-0217", "CV Sentosa Materials", "Rp 88 Jt", "medium"],
        ["PO-2026-0216", "PT Bayu Manufaktur", "Rp 124 Jt", "medium"],
      ].map(([n,v,a,p],i) => (
        <div key={i} className="m-row">
          <div style={{ width: 4, height: 36, background: p === "high" ? "var(--danger)" : "var(--warning)", borderRadius: 2 }}/>
          <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">{v}</div></div>
          <div style={{ textAlign: "right" }}>
            <div className="tnum" style={{ fontSize: 12.5, fontWeight: 700 }}>{a}</div>
            <button className="btn primary xs" style={{ marginTop: 4 }}>Approve</button>
          </div>
        </div>
      ))}
    </div>
    <SectionHeader title="Top Suppliers (Lead Time)"/>
    <div className="m-card flush">
      {[
        ["PT Cipta Logam Nusantara", "16 hari", "+2", "warning"],
        ["CV Sentosa Materials", "12 hari", "0", "success"],
        ["PT Mitra Aluminium", "10 hari", "−1", "success"],
        ["UD Karya Jaya", "18 hari", "+3", "danger"],
      ].map(([n,d,t,k],i) => (
        <div key={i} className="m-row">
          <div className="icon-tile" style={{ background: "var(--bg-subtle)", color: "var(--text-2)", fontWeight: 700, fontSize: 12 }}>{n.split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
          <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">Avg lead time</div></div>
          <div style={{ textAlign: "right" }}>
            <div className="tnum" style={{ fontSize: 13, fontWeight: 700 }}>{d}</div>
            <span className={`badge ${k}`}>{t}d drift</span>
          </div>
        </div>
      ))}
    </div>
  </>
);

// 07 — Sales
const MSales = () => (
  <>
    <Seg items={["MTD","WTD","Today"]} active="MTD" onSelect={()=>{}}/>
    <div className="m-kpi-grid">
      <KpiTile l="Sales MTD" v="390,5M" d="+8%" up={true} icon="chart" tone="success" spark={[12,18,16,22,20,28,32,30,36,42]}/>
      <KpiTile l="Avg Order" v="14,2Jt" d="+3%" up={true} icon="cart" tone="primary" spark={[10,12,11,13,14,13,14,15,14,15]}/>
      <KpiTile l="New Orders" v="284" d="+12" up={true} icon="plus" tone="info" spark={[18,20,22,24,22,26,28,26,30,32]}/>
      <KpiTile l="Cancelled" v="14" d="+4" up={false} icon="x" tone="danger" spark={[6,8,7,9,10,11,12,11,13,14]}/>
    </div>
    <SectionHeader title="Sales by Region"/>
    <div className="m-card"><div className="m-card-pad">
      {[
        ["Jakarta", 142, 100, "#3e97ff"],
        ["Surabaya", 98, 70, "#f8285a"],
        ["Bandung", 76, 54, "#17c653"],
        ["Medan", 73, 52, "#f6c000"],
        ["Makassar", 41, 29, "#7239ea"],
      ].map(([r,v,p,c],i) => (
        <div key={i} style={{ marginBottom: i<4?10:0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{r}</span>
            <span className="tnum" style={{ fontWeight: 700 }}>Rp {v} Jt</span>
          </div>
          <div style={{ height: 6, background: "var(--bg-subtle)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${p}%`, height: "100%", background: c, borderRadius: 3 }}/>
          </div>
        </div>
      ))}
    </div></div>
    <SectionHeader title="Top Customers"/>
    <div className="m-card flush">
      {[
        ["PT Cipta Logam", "Jakarta", "Rp 88 Jt", "+12%", true],
        ["CV Sentosa", "Surabaya", "Rp 72 Jt", "−5%", false],
        ["PT Bayu Mfg", "Bandung", "Rp 64 Jt", "+8%", true],
        ["UD Karya Jaya", "Medan", "Rp 52 Jt", "+22%", true],
      ].map(([n,r,v,d,up],i) => (
        <div key={i} className="m-row">
          <div className="icon-tile" style={{ background: "var(--primary-soft)", color: "var(--primary-ink)", fontWeight: 700, fontSize: 11 }}>#{i+1}</div>
          <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">{r}</div></div>
          <div style={{ textAlign: "right" }}>
            <div className="tnum" style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
            <span className={`badge ${up?"success":"danger"}`}>{d}</span>
          </div>
        </div>
      ))}
    </div>
  </>
);

// 08 — Production
const MProduction = () => (
  <>
    <Seg items={["Lines","Yield","Output"]} active="Lines" onSelect={()=>{}}/>
    <div className="m-kpi-grid">
      <KpiTile l="Yield Rate" v="94.7%" d="+0.8%" up={true} icon="factory" tone="success" spark={[88,90,89,92,91,93,94,93,95,94]}/>
      <KpiTile l="Output Today" v="2.840" d="+3%" up={true} icon="box" tone="primary" spark={[2400,2500,2600,2550,2700,2750,2840]}/>
      <KpiTile l="Downtime" v="42m" d="−18%" up={true} icon="clock" tone="success" spark={[60,55,50,52,48,45,42]}/>
      <KpiTile l="Defect" v="1.4%" d="+0.2%" up={false} icon="bolt" tone="warning" spark={[1.0,1.1,1.2,1.1,1.3,1.4,1.4]}/>
    </div>
    <SectionHeader title="Lines Status"/>
    <div className="m-card flush">
      {[
        ["Line A — Cutting", "running", 86, "Output 1.240 / target 1.200"],
        ["Line B — Welding", "running", 72, "Output 980 / target 1.000"],
        ["Line C — Assembly", "stopped", 0, "Maintenance · 32m"],
        ["Line D — Painting", "running", 64, "Output 620 / target 700"],
        ["Line E — Packaging", "running", 92, "Output 540 / target 500"],
      ].map(([n,st,load,sub],i) => (
        <div key={i} className="m-row">
          <span style={{ width: 8, height: 8, borderRadius: 50, background: st === "running" ? "var(--success)" : "var(--danger)", animation: "pulse 1.8s infinite" }}/>
          <div className="body"><div className="t" style={{ fontSize: 13 }}>{n}</div><div className="s">{sub}</div></div>
          <div style={{ width: 60, height: 6, background: "var(--bg-subtle)", borderRadius: 3, marginRight: 8 }}>
            <div style={{ width: `${load}%`, height: "100%", background: load>70?"var(--success)":load>0?"var(--warning)":"var(--danger)", borderRadius: 3 }}/>
          </div>
          <span className="tnum" style={{ fontSize: 11, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{load}%</span>
        </div>
      ))}
    </div>
    <SectionHeader title="Yield by Line (7d)"/>
    <div className="m-card"><div className="m-card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, textAlign: "center" }}>
      {[
        ["A", 96], ["B", 94], ["C", 88], ["D", 92], ["E", 98],
      ].map(([n,v],i) => (
        <div key={i}>
          <Donut value={v} color="#3e97ff" size={48}/>
          <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>Line {n}</div>
        </div>
      ))}
    </div></div>
  </>
);

window.MFinance = MFinance;
window.MWarehouse = MWarehouse;
window.MPurchase = MPurchase;
window.MSales = MSales;
window.MProduction = MProduction;
