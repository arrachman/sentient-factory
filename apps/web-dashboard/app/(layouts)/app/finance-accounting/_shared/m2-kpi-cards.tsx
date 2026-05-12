'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fmt, fmtCompact, fmtMoney, fmtMoneyCompact } from './m2-types';

type KpiCardDef = {
  title: string;
  value: unknown;
  isMoney: boolean;
};

type M2KpiCardsProps = {
  cards: KpiCardDef[];
  loading: boolean;
};

export function M2KpiCards({ cards, loading }: M2KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {cards.map(({ title, value, isMoney }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p
                  className="text-xl font-semibold leading-tight"
                  title={isMoney ? fmtMoney(value, 2) : fmt(value)}
                >
                  {isMoney ? fmtMoneyCompact(value, 2) : fmtCompact(value)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isMoney ? fmtMoney(value, 2) : fmt(value)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
