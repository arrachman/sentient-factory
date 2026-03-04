import type {
  MenuOptionItem,
  PermissionItem,
  RoleFormState,
  RoleItem,
  RoleListMeta,
} from '@/features/administrator-role/model/types';
import { normalizeRoleItem } from '@/features/administrator-role/model/utils';
import { requestJson } from '@/shared/api/http';

export async function fetchRoles(params: {
  page: number;
  limit: number;
  search: string;
}): Promise<{ items: RoleItem[]; meta: RoleListMeta }> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search.trim()) {
    query.set('search', params.search.trim());
  }

  const payload = await requestJson<RoleItem[]>(`/api/master-data-roles?${query.toString()}`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load roles');
  }

  return {
    items: (Array.isArray(payload.data) ? payload.data : []).map(normalizeRoleItem),
    meta: {
      page: typeof payload.meta?.page === 'number' ? payload.meta.page : params.page,
      totalPages: typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1,
      total: typeof payload.meta?.total === 'number' ? payload.meta.total : 0,
    },
  };
}

export async function fetchPermissionOptions(): Promise<PermissionItem[]> {
  const payload = await requestJson<PermissionItem[]>('/api/master-data-permissions?page=1&limit=100');
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load permissions');
  }

  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchMenuOptions(): Promise<MenuOptionItem[]> {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const all: MenuOptionItem[] = [];

  do {
    const payload = await requestJson<MenuOptionItem[]>(`/api/menus?page=${page}&limit=${limit}`);
    if (!payload.success) {
      throw new Error(payload.message || 'Failed to load menus');
    }
    all.push(...(Array.isArray(payload.data) ? payload.data : []));
    totalPages = typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export async function createRole(form: RoleFormState): Promise<RoleItem> {
  const payload = await requestJson<RoleItem>('/api/master-data-roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      isSystem: form.isSystem,
    }),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save role');
  }

  return payload.data;
}

export async function updateRole(uuid: string, form: RoleFormState): Promise<RoleItem> {
  const payload = await requestJson<RoleItem>(`/api/master-data-roles/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      isSystem: form.isSystem,
    }),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save role');
  }

  return payload.data;
}

export async function deleteRole(uuid: string): Promise<void> {
  const payload = await requestJson<RoleItem>(`/api/master-data-roles/${uuid}`, {
    method: 'DELETE',
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to delete role');
  }
}

export async function fetchRolePermissionIds(uuid: string): Promise<number[]> {
  const payload = await requestJson<{ permissionIds?: unknown[] }>(`/api/master-data-roles/${uuid}/permissions`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load role permissions');
  }

  const ids = Array.isArray(payload.data?.permissionIds)
    ? payload.data.permissionIds
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    : [];

  return Array.from(new Set(ids));
}

export async function updateRolePermissions(uuid: string, permissionIds: number[]): Promise<void> {
  const payload = await requestJson<unknown>(`/api/master-data-roles/${uuid}/permissions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissionIds }),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to update role permissions');
  }
}

export async function fetchRoleMenuIds(uuid: string): Promise<number[]> {
  const payload = await requestJson<{ menuIds?: unknown[] }>(`/api/master-data-roles/${uuid}/menus`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load role menus');
  }

  const ids = Array.isArray(payload.data?.menuIds)
    ? payload.data.menuIds
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    : [];

  return Array.from(new Set(ids));
}

export async function updateRoleMenus(uuid: string, menuIds: number[]): Promise<void> {
  const payload = await requestJson<unknown>(`/api/master-data-roles/${uuid}/menus`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menuIds }),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to update role menus');
  }
}
