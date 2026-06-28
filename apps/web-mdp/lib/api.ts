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
  assetId: string | null;
  idealCycleSeconds: string | null;
  isActive: boolean;
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export type ReasonCodeCategory = 'DOWNTIME' | 'SCRAP' | 'DELAY' | 'QUALITY' | 'OTHER';

export interface ReasonCode {
  id: string;
  code: string;
  name: string;
  category: ReasonCodeCategory;
  isActive: boolean;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  erpFixedAssetId: string | null;
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

export type MesPostingStatus = 'PENDING' | 'POSTED' | 'FAILED';

export interface ProductionLog {
  id: string;
  productionOrderId: string;
  operationId: string | null;
  shiftId: string | null;
  operatorId: string | null;
  goodQty: string;
  scrapQty: string;
  reworkQty: string;
  scrapReasonId: string | null;
  startedAt: string;
  endedAt: string | null;
  postingStatus: MesPostingStatus;
  notes: string | null;
  scrapReason: { id: string; code: string; name: string } | null;
  productionOrder?: { id: string; code: string } | null;
}

export type DowntimeType = 'PLANNED' | 'UNPLANNED';

export interface DowntimeEvent {
  id: string;
  workCenterId: string;
  reasonId: string;
  productionOrderId: string | null;
  operationId: string | null;
  assetId: string | null;
  type: DowntimeType;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: string | null;
  reportedById: string | null;
  notes: string | null;
  workCenter: { id: string; code: string; name: string } | null;
  reason: { id: string; code: string; name: string } | null;
}

export type MesOperationStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

export interface Operation {
  id: string;
  productionOrderId: string;
  sequence: number;
  name: string;
  workCenterId: string;
  status: MesOperationStatus;
  plannedQty: string | null;
  goodQty: string;
  scrapQty: string;
  startedAt: string | null;
  completedAt: string | null;
  productionOrder?: { id: string; code: string } | null;
  workCenter: { id: string; code: string; name: string } | null;
}

export interface MaterialConsumption {
  id: string;
  productionOrderId: string;
  operationId: string | null;
  itemId: string;
  qty: string;
  uomCode: string | null;
  sourceBinId: string | null;
  postingStatus: MesPostingStatus;
  consumedAt: string;
  productionOrder?: { id: string; code: string } | null;
}

export interface LaborLog {
  id: string;
  operationId: string;
  operatorId: string;
  shiftId: string | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: string | null;
  operation: { id: string; name: string; sequence: number } | null;
  shift: { id: string; code: string; name: string } | null;
}

export interface WorkCalendar {
  id: string;
  code: string;
  name: string;
  description: string | null;
  workCenterId: string | null;
  shiftId: string | null;
  plannedMinutesPerDay: string;
  workingDaysPerWeek: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface Menu {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  path: string | null;
  icon: string | null;
  moduleKey: string | null;
  sequence: number;
  isActive: boolean;
  parent?: { id: string; code: string; name: string } | null;
}

export interface RoleMenu {
  id: string;
  roleId: string;
  menuId: string;
  canView: boolean;
  canEdit: boolean;
  menu?: { id: string; code: string; name: string; path: string | null } | null;
}

export type WmsTaskType = 'PUTAWAY' | 'PICK' | 'MOVE' | 'COUNT' | 'REPLENISH';
export type WmsTaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type WmsPostingStatus = 'PENDING' | 'POSTED' | 'FAILED';
export type WmsHandlingUnitStatus = 'OPEN' | 'CLOSED' | 'SHIPPED';

export interface WmsTask {
  id: string;
  code: string;
  type: WmsTaskType;
  status: WmsTaskStatus;
  itemId: string | null;
  qty: string | null;
  uomCode: string | null;
  sourceBinId: string | null;
  destBinId: string | null;
  productionOrderId: string | null;
  assignedToId: string | null;
  priority: number;
  notes: string | null;
  isActive: boolean;
}

export interface WmsHandlingUnit {
  id: string;
  code: string;
  status: WmsHandlingUnitStatus;
  currentBinId: string | null;
  notes: string | null;
  isActive: boolean;
}

export interface WmsPick {
  id: string;
  taskId: string;
  itemId: string;
  qtyRequested: string;
  qtyPicked: string;
  sourceBinId: string | null;
  handlingUnitId: string | null;
  status: WmsTaskStatus;
  notes: string | null;
  handlingUnit?: { id: string; code: string } | null;
}

export interface WmsMovement {
  id: string;
  code: string;
  taskId: string | null;
  itemId: string;
  qty: string;
  uomCode: string | null;
  fromBinId: string | null;
  toBinId: string | null;
  handlingUnitId: string | null;
  movedAt: string;
  movedById: string | null;
  postingStatus: WmsPostingStatus;
  notes: string | null;
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

function crudResource<T>(path: string): CrudResource<T> {
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

export const workCenters = crudResource<WorkCenter>('/work-centers');
export const shifts = crudResource<Shift>('/shifts');
export const reasonCodes = crudResource<ReasonCode>('/reason-codes');
export const assets = crudResource<Asset>('/assets');

/** MES execution records — filterable by parent (production order / work center). */
export const productionLogs = crudResource<ProductionLog>('/production-logs');
export const downtimeEvents = crudResource<DowntimeEvent>('/downtime-events');
export const operations = crudResource<Operation>('/operations');
export const materialConsumptions = crudResource<MaterialConsumption>('/material-consumptions');
export const laborLogs = crudResource<LaborLog>('/labor-logs');

/** mdp foundation — work calendars (OEE availability), nav SSOT, access map. */
export const workCalendars = crudResource<WorkCalendar>('/work-calendars');
export const menus = crudResource<Menu>('/menus');
export const roleMenus = crudResource<RoleMenu>('/role-menus');

/** WMS execution — physical warehouse work; movements emit to ERP inv_ (decision #3). */
export const wmsTasks = crudResource<WmsTask>('/wms/tasks');
export const wmsHandlingUnits = crudResource<WmsHandlingUnit>('/wms/handling-units');
export const wmsPicks = crudResource<WmsPick>('/wms/picks');
export const wmsMovements = crudResource<WmsMovement>('/wms/movements');

export interface NavNode {
  id: string;
  parentId: string | null;
  code: string;
  name: string;
  path: string | null;
  icon: string | null;
  moduleKey: string | null;
  sequence: number;
  children: NavNode[];
}

/** Role-filtered navigation tree for the current user (mdp_menus + mdp_role_menus). */
export function fetchNav() {
  return request<{ success: boolean; data: NavNode[] }>('/menus/nav');
}

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
