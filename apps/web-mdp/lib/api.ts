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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message ?? body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  return body as T;
}

export type MesOrderStatus =
  | 'RELEASED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export interface WorkCenter {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface ProductionOrder {
  id: string;
  code: string;
  itemId: string;
  plannedQty: string;
  producedGoodQty: string;
  producedScrapQty: string;
  uomCode: string | null;
  status: MesOrderStatus;
  plannedStartAt: string | null;
  plannedEndAt: string | null;
  notes: string | null;
  workCenter: { id: string; code: string; name: string } | null;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const api = {
  listWorkCenters(q: ListQuery = {}) {
    return request<{ success: boolean } & ListResult<WorkCenter>>(
      `/work-centers${qs({ limit: 100, sortBy: 'name', sortDir: 'asc', ...q } as Record<string, unknown>)}`
    );
  },
  listProductionOrders(q: ListQuery & { status?: string; workCenterId?: string } = {}) {
    return request<{ success: boolean } & ListResult<ProductionOrder>>(
      `/production-orders${qs(q as Record<string, unknown>)}`
    );
  },
  createProductionOrder(payload: Record<string, unknown>) {
    return request<{ success: boolean; data: ProductionOrder }>(`/production-orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
