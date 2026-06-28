// HR Worksites & Geofences — /api/hr/worksites
import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface HrWorksite {
  id: string;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorksitePayload {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive?: boolean;
}

export type UpdateWorksitePayload = Partial<CreateWorksitePayload>;

export interface WorksiteQuery {
  page?: number;
  limit?: number;
  search?: string;
}

/** Backend may return an array or a { data } envelope — callers normalize. */
export async function listWorksites(
  query?: WorksiteQuery,
): Promise<HrWorksite[] | { data: HrWorksite[] }> {
  return apiGet('/hr/worksites', query as Record<string, string | number | undefined>);
}

export async function createWorksite(payload: CreateWorksitePayload): Promise<HrWorksite> {
  return apiPost<HrWorksite>('/hr/worksites', payload);
}

export async function updateWorksite(
  id: string,
  payload: UpdateWorksitePayload,
): Promise<HrWorksite> {
  return apiPatch<HrWorksite>(`/hr/worksites/${id}`, payload);
}

export async function deleteWorksite(id: string): Promise<void> {
  await apiDelete<void>(`/hr/worksites/${id}`);
}
