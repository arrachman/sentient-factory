'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AgingRow } from './types';

export function TopAgingCard({
  title,
  subtitle,
  ctaLabel,
  rows,
  axisMax,
  ticks,
  minimal = false,
  headerAction,
  valueColumnWidth = '5.5rem',
  valueGap = '0.625rem',
}: {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  rows: AgingRow[];
  axisMax: number;
  ticks: number[];
  minimal?: boolean;
  headerAction?: React.ReactNode;
  valueColumnWidth?: string;
  valueGap?: string;
}) {
  return (
    <Card className="lg:col-span-8 rounded-2xl border-border/80 shadow-xs">
      <CardHeader className="px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold lg:text-lg">{title}</CardTitle>
            {minimal ? null : <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
          </div>
          {minimal
            ? null
            : headerAction ?? (ctaLabel ? (
                <button type="button" className="text-sm font-semibold text-primary">
                  {ctaLabel}
                </button>
              ) : null)}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-3">
        <div
          className="relative rounded-xl bg-muted/35 p-2.5"
          style={
            {
              '--value-col-width': valueColumnWidth,
              '--value-col-gap': valueGap,
            } as React.CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute inset-y-3 left-3 z-0"
            style={{ right: 'calc(var(--value-col-width) + var(--value-col-gap))' }}
          >
            <div className="relative h-full w-full">
              {ticks.map((tick) => (
                <div
                  key={`po-aging-grid-${tick}`}
                  className="absolute bottom-0 top-0 border-l border-dashed border-border/70"
                  style={{ left: `${(tick / axisMax) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            {rows.map((row, index) => {
              const width = Math.min((row.days / axisMax) * 100, 100);

              return (
                <div
                  key={row.label}
                  className="group rounded-md px-2 py-1 transition-colors hover:bg-blue-100/55"
                >
                  <div
                    className="grid items-center gap-2.5"
                    style={{ gridTemplateColumns: `minmax(0,1fr) var(--value-col-width)` }}
                  >
                    <div className="relative h-8 rounded-md">
                      <div
                        className="flex h-full items-center rounded-md bg-[#4776d8] px-2.5 text-[11px] font-medium text-white transition-colors group-hover:bg-[#2f5fcd] lg:text-xs"
                        style={{ width: `${width}%` }}
                      >
                        <span className="line-clamp-1">{row.label}</span>
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-left text-[11px] font-medium leading-none text-foreground">
                      {row.days}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {minimal ? null : (
            <div className="relative z-10 mt-5" style={{ paddingRight: 'calc(var(--value-col-width) + var(--value-col-gap))' }}>
              <div className="grid grid-cols-8 text-[11px] text-muted-foreground">
                {ticks.map((tick) => (
                  <span key={`po-aging-tick-${tick}`} className="text-left first:pl-0">
                    {tick}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
