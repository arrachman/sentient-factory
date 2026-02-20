import type {
  PermissionFormState,
  PermissionItem,
  PermissionListMeta,
} from '@/features/administrator-permission/model/types';
import { normalizePermissionItem } from '@/features/administrator-permission/model/utils';
import { requestJson } from '@/shared/api/http';

export async function fetchPermissions(params: {
  page: number;
  limit: number;
  search: string;
}): Promise<{ items: PermissionItem[]; meta: PermissionListMeta }> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search.trim()) {
    query.set('search', params.search.trim());
  }

  const payload = await requestJson<PermissionItem[]>(`/api/master-data-permissions?${query.toString()}`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load permissions');
  }

  return {
    items: (Array.isArray(payload.data) ? payload.data : []).map(normalizePermissionItem),
    meta: {
      page: typeof payload.meta?.page === 'number' ? payload.meta.page : params.page,
      totalPages: typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1,
      total: typeof payload.meta?.total === 'number' ? payload.meta.total : 0,
    },
  };
}

function toPermissionPayload(form: PermissionFormState) {
  return {
    name: form.name.trim(),
    module: form.module.trim(),
    action: form.action.trim(),
    description: form.description.trim() || undefined,
  };
}

export async function createPermission(form: PermissionFormState): Promise<PermissionItem> {
  const payload = await requestJson<PermissionItem>('/api/master-data-permissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPermissionPayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save permission');
  }

  return payload.data;
}

export async function updatePermission(uuid: string, form: PermissionFormState): Promise<PermissionItem> {
  const payload = await requestJson<PermissionItem>(`/api/master-data-permissions/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPermissionPayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save permission');
  }

  return payload.data;
}

export async function deletePermission(uuid: string): Promise<void> {
  const payload = await requestJson<PermissionItem>(`/api/master-data-permissions/${uuid}`, {
    method: 'DELETE',
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to delete permission');
  }
}
