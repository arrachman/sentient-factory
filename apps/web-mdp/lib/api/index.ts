// MDP API barrel — preserves the single `@/lib/api` import surface while the
// implementation is split per ISA-95 domain (see ./client + ./<domain>).
export * from './client';
export * from './mes';
export * from './foundation';
export * from './wms';
export * from './qms';
export * from './mnt';
export * from './ext';
export * from './oee';

import { ListQuery, ListResult, qs, request } from './client';
import { ProductionOrder, workCenters } from './mes';

export const api = {
  listWorkCenters(q: ListQuery = {}) {
    return workCenters.list({ limit: 100, sortBy: 'name', sortDir: 'asc', ...q });
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
