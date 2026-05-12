'use client';

/**
 * Data hook untuk m2_sm (Bank Payment) dashboard:
 *  - Fetch summary/trends/breakdown/cashflow/branch/topContacts/status/table + insights
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

const FEATURE = 'm2_sm';

export function useM2SmData() {
  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [cashflow, setCashflow] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [topContacts, setTopContacts] = useState<Record<string, unknown>[]>([]);
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
        cashflowRows,
        branchRows,
        topContactRows,
        statusRows,
        detailRows,
      ] = await Promise.all([
        fetchRows<SummaryRow>(`/api/dashboard/m2/summary?${query.toString()}`),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/trends?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/breakdown?${query.toString()}&groupBy=tsumber`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/breakdown/cashflow?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/breakdown/branch?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/sm/top-contacts?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/breakdown/status?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/table?${query.toString()}&page=1&pageSize=20&sortBy=tkredit&sortOrder=desc`,
        ),
      ]);

      const insightQuery = new URLSearchParams({
        fromDate,
        toDate,
        feature: FEATURE,
      });
      const insightResponse = await fetch(
        `/api/dashboard/m2/insight?${insightQuery.toString()}`,
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
      setCashflow(cashflowRows);
      setBranch(branchRows);
      setTopContacts(topContactRows);
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
        debit: toNumber(row.total_debit),
        kredit: toNumber(row.total_kredit),
        net: toNumber(row.net_cashflow),
        budget: toNumber(row.total_debit),
        realization: toNumber(row.total_kredit),
      })),
    [trends],
  );

  const sourceBreakdownData = useMemo(
    () =>
      breakdown.slice(0, 8).map((row) => ({
        label: String(row.group_key ?? 'UNKNOWN'),
        value: toNumber(row.total_debit) + toNumber(row.total_kredit),
      })),
    [breakdown],
  );

  const cashflowChartData = useMemo(
    () =>
      cashflow.map((row) => ({
        period: String(row.period_ym ?? '-'),
        cashIn: toNumber(row.cash_in),
        cashOut: toNumber(row.cash_out),
        allocation: toNumber(row.cash_in),
        realization: toNumber(row.cash_out),
      })),
    [cashflow],
  );

  const branchChartData = useMemo(
    () =>
      branch.slice(0, 8).map((row) => ({
        cabang: String(row.cabang ?? 'UNKNOWN'),
        movement: toNumber(row.movement_amount),
      })),
    [branch],
  );

  const kpiValues = useMemo(() => {
    const totalRows = toNumber(summary?.total_journal_rows);
    const totalDebit = toNumber(summary?.total_debit);
    const totalKredit = toNumber(summary?.total_kredit);
    const net = toNumber(summary?.net_cashflow);
    return { kpi1: totalRows, kpi2: totalDebit, kpi3: totalKredit, kpi4: net };
  }, [summary]);

  const fallbackInsights = useMemo(() => {
    const totalPayment = toNumber(kpiValues.kpi2);
    const totalRealisasi = toNumber(kpiValues.kpi3);
    const outstanding = Math.max(0, toNumber(kpiValues.kpi4));
    const trxCount = toNumber(kpiValues.kpi1);
    const outstandingPct =
      totalPayment > 0 ? (outstanding / totalPayment) * 100 : 0;

    const sourceTop = sourceBreakdownData[0];
    const branchTop = branchChartData[0];
    const statusTop = status[0];
    const avgPerPeriod = totalPayment / Math.max(trendChartData.length, 1);
    const trendOutlier = trendChartData.find(
      (item) => toNumber(item.debit) > avgPerPeriod * 2.5,
    );

    const ins = [
      `Periode analisis mencatat ${fmt(trxCount)} transaksi bank payment dengan total ${fmtMoney(totalPayment, 2)}.`,
      `Total realisasi ${fmtMoney(totalRealisasi, 2)} dengan outstanding ${fmtMoney(outstanding, 2)} (${fmt(outstandingPct, 2)}%).`,
      sourceTop
        ? `Sumber payment terbesar saat ini adalah ${sourceTop.label} dengan kontribusi ${fmtMoney(sourceTop.value, 2)}.`
        : 'Belum ada sumber payment dominan.',
      branchTop
        ? `Cabang dengan nilai payment tertinggi: ${branchTop.cabang} (${fmtMoney(branchTop.movement, 2)}).`
        : 'Belum ada cabang dengan payment dominan.',
    ];

    const anom = [
      ...(outstandingPct > 30
        ? [
            `Outstanding payment melebihi 30% dari total nilai payment (${fmt(outstandingPct, 2)}%).`,
          ]
        : []),
      ...(trendOutlier
        ? [
            `Lonjakan bank payment terdeteksi pada periode ${trendOutlier.period}; perlu verifikasi transaksi bernilai besar.`,
          ]
        : []),
      ...(statusTop &&
      String(statusTop.status_label ?? '').startsWith('unknown_')
        ? [
            'Terdapat status transaksi bank payment yang belum terpetakan (unknown_*).',
          ]
        : []),
    ];

    const rec = [
      'Prioritaskan review transaksi payment outstanding terbesar berdasarkan sumber dan cabang.',
      'Validasi transaksi outlier untuk memastikan akurasi nominal bank payment.',
      'Pantau rasio outstanding payment secara periodik untuk menjaga kesehatan cash outflow.',
    ];

    return { insights: ins, anomalies: anom, recommendations: rec };
  }, [branchChartData, kpiValues, sourceBreakdownData, status, trendChartData]);

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
        `/api/dashboard/m2/sm/contact-drilldown?${query.toString()}`,
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
    topContacts,
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
