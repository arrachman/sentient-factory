import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { AdministratorSession, SessionFormState, UserApiItem } from '@/features/administrator-session/model/types';
import { fromDatetimeLocal } from '@/features/administrator-session/model/utils';

export async function fetchSessions(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ApiEnvelope<AdministratorSession[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<AdministratorSession[]>(`/api/sessions?${query.toString()}`);
}

export async function fetchSessionUsers(): Promise<ApiEnvelope<UserApiItem[]>> {
  return requestJson<UserApiItem[]>('/api/users?page=1&limit=100');
}

export async function createSession(payload: SessionFormState): Promise<ApiEnvelope<AdministratorSession>> {
  return requestJson<AdministratorSession>('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: payload.userId.trim(),
      token: payload.token.trim(),
      expiresAt: fromDatetimeLocal(payload.expiresAt),
      ipAddress: payload.ipAddress.trim() || undefined,
      userAgent: payload.userAgent.trim() || undefined,
    }),
  });
}

export async function updateSession(uuid: string, payload: SessionFormState): Promise<ApiEnvelope<AdministratorSession>> {
  return requestJson<AdministratorSession>(`/api/sessions/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: payload.userId.trim(),
      token: payload.token.trim(),
      expiresAt: fromDatetimeLocal(payload.expiresAt),
      ipAddress: payload.ipAddress.trim() || undefined,
      userAgent: payload.userAgent.trim() || undefined,
    }),
  });
}

export async function deleteSession(uuid: string): Promise<ApiEnvelope<AdministratorSession>> {
  return requestJson<AdministratorSession>(`/api/sessions/${uuid}`, {
    method: 'DELETE',
  });
}
