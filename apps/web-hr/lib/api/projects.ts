// HR Projects & activity time (/api/hr/projects, /api/hr/project-time)
import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface HrProject {
  id: string;
  code: string;
  name: string;
  clientName?: string | null;
  isBillable: boolean;
  isActive: boolean;
}

export interface CreateProjectPayload {
  code: string;
  name: string;
  clientName?: string;
  isBillable?: boolean;
  isActive?: boolean;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface HrProjectTimeEntry {
  id: string;
  userId: string;
  projectId: string;
  workDate: string;
  minutes: number;
  activity?: string | null;
  note?: string | null;
  projectCode?: string;
  projectName?: string;
  isBillable?: boolean;
  employeeCode?: string | null;
  fullName?: string | null;
  username?: string;
}

export interface ProjectTimeQuery {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  projectId?: number;
}

export interface ProjectTimePayload {
  data?: HrProjectTimeEntry[];
  meta?: { total: number; page: number; limit: number };
}

export interface CreateProjectTimePayload {
  projectId: number;
  workDate: string;
  minutes: number;
  activity?: string;
  note?: string;
}

export async function listProjects(): Promise<HrProject[] | { data: HrProject[] }> {
  return apiGet('/hr/projects');
}

export async function createProject(payload: CreateProjectPayload): Promise<{ id: string }> {
  return apiPost('/hr/projects', payload);
}

export async function updateProject(
  id: string,
  payload: UpdateProjectPayload,
): Promise<{ id: string }> {
  return apiPatch(`/hr/projects/${id}`, payload);
}

export async function deleteProject(id: string): Promise<void> {
  await apiDelete<void>(`/hr/projects/${id}`);
}

export async function listProjectTime(query?: ProjectTimeQuery): Promise<ProjectTimePayload> {
  return apiGet<ProjectTimePayload>(
    '/hr/project-time',
    query as Record<string, string | number | undefined>,
  );
}

export async function createProjectTime(
  payload: CreateProjectTimePayload,
): Promise<{ id: string }> {
  return apiPost('/hr/project-time', payload);
}

export async function deleteProjectTime(id: string): Promise<void> {
  await apiDelete<void>(`/hr/project-time/${id}`);
}
