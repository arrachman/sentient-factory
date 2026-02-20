import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { AuditLogFormState, AuditLogItem } from '@/features/administrator-auditlog/model/types';

export async function fetchAuditLogs(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ApiEnvelope<AuditLogItem[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<AuditLogItem[]>(`/api/audit-logs?${query.toString()}`);
}

export async function createAuditLog(payload: AuditLogFormState): Promise<ApiEnvelope<AuditLogItem>> {
  const body: Record<string, unknown> = {
    action: payload.action.trim(),
    entityType: payload.entityType.trim(),
  };

  if (payload.userId.trim()) {
    const parsedUserId = Number(payload.userId.trim());
    if (!Number.isInteger(parsedUserId) || parsedUserId < 1) {
      throw new Error('User ID must be a positive number');
    }
    body.userId = parsedUserId;
  }

  if (payload.entityId.trim()) {
    body.entityId = payload.entityId.trim();
  }
  if (payload.ipAddress.trim()) {
    body.ipAddress = payload.ipAddress.trim();
  }
  if (payload.userAgent.trim()) {
    body.userAgent = payload.userAgent.trim();
  }
  if (payload.oldData.trim()) {
    body.oldData = JSON.parse(payload.oldData);
  }
  if (payload.newData.trim()) {
    body.newData = JSON.parse(payload.newData);
  }

  return requestJson<AuditLogItem>('/api/audit-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function updateAuditLog(uuid: string, payload: AuditLogFormState): Promise<ApiEnvelope<AuditLogItem>> {
  const body: Record<string, unknown> = {
    action: payload.action.trim(),
    entityType: payload.entityType.trim(),
  };

  if (payload.userId.trim()) {
    const parsedUserId = Number(payload.userId.trim());
    if (!Number.isInteger(parsedUserId) || parsedUserId < 1) {
      throw new Error('User ID must be a positive number');
    }
    body.userId = parsedUserId;
  }

  if (payload.entityId.trim()) {
    body.entityId = payload.entityId.trim();
  }
  if (payload.ipAddress.trim()) {
    body.ipAddress = payload.ipAddress.trim();
  }
  if (payload.userAgent.trim()) {
    body.userAgent = payload.userAgent.trim();
  }
  if (payload.oldData.trim()) {
    body.oldData = JSON.parse(payload.oldData);
  }
  if (payload.newData.trim()) {
    body.newData = JSON.parse(payload.newData);
  }

  return requestJson<AuditLogItem>(`/api/audit-logs/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function deleteAuditLog(uuid: string): Promise<ApiEnvelope<AuditLogItem>> {
  return requestJson<AuditLogItem>(`/api/audit-logs/${uuid}`, {
    method: 'DELETE',
  });
}
