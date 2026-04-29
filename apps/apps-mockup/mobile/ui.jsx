/* global React */
// Mobile shared building blocks — reusable across screens

const Spark = ({ data, color = "#3e97ff", h = 28 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => `${(i/(data.length-1))*100},${30 - ((v-min)/(max-min||1))*26 - 2}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const Bars = ({ data, color = "#3e97ff", h = 40 }) => {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 10} 40`} preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      {data.map((v, i) => (
        <rect key={i} x={i*10+1} y={40 - (v/max)*38} width="8" height={(v/max)*38} fill={color} rx="1.5"/>
      ))}
    </svg>
  );
};

const Donut = ({ value, max = 100, color = "#3e97ff", size = 56, label }) => {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / max) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={size/4.5} fontWeight="700" fill="currentColor">{label || value + "%"}</text>
    </svg>
  );
};

const KpiTile = ({ l, v, d, up, tone = "primary", icon, spark }) => (
  <div className="m-kpi">
    {icon && <div className="icon-tile" style={{ background: `var(--${tone}-soft)`, color: `var(--${tone}-ink)` }}><SF.Icon name={icon} size={14}/></div>}
    <div className="l">{l}</div>
    <div className="v">{v}</div>
    {d && <div className="d" style={{ color: up ? "var(--success-ink)" : "var(--danger-ink)" }}>{up ? "↑" : "↓"} {d}</div>}
    {spark && <div style={{ marginTop: 6 }}><Spark data={spark} color={up ? "#17c653" : "#f8285a"}/></div>}
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div className="m-section-h">
    <h4>{title}</h4>
    {action && <a>{action}</a>}
  </div>
);

const ChipRow = ({ items, active, onSelect }) => (
  <div className="m-chip-row">
    {items.map((c,i) => (
      <span key={i} className={`m-chip ${active === c ? "active" : ""}`} onClick={() => onSelect && onSelect(c)}>{c}</span>
    ))}
  </div>
);

const Seg = ({ items, active, onSelect }) => (
  <div className="m-seg">
    {items.map(it => (
      <button key={it} className={active === it ? "active" : ""} onClick={() => onSelect && onSelect(it)}>{it}</button>
    ))}
  </div>
);

window.MUI = { Spark, Bars, Donut, KpiTile, SectionHeader, ChipRow, Seg };
