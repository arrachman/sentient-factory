'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Giro Masuk (RG) untuk memantau penerimaan giro, tren pencairan, dan distribusi transaksi.',
  kpi1: 'Total Transaksi Giro Masuk',
  kpi2: 'Total Nilai Giro Masuk',
  kpi3: 'Total Tercairkan',
  kpi4: 'Outstanding Giro Masuk',
  trendTitle: 'Trend Giro Masuk vs Tercairkan',
  flowTitle: 'Arus Penerimaan Giro',
  sourceTitle: 'Komposisi Sumber Giro Masuk',
  branchTitle: 'Top Cabang Giro Masuk',
  statusTitle: 'Ringkasan Status Giro Masuk',
  tableTitle: 'List Transaksi Giro Masuk (Sample)',
  insightTitle: 'AI Insight Giro Masuk',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status giro masuk.',
  emptyInsightText: 'Belum ada insight giro masuk.',
  emptyAnomalyText: 'Belum ada anomali giro masuk.',
  emptyRecommendationText: 'Belum ada rekomendasi giro masuk.',
  emptyTableText: 'Tidak ada data transaksi giro masuk.',
};

const fallbackInsightsFn: FallbackInsightsFn = ({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  trendChartData,
  status,
}) => {
  const totalGiroMasuk = toNumber(kpiValues.kpi2);
  const totalTercairkan = toNumber(kpiValues.kpi3);
  const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
  const trxCount = toNumber(kpiValues.kpi1);
  const outstandingPct =
    totalGiroMasuk > 0 ? (outstanding / totalGiroMasuk) * 100 : 0;

  const sourceTop = sourceBreakdownData[0];
  const branchTop = branchChartData[0];
  const statusTop = status[0];
  const trendOutlier = trendChartData.find(
    (item) =>
      toNumber(item.debit) >
      (totalGiroMasuk / Math.max(trendChartData.length, 1)) * 2.5,
  );

  return {
    insights: [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi giro masuk dengan total ${fmtMoney(totalGiroMasuk, 2)}.`,
      `Total pencairan ${fmtMoney(totalTercairkan, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber giro masuk terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber giro masuk dominan.',
      branchTop
        ? `Cabang dengan giro masuk tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan giro masuk dominan.',
    ],
    anomalies: [
      ...(outstandingPct > 30
        ? [
            `Outstanding giro masuk melebihi 30% dari total nilai giro (${fmt(outstandingPct, 2)}%).`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan giro masuk terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi bernilai besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi giro masuk yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Prioritaskan review giro outstanding terbesar berdasarkan sumber dan cabang.',
      'Validasi transaksi outlier untuk memastikan akurasi nominal giro masuk.',
      'Pantau rasio outstanding giro masuk agar proses pencairan tetap sehat.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_rg"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total giro masuk',
        totalKredit: 'total tercairkan',
        netCashflow: 'outstanding giro masuk',
        cashIn: 'nilai giro masuk',
        cashOut: 'nilai pencairan giro',
        arusKasAgregat: 'ringkasan penerimaan giro',
        outlierNetCashflow: 'outlier giro masuk',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
