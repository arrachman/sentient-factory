/**
 * Audit log API wrapper.
 *
 * Endpoint: GET /clinic/audit (NestJS @Controller('clinic/audit'))
 * Auth: JWT cookie (forwarded automatically via apiClient credentials).
 * Roles: clinic-admin | clinic-owner only.
 */
import { apiClient } from '@/lib/api-client';
import type { AuditListResponse } from '../model/types';

export type AuditQuery = {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
  userId?: number;
};

export const auditApi = {
  list(query: AuditQuery = {}): Promise<AuditListResponse> {
    const params = new URLSearchParams();
    params.set('limit', String(query.limit ?? 200));
    if (query.page) params.set('page', String(query.page));
    if (query.entityType) params.set('entityType', query.entityType);
    if (query.action) params.set('action', query.action);
    if (query.userId) params.set('userId', String(query.userId));
    return apiClient.get<AuditListResponse>(`/audit?${params.toString()}`);
  },
};
