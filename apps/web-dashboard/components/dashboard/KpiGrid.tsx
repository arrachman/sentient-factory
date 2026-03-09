'use client';

import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { KpiCard } from './types';

function KpiDeltaPill({ delta, label }: { delta: number; label: string }) {
  const isUp = delta > 0;

  return (
    <Badge
      variant={isUp ? 'success' : 'destructive'}
      appearance="light"
      size="sm"
      className="rounded-full px-2.5 text-xs font-semibold"
    >
      {isUp ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      {Math.abs(delta)} ({label})
    </Badge>
  );
}

export function KpiGrid({ cards, className }: { cards: KpiCard[]; className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-3', className)}>
      {cards.map((card) => (
        <Card key={card.title} className="rounded-2xl border-border/80 shadow-xs transition-shadow hover:shadow-sm">
          <CardHeader className="min-h px-6">
            <div className="flex items-center gap-2">
              <CardTitle
                className="text-[14px] font-medium leading-[26px] tracking-[0%]"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {card.title}
              </CardTitle>
              {card.status ? (
                <Badge
                  variant={card.status === 'good' ? 'success' : card.status === 'warn' ? 'warning' : 'destructive'}
                  appearance="light"
                  size="xs"
                >
                  {card.status === 'good' ? 'Baik' : card.status === 'warn' ? 'Waspada' : 'Kritis'}
                </Badge>
              ) : null}
              {card.info ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex size-6 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground"
                      aria-label="Info KPI"
                    >
                      <Info className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px]">
                    {card.info}
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
            <p className="text-sm font-medium text-muted-foreground">{card.subtitle}</p>
          </CardHeader>
          <CardContent className="flex items-end gap-3 px-6 pb-4 pt-3">
            <p className="text-1xl font-bold leading-none tracking-tight lg:text1xl">{card.value}</p>
            <KpiDeltaPill delta={card.delta} label={card.deltaLabel} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
