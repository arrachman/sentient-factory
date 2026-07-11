import * as path from 'path';

/**
 * Pure (non-I/O) helpers for AttendanceQueryService.
 *
 * No service dependencies, no Prisma, no async. Everything that touches the
 * filesystem or DB stays in the service; only pure calculations live here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal authenticated-user shape consumed by the attendance query methods.
 * Has no canonical home in the codebase (duplicated locally across services),
 * so it is co-located here for the query feature.
 */
export type AuthUser = {
  id: number;
  roles?: string[];
};

/** Default face-identification similarity threshold (original L26). */
export const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;

/** Default face-verification similarity threshold (original L27). */
export const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve page/limit/offset from optional query fields (original L133–135, L247–249). */
export function resolvePagination(args: {
  page?: number | null;
  limit?: number | null;
  defaultLimit: number;
}): { page: number; limit: number; offset: number } {
  const page = args.page ?? 1;
  const limit = args.limit ?? args.defaultLimit;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/** Build the `meta` block for a paginated response with zero results. */
export function emptyPaginatedResponse(page: number, limit: number): {
  success: true;
  data: never[];
  meta: { page: number; limit: number; total: 0; totalPages: 1 };
} {
  return {
    success: true,
    data: [],
    meta: { page, limit, total: 0, totalPages: 1 },
  };
}

/** Build the `meta` block for a paginated response with results. */
export function paginatedMeta(args: {
  page: number;
  limit: number;
  total: number;
  extra?: Record<string, unknown>;
}): { page: number; limit: number; total: number; totalPages: number } & Record<
  string,
  unknown
> {
  const { page, limit, total, extra } = args;
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    ...extra,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Timesheet — standard daily minutes (pure calc only; settings I/O in service)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pure standard-daily-minutes calculation (original L289).
 * `dailyRegularHours` is fetched async in the service; only the rounding/clamp
 * is extracted here.
 */
export function computeStandardDailyMinutes(dailyRegularHours: number): number {
  return Math.max(0, Math.round(dailyRegularHours * 60));
}

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot — path containment check + MIME/file-name derivation (pure)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Security-sensitive base-directory containment check (original L413).
 * Verbatim predicate: the resolved file must be the base itself or live
 * beneath it. Path resolution + file reading stay in the service so the
 * retrieval sequence order is preserved.
 */
export function isPathWithinBase(
  resolvedFile: string,
  resolvedBase: string,
): boolean {
  return (
    resolvedFile.startsWith(resolvedBase + path.sep) ||
    resolvedFile === resolvedBase
  );
}

/**
 * Derive a MIME type for a snapshot file from its extension (original L423).
 * Defaults to `image/jpeg` for non-`.png` extensions.
 */
export function deriveSnapshotMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  return extension === '.png' ? 'image/png' : 'image/jpeg';
}

/** Derive the base file name from a resolved path (original L428). */
export function deriveSnapshotFileName(filePath: string): string {
  return path.basename(filePath);
}