'use client';

/**
 * Shared M2Dashboard — komponen umum untuk semua finance-accounting m2_*
 * dashboard pages (m2_sg, m2_sgc, m2_rm, m2_rg, m2_rgc, m2_cd, m2_sm,
 * m2_bd, m2_aj, m2_jm, m2_gj, m2_template).
 *
 * Sebelumnya tiap page punya implementasi 1015-baris yang nyaris identik
 * (cuma beda `feature` const + entry FEATURE_COPY). Sekarang setiap page
 * jadi wrapper tipis:
 *
 *   export default function Page() {
 *     return <M2Dashboard feature="m2_sg" />;
 *   }
 */
import { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { M2_FEATURE_COPY, M2_FEATURE_LABELS } from './m2-feature-copy';
import { fmt, fmtMoney, toNumber } from './m2-utils';
import { useM2Data } from './use-m2-data';
import { M2KpiGrid } from './m2-kpi-grid';
import {
  M2BreakdownRow,
  M2TrendCharts,
  type BranchChartRow,
  type CashflowChartRow,
  type SourceBreakdownRow,
  type TrendChartRow,
} from './m2-charts';
import {
  M2InsightCard,
  type FallbackInsights,
} from './m2-insight-card';
import { M2TableCard } from './m2-table-card';

export function M2Dashboard({ feature }: { feature: string }) {
  const featureLabel = M2_FEATURE_LABELS[feature] ?? `Finance Feature (${feature})`;
  const featureCopy = M2_FEATURE_COPY[feature] ?? M2_FEATURE_COPY.default;
  const isBudgetFeature = feature === 'm2_bd';
  const isOutgoingGiroFeature = feature === 'm2_sg';

  const data = useM2Data(feature);

  const trendChartData = useMemo<TrendChartRow[]>(
    () =>
      data.trends.map((row) => ({
        period: String(row.period_ym ?? '-'),
        debit: toNumber(row.total_debit),
        kredit: toNumber(row.total_kredit),
        net: toNumber(row.net_cashflow),
        budget: toNumber(row.total_debit),
        realization: toNumber(row.total_kredit),
      })),
    [data.trends],
  );

  const sourceBreakdownData = useMemo<SourceBreakdownRow[]>(
    () =>
      data.breakdown.slice(0, 8).map((row) => ({
        label: String(row.group_key ?? 'UNKNOWN'),
        value: toNumber(row.total_debit) + toNumber(row.total_kredit),
      })),
    [data.breakdown],
  );

  const cashflowChartData = useMemo<CashflowChartRow[]>(
    () =>
      data.cashflow.map((row) => ({
        period: String(row.period_ym ?? '-'),
        cashIn: toNumber(row.cash_in),
        cashOut: toNumber(row.cash_out),
        allocation: toNumber(row.cash_in),
        realization: toNumber(row.cash_out),
      })),
    [data.cashflow],
  );

  const kpiValues = useMemo(() => {
    const totalRows = toNumber(data.summary?.total_journal_rows);
    const totalDebit = toNumber(data.summary?.total_debit);
    const totalKredit = toNumber(data.summary?.total_kredit);
    const net = toNumber(data.summary?.net_cashflow);
    if (!isBudgetFeature) {
      return { kpi1: totalRows, kpi2: totalDebit, kpi3: totalKredit, kpi4: net };
    }
    return {
      kpi1: totalRows,
      kpi2: totalDebit,
      kpi3: totalKredit,
      kpi4: totalDebit - totalKredit,
    };
  }, [isBudgetFeature, data.summary]);

  const branchChartData = useMemo<BranchChartRow[]>(
    () =>
      data.branch.slice(0, 8).map((row) => ({
        cabang: String(row.cabang ?? 'UNKNOWN'),
        movement: toNumber(row.movement_amount),
      })),
    [data.branch],
  );

  const fallbackInsights = useMemo<FallbackInsights>(
    () =>
      isOutgoingGiroFeature
        ? buildOutgoingGiroFallback({
            kpiValues,
            sourceBreakdownData,
            branchChartData,
            status: data.status,
            trendChartData,
          })
        : { insights: [], anomalies: [], recommendations: [] },
    [
      isOutgoingGiroFeature,
      kpiValues,
      sourceBreakdownData,
      branchChartData,
      data.status,
      trendChartData,
    ],
  );

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>{featureLabel}</ToolbarPageTitle>
          <ToolbarDescription>
            {featureCopy.description} ({feature})
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={data.fromDate}
              onChange={(e) => data.setFromDate(e.target.value)}
              className="w-[160px]"
            />
            <Input
              type="date"
              value={data.toDate}
              onChange={(e) => data.setToDate(e.target.value)}
              className="w-[160px]"
            />
            <Button
              variant="outline"
              onClick={() => void data.load()}
              disabled={data.loading}
            >
              <RefreshCw />
              Refresh
            </Button>
          </div>
        </ToolbarActions>
      </Toolbar>

      {data.error ? (
        <Card className="mb-4 border-destructive/30">
          <CardContent className="pt-6 text-sm text-destructive">
            {data.error}
          </CardContent>
        </Card>
      ) : null}

      <M2KpiGrid
        loading={data.loading}
        copy={featureCopy}
        kpiValues={kpiValues}
        summary={data.summary}
      />

      <M2TrendCharts
        copy={featureCopy}
        trendData={trendChartData}
        cashflowData={cashflowChartData}
        isBudgetFeature={isBudgetFeature}
      />

      <M2BreakdownRow
        copy={featureCopy}
        sourceData={sourceBreakdownData}
        branchData={branchChartData}
        status={data.status}
      />

      <M2InsightCard
        copy={featureCopy}
        feature={feature}
        insights={data.insights}
        anomalies={data.anomalies}
        recommendations={data.recommendations}
        insightModel={data.insightModel}
        fallback={fallbackInsights}
      />

      <M2TableCard copy={featureCopy} tableRows={data.tableRows} />
    </div>
  );
}

// =====================================================================
// Helpers
// =====================================================================

function buildOutgoingGiroFallback({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  status,
  trendChartData,
}: {
  kpiValues: { kpi1: number; kpi2: number; kpi3: number; kpi4: number };
  sourceBreakdownData: SourceBreakdownRow[];
  branchChartData: BranchChartRow[];
  status: Record<string, unknown>[];
  trendChartData: TrendChartRow[];
}): FallbackInsights {
  const totalGiroKeluar = toNumber(kpiValues.kpi2);
  const totalTerbayar = toNumber(kpiValues.kpi3);
  const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
  const trxCount = toNumber(kpiValues.kpi1);
  const outstandingPct =
    totalGiroKeluar > 0 ? (outstanding / totalGiroKeluar) * 100 : 0;

  const sourceTop = sourceBreakdownData[0];
  const branchTop = branchChartData[0];
  const statusTop = status[0];
  const trendOutlier = trendChartData.find(
    (item) =>
      toNumber(item.debit) >
      (totalGiroKeluar / Math.max(trendChartData.length, 1)) * 2.5,
  );

  const insights = [
    `Periode analisis mencatat ${fmt(trxCount)} transaksi giro keluar dengan total ${fmtMoney(totalGiroKeluar, 2)}.`,
    `Total pembayaran ${fmtMoney(totalTerbayar, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
    sourceTop
      ? `Sumber giro keluar terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
      : 'Belum ada sumber giro keluar dominan.',
    branchTop
      ? `Cabang dengan pembayaran giro tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
      : 'Belum ada cabang dengan pembayaran giro dominan.',
  ];

  const anomalies = [
    ...(outstandingPct > 30
      ? [
          `Outstanding giro melebihi 30% dari total nilai giro keluar (${fmt(outstandingPct, 2)}%).`,
        ]
      : []),
    ...(trendOutlier
      ? [
          `Lonjakan giro keluar terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi bernilai besar.`,
        ]
      : []),
    ...(statusTop &&
    String(statusTop.status_label ?? '').startsWith('unknown_')
      ? [
          'Terdapat status transaksi giro keluar yang belum terpetakan (unknown_*).',
        ]
      : []),
  ];

  const recommendations = [
    'Prioritaskan review transaksi giro outstanding terbesar berdasarkan sumber dan cabang.',
    'Lakukan validasi transaksi outlier agar nominal pembayaran giro tetap akurat.',
    'Pantau rasio outstanding giro secara berkala agar arus kas lebih terkontrol.',
  ];

  return { insights, anomalies, recommendations };
}
