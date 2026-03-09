'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductionKpi = {
  title: string;
  subtitle: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  suffixMuted?: string;
};

export function ProductionKpiRow({ cards }: { cards: ProductionKpi[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const isPositive = (card.delta ?? 0) >= 0;
        return (
          <Card key={card.title} className="rounded-xl border-border/80 shadow-xs">
            <CardHeader className="px-4 pb-1 pt-3">
              <CardTitle className="text-xs font-medium text-foreground">{card.title}</CardTitle>
              <p className="text-[10px] text-muted-foreground">{card.subtitle}</p>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-0">
              <div className="flex items-end gap-2">
                <p className="text-[28px] font-semibold leading-none">{card.value}</p>
                {card.suffixMuted ? <span className="text-xs text-muted-foreground">{card.suffixMuted}</span> : null}
              </div>
              {typeof card.delta === 'number' && card.deltaLabel ? (
                <div className={`mt-1 flex items-center gap-1 text-[10px] font-medium ${isPositive ? 'text-green-500' : 'text-rose-500'}`}>
                  {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                  {Math.abs(card.delta)} ({card.deltaLabel})
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
