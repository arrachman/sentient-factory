'use client';

/**
 * 6-card KPI grid: 4 main KPIs + total cabang + total sumber.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fmt,
  fmtCompact,
  fmtMoney,
  fmtMoneyCompact,
  type SummaryRow,
} from './m2-utils';
import type { M2FeatureCopy } from './m2-feature-copy';

export type KpiValues = {
  kpi1: number;
  kpi2: number;
  kpi3: number;
  kpi4: number;
};

export function M2KpiGrid({
  loading,
  copy,
  kpiValues,
  summary,
}: {
  loading: boolean;
  copy: M2FeatureCopy;
  kpiValues: KpiValues;
  summary: SummaryRow | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <KpiCard
        title={copy.kpi1}
        loading={loading}
        primary={fmtCompact(kpiValues.kpi1)}
        secondary={fmt(kpiValues.kpi1)}
        titleAttr={fmt(kpiValues.kpi1)}
      />
      <KpiCard
        title={copy.kpi2}
        loading={loading}
        primary={fmtMoneyCompact(kpiValues.kpi2, 2)}
        secondary={fmtMoney(kpiValues.kpi2, 2)}
        titleAttr={fmtMoney(kpiValues.kpi2, 2)}
      />
      <KpiCard
        title={copy.kpi3}
        loading={loading}
        primary={fmtMoneyCompact(kpiValues.kpi3, 2)}
        secondary={fmtMoney(kpiValues.kpi3, 2)}
        titleAttr={fmtMoney(kpiValues.kpi3, 2)}
      />
      <KpiCard
        title={copy.kpi4}
        loading={loading}
        primary={fmtMoneyCompact(kpiValues.kpi4, 2)}
        secondary={fmtMoney(kpiValues.kpi4, 2)}
        titleAttr={fmtMoney(kpiValues.kpi4, 2)}
      />
      <KpiCard
        title={copy.totalBranchTitle}
        loading={loading}
        primary={fmtCompact(summary?.total_cabang)}
        secondary={fmt(summary?.total_cabang)}
        titleAttr={fmt(summary?.total_cabang)}
      />
      <KpiCard
        title={copy.totalSourceTitle}
        loading={loading}
        primary={fmtCompact(summary?.total_sumber)}
        secondary={fmt(summary?.total_sumber)}
        titleAttr={fmt(summary?.total_sumber)}
      />
    </div>
  );
}

function KpiCard({
  title,
  loading,
  primary,
  secondary,
  titleAttr,
}: {
  title: string;
  loading: boolean;
  primary: string;
  secondary: string;
  titleAttr: string;
}) {
  return (
    <Card>
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
              title={titleAttr}
            >
              {primary}
            </p>
            <p className="text-xs text-muted-foreground">{secondary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
