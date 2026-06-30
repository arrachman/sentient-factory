// Minimal MDP API client. Same-origin via Next rewrite (/api/mdp/* →
// api-gateway). Reuses ERP auth cookie (erp_token) — credentials included.

const BASE = '/api/mdp';

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListResult<T> {
  data: T[];
  meta: ListMeta;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
    const msg = body?.message ?? body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  return body as T;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/**
 * Generic CRUD client for a list-backed master resource. All MDP foundation
 * masters share the same response envelope (`{ success, data, meta }`) and
 * REST shape, so one factory covers shifts / reason-codes / assets /
 * work-centers without per-resource boilerplate.
 */
export interface CrudResource<T> {
  list(q?: ListQuery & Record<string, unknown>): Promise<{ success: boolean } & ListResult<T>>;
  create(payload: Record<string, unknown>): Promise<{ success: boolean; data: T }>;
  update(id: string, payload: Record<string, unknown>): Promise<{ success: boolean; data: T }>;
  remove(id: string): Promise<{ success: boolean; message?: string }>;
}

export function crudResource<T>(path: string): CrudResource<T> {
  return {
    list(q = {}) {
      return request<{ success: boolean } & ListResult<T>>(`${path}${qs(q)}`);
    },
    create(payload) {
      return request<{ success: boolean; data: T }>(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    update(id, payload) {
      return request<{ success: boolean; data: T }>(`${path}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    remove(id) {
      return request<{ success: boolean; message?: string }>(`${path}/${id}`, { method: 'DELETE' });
    },
  };
}
