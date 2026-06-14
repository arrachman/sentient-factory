'use client';

import { M2BaseFinancePage, type FallbackInsightsFn } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';
import { fmt, fmtMoney, toNumber } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Giro Keluar (SG) untuk memantau pengeluaran via giro, nilai pembayaran, dan distribusi transaksi.',
  kpi1: 'Total Transaksi Giro Keluar',
  kpi2: 'Total Nilai Giro Keluar',
  kpi3: 'Total Terbayar',
  kpi4: 'Outstanding Giro',
  trendTitle: 'Trend Giro Keluar vs Terbayar',
  flowTitle: 'Arus Pembayaran Giro',
  sourceTitle: 'Komposisi Sumber Giro Keluar',
  branchTitle: 'Top Cabang Pembayaran Giro',
  statusTitle: 'Ringkasan Status Giro Keluar',
  tableTitle: 'List Transaksi Giro Keluar (Sample)',
  insightTitle: 'AI Insight Giro Keluar',
  insightHighlights: 'Ringkasan',
  insightAnomalies: 'Anomali',
  insightRecommendations: 'Rekomendasi',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Belum ada data status giro keluar.',
  emptyInsightText: 'Belum ada insight giro keluar.',
  emptyAnomalyText: 'Belum ada anomali giro keluar.',
  emptyRecommendationText: 'Belum ada rekomendasi giro keluar.',
  emptyTableText: 'Tidak ada data transaksi giro keluar.',
};

const fallbackInsightsFn: FallbackInsightsFn = ({
  kpiValues,
  sourceBreakdownData,
  branchChartData,
  trendChartData,
  status,
}) => {
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

  return {
    insights: [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi giro keluar dengan total ${fmtMoney(totalGiroKeluar, 2)}.`,
      `Total pembayaran ${fmtMoney(totalTerbayar, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber giro keluar terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber giro keluar dominan.',
      branchTop
        ? `Cabang dengan pembayaran giro tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan pembayaran giro dominan.',
    ],
    anomalies: [
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
        ? ['Terdapat status transaksi giro keluar yang belum terpetakan (unknown_*).']
        : []),
    ],
    recommendations: [
      'Prioritaskan review transaksi giro outstanding terbesar berdasarkan sumber dan cabang.',
      'Lakukan validasi transaksi outlier agar nominal pembayaran giro tetap akurat.',
      'Pantau rasio outstanding giro secara berkala agar arus kas lebih terkontrol.',
    ],
  };
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_sg"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total giro keluar',
        totalKredit: 'total terbayar',
        netCashflow: 'outstanding giro',
        cashIn: 'nilai giro keluar',
        cashOut: 'nilai terbayar',
        arusKasAgregat: 'ringkasan pembayaran giro',
        outlierNetCashflow: 'outlier pembayaran giro',
      }}
      fallbackInsightsFn={fallbackInsightsFn}
    />
  );
}
