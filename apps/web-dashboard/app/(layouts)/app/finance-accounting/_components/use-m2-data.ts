'use client';

/**
 * Hook fetcher untuk dashboard m2_*. Sekali load = 7 endpoint paralel +
 * 1 insight endpoint. Semua data state disimpan di hook supaya page
 * tinggal render.
 */
import { useEffect, useState } from 'react';
import {
  fetchRows,
  oneYearAgoDateOnly,
  todayDateOnly,
  type InsightItem,
  type InsightResponse,
  type SummaryRow,
} from './m2-utils';

export function useM2Data(feature: string) {
  const [fromDate, setFromDate] = useState(oneYearAgoDateOnly());
  const [toDate, setToDate] = useState(todayDateOnly());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, unknown>[]>([]);
  const [cashflow, setCashflow] = useState<Record<string, unknown>[]>([]);
  const [branch, setBranch] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState<Record<string, unknown>[]>([]);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
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
      const query = new URLSearchParams({ fromDate, toDate, feature });
      const [
        summaryRows,
        trendRows,
        breakdownRows,
        cashflowRows,
        branchRows,
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
          `/api/dashboard/m2/breakdown/status?${query.toString()}`,
        ),
        fetchRows<Record<string, unknown>>(
          `/api/dashboard/m2/table?${query.toString()}&page=1&pageSize=20&sortBy=ttgl&sortOrder=desc`,
        ),
      ]);

      const insightQuery = new URLSearchParams({ fromDate, toDate, feature });
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
      setStatus(statusRows);
      setTableRows(detailRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature]);

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
    status,
    tableRows,
    insights,
    anomalies,
    recommendations,
    insightModel,
    load,
  };
}
