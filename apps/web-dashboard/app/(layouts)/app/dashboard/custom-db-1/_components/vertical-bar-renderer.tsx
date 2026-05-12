'use client';

import { CHART_COLORS } from '../_lib/chart-data';
import { formatChartNumber, truncateChartLabel } from '../_lib/chart-data';
import type { NormalizedBarDatum } from '../_types';

export function VerticalBarRenderer({ data }: { data: NormalizedBarDatum[] }) {
  const viewBoxWidth = 720;
  const viewBoxHeight = 320;
  const topPadding = 20;
  const bottomPadding = 64;
  const leftPadding = 24;
  const rightPadding = 16;
  const chartHeight = viewBoxHeight - topPadding - bottomPadding;
  const chartWidth = viewBoxWidth - leftPadding - rightPadding;
  const gap = 16;
  const barWidth = Math.max(22, (chartWidth - gap * Math.max(data.length - 1, 0)) / Math.max(data.length, 1));

  return (
    <div className="h-[360px] w-full">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = topPadding + chartHeight - (tick / 100) * chartHeight;
          return (
            <g key={`vbar-grid-${tick}`}>
              <line x1={leftPadding} x2={viewBoxWidth - rightPadding} y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
              <text x={0} y={y + 4} fill="#64748b" fontSize="12" fontWeight="600">
                {tick}%
              </text>
            </g>
          );
        })}
        {data.map((entry, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const x = leftPadding + index * (barWidth + gap);
          const height = (entry.normalizedValue / 100) * chartHeight;
          const y = topPadding + chartHeight - height;
          const radius = Math.min(barWidth / 2, 16);
          return (
            <g key={`vbar-row-${entry.label}-${index}`}>
              <path
                d={[
                  `M ${x} ${topPadding + chartHeight}`,
                  `L ${x} ${y + radius}`,
                  `Q ${x} ${y} ${x + radius} ${y}`,
                  `L ${x + barWidth - radius} ${y}`,
                  `Q ${x + barWidth} ${y} ${x + barWidth} ${y + radius}`,
                  `L ${x + barWidth} ${topPadding + chartHeight}`,
                  'Z',
                ].join(' ')}
                fill={color}
              >
                <title>{`${entry.label}: ${formatChartNumber(entry.originalValue)} (${entry.normalizedValue.toFixed(1)}%)`}</title>
              </path>
              <text
                x={x + barWidth / 2}
                y={Math.min(y + 16, topPadding + chartHeight - 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
              >
                {`${entry.normalizedValue.toFixed(0)}%`}
              </text>
              <text
                x={x + barWidth / 2}
                y={viewBoxHeight - 30}
                textAnchor="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
              >
                {truncateChartLabel(entry.label, 10)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
