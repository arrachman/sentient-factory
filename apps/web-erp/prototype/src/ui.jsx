// Shared UI primitives
const Spark = ({ data, color, height = 28, fill = true }) => {
  const w = 120;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => [i * step, h - 4 - ((v - min) / range) * (h - 8)]);
  const d = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fillD = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark" style={{ height }}>
      {fill && <path d={fillD} fill={color} opacity="0.12" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Bars = ({ data, color, height = 64, negColor }) => {
  const w = 400;
  const h = height;
  const max = Math.max(...data.map(Math.abs)) || 1;
  const bw = (w - data.length * 3) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <line x1="0" y1={h/2} x2={w} y2={h/2} stroke="currentColor" strokeWidth="0.5" opacity="0.18"/>
      {data.map((v, i) => {
        const x = i * (bw + 3);
        const barH = (Math.abs(v) / max) * (h/2 - 4);
        const y = v >= 0 ? h/2 - barH : h/2;
        return <rect key={i} x={x} y={y} width={bw} height={barH} rx="1.5" fill={v >= 0 ? color : (negColor || color)} opacity={v >= 0 ? 1 : 0.65}/>;
      })}
    </svg>
  );
};

const Donut = ({ slices, size = 100, stroke = 14 }) => {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.v, 0) || 1;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--panel-2)" strokeWidth={stroke}/>
      {slices.map((s, i) => {
        const len = (s.v / total) * C;
        const off = C - acc;
        acc += len;
        return (
          <circle key={i} cx={size/2} cy={size/2} r={r}
            fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${C}`}
            strokeDashoffset={off}
            transform={`rotate(-90 ${size/2} ${size/2})`}/>
        );
      })}
    </svg>
  );
};

const StatusPill = ({ status, t }) => {
  const map = {
    'Approved': 'success', 'Need Approve': 'warn', 'Posted': 'primary', 'Draft': '', 'Rejected': 'danger',
  };
  const cls = map[status] || '';
  const label = t ? t(status) : status;
  return <span className={`pill ${cls}`}><span className="dot"></span>{label}</span>;
};

const Kbd = ({ children }) => <span className="kbd">{children}</span>;

const useKey = (handler) => {
  React.useEffect(() => {
    const fn = (e) => handler(e);
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [handler]);
};

Object.assign(window, { Spark, Bars, Donut, StatusPill, Kbd, useKey });
