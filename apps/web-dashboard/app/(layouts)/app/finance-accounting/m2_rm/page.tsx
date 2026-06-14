'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Bank Receipt (RM) untuk memantau penerimaan bank, tren realisasi, dan distribusi transaksi.',
  kpi1: 'Total Transaksi Bank Receipt',
  kpi2: 'Total Nilai Receipt',
  kpi3: 'Total Terealisasi',
  kpi4: 'Outstanding Receipt',
  trendTitle: 'Trend Receipt vs Realisasi',
  flowTitle: 'Arus Penerimaan Bank',
  sourceTitle: 'Komposisi Sumber Receipt',
  branchTitle: 'Top Cabang Receipt',
  statusTitle: 'Ringkasan Status Bank Receipt',
  tableTitle: 'List Transaksi Bank Receipt (Sample)',
  insightTitle: 'AI Insight Bank Receipt',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status bank receipt.',
  emptyInsightText: 'Belum ada insight bank receipt.',
  emptyAnomalyText: 'Belum ada anomali bank receipt.',
  emptyRecommendationText: 'Belum ada rekomendasi bank receipt.',
  emptyTableText: 'Tidak ada data transaksi bank receipt.',
};

const fallbackInsightsFn: FallbackInsightsFn = ({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  trendChartData,
  status,
}) => {
  const totalReceipt = toNumber(kpiValues.kpi2);
  const totalRealisasi = toNumber(kpiValues.kpi3);
  const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
  const trxCount = toNumber(kpiValues.kpi1);
  const outstandingPct =
    totalReceipt > 0 ? (outstanding / totalReceipt) * 100 : 0;

  const sourceTop = sourceBreakdownData[0];
  const branchTop = branchChartData[0];
  const statusTop = status[0];
  const trendOutlier = trendChartData.find(
    (item) =>
      toNumber(item.debit) >
      (totalReceipt / Math.max(trendChartData.length, 1)) * 2.5,
  );

  return {
    insights: [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi bank receipt dengan total ${fmtMoney(totalReceipt, 2)}.`,
      `Total realisasi ${fmtMoney(totalRealisasi, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber receipt terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber receipt dominan.',
      branchTop
        ? `Cabang dengan nilai receipt tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan receipt dominan.',
    ],
    anomalies: [
      ...(outstandingPct > 30
        ? [
            `Outstanding receipt melebihi 30% dari total nilai receipt (${fmt(outstandingPct, 2)}%).`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan bank receipt terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi bernilai besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi bank receipt yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Prioritaskan review transaksi receipt outstanding terbesar berdasarkan sumber dan cabang.',
      'Lakukan validasi transaksi outlier agar nominal bank receipt tetap akurat.',
      'Pantau rasio outstanding receipt secara berkala agar arus kas lebih terkontrol.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_rm"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total bank receipt',
        totalKredit: 'total terealisasi',
        netCashflow: 'outstanding receipt',
        cashIn: 'nilai receipt',
        cashOut: 'nilai realisasi receipt',
        arusKasAgregat: 'ringkasan penerimaan bank',
        outlierNetCashflow: 'outlier bank receipt',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
