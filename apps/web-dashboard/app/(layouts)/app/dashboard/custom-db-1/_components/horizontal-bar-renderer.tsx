'use client';

import { CHART_COLORS } from '../_lib/chart-data';
import { formatChartNumber, truncateChartLabel } from '../_lib/chart-data';
import type { NormalizedBarDatum } from '../_types';

export function HorizontalBarRenderer({ data }: { data: NormalizedBarDatum[] }) {
  const viewBoxWidth = 720;
  const viewBoxHeight = 320;
  const leftLabelWidth = 186;
  const labelToBarGap = 18;
  const rightPadding = 28;
  const topPadding = 16;
  const bottomPadding = 16;
  const rowGap = 14;
  const availableHeight = viewBoxHeight - topPadding - bottomPadding;
  const rowHeight = Math.max(18, (availableHeight - rowGap * Math.max(data.length - 1, 0)) / Math.max(data.length, 1));
  const trackWidth = viewBoxWidth - leftLabelWidth - rightPadding;

  return (
    <div className="h-[360px] w-full">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        {data.map((entry, index) => {
          const y = topPadding + index * (rowHeight + rowGap);
          const width = (entry.normalizedValue / 100) * trackWidth;
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const radius = Math.min(rowHeight / 2, 999);
          return (
            <g key={`hbar-row-${entry.label}-${index}`}>
              <text
                x={leftLabelWidth - labelToBarGap}
                y={y + rowHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
              >
                {truncateChartLabel(entry.label, 22)}
              </text>
              <rect
                x={leftLabelWidth}
                y={y}
                width={trackWidth}
                height={rowHeight}
                rx={radius}
                ry={radius}
                fill="rgba(148,163,184,0.12)"
              />
              <rect
                x={leftLabelWidth}
                y={y}
                width={Math.max(width, 0)}
                height={rowHeight}
                rx={radius}
                ry={radius}
                fill={color}
              >
                <title>{`${entry.label}: ${formatChartNumber(entry.originalValue)} (${entry.normalizedValue.toFixed(1)}%)`}</title>
              </rect>
              <text
                x={leftLabelWidth + Math.max(width - 10, 12)}
                y={y + rowHeight / 2}
                dominantBaseline="middle"
                textAnchor="end"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
              >
                {`${entry.normalizedValue.toFixed(0)}%`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
