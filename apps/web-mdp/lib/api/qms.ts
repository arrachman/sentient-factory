// QMS — quality results vs MES/ERP; flags dispositions, does not post stock.
import { crudResource } from './client';

export type QmsInspectionType = 'INCOMING' | 'IN_PROCESS' | 'FINAL';
export type QmsInspectionVerdict = 'PENDING' | 'PASS' | 'FAIL';
export type QmsCharacteristicType = 'VARIABLE' | 'ATTRIBUTE';
export type QmsResultStatus = 'PASS' | 'FAIL' | 'NA';
export type QmsNcrSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL';
export type QmsNcrStatus = 'OPEN' | 'UNDER_REVIEW' | 'CONTAINED' | 'CLOSED' | 'CANCELLED';
export type QmsDisposition =
  | 'PENDING'
  | 'USE_AS_IS'
  | 'REWORK'
  | 'REPAIR'
  | 'SCRAP'
  | 'RETURN_TO_SUPPLIER';
export type QmsCapaType = 'CORRECTIVE' | 'PREVENTIVE';
export type QmsCapaStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'IMPLEMENTED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'CANCELLED';

export interface QmsPlan {
  id: string;
  code: string;
  name: string;
  type: QmsInspectionType;
  itemId: string | null;
  operationId: string | null;
  description: string | null;
  isActive: boolean;
}

export interface QmsCharacteristic {
  id: string;
  planId: string;
  sequence: number;
  name: string;
  characteristicType: QmsCharacteristicType;
  uomCode: string | null;
  nominal: string | null;
  lowerLimit: string | null;
  upperLimit: string | null;
  notes: string | null;
}

export interface QmsInspection {
  id: string;
  code: string;
  planId: string | null;
  type: QmsInspectionType;
  itemId: string | null;
  productionOrderId: string | null;
  lotCode: string | null;
  lotSize: string | null;
  sampleSize: string | null;
  result: QmsInspectionVerdict;
  inspectedAt: string;
  inspectedById: string | null;
  notes: string | null;
  plan?: { id: string; code: string; name: string } | null;
}

export interface QmsResult {
  id: string;
  inspectionId: string;
  characteristicId: string | null;
  measuredValue: string | null;
  status: QmsResultStatus;
  notes: string | null;
  characteristic?: { id: string; name: string; sequence: number } | null;
}

export interface QmsNonconformance {
  id: string;
  code: string;
  name: string;
  description: string | null;
  severity: QmsNcrSeverity;
  status: QmsNcrStatus;
  disposition: QmsDisposition;
  sourceType: string | null;
  itemId: string | null;
  productionOrderId: string | null;
  inspectionId: string | null;
  qtyAffected: string | null;
  erpReferenceType: string | null;
  erpReferenceId: string | null;
  detectedAt: string;
  detectedById: string | null;
  closedAt: string | null;
  notes: string | null;
  inspection?: { id: string; code: string } | null;
}

export interface QmsCapaAction {
  id: string;
  code: string;
  name: string;
  nonconformanceId: string | null;
  type: QmsCapaType;
  status: QmsCapaStatus;
  description: string | null;
  rootCause: string | null;
  actionPlan: string | null;
  assignedToId: string | null;
  dueDate: string | null;
  completedAt: string | null;
  verifiedById: string | null;
  verifiedAt: string | null;
  effectiveness: string | null;
  notes: string | null;
  nonconformance?: { id: string; code: string } | null;
}

export const qmsPlans = crudResource<QmsPlan>('/qms/plans');
export const qmsCharacteristics = crudResource<QmsCharacteristic>('/qms/characteristics');
export const qmsInspections = crudResource<QmsInspection>('/qms/inspections');
export const qmsResults = crudResource<QmsResult>('/qms/results');
export const qmsNonconformances = crudResource<QmsNonconformance>('/qms/nonconformances');
export const qmsCapaActions = crudResource<QmsCapaAction>('/qms/capa-actions');
