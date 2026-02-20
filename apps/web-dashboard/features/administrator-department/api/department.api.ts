import type {
  DepartmentFormState,
  DepartmentItem,
  DepartmentListMeta,
} from '@/features/administrator-department/model/types';
import { normalizeDepartmentItem } from '@/features/administrator-department/model/utils';
import { requestJson } from '@/shared/api/http';

export async function fetchDepartments(params: {
  page: number;
  limit: number;
  search: string;
}): Promise<{ items: DepartmentItem[]; meta: DepartmentListMeta }> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search.trim()) {
    query.set('search', params.search.trim());
  }

  const payload = await requestJson<DepartmentItem[]>(`/api/departments?${query.toString()}`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load departments');
  }

  const page = typeof payload.meta?.page === 'number' ? payload.meta.page : params.page;
  const totalPages = typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1;
  const total = typeof payload.meta?.total === 'number' ? payload.meta.total : 0;

  return {
    items: (Array.isArray(payload.data) ? payload.data : []).map(normalizeDepartmentItem),
    meta: {
      page,
      totalPages,
      total,
    },
  };
}

function toDepartmentPayload(form: DepartmentFormState): Record<string, unknown> {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    parentId: form.parentId.trim() ? Number(form.parentId) : null,
  };
}

export async function createDepartment(form: DepartmentFormState): Promise<DepartmentItem> {
  const payload = await requestJson<DepartmentItem>('/api/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toDepartmentPayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save department');
  }

  return payload.data;
}

export async function updateDepartment(uuid: string, form: DepartmentFormState): Promise<DepartmentItem> {
  const payload = await requestJson<DepartmentItem>(`/api/departments/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toDepartmentPayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save department');
  }

  return payload.data;
}

export async function deleteDepartment(uuid: string): Promise<void> {
  const payload = await requestJson<DepartmentItem>(`/api/departments/${uuid}`, {
    method: 'DELETE',
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to delete department');
  }
}
