/**
 * Pure async API helpers untuk Administrator Menu.
 * Dipisah dari hook utama (`use-administrator-menu-page.ts`) supaya hook tetap
 * ringkas dan helper bisa di-unit-test tanpa wrap React.
 */
import type {
  AdministratorMenu,
  AdministratorMenuFormState,
} from '@/features/administrator-menu/model/types';

export type MenuListResponse = {
  success?: boolean;
  message?: string;
  data?: AdministratorMenu[];
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
};

export type MenuMutationResponse = {
  success?: boolean;
  message?: string;
};

export type MenuDetailResponse = {
  success?: boolean;
  message?: string;
  data?: AdministratorMenu;
};

type HeadersLike = HeadersInit | undefined;

export type FetchMenuListArgs = {
  page: number;
  limit: number;
  search?: string;
  parentFilter?: string;
  headers?: HeadersLike;
};

export async function fetchMenuList({
  page,
  limit,
  search,
  parentFilter,
  headers,
}: FetchMenuListArgs): Promise<MenuListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    includeInactive: 'true',
  });

  if (search?.trim()) {
    query.set('search', search.trim());
  }
  if (parentFilter && parentFilter !== 'all') {
    query.set('groupId', parentFilter);
  }

  const response = await fetch(`/api/menus?${query.toString()}`, {
    cache: 'no-store',
    headers,
  });
  const payload = (await response.json().catch(() => null)) as MenuListResponse | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Failed to load menu data');
  }

  return payload;
}

export async function fetchParentMenus(
  headers?: HeadersLike,
): Promise<MenuListResponse | null> {
  const response = await fetch(
    '/api/menus?page=1&limit=100&includeInactive=true',
    {
      cache: 'no-store',
      headers,
    },
  );
  const payload = (await response.json().catch(() => null)) as MenuListResponse | null;
  if (!response.ok || !payload?.success) {
    return null;
  }
  return payload;
}

export async function fetchMenuDetail(
  id: number,
  headers?: HeadersLike,
): Promise<AdministratorMenu> {
  const response = await fetch(`/api/menus/${id}`, {
    cache: 'no-store',
    headers,
  });
  const payload = (await response.json().catch(() => null)) as MenuDetailResponse | null;

  if (!response.ok || !payload?.success || !payload?.data) {
    throw new Error(payload?.message || 'Failed to load menu detail');
  }

  return payload.data;
}

export function buildSavePayload(
  form: AdministratorMenuFormState,
  editingId: string | null,
) {
  const payload: Record<string, unknown> = {
    key: form.key.trim(),
    title: form.title.trim(),
    type: form.type.trim(),
    parentId: form.parentId ? Number(form.parentId) : null,
    sortOrder: Number(form.sortOrder || 0),
    isVisible: form.isVisible,
    isActive: form.isActive,
  };

  if (form.path.trim()) {
    payload.path = form.path.trim();
  } else if (editingId) {
    payload.path = null;
  }

  if (form.icon.trim()) {
    payload.icon = form.icon.trim();
  } else if (editingId) {
    payload.icon = null;
  }

  if (form.permissionName.trim()) {
    payload.permissionName = form.permissionName.trim();
  } else if (editingId) {
    payload.permissionName = null;
  }

  return payload;
}

export async function saveMenu(
  form: AdministratorMenuFormState,
  editingId: string | null,
  headers?: HeadersLike,
): Promise<MenuMutationResponse> {
  const endpoint = editingId ? `/api/menus/${editingId}` : '/api/menus';
  const method = editingId ? 'PATCH' : 'POST';
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    body: JSON.stringify(buildSavePayload(form, editingId)),
  });
  const result = (await response.json().catch(() => null)) as MenuMutationResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to save menu');
  }
  return result;
}

export async function deleteMenu(
  id: number,
  headers?: HeadersLike,
): Promise<MenuMutationResponse> {
  const response = await fetch(`/api/menus/${id}`, {
    method: 'DELETE',
    headers,
  });
  const result = (await response.json().catch(() => null)) as MenuMutationResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to delete menu');
  }
  return result;
}

export type BatchSortItem = {
  id: number;
  sortOrder: number;
  path: string;
};

export async function batchSortMenus(
  items: BatchSortItem[],
  headers?: HeadersLike,
): Promise<MenuMutationResponse> {
  const response = await fetch('/api/menus/sort-batch', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    body: JSON.stringify({ items }),
  });
  const result = (await response.json().catch(() => null)) as MenuMutationResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to update menu sort order');
  }
  return result;
}

export type SortPathDraftChange = {
  id: number;
  sortOrder: number;
  path: string;
};

export function buildBatchSortDiff(
  items: AdministratorMenu[],
  sortDrafts: Record<number, string>,
  pathDrafts: Record<number, string>,
): SortPathDraftChange[] {
  return items
    .map((item) => ({
      id: item.id,
      originalSortOrder: item.sortOrder ?? 0,
      nextSortOrder: Number(sortDrafts[item.id] ?? item.sortOrder ?? 0),
      originalPath: item.path ?? '',
      nextPath: pathDrafts[item.id] ?? item.path ?? '',
    }))
    .filter(
      (item) =>
        Number.isInteger(item.nextSortOrder) && item.nextSortOrder >= 0,
    )
    .filter(
      (item) =>
        item.originalSortOrder !== item.nextSortOrder ||
        item.originalPath !== item.nextPath,
    )
    .map((item) => ({
      id: item.id,
      sortOrder: item.nextSortOrder,
      path: item.nextPath,
    }));
}
