'use client';

import { M2BaseFinancePage } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Anggaran (BD) untuk memantau nilai anggaran, realisasi pergerakan, dan status dokumen.',
  kpi1: 'Total Dokumen Anggaran',
  kpi2: 'Total Nilai Anggaran',
  kpi3: 'Total Realisasi Anggaran',
  kpi4: 'Selisih Anggaran',
  trendTitle: 'Trend Nilai Anggaran vs Realisasi',
  flowTitle: 'Alokasi Anggaran vs Realisasi',
  sourceTitle: 'Komposisi Sumber Anggaran',
  branchTitle: 'Top Cabang Berdasarkan Anggaran',
  statusTitle: 'Ringkasan Status Anggaran',
  tableTitle: 'List Dokumen Anggaran (Sample)',
  insightTitle: 'AI Insight Anggaran',
  insightHighlights: 'Sorotan Anggaran',
  insightAnomalies: 'Anomali Anggaran',
  insightRecommendations: 'Rekomendasi Anggaran',
  totalBranchTitle: 'Total Cabang Anggaran',
  totalSourceTitle: 'Total Sumber Anggaran',
  emptyStatusText: 'Tidak ada data status anggaran.',
  emptyInsightText: 'Belum ada insight anggaran.',
  emptyAnomalyText: 'Belum ada anomali anggaran.',
  emptyRecommendationText: 'Belum ada rekomendasi anggaran.',
  emptyTableText: 'Tidak ada data dokumen anggaran.',
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_bd"
      copy={copy}
      kpi4IsDelta
      insightTermMap={{
        totalDebit: 'total nilai anggaran',
        totalKredit: 'total realisasi anggaran',
        netCashflow: 'selisih anggaran',
        cashIn: 'alokasi anggaran',
        cashOut: 'realisasi anggaran',
        arusKasAgregat: 'ringkasan alokasi vs realisasi',
        outlierNetCashflow: 'outlier selisih anggaran',
      }}
    />
  );
}
