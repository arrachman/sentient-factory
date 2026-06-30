// PRTS (problem/Andon) · DMS (controlled docs) · IMS/QHSE (EHS) · LMS (training).
// Lighter modules grouped; each entity follows the shared crudResource shape.
import { crudResource } from './client';

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
