import type {
  AdministratorUser,
  RoleApiItem,
  UserFormState,
  UserListMeta,
  WarehouseApiItem,
  WarehouseOption,
} from '@/features/administrator-users/model/types';
import { normalizeUser, toEntityId } from '@/features/administrator-users/model/utils';
import { requestJson } from '@/shared/api/http';

export async function fetchUsers(params: {
  page: number;
  limit: number;
  search: string;
}): Promise<{ items: AdministratorUser[]; meta: UserListMeta }> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    isActive: 'true',
  });

  if (params.search.trim()) {
    query.set('search', params.search.trim());
  }

  const payload = await requestJson<AdministratorUser[]>(`/api/users?${query.toString()}`);
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load users');
  }

  return {
    items: (Array.isArray(payload.data) ? payload.data : []).map(normalizeUser),
    meta: {
      page: typeof payload.meta?.page === 'number' ? payload.meta.page : params.page,
      totalPages: typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1,
      total: typeof payload.meta?.total === 'number' ? payload.meta.total : 0,
    },
  };
}

export async function fetchWarehouseOptions(): Promise<WarehouseOption[]> {
  const payload = await requestJson<WarehouseApiItem[]>('/api/master-data-warehouses?page=1&limit=100');
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load warehouses');
  }

  return (Array.isArray(payload.data) ? payload.data : []).map((item) => ({
    value: String(item.id ?? item.uuid ?? ''),
    label: String(item.locationName || item.name || item.id || item.uuid || ''),
  }));
}

export async function fetchRoleOptions(): Promise<WarehouseOption[]> {
  const payload = await requestJson<RoleApiItem[]>('/api/master-data-roles?page=1&limit=100&includeSystem=true');
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load roles');
  }

  return (Array.isArray(payload.data) ? payload.data : []).map((item) => ({
    value: String(item.id ?? item.uuid ?? ''),
    label: String(item.name || item.id || item.uuid || ''),
  }));
}

export async function fetchDefaultWarehouseId(): Promise<string> {
  const payload = await requestJson<Record<string, unknown>>('/api/auth/me');
  if (!payload.success) {
    throw new Error(payload.message || 'Failed to load profile');
  }

  const data = payload.data ?? {};
  const rawWarehouseId =
    data.warehouseId ??
    (data.user as Record<string, unknown> | undefined)?.warehouseId ??
    (data.warehouse as Record<string, unknown> | undefined)?.id ??
    ((data.user as Record<string, unknown> | undefined)?.warehouse as Record<string, unknown> | undefined)?.id ??
    (data.warehouse as Record<string, unknown> | undefined)?.uuid ??
    ((data.user as Record<string, unknown> | undefined)?.warehouse as Record<string, unknown> | undefined)?.uuid ??
    null;

  return toEntityId(rawWarehouseId);
}

function toCreatePayload(form: UserFormState): Record<string, unknown> {
  return {
    email: form.email.trim(),
    username: form.username.trim(),
    fullName: form.fullName.trim() || undefined,
    password: form.password.trim(),
    roleIds: form.roleIds,
    warehouseId: form.warehouseId.trim(),
    isActive: form.isActive,
  };
}

function toUpdatePayload(form: UserFormState): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    email: form.email.trim(),
    username: form.username.trim(),
    fullName: form.fullName.trim() || undefined,
    roleIds: form.roleIds,
    warehouseId: form.warehouseId.trim(),
    isActive: form.isActive,
  };

  if (form.password.trim()) {
    payload.password = form.password.trim();
  }

  return payload;
}

export async function createUser(form: UserFormState): Promise<AdministratorUser> {
  const payload = await requestJson<AdministratorUser>('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toCreatePayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save user');
  }

  return payload.data;
}

export async function updateUser(uuid: string, form: UserFormState): Promise<AdministratorUser> {
  const payload = await requestJson<AdministratorUser>(`/api/users/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toUpdatePayload(form)),
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to save user');
  }

  return payload.data;
}

export async function deleteUser(uuid: string): Promise<void> {
  const payload = await requestJson<AdministratorUser>(`/api/users/${uuid}`, {
    method: 'DELETE',
  });

  if (!payload.success) {
    throw new Error(payload.message || 'Failed to delete user');
  }
}
