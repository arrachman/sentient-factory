import { SetMetadata } from '@nestjs/common';

export const AUDIT_RESOURCE_KEY = 'clinicAuditResource';

/**
 * Override resource type for audit log (default: derived from controller path).
 * Example: @AuditResource('clinic.booking') on a controller.
 */
export const AuditResource = (resource: string) => SetMetadata(AUDIT_RESOURCE_KEY, resource);
