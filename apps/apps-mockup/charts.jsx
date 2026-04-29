/* charts.jsx — Lightweight pure-SVG charts (no external lib)
   Sparkline, Bar, Donut, Heatmap, Line/Area, Bullet, Radial. */

// Tiny utility
const _path = (pts) => pts.length ? 'M' + pts.map(p => `${p[0]},${p[1]}`).join(' L ') : '';
const _smoothPath = (pts) => {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const cx = (x1 + x2) / 2;
    d.push(`C ${cx},${y1} ${cx},${y2} ${x2},${y2}`);
  }
  return d.join(' ');
};

// ─── Sparkline (line + area)
const Sparkline = ({ data, w = 100, h = 32, stroke = 'var(--sf-primary)', fill = true, dots = false }) => {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const stepX = (w - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((v, i) => [pad + i * stepX, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const id = 'sg-' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={stroke} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={`${_smoothPath(pts)} L ${w-pad},${h-pad} L ${pad},${h-pad} Z`} fill={`url(#${id})`} />}
      <path d={_smoothPath(pts)} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      {dots && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={stroke} />)}
    </svg>
  );
};

// ─── Bar chart (vertical)
const BarChart = ({ data, labels, w = 600, h = 220, color = 'var(--sf-primary)', secondary, secondaryColor = 'var(--sf-info)', stacked = false }) => {
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const all = stacked ? data.map((v, i) => v + (secondary?.[i] || 0)) : (secondary ? [...data, ...secondary] : data);
  const max = Math.max(...all) * 1.1;
  const barW = innerW / data.length;
  const groupW = secondary && !stacked ? barW * 0.36 : barW * 0.62;
  const ticks = 4;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {/* gridlines */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const y = padT + (innerH / ticks) * i;
        const v = Math.round(max * (1 - i / ticks));
        return <g key={i}>
          <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--sf-border)" strokeDasharray={i === ticks ? '' : '3 3'} />
          <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--sf-text-faint)">{v}</text>
        </g>;
      })}
      {/* bars */}
      {data.map((v, i) => {
        const cx = padL + barW * i + barW / 2;
        const h1 = (v / max) * innerH;
        const x1 = secondary && !stacked ? cx - groupW - 2 : cx - groupW / 2;
        const yBase = padT + innerH;
        return (
          <g key={i}>
            <rect x={x1} y={yBase - h1} width={groupW} height={h1} fill={color} rx="3">
              <title>{labels?.[i]}: {v}</title>
            </rect>
            {secondary && (
              stacked
                ? <rect x={x1} y={yBase - h1 - (secondary[i] / max) * innerH} width={groupW} height={(secondary[i] / max) * innerH} fill={secondaryColor} rx="3" />
                : <rect x={cx + 2} y={yBase - (secondary[i] / max) * innerH} width={groupW} height={(secondary[i] / max) * innerH} fill={secondaryColor} rx="3" />
            )}
            {labels && <text x={cx} y={h - 8} textAnchor="middle" fontSize="11" fill="var(--sf-text-soft)">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Donut
const Donut = ({ data, size = 160, thickness = 22, gap = 2, centerLabel, centerValue }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--sf-bg-hover)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = (d.value / total) * circumference;
          const dasharray = `${Math.max(0, len - gap)} ${circumference}`;
          const seg = (
            <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={d.color}
              strokeWidth={thickness} strokeDasharray={dasharray} strokeDashoffset={-offset}
              strokeLinecap="butt" transform={`rotate(-90 ${c} ${c})`} />
          );
          offset += len;
          return seg;
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {centerValue && <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--sf-text)', letterSpacing: '-.02em' }}>{centerValue}</div>}
          {centerLabel && <div style={{ fontSize: 12, color: 'var(--sf-text-soft)', marginTop: 2 }}>{centerLabel}</div>}
        </div>
      )}
    </div>
  );
};

// ─── Heatmap (e.g. weekly attendance)
const Heatmap = ({ data, rowLabels, colLabels, colors = ['#E9F3FF', '#9CC8FF', '#5BA8FF', '#1B84FF', '#0954B0'] }) => {
  const max = Math.max(1, ...data.flat());
  const colorFor = v => {
    if (v === 0) return 'var(--sf-bg-hover)';
    const idx = Math.min(colors.length - 1, Math.floor((v / max) * colors.length));
    return colors[idx];
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${colLabels.length}, 1fr)`, gap: 4, fontSize: 11, color: 'var(--sf-text-soft)' }}>
      <div />
      {colLabels.map((l, i) => <div key={i} style={{ textAlign: 'center' }}>{l}</div>)}
      {data.map((row, ri) => <React.Fragment key={ri}>
        <div style={{ paddingRight: 8, textAlign: 'right', alignSelf: 'center' }}>{rowLabels[ri]}</div>
        {row.map((v, ci) => (
          <div key={ci} title={`${rowLabels[ri]} ${colLabels[ci]}: ${v}`}
            style={{ aspectRatio: '1', borderRadius: 4, background: colorFor(v), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: v > max * 0.6 ? '#fff' : 'var(--sf-text-soft)' }}>
            {v > 0 ? v : ''}
          </div>
        ))}
      </React.Fragment>)}
    </div>
  );
};

// ─── Area (multi-series)
const AreaChart = ({ series, labels, w = 720, h = 280, ticks = 5 }) => {
  const padL = 40, padR = 16, padT = 16, padB = 32;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const all = series.flatMap(s => s.data);
  const max = Math.max(...all) * 1.15;
  const stepX = innerW / (labels.length - 1);

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`area-${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {/* gridlines */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const y = padT + (innerH / ticks) * i;
        const v = Math.round(max * (1 - i / ticks));
        return <g key={i}>
          <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--sf-border)" strokeDasharray={i === ticks ? '' : '3 3'} />
          <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--sf-text-faint)">{v}</text>
        </g>;
      })}
      {/* x labels */}
      {labels.map((lb, i) => (
        <text key={i} x={padL + i * stepX} y={h - 10} textAnchor="middle" fontSize="11" fill="var(--sf-text-soft)">{lb}</text>
      ))}
      {/* areas */}
      {series.map((s, idx) => {
        const pts = s.data.map((v, i) => [padL + i * stepX, padT + innerH - (v / max) * innerH]);
        const linePath = _smoothPath(pts);
        const areaPath = `${linePath} L ${padL + innerW},${padT + innerH} L ${padL},${padT + innerH} Z`;
        return (
          <g key={idx}>
            <path d={areaPath} fill={`url(#area-${idx})`} />
            <path d={linePath} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--sf-bg-elev)" stroke={s.color} strokeWidth="2" />)}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Radial Progress
const Radial = ({ value, max = 100, size = 120, thickness = 10, color = 'var(--sf-primary)', label, sublabel }) => {
  const r = size / 2 - thickness / 2 - 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--sf-bg-hover)" strokeWidth={thickness} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--sf-text)' }}>{label || `${Math.round(pct * 100)}%`}</div>
        {sublabel && <div style={{ fontSize: 11, color: 'var(--sf-text-soft)', marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  );
};

Object.assign(window, { Sparkline, BarChart, Donut, Heatmap, AreaChart, Radial });
