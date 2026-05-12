'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Giro Keluar Batal (SGC) untuk memantau pembatalan giro keluar, tren nilai pembatalan, dan distribusi transaksi.',
  kpi1: 'Total Transaksi Batal',
  kpi2: 'Total Nilai Giro Batal',
  kpi3: 'Total Nilai Reversal',
  kpi4: 'Net Pembatalan',
  trendTitle: 'Trend Giro Batal vs Reversal',
  flowTitle: 'Arus Nilai Pembatalan',
  sourceTitle: 'Komposisi Sumber Giro Batal',
  branchTitle: 'Top Cabang Pembatalan',
  statusTitle: 'Ringkasan Status Giro Batal',
  tableTitle: 'List Transaksi Giro Keluar Batal (Sample)',
  insightTitle: 'AI Insight Giro Keluar Batal',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status giro keluar batal.',
  emptyInsightText: 'Belum ada insight giro keluar batal.',
  emptyAnomalyText: 'Belum ada anomali giro keluar batal.',
  emptyRecommendationText: 'Belum ada rekomendasi giro keluar batal.',
  emptyTableText: 'Tidak ada data transaksi giro keluar batal.',
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
      `Periode analisis mencatat ${fmt(trxCount)} transaksi giro keluar batal dengan total ${fmtMoney(totalCancelled, 2)}.`,
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
            `Lonjakan giro keluar batal terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi pembatalan bernilai besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi giro keluar batal yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Review transaksi pembatalan terbesar berdasarkan sumber dan cabang untuk menemukan akar masalah operasional.',
      'Validasi dokumen reversal bernilai tinggi agar tidak terjadi pembatalan berulang.',
      'Pantau tren giro keluar batal mingguan untuk menekan rasio pembatalan yang tidak normal.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_sgc"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total giro keluar batal',
        totalKredit: 'total nilai reversal',
        netCashflow: 'net pembatalan',
        cashIn: 'nilai pembatalan',
        cashOut: 'nilai reversal',
        arusKasAgregat: 'ringkasan pembatalan giro',
        outlierNetCashflow: 'outlier pembatalan giro',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
