/* global React, SF */
const { Icon } = SF;

// ============ SALES ============
const SalesDashboard = () => {
  const top = [
    { code: "PS", name: "PT SUTINDO SURYA SEJAHTERA", v: "Rp 138,7 M", g: 12, c: "#3e97ff" },
    { code: "PD", name: "PT DITRACO BANGUN SARANA", v: "Rp 47,3 M", g: 8, c: "#17c653" },
    { code: "PM", name: "PT MAJU TEKNIK UTAMA", v: "Rp 46,7 M", g: -3, c: "#f6c000" },
    { code: "PP", name: "PT PRIMA HARMONI INDUSTRI", v: "Rp 33,4 M", g: 5, c: "#f8285a" },
    { code: "PA", name: "PT ALPHA INTEGRATED", v: "Rp 32,6 M", g: 18, c: "#7239ea" },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat t-success"><div className="label">Sales MTD</div><div className="value tnum">Rp 390,5 M</div><div className="delta up"><Icon name="arrowUp" size={12}/> 8% vs LM</div><div className="icon-tile"><Icon name="chart" size={18}/></div></div>
        <div className="stat t-primary"><div className="label">Orders MTD</div><div className="value tnum">1,284</div><div className="delta up"><Icon name="arrowUp" size={12}/> 4.1%</div><div className="icon-tile"><Icon name="cart" size={18}/></div></div>
        <div className="stat t-info"><div className="label">Avg Basket</div><div className="value tnum">Rp 304 Jt</div><div className="delta up"><Icon name="arrowUp" size={12}/> 3.8%</div><div className="icon-tile"><Icon name="coin" size={18}/></div></div>
        <div className="stat t-warning"><div className="label">Conversion</div><div className="value tnum">22.4%</div><div className="delta down"><Icon name="arrowDown" size={12}/> 0.6%</div><div className="icon-tile"><Icon name="bolt" size={18}/></div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Sales Trend</h3><div className="sub">Daily revenue · last 30 days</div></div>
            <div className="actions"><span className="badge success">Realtime</span></div>
          </div>
          <div className="card-body">
            <svg viewBox="0 0 600 220" style={{width:"100%",height:220}}>
              <defs>
                <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#3e97ff" stopOpacity="0.4"/>
                  <stop offset="1" stopColor="#3e97ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0,1,2,3,4].map(i => <line key={i} x1="40" x2="590" y1={20+i*40} y2={20+i*40} stroke="#eef0f5"/>)}
              <path d="M40,170 C80,160 120,140 160,150 C200,160 240,120 280,110 C320,100 360,130 400,90 C440,60 480,80 520,70 C560,60 580,50 590,55 L590,200 L40,200Z" fill="url(#sg)"/>
              <path d="M40,170 C80,160 120,140 160,150 C200,160 240,120 280,110 C320,100 360,130 400,90 C440,60 480,80 520,70 C560,60 580,50 590,55" fill="none" stroke="#3e97ff" strokeWidth="2.5"/>
            </svg>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>By Channel</h3><div className="sub">Revenue split</div></div></div>
          <div className="card-body">
            {[{n:"Direct B2B",v:62,c:"var(--primary)"},{n:"Distributor",v:24,c:"var(--info)"},{n:"Online",v:9,c:"var(--success)"},{n:"Marketplace",v:5,c:"var(--warning)"}].map((c,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",fontSize:12,marginBottom:4}}>
                  <strong>{c.n}</strong>
                  <span className="tnum" style={{marginLeft:"auto",fontWeight:700}}>{c.v}%</span>
                </div>
                <div style={{height:8,background:"var(--bg)",borderRadius:4}}>
                  <div style={{width:`${c.v}%`,height:"100%",background:c.c,borderRadius:4}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3>Top Customers</h3><div className="sub">By sales amount, MTD</div></div></div>
        <div className="card-body" style={{ padding: 0 }}>
          {top.map((t,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < top.length-1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{width:36,height:36,borderRadius:8,background:t.c,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{t.code}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.name}</div><div style={{fontSize:11,color:"var(--text-3)"}}>5 orders this month</div></div>
              <div className="tnum" style={{fontSize:14,fontWeight:700}}>{t.v}</div>
              <span className={`badge ${t.g >= 0 ? "success" : "danger"}`} style={{minWidth:48,justifyContent:"center"}}>{t.g>0?"+":""}{t.g}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.SalesDashboard = SalesDashboard;
