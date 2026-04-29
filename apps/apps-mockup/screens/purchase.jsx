/* global React, SF */
const { Icon } = SF;

// ============ PURCHASE ============
const PurchaseDashboard = () => {
  const pos = [
    { no: "PO-2026-0218", sup: "PT Cipta Logam Nusantara", cat: "Raw Materials", v: "Rp 245.000.000", lt: "8d", st: "delayed", stl: "Delayed" },
    { no: "PO-2026-0217", sup: "PT Sinar Baja Industri", cat: "Steel Components", v: "Rp 182.500.000", lt: "5d", st: "ontime", stl: "On Track" },
    { no: "PO-2026-0216", sup: "CV Maju Aluminium", cat: "Aluminum Sheet", v: "Rp 98.300.000", lt: "3d", st: "ontime", stl: "On Track" },
    { no: "PO-2026-0215", sup: "PT Mitra Plastik Pratama", cat: "Packaging", v: "Rp 64.200.000", lt: "12d", st: "delayed", stl: "Delayed" },
    { no: "PO-2026-0214", sup: "PT Bumi Lestari Logistik", cat: "Logistics", v: "Rp 32.100.000", lt: "2d", st: "received", stl: "Received" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat t-primary"><div className="label">Active POs</div><div className="value tnum">184</div><div className="delta down"><Icon name="arrowDown" size={12}/> 3.4%</div><div className="icon-tile"><Icon name="cart" size={18}/></div></div>
        <div className="stat t-warning"><div className="label">Pending Approval</div><div className="value tnum">28</div><div className="delta up"><Icon name="arrowUp" size={12}/> 6 today</div><div className="icon-tile"><Icon name="clock" size={18}/></div></div>
        <div className="stat t-success"><div className="label">Avg Lead Time</div><div className="value tnum">6.2 d</div><div className="delta down"><Icon name="arrowDown" size={12}/> 0.4d faster</div><div className="icon-tile"><Icon name="truck" size={18}/></div></div>
        <div className="stat t-danger"><div className="label">Delayed POs</div><div className="value tnum">12</div><div className="delta up"><Icon name="arrowUp" size={12}/> +3</div><div className="icon-tile"><Icon name="bolt" size={18}/></div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Purchase by Category</h3><div className="sub">MTD spend</div></div></div>
          <div className="card-body">
            {[{n:"Raw Materials",v:42,c:"var(--primary)"},{n:"Steel Components",v:24,c:"var(--info)"},{n:"Packaging",v:14,c:"var(--success)"},{n:"Aluminum",v:11,c:"var(--warning)"},{n:"Logistics",v:9,c:"#ff8a3d"}].map((r,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",fontSize:12,marginBottom:4}}><strong>{r.n}</strong><span className="tnum" style={{marginLeft:"auto",fontWeight:700}}>{r.v}%</span></div>
                <div style={{height:8,background:"var(--bg)",borderRadius:4}}><div style={{width:`${r.v*2}%`,height:"100%",background:r.c,borderRadius:4}}></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><h3>Supplier Performance</h3><div className="sub">On-time vs delayed deliveries</div></div></div>
          <div className="card-body">
            {[{n:"PT Sinar Baja Industri",ot:96,c:"var(--success)"},{n:"CV Maju Aluminium",ot:91,c:"var(--success)"},{n:"PT Mitra Plastik Pratama",ot:74,c:"var(--warning)"},{n:"PT Cipta Logam Nusantara",ot:62,c:"var(--danger)"},{n:"PT Bumi Lestari Logistik",ot:88,c:"var(--success)"}].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<4?"1px solid var(--divider)":"none"}}>
                <div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:600}}>{s.n}</div></div>
                <div style={{width:90,height:6,background:"var(--bg)",borderRadius:3}}><div style={{width:`${s.ot}%`,height:"100%",background:s.c,borderRadius:3}}/></div>
                <span className="tnum" style={{fontSize:12,fontWeight:700,minWidth:36,textAlign:"right"}}>{s.ot}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3>Recent Purchase Orders</h3><div className="sub">Live operational feed</div></div>
          <div className="actions"><button className="btn outline sm"><Icon name="filter" size={12}/> Filter</button><button className="btn primary sm">+ Create PO</button></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>PO No</th><th>Supplier</th><th>Category</th><th style={{textAlign:"right"}}>Value</th><th>Lead Time</th><th>Status</th></tr></thead>
            <tbody>
              {pos.map((p,i)=>(
                <tr key={i}>
                  <td className="mono" style={{fontWeight:600}}>{p.no}</td>
                  <td>{p.sup}</td>
                  <td>{p.cat}</td>
                  <td className="num" style={{textAlign:"right",fontWeight:600}}>{p.v}</td>
                  <td className="mono">{p.lt}</td>
                  <td><span className={`badge ${p.st === "delayed" ? "danger" : p.st === "received" ? "success" : "primary"}`}>{p.stl}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.PurchaseDashboard = PurchaseDashboard;
