/* global React, SF */
const { Icon } = SF;

const StatBig = ({ label, value, delta, deltaDir = "up", icon, tone = "primary", sub }) => (
  <div className={`stat t-${tone}`}>
    <div className="label">{label}</div>
    <div className="value tnum">{value}</div>
    {delta && <div className={`delta ${deltaDir}`}><Icon name={deltaDir === "up" ? "arrowUp" : "arrowDown"} size={12} /> {delta}</div>}
    {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
    <div className="icon-tile"><Icon name={icon} size={18} /></div>
  </div>
);

// ============ FINANCE DASHBOARD ============
const FinanceDashboard = () => {
  const cashPos = [
    { name: "BCA Main Account", code: "1101", v: "Rp 3,2 M", t: "primary", icon: "coin" },
    { name: "BRI Operasional", code: "1102", v: "Rp 1,1 M", t: "info", icon: "coin" },
    { name: "Mandiri Payroll", code: "1103", v: "Rp 540 Jt", t: "success", icon: "coin" },
    { name: "Cash on Hand", code: "1100", v: "Rp 95 Jt", t: "warning", icon: "coin" },
  ];
  const apAging = [
    { lbl: "0-30 Days", v: 42, c: "var(--success)", pct: "56%" },
    { lbl: "31-60 Days", v: 18, c: "var(--warning)", pct: "24%" },
    { lbl: "61-90 Days", v: 9, c: "#ff8a3d", pct: "12%" },
    { lbl: "90+ Days", v: 6, c: "var(--danger)", pct: "8%" },
  ];
  const arAging = [
    { lbl: "0-30 Days", v: 37, c: "var(--success)", pct: "51%" },
    { lbl: "31-60 Days", v: 21, c: "var(--warning)", pct: "29%" },
    { lbl: "61-90 Days", v: 8, c: "#ff8a3d", pct: "11%" },
    { lbl: "90+ Days", v: 6, c: "var(--danger)", pct: "9%" },
  ];
  const overdue = [
    { id: "INV/AR-0221", from: "PT Surya Mandiri · Due 18 Mar 2026", v: "Rp 195.000.000", t: "3 days overdue" },
    { id: "INV/AR-0212", from: "PT Prima Indo · Due 14 Mar 2026", v: "Rp 96.300.000", t: "7 days overdue" },
    { id: "INV/AR-0204", from: "CV Bina Karya · Due 10 Mar 2026", v: "Rp 54.200.000", t: "11 days overdue" },
    { id: "INV/AR-0193", from: "PT Bumi Citra · Due 5 Mar 2026", v: "Rp 32.700.000", t: "16 days overdue" },
  ];
  const recon = [
    { name: "BCA Main Account", v: "138/140 matched", pct: 98, sub: "settled in 2s", c: "var(--success)" },
    { name: "BRI Operasional", v: "94/100 matched", pct: 94, sub: "needs 6 review", c: "var(--success)" },
    { name: "Mandiri Payroll", v: "78/110 matched", pct: 71, sub: "in progress", c: "var(--warning)" },
  ];
  const txns = [
    { vno: "BR-22001", date: "01/03/2026", acc: "Cash & Bank", branch: "Jakarta", amt: "Rp 145.000.000", st: "success", lbl: "Posted" },
    { vno: "BR-22030", date: "04/03/2026", acc: "Downstream Receiv.", branch: "Surabaya", amt: "Rp 92.300.000", st: "warning", lbl: "Pending" },
    { vno: "JV-22020", date: "08/03/2026", acc: "Payroll Liability", branch: "Bandung", amt: "Rp 81.500.000", st: "success", lbl: "Posted" },
    { vno: "JV-22019", date: "11/03/2026", acc: "Tax Payable", branch: "Jakarta", amt: "Rp 142.800.000", st: "warning", lbl: "Pending" },
    { vno: "BR-22035", date: "13/03/2026", acc: "Account Payable", branch: "Semarang", amt: "Rp 56.900.000", st: "danger", lbl: "Failed" },
    { vno: "JV-22041", date: "16/03/2026", acc: "Cash & Bank", branch: "Medan", amt: "Rp 84.100.000", st: "success", lbl: "Posted" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      {/* row 1: stats */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <StatBig label="Total Inflow" value="Rp 5,4 M" delta="12.4% vs last" deltaDir="up" icon="arrowUp" tone="success" sub="MTD March 2026" />
        <StatBig label="Total Outflow" value="Rp 3,8 M" delta="6.1% vs last" deltaDir="up" icon="arrowDown" tone="warning" sub="MTD March 2026" />
        <StatBig label="Net Cashflow" value="Rp 1,6 M" delta="20.0% vs last" deltaDir="up" icon="coin" tone="primary" sub="MTD March 2026" />
        <StatBig label="Outstanding Payable" value="Rp 845 Jt" delta="3.2% vs last" deltaDir="down" icon="bolt" tone="danger" sub="92 invoices" />
      </div>

      {/* row 2: cash position + cashflow forecast */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Cash Position</h3>
              <div className="sub">March 2026</div>
            </div>
            <div className="actions"><button className="icon-btn" style={{ width: 28, height: 28 }}><Icon name="more" size={14}/></button></div>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cashPos.map((c,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 4px" }}>
                <div className={`badge ${c.t}`} style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center" }}><Icon name={c.icon} size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{c.code}</div>
                </div>
                <div className="tnum" style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div><h3>Cashflow Forecast</h3><div className="sub">Next 4 weeks</div></div>
            <div className="actions">
              <span className="badge"><span style={{ width: 8, height: 2, background: "#17c653", display: "inline-block" }}></span> Inflow</span>
              <span className="badge"><span style={{ width: 8, height: 2, background: "#f8285a", display: "inline-block" }}></span> Outflow</span>
            </div>
          </div>
          <div className="card-body">
            <svg viewBox="0 0 600 220" style={{ width: "100%", height: 220 }}>
              {/* gridlines */}
              {[0,1,2,3,4].map(i => (
                <line key={i} x1="40" x2="590" y1={20+i*40} y2={20+i*40} stroke="#eef0f5" strokeWidth="1"/>
              ))}
              {[0,1,2,3,4].map(i => (
                <text key={i} x="32" y={24+i*40} textAnchor="end" fontSize="9" fill="#a1a8b5" fontFamily="var(--font-mono)">{[160,120,80,40,0][i]}b</text>
              ))}
              {/* outflow */}
              <path d="M40,140 L130,150 L220,135 L310,160 L400,150 L490,170 L580,165" fill="none" stroke="#f8285a" strokeWidth="2.2"/>
              {/* inflow */}
              <path d="M40,90 L130,80 L220,100 L310,70 L400,85 L490,60 L580,75" fill="none" stroke="#17c653" strokeWidth="2.2"/>
              {/* dots */}
              {[[40,90],[130,80],[220,100],[310,70],[400,85],[490,60],[580,75]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#17c653"/>)}
              {[[40,140],[130,150],[220,135],[310,160],[400,150],[490,170],[580,165]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#f8285a"/>)}
              {/* x labels */}
              {["W1","W2","W3","W4","W5","W6","W7"].map((l,i) => (
                <text key={i} x={40+i*90} y="210" textAnchor="middle" fontSize="10" fill="#78808f">{l}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* row 3: AR + AP aging */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {[{ttl: "AR Aging", total: 75, data: arAging},{ttl: "AP Aging", total: 72, data: apAging}].map((g,gi) => (
          <div key={gi} className="card">
            <div className="card-header"><div><h3>{g.ttl}</h3><div className="sub">March 2026</div></div></div>
            <div className="card-body">
              <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total</span>
                <span className="tnum" style={{ fontSize: 24, fontWeight: 700 }}>{g.total}</span>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>invoices</span>
              </div>
              {g.data.map((r,i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, background: r.c, borderRadius: 50, marginRight: 8 }}></span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.lbl}</span>
                    <span className="tnum" style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700 }}>{r.v}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 6 }}>{r.pct}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: r.pct, height: "100%", background: r.c, borderRadius: 3 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* row 4: overdue + bank recon */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Overdue Invoices</h3><div className="sub">March 2026</div></div><div className="actions"><a style={{ color: "var(--primary)", fontSize: 12, fontWeight: 600 }}>View all →</a></div></div>
          <div className="card-body" style={{ padding: 0 }}>
            {overdue.map((o,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: i < overdue.length-1 ? "1px solid var(--divider)" : "none" }}>
                <div className="badge danger" style={{ width: 36, height: 36, borderRadius: 8, padding: 0, justifyContent: "center", marginRight: 12 }}><Icon name="bolt" size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{o.id}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{o.from}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="tnum" style={{ fontSize: 13, fontWeight: 700 }}>{o.v}</div>
                  <div className="badge danger" style={{ marginTop: 2 }}>{o.t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Bank Reconciliation Status</h3><div className="sub">March 2026</div></div></div>
          <div className="card-body">
            {recon.map((r,i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 6 }}>
                  <strong style={{ fontSize: 12.5 }}>{r.name}</strong>
                  <span className="tnum" style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700 }}>{r.v}</span>
                </div>
                <div style={{ height: 8, background: "var(--bg)", borderRadius: 4 }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: r.c, borderRadius: 4 }}></div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent txns */}
      <div className="card">
        <div className="card-header">
          <div><h3>Recent Finance Transactions</h3><div className="sub">March 2026 · Live feed</div></div>
          <div className="actions">
            <button className="btn outline sm"><Icon name="filter" size={12} /> Filter</button>
            <button className="btn outline sm"><Icon name="download" size={12} /> Export</button>
          </div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>Voucher No</th><th>Date</th><th>Account</th><th>Branch</th><th style={{ textAlign: "right" }}>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {txns.map((t,i) => (
                <tr key={i}>
                  <td className="mono">{t.vno}</td>
                  <td className="num">{t.date}</td>
                  <td>{t.acc}</td>
                  <td>{t.branch}</td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{t.amt}</td>
                  <td><span className={`badge ${t.st}`}>{t.lbl}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.FinanceDashboard = FinanceDashboard;
