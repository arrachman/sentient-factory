import { Sector } from 'recharts';
import { CHART_COLORS } from './chart-data';

export function renderRoseSliceShape(
  props: {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    cornerRadius?: number;
    fill?: string;
    payload?: { value?: number };
  },
  maxValue: number,
) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 24,
    outerRadius = 110,
    startAngle = 0,
    endAngle = 0,
    cornerRadius = 4,
    fill = CHART_COLORS[0],
    payload,
  } = props;

  const rawValue = typeof payload?.value === 'number' ? payload.value : Number(payload?.value || 0);
  const normalized = maxValue > 0 ? Math.max(rawValue, 0) / maxValue : 0;
  const dynamicOuterRadius = innerRadius + (outerRadius - innerRadius) * (0.42 + normalized * 0.58);

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={dynamicOuterRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      cornerRadius={cornerRadius}
      fill={fill}
    />
  );
}

export function renderDonutLabels(props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
}) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, name = '' } = props;

  const angleRad = (-midAngle * Math.PI) / 180;
  const percentRadius = innerRadius + (outerRadius - innerRadius) * 0.52;
  const percentX = cx + Math.cos(angleRad) * percentRadius;
  const percentY = cy + Math.sin(angleRad) * percentRadius;

  const lineStartRadius = outerRadius + 2;
  const lineBendRadius = outerRadius + 18;
  const lineStartX = cx + Math.cos(angleRad) * lineStartRadius;
  const lineStartY = cy + Math.sin(angleRad) * lineStartRadius;
  const lineBendX = cx + Math.cos(angleRad) * lineBendRadius;
  const lineBendY = cy + Math.sin(angleRad) * lineBendRadius;
  const lineEndX = lineBendX + (Math.cos(angleRad) >= 0 ? 18 : -18);
  const textAnchor = Math.cos(angleRad) >= 0 ? 'start' : 'end';
  const textX = lineEndX + (Math.cos(angleRad) >= 0 ? 4 : -4);

  return (
    <g>
      <text
        x={percentX}
        y={percentY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: '#ffffff', fontSize: '14px', fontWeight: 700 }}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
      <path
        d={`M ${lineStartX} ${lineStartY} L ${lineBendX} ${lineBendY} L ${lineEndX} ${lineBendY}`}
        stroke="#94a3b8"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={textX}
        y={lineBendY}
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{ fill: '#0f172a', fontSize: '12px', fontWeight: 600 }}
      >
        {String(name)}
      </text>
    </g>
  );
}

export function renderPieLabels(props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
}) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, name = '' } = props;

  const angleRad = (-midAngle * Math.PI) / 180;
  const percentRadius = innerRadius + (outerRadius - innerRadius) * 0.58;
  const percentX = cx + Math.cos(angleRad) * percentRadius;
  const percentY = cy + Math.sin(angleRad) * percentRadius;

  const lineStartRadius = outerRadius + 2;
  const lineBendRadius = outerRadius + 18;
  const lineStartX = cx + Math.cos(angleRad) * lineStartRadius;
  const lineStartY = cy + Math.sin(angleRad) * lineStartRadius;
  const lineBendX = cx + Math.cos(angleRad) * lineBendRadius;
  const lineBendY = cy + Math.sin(angleRad) * lineBendRadius;
  const lineEndX = lineBendX + (Math.cos(angleRad) >= 0 ? 18 : -18);
  const textAnchor = Math.cos(angleRad) >= 0 ? 'start' : 'end';
  const textX = lineEndX + (Math.cos(angleRad) >= 0 ? 4 : -4);

  return (
    <g>
      <text
        x={percentX}
        y={percentY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: '#ffffff', fontSize: '13px', fontWeight: 700 }}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
      <path
        d={`M ${lineStartX} ${lineStartY} L ${lineBendX} ${lineBendY} L ${lineEndX} ${lineBendY}`}
        stroke="#94a3b8"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={textX}
        y={lineBendY}
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{ fill: '#0f172a', fontSize: '12px', fontWeight: 600 }}
      >
        {String(name)}
      </text>
    </g>
  );
}
