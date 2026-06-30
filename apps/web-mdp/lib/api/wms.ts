// WMS execution — physical warehouse work; movements emit to ERP inv_ (decision #3).
import { crudResource } from './client';

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

export const wmsTasks = crudResource<WmsTask>('/wms/tasks');
export const wmsHandlingUnits = crudResource<WmsHandlingUnit>('/wms/handling-units');
export const wmsPicks = crudResource<WmsPick>('/wms/picks');
export const wmsMovements = crudResource<WmsMovement>('/wms/movements');
