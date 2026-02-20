import { useMemo, useState } from 'react';
import {
  type InboundRow,
  type ListResponse,
  type OutboundRow,
  type PeriodFilter,
  resolvePeriodRange,
} from '@/app/(layouts)/app/model/logistic-dashboard';

function getTokenFromCookie() {
  return (
    document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('sf_token='))
      ?.slice('sf_token='.length) || ''
  );
}

export function useLogisticDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<PeriodFilter>('7d');

  const [inboundRows, setInboundRows] = useState<InboundRow[]>([]);
  const [outboundRows, setOutboundRows] = useState<OutboundRow[]>([]);
  const [inboundTotal, setInboundTotal] = useState(0);
  const [outboundTotal, setOutboundTotal] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const inboundPosted = useMemo(() => inboundRows.filter((row) => row.status === 'POSTED').length, [inboundRows]);
  const inboundCancelled = useMemo(() => inboundRows.filter((row) => row.status === 'CANCELLED').length, [inboundRows]);
  const outboundInProgress = useMemo(
    () => outboundRows.filter((row) => row.status === 'SHIPPED' || row.status === 'DRAFT').length,
    [outboundRows],
  );
  const outboundClosed = useMemo(() => outboundRows.filter((row) => row.status === 'CLOSED').length, [outboundRows]);

  const fetchDashboardData = async (activePeriod: PeriodFilter = period) => {
    setLoading(true);
    setError('');
    try {
      const headers = token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined;
      const range = resolvePeriodRange(activePeriod);
      const inboundQuery = new URLSearchParams({
        page: '1',
        limit: '10',
        transactionDateFrom: range.from,
        transactionDateTo: range.to,
      });
      const outboundQuery = new URLSearchParams({
        page: '1',
        limit: '10',
        doDateFrom: range.from,
        doDateTo: range.to,
      });

      const [inboundRes, outboundRes] = await Promise.all([
        fetch(`/api/inbounds?${inboundQuery.toString()}`, {
          cache: 'no-store',
          headers,
        }),
        fetch(`/api/outbound?${outboundQuery.toString()}`, {
          cache: 'no-store',
          headers,
        }),
      ]);

      const [inboundPayload, outboundPayload] = await Promise.all([
        inboundRes.json().catch(() => null),
        outboundRes.json().catch(() => null),
      ]);

      if (!inboundRes.ok || !inboundPayload?.success) {
        throw new Error(inboundPayload?.message || 'Failed to load inbound data');
      }
      if (!outboundRes.ok || !outboundPayload?.success) {
        throw new Error(outboundPayload?.message || 'Failed to load outbound data');
      }

      const inboundData = inboundPayload as ListResponse<InboundRow>;
      const outboundData = outboundPayload as ListResponse<OutboundRow>;

      setInboundRows(Array.isArray(inboundData.data) ? inboundData.data : []);
      setOutboundRows(Array.isArray(outboundData.data) ? outboundData.data : []);
      setInboundTotal(Number(inboundData.meta?.total ?? 0));
      setOutboundTotal(Number(outboundData.meta?.total ?? 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    period,
    setPeriod,
    inboundRows,
    outboundRows,
    inboundTotal,
    outboundTotal,
    inboundPosted,
    inboundCancelled,
    outboundInProgress,
    outboundClosed,
    fetchDashboardData,
  };
}
