'use client';

import { memo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { renderDonutLabels, renderPieLabels } from '../_lib/chart-labels';
import {
  CHART_COLORS,
  buildNormalizedBarData,
  buildScatterVisualData,
  formatChartNumber,
  formatDonutTotal,
  truncateChartLabel,
} from '../_lib/chart-data';
import type { ChartDatum, ChartType, ScatterVisualDatum } from '../_types';
import { HorizontalBarRenderer } from './horizontal-bar-renderer';
import { VerticalBarRenderer } from './vertical-bar-renderer';

export const MemoizedChartRenderer = memo(function ChartRenderer({
  chartType,
  data,
}: {
  chartType: ChartType;
  data: ChartDatum[];
}) {
  const config = {
    value: { label: 'Value', color: CHART_COLORS[0] },
  };

  if (chartType === 'pie' || chartType === 'donut') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <PieChart margin={{ top: 12, right: 32, bottom: 12, left: 32 }}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const numericValue = typeof value === 'number' ? value : Number(value);
                  const percent = total > 0 ? (numericValue / total) * 100 : 0;
                  return (
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{String(item?.payload?.label ?? '')}</div>
                      <div className="text-slate-600 dark:text-slate-300">{formatChartNumber(numericValue)} ({percent.toFixed(1)}%)</div>
                    </div>
                  );
                }}
                hideIndicator
                hideLabel
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={chartType === 'donut' ? 86 : 24}
            outerRadius={chartType === 'donut' ? 126 : 110}
            paddingAngle={chartType === 'donut' ? 4 : 2}
            cornerRadius={chartType === 'donut' ? 12 : 4}
            cx="50%"
            cy="52%"
            labelLine={chartType === 'donut' || chartType === 'pie' ? false : { stroke: '#94a3b8', strokeWidth: 1 }}
            label={(props) => {
              if (!props.percent || props.percent < 0.04) return '';
              if (chartType === 'donut') return renderDonutLabels(props);
              if (chartType === 'pie') return renderPieLabels(props);
              return `${String(props.name)} ${Math.round(props.percent * 100)}%`;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`${entry.label}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(255,255,255,0.92)" strokeWidth={2} />
            ))}
          </Pie>
          {chartType === 'donut' ? (
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="fill-slate-900 text-[18px] font-medium dark:fill-slate-100">Total</text>
          ) : null}
          {chartType === 'donut' ? (
            <text x="50%" y="57%" textAnchor="middle" dominantBaseline="central" className="fill-slate-900 text-[24px] font-semibold tracking-tight dark:fill-slate-50">{formatDonutTotal(total)}</text>
          ) : null}
        </PieChart>
      </ChartContainer>
    );
  }

  if (chartType === 'scatter') {
    const scatterData = buildScatterVisualData(data);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <ScatterChart margin={{ left: 8, right: 18, top: 18, bottom: 12 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.22)" strokeDasharray="4 4" />
          <XAxis axisLine={false} dataKey="x" name="X Metric" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} tickMargin={10} type="number" />
          <YAxis axisLine={false} dataKey="y" name="Y Metric" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} tickMargin={10} type="number" />
          <ZAxis dataKey="bubbleSize" range={[80, 320]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(_value, _name, item) => {
                  const payload = item?.payload as ScatterVisualDatum | undefined;
                  if (!payload) return null;
                  return (
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{payload.label}</div>
                      <div className="text-slate-600 dark:text-slate-300">X: {formatChartNumber(payload.x ?? 0)}</div>
                      <div className="text-slate-600 dark:text-slate-300">Y: {formatChartNumber(payload.y ?? 0)}</div>
                      <div className="text-slate-600 dark:text-slate-300">Magnitude: {formatChartNumber(payload.value)}</div>
                      <div className="font-medium" style={{ color: payload.scatterColor }}>{payload.scatterLevel}</div>
                    </div>
                  );
                }}
                hideIndicator
                hideLabel
              />
            }
          />
          <Scatter data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`${entry.label}-${index}`} fill={entry.scatterColor} fillOpacity={0.88} stroke="#ffffff" strokeWidth={1.5} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    );
  }

  if (chartType === 'line') {
    const lineColors = data.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <LineChart data={data} margin={{ top: 24, right: 24, bottom: 12, left: 8 }}>
          <defs>
            <linearGradient id="bumpLineGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineSpectrum" x1="0" x2="1" y1="0" y2="0">
              {lineColors.map((color, index) => {
                const offset = lineColors.length === 1 ? 0 : (index / (lineColors.length - 1)) * 100;
                return <stop key={`${color}-${index}`} offset={`${offset}%`} stopColor={color} />;
              })}
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={14} fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                {truncateChartLabel(String(payload.value), 14)}
              </text>
            )}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => formatChartNumber(Number(value))} tickLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="value" stroke="url(#bumpLineGlow)" strokeWidth={12} dot={false} activeDot={false} isAnimationActive={false} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineSpectrum)"
            strokeWidth={4}
            dot={(props: any) => {
              const color = lineColors[props.index % lineColors.length] ?? CHART_COLORS[0];
              return <circle key={`line-dot-${props.index}-${props.cx}-${props.cy}`} cx={props.cx} cy={props.cy} r={6} fill="#ffffff" stroke={color} strokeWidth={3} />;
            }}
            activeDot={(props: any) => {
              const color = lineColors[props.index % lineColors.length] ?? CHART_COLORS[0];
              return <circle key={`line-active-dot-${props.index}-${props.cx}-${props.cy}`} cx={props.cx} cy={props.cy} r={7} fill="#ffffff" stroke={color} strokeWidth={3} />;
            }}
          />
          <Line type="monotone" dataKey="value" stroke="transparent" dot={false} activeDot={false} isAnimationActive={false}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => formatChartNumber(Number(value))}
              content={(props: any) => {
                const value = Number(props.value ?? 0);
                const pointIndex = typeof props.index === 'number' ? props.index : 0;
                const color = lineColors[pointIndex % lineColors.length] ?? '#0f172a';
                return <text x={props.x} y={(props.y ?? 0) - 10} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{formatChartNumber(value)}</text>;
              }}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    );
  }

  if (chartType === 'area') {
    const areaColors = data.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <AreaChart data={data} margin={{ top: 24, right: 24, bottom: 12, left: 8 }}>
          <defs>
            <linearGradient id="areaSpectrum" x1="0" x2="1" y1="0" y2="0">
              {areaColors.map((color, index) => {
                const offset = areaColors.length === 1 ? 0 : (index / (areaColors.length - 1)) * 100;
                return <stop key={`${color}-${index}`} offset={`${offset}%`} stopColor={color} />;
              })}
            </linearGradient>
            <linearGradient id="areaFillSpectrum" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="45%" stopColor="#7c3aed" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={14} fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                {truncateChartLabel(String(payload.value), 14)}
              </text>
            )}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => formatChartNumber(Number(value))} tickLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#areaSpectrum)"
            fill="url(#areaFillSpectrum)"
            fillOpacity={1}
            strokeWidth={4}
            dot={(props: any) => {
              const color = areaColors[props.index % areaColors.length] ?? CHART_COLORS[0];
              return <circle key={`area-dot-${props.index}-${props.cx}-${props.cy}`} cx={props.cx} cy={props.cy} r={5} fill="#ffffff" stroke={color} strokeWidth={2.5} />;
            }}
            activeDot={(props: any) => {
              const color = areaColors[props.index % areaColors.length] ?? CHART_COLORS[0];
              return <circle key={`area-active-dot-${props.index}-${props.cx}-${props.cy}`} cx={props.cx} cy={props.cy} r={6} fill="#ffffff" stroke={color} strokeWidth={3} />;
            }}
          />
          <Area type="monotone" dataKey="value" stroke="transparent" fill="transparent" isAnimationActive={false} dot={false} activeDot={false}>
            <LabelList
              dataKey="value"
              position="top"
              content={(props: any) => {
                const value = Number(props.value ?? 0);
                const color = areaColors[props.index % areaColors.length] ?? '#0f172a';
                return <text x={props.x} y={(props.y ?? 0) - 10} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{formatChartNumber(value)}</text>;
              }}
            />
          </Area>
        </AreaChart>
      </ChartContainer>
    );
  }

  if (chartType === 'horizontal_bar') {
    const normalizedData = buildNormalizedBarData(data);
    return <ChartContainer className="h-[360px] w-full" config={config}><HorizontalBarRenderer data={normalizedData} /></ChartContainer>;
  }

  if (chartType === 'vertical_bar') {
    const normalizedData = buildNormalizedBarData(data);
    return <ChartContainer className="h-[360px] w-full" config={config}><VerticalBarRenderer data={normalizedData} /></ChartContainer>;
  }

  // Default: horizontal bar
  const normalizedData = buildNormalizedBarData(data);
  return <ChartContainer className="h-[360px] w-full" config={config}><HorizontalBarRenderer data={normalizedData} /></ChartContainer>;
});
