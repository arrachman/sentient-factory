export type AuditLogItem = {
  id?: string | number;
  uuid?: string | number;
  userId?: number | null;
  action?: string;
  entityType?: string;
  entityId?: string | null;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  userName?: string | null;
  userEmail?: string | null;
};

export type AuditLogFormState = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldData: string;
  newData: string;
  ipAddress: string;
  userAgent: string;
};

export const initialAuditLogForm: AuditLogFormState = {
  userId: '',
  action: '',
  entityType: '',
  entityId: '',
  oldData: '',
  newData: '',
  ipAddress: '',
  userAgent: '',
};
