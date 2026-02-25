import { useEffect, useRef, useState } from 'react';
import {
  type BreakdownRow,
  type DashboardDomain,
  type DashboardResponse,
  type DomainsResponse,
  fmtNumber,
  type MetadataResponse,
  type PeriodFilter,
  resolvePeriodRange,
  type SummaryRow,
  type TrendRow,
  toNumber,
} from '@/app/(layouts)/app/model/logistic-dashboard';

const DEFAULT_DOMAIN: DashboardDomain = 'm1';

const DOMAIN_PREFERRED_GROUP_BY: Record<DashboardDomain, string[]> = {
  m1: ['sumber', 'cabang', 'lokasi'],
  m: ['abstatus', 'abshift', 'abkaryawan'],
  m2r: ['apstatuslunas', 'apsumber', 'apmatauang'],
  so: ['sostatus', 'sostatusrealisasi', 'sobagianpenjualan', 'socustomer'],
};

const DOMAIN_PREFERRED_SORT_BY: Record<DashboardDomain, string[]> = {
  m1: ['id', 'tgl', 'inputtgl'],
  m: ['adid', 'adtgl', 'adinputtgl'],
  m2r: ['nmtahun', 'nmbulan', 'nmsaldo'],
  so: ['soid', 'sotgl', 'grand_total', 'total_paid'],
};

async function parsePayload<T>(response: Response): Promise<DashboardResponse<T>> {
  return (await response.json().catch(() => null)) as DashboardResponse<T>;
}

function pickPreferred(options: string[], preferred: string[], fallback = ''): string {
  const picked = preferred.find((item) => options.includes(item));
  return picked ?? options[0] ?? fallback;
}

function pickRowValue(
  row: Record<string, unknown>,
  ...keys: string[]
): string | number | undefined {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }
  }
  return undefined;
}

function normalizeSummaryRows(domain: DashboardDomain, rows: SummaryRow[]): SummaryRow[] {
  if (domain !== 'so') {
    return rows;
  }

  return rows.map((row) => ({
    ...row,
    total_rows: row.total_rows ?? pickRowValue(row as Record<string, unknown>, 'total_so'),
    total_metric: row.total_metric ?? pickRowValue(row as Record<string, unknown>, 'grand_total'),
    avg_metric:
      row.avg_metric ??
      row.total_metric ??
      pickRowValue(row as Record<string, unknown>, 'grand_total'),
    min_metric:
      row.min_metric ??
      pickRowValue(row as Record<string, unknown>, 'subtotal_before_discount_tax') ??
      row.total_metric,
    max_metric:
      row.max_metric ??
      pickRowValue(row as Record<string, unknown>, 'total_paid') ??
      row.total_metric,
  }));
}

function normalizeTrendRows(domain: DashboardDomain, rows: TrendRow[]): TrendRow[] {
  if (domain !== 'so') {
    return rows;
  }

  return rows.map((row) => ({
    ...row,
    total_rows: row.total_rows ?? pickRowValue(row as Record<string, unknown>, 'total_so'),
    total_metric: row.total_metric ?? pickRowValue(row as Record<string, unknown>, 'grand_total'),
  }));
}

function normalizeBreakdownRows(domain: DashboardDomain, rows: BreakdownRow[]): BreakdownRow[] {
  if (domain !== 'so') {
    return rows;
  }

  return rows.map((row) => {
    const raw = row as Record<string, unknown>;
    return {
      ...row,
      group_key:
        row.group_key ??
        String(
          raw.group_label_expr ??
            raw.status_label ??
            raw.realization_label ??
            raw.salesman_label ??
            raw.customer_label ??
            raw.group_key_expr ??
            'UNKNOWN',
        ),
      total_rows: row.total_rows ?? pickRowValue(raw, 'total_so'),
      total_metric: row.total_metric ?? pickRowValue(raw, 'grand_total'),
    };
  });
}

function resolveBreakdownEndpoint(domain: DashboardDomain, groupBy: string) {
  if (domain !== 'so') {
    return {
      path: `/api/dashboard/${domain}/breakdown`,
      includeGroupBy: true,
    };
  }

  if (groupBy === 'sostatusrealisasi') {
    return { path: '/api/dashboard/so/breakdown/realisasi', includeGroupBy: false };
  }
  if (groupBy === 'sobagianpenjualan') {
    return { path: '/api/dashboard/so/breakdown/salesman', includeGroupBy: false };
  }
  if (groupBy === 'socustomer') {
    return { path: '/api/dashboard/so/breakdown/customer', includeGroupBy: false };
  }
  return { path: '/api/dashboard/so/breakdown/status', includeGroupBy: false };
}

export function useLogisticDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [domain, setDomain] = useState<DashboardDomain>(DEFAULT_DOMAIN);
  const [domainOptions, setDomainOptions] = useState<Array<{ value: DashboardDomain; label: string }>>([
    { value: 'm1', label: 'm1' },
    { value: 'm', label: 'm' },
    { value: 'm2r', label: 'm2r' },
    { value: 'so', label: 'so' },
  ]);

  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [groupBy, setGroupBy] = useState<string>('sumber');
  const [sortBy, setSortBy] = useState<string>('id');
  const [metricView, setMetricView] = useState<'totalMetric' | 'totalRows'>('totalMetric');

  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownRow[]>([]);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);

  const [groupByOptions, setGroupByOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [sortByOptions, setSortByOptions] = useState<Array<{ value: string; label: string }>>([]);
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    if (hydratedFromUrl.current || typeof window === 'undefined') {
      return;
    }

    const query = new URLSearchParams(window.location.search);
    const queryDomain = query.get('domain');
    const queryPeriod = query.get('period');
    const queryGroupBy = query.get('groupBy');
    const querySortBy = query.get('sortBy');
    const queryMetricView = query.get('metricView');

    if (queryDomain === 'm1' || queryDomain === 'm' || queryDomain === 'm2r' || queryDomain === 'so') {
      setDomain(queryDomain);
    }
    if (queryPeriod === 'all' || queryPeriod === 'today' || queryPeriod === '7d' || queryPeriod === '30d') {
      setPeriod(queryPeriod);
    }
    if (queryGroupBy) {
      setGroupBy(queryGroupBy);
    }
    if (querySortBy) {
      setSortBy(querySortBy);
    }
    if (queryMetricView === 'totalMetric' || queryMetricView === 'totalRows') {
      setMetricView(queryMetricView);
    }

    hydratedFromUrl.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedFromUrl.current || typeof window === 'undefined') {
      return;
    }

    const query = new URLSearchParams(window.location.search);
    query.set('domain', domain);
    query.set('period', period);
    if (groupBy) {
      query.set('groupBy', groupBy);
    } else {
      query.delete('groupBy');
    }
    if (sortBy) {
      query.set('sortBy', sortBy);
    } else {
      query.delete('sortBy');
    }
    query.set('metricView', metricView);

    const nextUrl = `${window.location.pathname}?${query.toString()}`;
    window.history.replaceState(null, '', nextUrl);
  }, [domain, period, groupBy, sortBy, metricView]);

  const resetFilters = () => {
    const nextDomain = domain;
    const nextPeriod: PeriodFilter = 'all';
    const nextGroupBy = pickPreferred(groupByOptions.map((item) => item.value), DOMAIN_PREFERRED_GROUP_BY[nextDomain], '');
    const nextSortBy = pickPreferred(sortByOptions.map((item) => item.value), DOMAIN_PREFERRED_SORT_BY[nextDomain], '');

    setPeriod(nextPeriod);
    setGroupBy(nextGroupBy);
    setSortBy(nextSortBy);
    setMetricView('totalMetric');
  };

  const fetchDashboardData = async (
    activePeriod: PeriodFilter = period,
    activeGroupBy = groupBy,
    activeDomain: DashboardDomain = domain,
  ) => {
    setLoading(true);
    setError('');

    try {
      const range = resolvePeriodRange(activePeriod);
      const baseQuery = new URLSearchParams({
        fromDate: range.from,
        toDate: range.to,
      });

      const [domainsRes, metadataRes] = await Promise.all([
        fetch('/api/dashboard/domains', { cache: 'no-store' }),
        fetch(`/api/dashboard/${activeDomain}/metadata`, { cache: 'no-store' }),
      ]);

      const [domainsPayload, metadataPayload] = await Promise.all([
        domainsRes.json().catch(() => null),
        metadataRes.json().catch(() => null),
      ]);

      if (!metadataRes.ok || !metadataPayload?.success) {
        throw new Error(metadataPayload?.message || 'Failed to load dashboard metadata');
      }

      if (domainsRes.ok && domainsPayload?.success) {
        const domainsData = (domainsPayload as DomainsResponse).data ?? [];
        const mapped = domainsData
          .map((item) => item.domain)
          .filter((value): value is DashboardDomain => value === 'm1' || value === 'm' || value === 'm2r' || value === 'so')
          .map((value) => ({ value, label: value }));
        if (mapped.length > 0) {
          setDomainOptions(mapped);
        }
      }

      const metadata = (metadataPayload?.data ?? {}) as MetadataResponse;
      const effectiveGroupBy = metadata.effective?.groupBy ?? [];
      const effectiveSortBy = metadata.effective?.sortBy ?? [];

      setGroupByOptions(effectiveGroupBy.map((value) => ({ value, label: value })));
      setSortByOptions(effectiveSortBy.map((value) => ({ value, label: value })));

      const resolvedGroupBy = effectiveGroupBy.includes(activeGroupBy)
        ? activeGroupBy
        : pickPreferred(effectiveGroupBy, DOMAIN_PREFERRED_GROUP_BY[activeDomain], activeGroupBy);

      const resolvedSortBy = effectiveSortBy.includes(sortBy)
        ? sortBy
        : pickPreferred(effectiveSortBy, DOMAIN_PREFERRED_SORT_BY[activeDomain], sortBy);

      if (resolvedGroupBy !== groupBy) {
        setGroupBy(resolvedGroupBy);
      }
      if (resolvedSortBy !== sortBy) {
        setSortBy(resolvedSortBy);
      }

      const breakdownEndpoint = resolveBreakdownEndpoint(activeDomain, resolvedGroupBy);
      const breakdownQuery = new URLSearchParams({
        ...Object.fromEntries(baseQuery.entries()),
      });
      if (breakdownEndpoint.includeGroupBy) {
        breakdownQuery.set('groupBy', resolvedGroupBy);
      }

      const [summaryRes, trendsRes, breakdownRes, tableRes] = await Promise.all([
        fetch(`/api/dashboard/${activeDomain}/summary?${baseQuery.toString()}`, { cache: 'no-store' }),
        fetch(`/api/dashboard/${activeDomain}/trends?${baseQuery.toString()}`, { cache: 'no-store' }),
        fetch(`${breakdownEndpoint.path}?${breakdownQuery.toString()}`, { cache: 'no-store' }),
        fetch(
          `/api/dashboard/${activeDomain}/table?${new URLSearchParams({
            ...Object.fromEntries(baseQuery.entries()),
            page: '1',
            pageSize: '10',
            sortBy: resolvedSortBy,
            sortOrder: 'desc',
          }).toString()}`,
          { cache: 'no-store' },
        ),
      ]);

      const [summaryPayload, trendsPayload, breakdownPayload, tablePayload] = await Promise.all([
        parsePayload<SummaryRow>(summaryRes),
        parsePayload<TrendRow>(trendsRes),
        parsePayload<BreakdownRow>(breakdownRes),
        parsePayload<Record<string, unknown>>(tableRes),
      ]);

      if (!summaryRes.ok || !summaryPayload?.success) {
        throw new Error(summaryPayload?.message || 'Failed to load dashboard summary');
      }
      if (!trendsRes.ok || !trendsPayload?.success) {
        throw new Error(trendsPayload?.message || 'Failed to load dashboard trends');
      }
      if (!breakdownRes.ok || !breakdownPayload?.success) {
        throw new Error(breakdownPayload?.message || 'Failed to load dashboard breakdown');
      }
      if (!tableRes.ok || !tablePayload?.success) {
        throw new Error(tablePayload?.message || 'Failed to load dashboard table');
      }

      const summaryRows = normalizeSummaryRows(activeDomain, summaryPayload.data?.rows ?? []);
      const trendRows = normalizeTrendRows(activeDomain, trendsPayload.data?.rows ?? []);
      const breakdownRows = normalizeBreakdownRows(activeDomain, breakdownPayload.data?.rows ?? []);

      setSummary(summaryRows[0] ?? null);
      setTrends(trendRows);
      setBreakdown(breakdownRows);
      setTableRows(tablePayload.data?.rows ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    domain,
    setDomain,
    domainOptions,
    period,
    setPeriod,
    groupBy,
    setGroupBy,
    sortBy,
    setSortBy,
    metricView,
    setMetricView,
    summary,
    trends,
    breakdown,
    tableRows,
    groupByOptions,
    sortByOptions,
    resetFilters,
    fetchDashboardData,
    totalRows: toNumber(summary?.total_rows),
    totalMetric: fmtNumber(summary?.total_metric, 2),
    avgMetric: fmtNumber(summary?.avg_metric, 2),
    minMetric: fmtNumber(summary?.min_metric, 2),
    maxMetric: fmtNumber(summary?.max_metric, 2),
  };
}
