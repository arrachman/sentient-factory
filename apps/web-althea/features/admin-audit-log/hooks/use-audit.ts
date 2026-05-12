'use client';

import { useQuery } from '@tanstack/react-query';
import { auditApi, type AuditQuery } from '../api/audit.api';
import { toEvent, type AuditEvent } from '../model/types';

/**
 * useAuditLogs — paginated list of audit rows mapped to UI events.
 *
 * Default limit 200 (matches backend `Math.min(limit, 200)` cap).
 * Refetch interval bisa ditambah kalau dibutuhkan; saat ini manual.
 */
export function useAuditLogs(query: AuditQuery = {}) {
  return useQuery({
    queryKey: ['clinic', 'audit', query],
    queryFn: () => auditApi.list(query),
    staleTime: 30_000,
    select: (resp) => ({
      ...resp,
      events: resp.data.map<AuditEvent>(toEvent),
    }),
  });
}
