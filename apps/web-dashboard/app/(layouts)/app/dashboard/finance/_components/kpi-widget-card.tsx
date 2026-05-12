'use client';

/**
 * Single KPI card untuk Finance Dashboard.
 * Mendukung mode compact (height kecil / column tunggal) supaya widget tetap
 * terbaca di mobile dan saat user resize ke ukuran minimum.
 */
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import type { KpiCard } from '@/components/dashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function KpiWidgetCard({
  card,
  compact = false,
}: {
  card: KpiCard;
  compact?: boolean;
}) {
  const isUp = card.delta > 0;

  return (
    <Card className="h-full rounded-2xl border-border/80 shadow-xs transition-shadow hover:shadow-sm">
      <CardHeader className={cn('px-6', compact ? 'py-4' : 'py-5')}>
        <div className="flex items-center gap-2">
          <CardTitle
            className={cn(
              'font-medium tracking-[0%]',
              compact ? 'text-[13px] leading-6' : 'text-[14px] leading-[26px]',
            )}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {card.title}
          </CardTitle>
          {card.status ? (
            <Badge
              variant={
                card.status === 'good'
                  ? 'success'
                  : card.status === 'warn'
                    ? 'warning'
                    : 'destructive'
              }
              appearance="light"
              size="xs"
            >
              {card.status === 'good'
                ? 'Baik'
                : card.status === 'warn'
                  ? 'Waspada'
                  : 'Kritis'}
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
        <p className="text-sm font-medium text-muted-foreground">
          {card.subtitle}
        </p>
      </CardHeader>
      <CardContent
        className={cn(
          'flex h-full flex-col gap-3 px-6',
          compact ? 'pb-4 pt-1' : 'pb-5 pt-2',
        )}
      >
        <div className="mt-auto flex flex-wrap items-end gap-3">
          <p
            className={cn(
              'font-bold leading-none tracking-tight',
              compact ? 'text-lg' : 'text-xl',
            )}
          >
            {card.value}
          </p>
          <Badge
            variant={isUp ? 'success' : 'destructive'}
            appearance="light"
            size="sm"
            className="rounded-full px-2.5 text-xs font-semibold"
          >
            {isUp ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )}
            {Math.abs(card.delta)} ({card.deltaLabel})
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
