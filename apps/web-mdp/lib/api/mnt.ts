// CMMS — maintenance; spare consumption emits ERP inv_ issue (decision #3 stub).
import { crudResource } from './client';

export type MntWorkOrderType = 'CORRECTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'INSPECTION';
export type MntWorkOrderStatus =
  | 'OPEN'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';
export type MntPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MntPmTriggerType = 'TIME_BASED' | 'METER_BASED';
export type MntFailureCodeType = 'FAILURE' | 'CAUSE' | 'REMEDY';
export type MntPostingStatus = 'PENDING' | 'POSTED' | 'FAILED';

export interface MntWorkOrder {
  id: string;
  code: string;
  name: string;
  type: MntWorkOrderType;
  status: MntWorkOrderStatus;
  priority: MntPriority;
  assetId: string | null;
  workCenterId: string | null;
  pmScheduleId: string | null;
  failureCodeId: string | null;
  description: string | null;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  downtimeMinutes: string | null;
  reportedById: string | null;
  assignedToId: string | null;
  notes: string | null;
  pmSchedule?: { id: string; code: string } | null;
  failureCode?: { id: string; code: string } | null;
}

export interface MntPmSchedule {
  id: string;
  code: string;
  name: string;
  assetId: string | null;
  workCenterId: string | null;
  triggerType: MntPmTriggerType;
  intervalDays: number | null;
  meterType: string | null;
  meterInterval: string | null;
  lastServiceAt: string | null;
  nextDueAt: string | null;
  taskDescription: string | null;
  isActive: boolean;
}

export interface MntFailureCode {
  id: string;
  code: string;
  name: string;
  type: MntFailureCodeType;
  description: string | null;
  isActive: boolean;
}

export interface MntSparePart {
  id: string;
  workOrderId: string;
  itemId: string;
  qty: string;
  uomCode: string | null;
  postingStatus: MntPostingStatus;
  notes: string | null;
}

export const mntWorkOrders = crudResource<MntWorkOrder>('/mnt/work-orders');
export const mntPmSchedules = crudResource<MntPmSchedule>('/mnt/pm-schedules');
export const mntFailureCodes = crudResource<MntFailureCode>('/mnt/failure-codes');
export const mntSpareParts = crudResource<MntSparePart>('/mnt/spare-parts');
