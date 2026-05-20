/**
 * Canonical approval-status helpers.
 * Single source of truth for status → badge variant and display label.
 * Import these in every list/form page — never define STATUS_VARIANT inline.
 */

export type ApprovalStatus =
  | 'DRAFT'
  | 'NEED_APPROVE'
  | 'APPROVED'
  | 'REJECTED'
  | 'POSTED';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warn' | 'danger' | 'info';

const VARIANT_MAP: Record<string, BadgeVariant> = {
  // Canonical enum keys (from backend / DB)
  DRAFT: 'default',
  NEED_APPROVE: 'warn',
  APPROVED: 'success',
  REJECTED: 'danger',
  POSTED: 'info',
  // Legacy display-string aliases (backwards compat with string-based status)
  Draft: 'default',
  'Need Approve': 'warn',
  Approved: 'success',
  Rejected: 'danger',
  Posted: 'info',
};

const LABEL_MAP: Record<string, string> = {
  DRAFT: 'Draft',
  NEED_APPROVE: 'Need Approve',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  POSTED: 'Posted',
};

/** Maps a status key/string to its badge variant. Falls back to 'default'. */
export function statusBadgeVariant(status: string): BadgeVariant {
  return VARIANT_MAP[status] ?? 'default';
}

/** Maps a status enum key to its display label. Falls back to the raw value. */
export function statusLabel(status: string): string {
  return LABEL_MAP[status] ?? status;
}
