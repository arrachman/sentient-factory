/* global React, SF */
const { Icon } = SF;

// ============ PRODUCTION ============
const ProductionDashboard = () => {
  const lines = [
    { name: "Line A · Stamping", st: "running", out: 1240, tgt: 1300, oee: 92, eff: 95 },
    { name: "Line B · Welding", st: "running", out: 880, tgt: 900, oee: 88, eff: 97 },
    { name: "Line C · Assembly", st: "stopped", out: 0, tgt: 600, oee: 0, eff: 0 },
    { name: "Line D · Painting", st: "running", out: 540, tgt: 580, oee: 81, eff: 93 },
    { name: "Line E · Packing", st: "running", out: 1480, tgt: 1500, oee: 94, eff: 98 },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat t-success"><div className="label">Yield Rate</div><div className="value tnum">94.7%</div><div className="delta up"><Icon name="arrowUp" size={12}/> 0.8%</div><div className="icon-tile"><Icon name="factory" size={18}/></div></div>
        <div className="stat t-primary"><div className="label">Output Today</div><div className="value tnum">4,140</div><div className="delta up"><Icon name="arrowUp" size={12}/> vs target 4,880</div><div className="icon-tile"><Icon name="box" size={18}/></div></div>
        <div className="stat t-info"><div className="label">OEE Average</div><div className="value tnum">89.0%</div><div className="delta up"><Icon name="arrowUp" size={12}/> 1.4%</div><div className="icon-tile"><Icon name="bolt" size={18}/></div></div>
        <div className="stat t-danger"><div className="label">Defect Rate</div><div className="value tnum">2.1%</div><div className="delta down"><Icon name="arrowDown" size={12}/> 0.3%</div><div className="icon-tile"><Icon name="zap" size={18}/></div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3>Output vs Target</h3><div className="sub">By production line · live</div></div></div>
          <div className="card-body" style={{padding:0}}>
            {lines.map((l,i) => (
              <div key={i} style={{padding:"14px 18px",borderBottom:i<lines.length-1?"1px solid var(--divider)":"none"}}>
                <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
                  <span className={`sev-dot ${l.st === "running" ? "" : "sev-critical"}`} style={{background:l.st === "running"?"var(--success)":"var(--danger)",animation:l.st==="running"?"pulse 1.4s infinite":"none"}}/>
                  <strong style={{fontSize:12.5}}>{l.name}</strong>
                  <span className={`badge ${l.st === "running" ? "success" : "danger"}`} style={{marginLeft:8}}>{l.st}</span>
                  <span style={{marginLeft:"auto",fontSize:11,color:"var(--text-3)"}}>OEE <strong className="tnum" style={{color:"var(--text)"}}>{l.oee}%</strong></span>
                </div>
                <div style={{height:10,background:"var(--bg)",borderRadius:5,position:"relative"}}>
                  <div style={{width:`${(l.out/l.tgt)*100}%`,height:"100%",background:l.st==="stopped"?"var(--danger)":"var(--primary)",borderRadius:5}}/>
                </div>
                <div style={{display:"flex",fontSize:11,color:"var(--text-3)",marginTop:4}}>
                  <span className="tnum">Output <strong style={{color:"var(--text)"}}>{l.out.toLocaleString()}</strong> / target {l.tgt.toLocaleString()}</span>
                  <span className="tnum" style={{marginLeft:"auto"}}>Eff <strong style={{color:"var(--text)"}}>{l.eff}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3>Defect Pareto</h3><div className="sub">By cause · last 7 days</div></div></div>
          <div className="card-body">
            {[{n:"Surface scratch",v:38,c:"var(--danger)"},{n:"Misalign weld",v:22,c:"#ff8a3d"},{n:"Paint bubble",v:14,c:"var(--warning)"},{n:"Loose fitting",v:11,c:"var(--info)"},{n:"Dimension off",v:9,c:"var(--success)"},{n:"Other",v:6,c:"var(--text-muted)"}].map((d,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",fontSize:12,marginBottom:4}}><strong>{d.n}</strong><span className="tnum" style={{marginLeft:"auto",fontWeight:700}}>{d.v}%</span></div>
                <div style={{height:8,background:"var(--bg)",borderRadius:4}}><div style={{width:`${d.v*2.2}%`,height:"100%",background:d.c,borderRadius:4}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3>Shift Performance — Today</h3><div className="sub">Running vs idle hours per line</div></div></div>
        <div className="card-body">
          <svg viewBox="0 0 600 200" style={{width:"100%",height:200}}>
            {lines.map((l,i) => {
              const y = 30 + i*32;
              return <g key={i}>
                <text x="0" y={y+10} fontSize="10.5" fill="#4b5263" fontWeight="600">{l.name.split("·")[0].trim()}</text>
                <rect x="100" y={y} width="450" height="14" fill="#eef0f5" rx="3"/>
                <rect x="100" y={y} width={l.st==="stopped"?0:380+Math.random()*60} height="14" fill={l.st==="stopped"?"#f8285a":"#3e97ff"} rx="3"/>
                {l.st!=="stopped" && <rect x={100+380+Math.random()*60} y={y} width="20" height="14" fill="#f6c000" rx="0"/>}
                <text x="560" y={y+10} fontSize="10" fill="#78808f" textAnchor="end" fontFamily="var(--font-mono)">{l.out}u</text>
              </g>;
            })}
          </svg>
          <div style={{display:"flex",gap:14,marginTop:8}}>
            <span className="badge primary"><span className="sev-dot" style={{background:"var(--primary)"}}/>Running</span>
            <span className="badge warning"><span className="sev-dot" style={{background:"var(--warning)"}}/>Idle</span>
            <span className="badge danger"><span className="sev-dot" style={{background:"var(--danger)"}}/>Stopped</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ProductionDashboard = ProductionDashboard;
