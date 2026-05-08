import { SetMetadata } from '@nestjs/common';

export const AUDIT_ACTION_KEY = 'clinicAuditAction';

/**
 * Override default audit action label (default: HTTP method).
 * Example: @AuditAction('reschedule') on a custom endpoint.
 */
export const AuditAction = (action: string) => SetMetadata(AUDIT_ACTION_KEY, action);
