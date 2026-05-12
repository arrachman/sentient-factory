'use client';

/**
 * Data hook untuk m2_cr (Kas Masuk) dashboard:
 *  - Fetch summary/trends/breakdown/status/branches/outstanding/table + insights
 *  - Compute chart data dan KPI values
 *  - Manage drilldown state (kontak detail)
 */
import { useEffect, useMemo, useState } from 'react';
import {
  fetchRows,
  fmt,
  fmtMoney,
  oneYearAgoDateOnly,
  toNumber,
  todayDateOnly,
  type InsightItem,
  type InsightResponse,
  type SummaryRow,
} from '../../_components/m2-utils';

const FEATURE = 'm2_cr';

export function useM2CrData() {
  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [cashflow, setCashflow] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [topOutstandingContacts, setTopOutstandingContacts] = useState<
    Record<string, unknown>[]
  >([]);
  const [status, setStatus] = useState<Record<string, unknown>[]>([]);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [contactDrilldown, setContactDrilldown] = useState<
    Record<string, unknown>[]
  >([]);
  const [activeKontakId, setActiveKontakId] = useState('');
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [loadingKontak, setLoadingKontak] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [anomalies, setAnomalies] = useState<InsightItem[]>([]);
  const [recommendations, setRecommendations] = useState<InsightItem[]>([]);
  const [insightModel, setInsightModel] = useState<{
    provider?: string;
    version?: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ fromDate, toDate, feature: FEATURE });
      const [
        summaryRows,
        trendRows,
        breakdownRows,
        statusRows,
        topBranchRows,
        topOutstandingRows,
        detailRows,
      ] = await Promise.all([
        fetchRows<SummaryRow>(
          `/api/dashboard/m2/cr/summary?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/trends?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/breakdown/source?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/breakdown/status-bayar?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/top-branches?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/top-outstanding-contacts?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/cr/table?${query.toString()}&page=1&pageSize=20&sortBy=outstanding&sortOrder=desc`,
        ),
      ]);

      const insightQuery = new URLSearchParams({
        fromDate,
        toDate,
        feature: FEATURE,
      });
      const insightResponse = await fetch(
        `/api/dashboard/m2/cr/insight?${insightQuery.toString()}`,
        { cache: 'no-store' },
      );
      const insightPayload = (await insightResponse
        .json()
        .catch(() => null)) as InsightResponse | null;
      if (insightResponse.ok && insightPayload?.success) {
        setInsights(insightPayload.data?.insights ?? []);
        setAnomalies(insightPayload.data?.anomalies ?? []);
        setRecommendations(insightPayload.data?.recommendations ?? []);
        setInsightModel(insightPayload.data?.model ?? null);
      } else {
        setInsights([]);
        setAnomalies([]);
        setRecommendations([]);
        setInsightModel(null);
      }

      setSummary(summaryRows[0] ?? null);
      setTrends(trendRows);
      setBreakdown(breakdownRows);
      setCashflow(trendRows);
      setBranch(topBranchRows);
      setTopOutstandingContacts(topOutstandingRows);
      setStatus(statusRows);
      setTableRows(detailRows);
      setContactDrilldown([]);
      setActiveKontakId('');
      setDrilldownOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendChartData = useMemo(
    () =>
      trends.map((row) => ({
        period: String(row.period_ym ?? '-'),
        debit: toNumber(row.total_kas_masuk),
        kredit: toNumber(row.total_terbayar),
        net: toNumber(row.outstanding),
        budget: toNumber(row.total_kas_masuk),
        realization: toNumber(row.total_terbayar),
      })),
    [trends],
  );

  const sourceBreakdownData = useMemo(
    () =>
      breakdown.slice(0, 8).map((row) => ({
        label: String(row.source_key ?? 'UNKNOWN'),
        value: toNumber(row.total_kas_masuk),
      })),
    [breakdown],
  );

  const cashflowChartData = useMemo(
    () =>
      cashflow.map((row) => ({
        period: String(row.period_ym ?? '-'),
        cashIn: toNumber(row.total_kas_masuk),
        cashOut: toNumber(row.total_terbayar),
        allocation: toNumber(row.total_kas_masuk),
        realization: toNumber(row.total_terbayar),
      })),
    [cashflow],
  );

  const branchChartData = useMemo(
    () =>
      branch.slice(0, 8).map((row) => ({
        cabang: String(row.cabang ?? 'UNKNOWN'),
        movement: toNumber(row.total_kas_masuk),
      })),
    [branch],
  );

  const kpiValues = useMemo(() => {
    const totalRows = toNumber(summary?.total_trx);
    const totalDebit = toNumber(summary?.total_kas_masuk);
    const totalKredit = toNumber(summary?.total_terbayar);
    const net = toNumber(summary?.outstanding);
    return { kpi1: totalRows, kpi2: totalDebit, kpi3: totalKredit, kpi4: net };
  }, [summary]);

  const fallbackInsights = useMemo(() => {
    const totalKasMasuk = toNumber(kpiValues.kpi2);
    const totalTerbayar = toNumber(kpiValues.kpi3);
    const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
    const trxCount = toNumber(kpiValues.kpi1);
    const outstandingPct =
      totalKasMasuk > 0 ? (outstanding / totalKasMasuk) * 100 : 0;

    const statusTop = status[0];
    const sourceTop = sourceBreakdownData[0];
    const branchTopRaw = branch[0];
    const branchTop = branchTopRaw
      ? {
          cabang: String(branchTopRaw.cabang ?? 'UNKNOWN'),
          movement: toNumber(branchTopRaw.movement_amount),
        }
      : null;

    const avgPerPeriod = totalKasMasuk / Math.max(trendChartData.length, 1);
    const trendOutlier = trendChartData.find(
      (item) => toNumber(item.debit) > avgPerPeriod * 2.5,
    );

    const ins = [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi kas masuk dengan total ${fmtMoney(totalKasMasuk, 2)}.`,
      `Total terbayar ${fmtMoney(totalTerbayar, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber transaksi terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber transaksi dominan.',
      branchTop
        ? `Cabang dengan movement tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan movement dominan.',
    ];

    const anom = [
      ...(outstandingPct > 30
        ? [
            `Outstanding kas masuk melebihi 30% dari total penerimaan (${fmt(outstandingPct, 2)}%).`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan kas masuk terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi nominal besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? ['Terdapat status transaksi belum terpetakan (unknown_*).']
        : []),
    ];

    const rec = [
      'Prioritaskan follow-up transaksi outstanding terbesar berdasarkan kontak dan cabang.',
      'Lakukan validasi transaksi outlier untuk memastikan tidak ada salah input nominal.',
      'Tetapkan monitoring mingguan untuk rasio outstanding agar cash conversion lebih sehat.',
    ];

    return { insights: ins, anomalies: anom, recommendations: rec };
  }, [branch, kpiValues, sourceBreakdownData, status, trendChartData]);

  const openContactDrilldown = async (kontakIdRaw: unknown) => {
    const kontakId = String(kontakIdRaw ?? '').trim();
    if (!kontakId) return;
    setActiveKontakId(kontakId);
    setDrilldownOpen(true);
    setLoadingKontak(kontakId);
    try {
      const query = new URLSearchParams({
        fromDate,
        toDate,
        feature: FEATURE,
        kontakId,
      });
      const rows = await fetchRows<Record<string, unknown>>(
        `/api/dashboard/m2/cr/contact-drilldown?${query.toString()}`,
      );
      setContactDrilldown(rows);
    } catch {
      setContactDrilldown([]);
    } finally {
      setLoadingKontak(null);
    }
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    loading,
    error,
    summary,
    trends,
    breakdown,
    cashflow,
    branch,
    topOutstandingContacts,
    status,
    tableRows,
    contactDrilldown,
    activeKontakId,
    drilldownOpen,
    setDrilldownOpen,
    loadingKontak,
    insights,
    anomalies,
    recommendations,
    insightModel,
    trendChartData,
    sourceBreakdownData,
    cashflowChartData,
    branchChartData,
    kpiValues,
    fallbackInsights,
    openContactDrilldown,
    load,
  };
}
