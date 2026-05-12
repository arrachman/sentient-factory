'use client';

import { M2BaseFinancePage } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Saldo Awal COA (CB) untuk memantau nominal opening balance, status posting, dan konsistensi saldo awal.',
  kpi1: 'Total Dokumen Saldo Awal',
  kpi2: 'Total Debit Saldo Awal',
  kpi3: 'Total Kredit Saldo Awal',
  kpi4: 'Net Opening Balance',
  trendTitle: 'Trend Debit vs Kredit Saldo Awal',
  flowTitle: 'Debit vs Kredit per Periode',
  sourceTitle: 'Komposisi Sumber Saldo Awal',
  branchTitle: 'Top Cabang Berdasarkan Saldo Awal',
  statusTitle: 'Ringkasan Status Saldo Awal',
  tableTitle: 'List Dokumen Saldo Awal (Sample)',
  insightTitle: 'AI Insight Saldo Awal COA',
  insightHighlights: 'Sorotan Saldo Awal',
  insightAnomalies: 'Anomali Saldo Awal',
  insightRecommendations: 'Rekomendasi Saldo Awal',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'Tidak ada data status saldo awal.',
  emptyInsightText: 'Belum ada insight saldo awal.',
  emptyAnomalyText: 'Belum ada anomali saldo awal.',
  emptyRecommendationText: 'Belum ada rekomendasi saldo awal.',
  emptyTableText: 'Tidak ada data dokumen saldo awal.',
};

export default function Page() {
  return (
    <M2BaseFinancePage
      feature="m2_cb"
      copy={copy}
      insightTermMap={{
        totalDebit: 'total debit saldo awal',
        totalKredit: 'total kredit saldo awal',
        netCashflow: 'net opening balance',
        cashIn: 'debit saldo awal',
        cashOut: 'kredit saldo awal',
        arusKasAgregat: 'ringkasan debit vs kredit saldo awal',
        outlierNetCashflow: 'outlier net opening balance',
      }}
    />
  );
}
