import { requestJson } from '@/shared/api/http';
import type { ApiEnvelope } from '@/shared/types/api';
import type { AdministratorSession } from '@/features/administrator-session/model/types';

export async function fetchSessions(params: {
  page: number;
  limit: number;
  search?: string;
  userId?: string;
}): Promise<ApiEnvelope<AdministratorSession[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.userId?.trim()) {
    query.set('userId', params.userId.trim());
  }

  return requestJson<AdministratorSession[]>(`/api/sessions?${query.toString()}`);
}

export async function deleteSession(uuid: string): Promise<ApiEnvelope<AdministratorSession>> {
  return requestJson<AdministratorSession>(`/api/sessions/${uuid}`, {
    method: 'DELETE',
  });
}
