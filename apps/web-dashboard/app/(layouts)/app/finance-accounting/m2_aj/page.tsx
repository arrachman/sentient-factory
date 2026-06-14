'use client';

import { M2BaseFinancePage } from '../_shared/m2-base-finance-page';
import type { FeatureCopy } from '../_shared/m2-types';

const copy: FeatureCopy = {
  description:
    'Dashboard Finance & Accounting dengan KPI, chart, breakdown, dan list transaksi.',
  kpi1: 'Total Jurnal',
  kpi2: 'Total Debit',
  kpi3: 'Total Kredit',
  kpi4: 'Net Cashflow',
  trendTitle: 'Trend Debit vs Kredit',
  flowTitle: 'Cash In vs Cash Out',
  sourceTitle: 'Komposisi Sumber',
  branchTitle: 'Top Cabang',
  statusTitle: 'Ringkasan Status',
  tableTitle: 'List Transaksi (Sample)',
  insightTitle: 'AI Insight',
  insightHighlights: 'Highlights',
  insightAnomalies: 'Anomaly Alerts',
  insightRecommendations: 'Recommendations',
  totalBranchTitle: 'Total Cabang',
  totalSourceTitle: 'Total Sumber',
  emptyStatusText: 'No status data.',
  emptyInsightText: 'No insight generated.',
  emptyAnomalyText: 'No anomaly detected.',
  emptyRecommendationText: 'No recommendation.',
  emptyTableText: 'Tidak ada data tabel.',
};

export default function Page() {
  return <M2BaseFinancePage feature="m2_aj" copy={copy} />;
}
