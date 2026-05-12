'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Giro Masuk Batal (RGC) untuk memantau pembatalan giro masuk, tren reversal, dan distribusi transaksi.',
  kpi1: 'Total Transaksi Giro Batal',
  kpi2: 'Total Nilai Giro Batal',
  kpi3: 'Total Nilai Reversal',
  kpi4: 'Net Pembatalan',
  trendTitle: 'Trend Giro Batal vs Reversal',
  flowTitle: 'Arus Pembatalan Giro',
  sourceTitle: 'Komposisi Sumber Giro Batal',
  branchTitle: 'Top Cabang Giro Batal',
  statusTitle: 'Ringkasan Status Giro Masuk Batal',
  tableTitle: 'List Transaksi Giro Masuk Batal (Sample)',
  insightTitle: 'AI Insight Giro Masuk Batal',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status giro masuk batal.',
  emptyInsightText: 'Belum ada insight giro masuk batal.',
  emptyAnomalyText: 'Belum ada anomali giro masuk batal.',
  emptyRecommendationText: 'Belum ada rekomendasi giro masuk batal.',
  emptyTableText: 'Tidak ada data transaksi giro masuk batal.',
};

const fallbackInsightsFn: FallbackInsightsFn = ({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  trendChartData,
  status,
}) => {
  const totalCancelled = toNumber(kpiValues.kpi2);
  const totalReversal = toNumber(kpiValues.kpi3);
  const netCancellation = toNumber(kpiValues.kpi4);
  const trxCount = toNumber(kpiValues.kpi1);
  const reversalPct =
    totalCancelled > 0 ? (totalReversal / totalCancelled) * 100 : 0;

  const sourceTop = sourceBreakdownData[0];
  const branchTop = branchChartData[0];
  const statusTop = status[0];
  const trendOutlier = trendChartData.find(
    (item) =>
      toNumber(item.debit) >
      (totalCancelled / Math.max(trendChartData.length, 1)) * 2.5,
  );

  return {
    insights: [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi giro masuk batal dengan total ${fmtMoney(totalCancelled, 2)}.`,
      `Total nilai reversal ${fmtMoney(totalReversal, 2)} dengan net pembatalan ${fmtMoney(netCancellation, 2)}.`,
      sourceTop
        ? `Sumber pembatalan terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber pembatalan dominan.',
      branchTop
        ? `Cabang dengan nilai pembatalan tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan pembatalan dominan.',
    ],
    anomalies: [
      ...(reversalPct > 80
        ? [
            `Rasio reversal mencapai ${fmt(reversalPct, 2)}% dari nilai giro batal; perlu review proses pembatalan.`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan giro masuk batal terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi pembatalan bernilai besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi giro masuk batal yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Review transaksi pembatalan terbesar berdasarkan sumber dan cabang untuk menemukan akar masalah operasional.',
      'Validasi dokumen reversal bernilai tinggi agar tidak terjadi pembatalan berulang.',
      'Pantau tren giro masuk batal mingguan untuk menekan rasio pembatalan yang tidak normal.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_rgc"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total giro masuk batal',
        totalKredit: 'total nilai reversal',
        netCashflow: 'net pembatalan',
        cashIn: 'nilai pembatalan giro',
        cashOut: 'nilai reversal',
        arusKasAgregat: 'ringkasan pembatalan giro masuk',
        outlierNetCashflow: 'outlier pembatalan giro masuk',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
