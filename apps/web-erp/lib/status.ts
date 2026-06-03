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
  | 'POSTED'
  | 'VOID'
  | 'CANCELLED';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warn' | 'danger' | 'info';

const VARIANT_MAP: Record<string, BadgeVariant> = {
  // Canonical enum keys (from backend / DB) — matches ErpDocumentStatus (7 values)
  DRAFT: 'default',
  NEED_APPROVE: 'warn',
  APPROVED: 'success',
  REJECTED: 'danger',
  POSTED: 'info',
  VOID: 'default',
  CANCELLED: 'danger',
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
  VOID: 'Void',
  CANCELLED: 'Cancelled',
};

/**
 * Canonical document-status filter options for read-only registers & list pages.
 * First entry (empty value) = "Semua" (all statuses). Import this instead of
 * hand-building status `<Select>` option arrays per page.
 */
export const DOC_STATUS_FILTER_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '', label: 'Semua Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'NEED_APPROVE', label: 'Need Approve' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'POSTED', label: 'Posted' },
  { value: 'VOID', label: 'Void' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

/** Maps a status key/string to its badge variant. Falls back to 'default'. */
export function statusBadgeVariant(status: string): BadgeVariant {
  return VARIANT_MAP[status] ?? 'default';
}

/** Maps a status enum key to its display label. Falls back to the raw value. */
export function statusLabel(status: string): string {
  return LABEL_MAP[status] ?? status;
}
