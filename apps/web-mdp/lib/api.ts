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

// ── QMS (quality) ──────────────────────────────────────────────────────────
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

/** QMS — quality results vs MES/ERP; flags dispositions, does not post stock. */
export const qmsPlans = crudResource<QmsPlan>('/qms/plans');
export const qmsCharacteristics = crudResource<QmsCharacteristic>('/qms/characteristics');
export const qmsInspections = crudResource<QmsInspection>('/qms/inspections');
export const qmsResults = crudResource<QmsResult>('/qms/results');
export const qmsNonconformances = crudResource<QmsNonconformance>('/qms/nonconformances');
export const qmsCapaActions = crudResource<QmsCapaAction>('/qms/capa-actions');

// ── CMMS (maintenance) ───────────────────────────────────────────────────────
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

/** CMMS — maintenance; spare consumption emits ERP inv_ issue (decision #3 stub). */
export const mntWorkOrders = crudResource<MntWorkOrder>('/mnt/work-orders');
export const mntPmSchedules = crudResource<MntPmSchedule>('/mnt/pm-schedules');
export const mntFailureCodes = crudResource<MntFailureCode>('/mnt/failure-codes');
export const mntSpareParts = crudResource<MntSparePart>('/mnt/spare-parts');

// ── DMS / PRTS / IMS / LMS modules ─────────────────────────────────────────
export type PrtIssueType = 'QUALITY' | 'MACHINE' | 'SAFETY' | 'MATERIAL' | 'PROCESS' | 'OTHER';
export type PrtSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PrtIssueStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type PrtEscalationStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
export type DmsCategory = 'SOP' | 'WORK_INSTRUCTION' | 'DRAWING' | 'POLICY' | 'FORM' | 'RECORD' | 'OTHER';
export type DmsDocStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'RELEASED' | 'OBSOLETE';
export type DmsRevisionStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SUPERSEDED';
export type EhsIncidentType = 'INJURY' | 'NEAR_MISS' | 'PROPERTY_DAMAGE' | 'ENVIRONMENTAL' | 'SECURITY' | 'OTHER';
export type EhsSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'FATAL';
export type EhsIncidentStatus = 'REPORTED' | 'UNDER_INVESTIGATION' | 'ACTION_PENDING' | 'CLOSED' | 'CANCELLED';
export type EhsAuditType = 'SAFETY' | 'ENVIRONMENTAL' | 'QUALITY' | 'FIVE_S' | 'INTERNAL' | 'EXTERNAL';
export type EhsAuditStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type EhsPermitType = 'HOT_WORK' | 'CONFINED_SPACE' | 'WORKING_AT_HEIGHT' | 'ELECTRICAL' | 'EXCAVATION' | 'CHEMICAL' | 'OTHER';
export type EhsPermitStatus = 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'REJECTED' | 'CANCELLED';
export type LmsCourseCategory = 'SAFETY' | 'QUALITY' | 'TECHNICAL' | 'ONBOARDING' | 'COMPLIANCE' | 'OTHER';
export type LmsCourseStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type LmsEnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface PrtIssue {
  id: string;
  code: string;
  name: string;
  type: PrtIssueType;
  severity: PrtSeverity | null;
  status: PrtIssueStatus | null;
  source: string | null;
  assetId: string | null;
  workCenterId: string | null;
  productionOrderId: string | null;
  description: string | null;
  reportedById: string | null;
  assignedToId: string | null;
  raisedAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  notes: string | null;
  isActive: boolean;
}
export const prtIssues = crudResource<PrtIssue>('/prt/issues');

export interface PrtEscalation {
  id: string;
  issueId: string;
  level: number | null;
  escalatedToId: string | null;
  escalatedAt: string;
  dueAt: string | null;
  status: PrtEscalationStatus | null;
  reason: string | null;
  notes: string | null;
}
export const prtEscalations = crudResource<PrtEscalation>('/prt/escalations');

export interface DmsDocument {
  id: string;
  code: string;
  name: string;
  category: DmsCategory | null;
  status: DmsDocStatus | null;
  currentRevision: string | null;
  ownerId: string | null;
  description: string | null;
  effectiveAt: string | null;
  isActive: boolean;
}
export const dmsDocuments = crudResource<DmsDocument>('/dms/documents');

export interface DmsRevision {
  id: string;
  documentId: string;
  revisionCode: string;
  status: DmsRevisionStatus | null;
  filePath: string | null;
  changeSummary: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  notes: string | null;
}
export const dmsRevisions = crudResource<DmsRevision>('/dms/revisions');

export interface DmsAcknowledgement {
  id: string;
  documentId: string;
  revisionId: string | null;
  userId: string;
  acknowledgedAt: string;
  notes: string | null;
}
export const dmsAcknowledgements = crudResource<DmsAcknowledgement>('/dms/acknowledgements');

export interface EhsIncident {
  id: string;
  code: string;
  name: string;
  type: EhsIncidentType;
  severity: EhsSeverity | null;
  status: EhsIncidentStatus | null;
  assetId: string | null;
  workCenterId: string | null;
  location: string | null;
  description: string | null;
  occurredAt: string;
  reportedById: string | null;
  investigatedById: string | null;
  rootCause: string | null;
  correctiveAction: string | null;
  closedAt: string | null;
  notes: string | null;
  isActive: boolean;
}
export const ehsIncidents = crudResource<EhsIncident>('/ehs/incidents');

export interface EhsAudit {
  id: string;
  code: string;
  name: string;
  type: EhsAuditType;
  status: EhsAuditStatus | null;
  scope: string | null;
  workCenterId: string | null;
  auditorId: string | null;
  scheduledAt: string | null;
  conductedAt: string | null;
  score: string | null;
  findings: string | null;
  notes: string | null;
  isActive: boolean;
}
export const ehsAudits = crudResource<EhsAudit>('/ehs/audits');

export interface EhsPermit {
  id: string;
  code: string;
  name: string;
  type: EhsPermitType;
  status: EhsPermitStatus | null;
  assetId: string | null;
  workCenterId: string | null;
  location: string | null;
  requestedById: string | null;
  approvedById: string | null;
  validFrom: string | null;
  validTo: string | null;
  description: string | null;
  notes: string | null;
  isActive: boolean;
}
export const ehsPermits = crudResource<EhsPermit>('/ehs/permits');

export interface LmsCourse {
  id: string;
  code: string;
  name: string;
  category: LmsCourseCategory | null;
  status: LmsCourseStatus | null;
  description: string | null;
  durationHours: string | null;
  isMandatory: boolean;
  validityMonths: number | null;
  isActive: boolean;
}
export const lmsCourses = crudResource<LmsCourse>('/lms/courses');

export interface LmsEnrollment {
  id: string;
  courseId: string;
  userId: string;
  status: LmsEnrollmentStatus | null;
  progressPct: string | null;
  enrolledAt: string;
  completedAt: string | null;
  score: string | null;
  certificateCode: string | null;
  expiresAt: string | null;
  notes: string | null;
}
export const lmsEnrollments = crudResource<LmsEnrollment>('/lms/enrollments');

export interface LmsCompetency {
  id: string;
  code: string;
  name: string;
  category: string | null;
  description: string | null;
  requiredCourseId: string | null;
  level: string | null;
  isActive: boolean;
}
export const lmsCompetencies = crudResource<LmsCompetency>('/lms/competencies');


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

// --- OEE overlay (derived metric; A × P × Q computed from mes/qms) -----------

export interface OeeRatios {
  availability: number | null;
  performance: number | null;
  quality: number | null;
  oee: number | null;
}

export interface OeeWorkCenterRow extends OeeRatios {
  workCenter: { id: string; code: string; name: string };
  plannedSeconds: number;
  downtimeSeconds: number;
  operatingSeconds: number;
  idealCycleSeconds: number | null;
  goodCount: number;
  scrapCount: number;
  totalCount: number;
  ncrCount: number;
  flags: { missingCalendar: boolean; missingIdealCycle: boolean };
}

export interface OeeSummary extends OeeRatios {
  workCenterCount: number;
  plannedSeconds: number;
  operatingSeconds: number;
  goodCount: number;
  totalCount: number;
  ncrCount: number;
}

export interface OeeReport {
  window: { from: string; to: string };
  summary: OeeSummary;
  workCenters: OeeWorkCenterRow[];
}

/** OEE = derived overlay (no tables); computed on-the-fly server-side. */
export function fetchOee(q: { from?: string; to?: string; workCenterId?: string } = {}) {
  return request<{ success: boolean; data: OeeReport }>(`/oee${qs(q)}`);
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
