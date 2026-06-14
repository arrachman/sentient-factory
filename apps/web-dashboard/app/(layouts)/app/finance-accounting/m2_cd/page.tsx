'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Kas Keluar (CD) untuk memantau pengeluaran kas, tren pembayaran, dan status transaksi.',
  kpi1: 'Total Transaksi Kas Keluar',
  kpi2: 'Total Kas Keluar',
  kpi3: 'Total Terbayar',
  kpi4: 'Outstanding Pengeluaran',
  trendTitle: 'Trend Kas Keluar vs Terbayar',
  flowTitle: 'Arus Pengeluaran Kas',
  sourceTitle: 'Komposisi Sumber Kas Keluar',
  branchTitle: 'Top Cabang Pengeluaran',
  statusTitle: 'Ringkasan Status Kas Keluar',
  tableTitle: 'List Transaksi Kas Keluar (Sample)',
  insightTitle: 'AI Insight Kas Keluar',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status kas keluar.',
  emptyInsightText: 'Belum ada insight kas keluar.',
  emptyAnomalyText: 'Belum ada anomali kas keluar.',
  emptyRecommendationText: 'Belum ada rekomendasi kas keluar.',
  emptyTableText: 'Tidak ada data transaksi kas keluar.',
};

const fallbackInsightsFn: FallbackInsightsFn = ({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  trendChartData,
  status,
}) => {
  const totalKasKeluar = toNumber(kpiValues.kpi2);
  const totalTerbayar = toNumber(kpiValues.kpi3);
  const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
  const trxCount = toNumber(kpiValues.kpi1);
  const outstandingPct =
    totalKasKeluar > 0 ? (outstanding / totalKasKeluar) * 100 : 0;

  const sourceTop = sourceBreakdownData[0];
  const branchTop = branchChartData[0];
  const statusTop = status[0];
  const trendOutlier = trendChartData.find(
    (item) =>
      toNumber(item.debit) >
      (totalKasKeluar / Math.max(trendChartData.length, 1)) * 2.5,
  );

  return {
    insights: [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi kas keluar dengan total ${fmtMoney(totalKasKeluar, 2)}.`,
      `Total pembayaran ${fmtMoney(totalTerbayar, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber pengeluaran terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber pengeluaran dominan.',
      branchTop
        ? `Cabang dengan pengeluaran terbesar: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan pengeluaran dominan.',
    ],
    anomalies: [
      ...(outstandingPct > 30
        ? [
            `Outstanding pengeluaran melebihi 30% dari total kas keluar (${fmt(outstandingPct, 2)}%).`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan kas keluar terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi nominal besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi kas keluar yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Prioritaskan review transaksi outstanding terbesar berdasarkan sumber dan cabang.',
      'Lakukan validasi transaksi outlier untuk memastikan tidak ada salah input nominal.',
      'Terapkan monitoring mingguan rasio outstanding agar arus kas keluar tetap terkendali.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_cd"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total kas keluar',
        totalKredit: 'total terbayar',
        netCashflow: 'outstanding pengeluaran',
        cashIn: 'nilai kas keluar',
        cashOut: 'nilai terbayar',
        arusKasAgregat: 'ringkasan pengeluaran vs pembayaran',
        outlierNetCashflow: 'outlier pengeluaran kas',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
