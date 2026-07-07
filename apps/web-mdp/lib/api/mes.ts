// MES execution + shared foundation masters (work centers / shifts / reason
// codes / assets). One file per ISA-95 domain; see ./client for the factory.
import { crudResource } from './client';

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

export const workCenters = crudResource<WorkCenter>('/work-centers');
export const shifts = crudResource<Shift>('/shifts');
export const reasonCodes = crudResource<ReasonCode>('/reason-codes');
export const assets = crudResource<Asset>('/assets');

/** MES execution records — filterable by parent (production order / work center). */
export const productionOrders = crudResource<ProductionOrder>('/production-orders');
export const productionLogs = crudResource<ProductionLog>('/production-logs');
export const downtimeEvents = crudResource<DowntimeEvent>('/downtime-events');
export const operations = crudResource<Operation>('/operations');
export const materialConsumptions = crudResource<MaterialConsumption>('/material-consumptions');
export const laborLogs = crudResource<LaborLog>('/labor-logs');
