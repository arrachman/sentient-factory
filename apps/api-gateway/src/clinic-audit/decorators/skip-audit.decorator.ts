import { SetMetadata } from '@nestjs/common';

export const SKIP_AUDIT_KEY = 'clinicSkipAudit';

/**
 * Mark a route or controller to skip audit log writing.
 * Example: @SkipAudit() on /health endpoint.
 */
export const SkipAudit = () => SetMetadata(SKIP_AUDIT_KEY, true);
