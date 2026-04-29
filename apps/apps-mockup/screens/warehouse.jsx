/* global React, SF */
const { Icon } = SF;

// ============ WAREHOUSE ============
const WarehouseDashboard = () => {
  const stockMovers = [
    { sku: "STL-PIPE-2.5", name: "Steel Pipe Ø2.5\"", wh: "Cibitung-1", on: 1240, mov: -82, st: "low" },
    { sku: "ALU-SHT-3MM", name: "Aluminum Sheet 3mm", wh: "Surabaya-A", on: 412, mov: -120, st: "critical" },
    { sku: "BRG-ROD-12", name: "Bearing Rod 12mm", wh: "Cibitung-2", on: 8240, mov: 540, st: "ok" },
    { sku: "CPP-WIRE-4", name: "Copper Wire 4mm²", wh: "Bekasi-3", on: 320, mov: -68, st: "low" },
    { sku: "BLT-HEX-M10", name: "Hex Bolt M10×40", wh: "Cibitung-1", on: 14820, mov: 1200, st: "ok" },
    { sku: "GLV-NIT-XL", name: "Nitrile Glove XL", wh: "Surabaya-B", on: 92, mov: -45, st: "critical" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat t-info"><div className="label">Total SKU</div><div className="value tnum">12,408</div><div className="delta up"><Icon name="arrowUp" size={12}/> 1.2% MoM</div><div className="icon-tile"><Icon name="box" size={18}/></div></div>
        <div className="stat t-success"><div className="label">Stock Value</div><div className="value tnum">Rp 18,4 M</div><div className="delta up"><Icon name="arrowUp" size={12}/> 4.7%</div><div className="icon-tile"><Icon name="coin" size={18}/></div></div>
        <div className="stat t-warning"><div className="label">Low Stock SKU</div><div className="value tnum">214</div><div className="delta down"><Icon name="arrowUp" size={12}/> 12 today</div><div className="icon-tile"><Icon name="bolt" size={18}/></div></div>
        <div className="stat t-danger"><div className="label">Negative Stock</div><div className="value tnum">7</div><div className="delta down"><Icon name="arrowUp" size={12}/> needs review</div><div className="icon-tile"><Icon name="zap" size={18}/></div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Inbound vs Outbound</h3><div className="sub">Last 14 days · units</div></div></div>
          <div className="card-body">
            <svg viewBox="0 0 600 220" style={{width:"100%",height:220}}>
              {[0,1,2,3,4].map(i => <line key={i} x1="40" x2="590" y1={20+i*40} y2={20+i*40} stroke="#eef0f5"/>)}
              {Array.from({length:14}).map((_,i) => {
                const x = 50 + i*38;
                const inH = 30 + Math.sin(i)*15 + Math.random()*30;
                const outH = 25 + Math.cos(i*0.7)*18 + Math.random()*30;
                return <g key={i}>
                  <rect x={x} y={180-inH} width="14" height={inH} fill="#3e97ff" rx="2"/>
                  <rect x={x+16} y={180-outH} width="14" height={outH} fill="#7239ea" rx="2"/>
                </g>;
              })}
            </svg>
            <div style={{display:"flex",gap:14,marginTop:6}}>
              <span className="badge primary"><span className="sev-dot" style={{background:"var(--primary)"}}/>Inbound</span>
              <span className="badge info"><span className="sev-dot" style={{background:"#7239ea"}}/>Outbound</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Stock by Warehouse</h3><div className="sub">Current snapshot</div></div></div>
          <div className="card-body">
            {[
              { name: "Cibitung-1", v: 4820, p: 82, c: "var(--primary)" },
              { name: "Cibitung-2", v: 3140, p: 64, c: "var(--info)" },
              { name: "Surabaya-A", v: 2120, p: 48, c: "var(--success)" },
              { name: "Bekasi-3", v: 1480, p: 35, c: "var(--warning)" },
              { name: "Surabaya-B", v: 848, p: 22, c: "#ff8a3d" },
            ].map((w,i) => (
              <div key={i} style={{marginBottom: 12}}>
                <div style={{display:"flex",fontSize:12,marginBottom:4}}>
                  <strong>{w.name}</strong>
                  <span className="tnum" style={{marginLeft:"auto",fontWeight:700}}>{w.v.toLocaleString()} <span style={{color:"var(--text-3)",fontWeight:400}}>units</span></span>
                </div>
                <div style={{height:8,background:"var(--bg)",borderRadius:4}}>
                  <div style={{width:`${w.p}%`,height:"100%",background:w.c,borderRadius:4}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3>Top Stock Movers</h3><div className="sub">Highest velocity in 24 hours</div></div>
          <div className="actions"><button className="btn outline sm"><Icon name="filter" size={12}/> Filter</button><button className="btn outline sm"><Icon name="download" size={12}/> Export</button></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>SKU</th><th>Name</th><th>Warehouse</th><th style={{textAlign:"right"}}>On Hand</th><th style={{textAlign:"right"}}>24h Move</th><th>Status</th></tr></thead>
            <tbody>
              {stockMovers.map((s,i) => (
                <tr key={i}>
                  <td className="mono" style={{fontWeight:600}}>{s.sku}</td>
                  <td>{s.name}</td>
                  <td>{s.wh}</td>
                  <td className="num" style={{textAlign:"right",fontWeight:600}}>{s.on.toLocaleString()}</td>
                  <td className="num" style={{textAlign:"right",fontWeight:700,color:s.mov<0?"var(--danger-ink)":"var(--success-ink)"}}>{s.mov>0?"+":""}{s.mov}</td>
                  <td><span className={`badge ${s.st === "critical" ? "danger" : s.st === "low" ? "warning" : "success"}`}>{s.st === "critical" ? "Critical" : s.st === "low" ? "Low" : "Healthy"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.WarehouseDashboard = WarehouseDashboard;
