/**
 * Normalisasi payload dari endpoint /api/hr/* ke shape internal.
 * Tahan terhadap nilai Prisma Decimal (object {s, e, d}) atau string numeric.
 */
import type {
  AssignedWorksiteRow,
  AttendanceUserOption,
  WorksiteRow,
} from './types';

export function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === 'object') {
    const decimalLike = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(decimalLike.d)) {
      const serialized = decimalLike.d.join('');
      const exponent =
        typeof decimalLike.e === 'number' ? decimalLike.e : serialized.length - 1;
      const sign = decimalLike.s === -1 ? -1 : 1;
      const decimal = Number(
        `${sign < 0 ? '-' : ''}${serialized[0] ?? '0'}${
          serialized.length > 1 ? `.${serialized.slice(1)}` : ''
        }e${exponent}`,
      );
      return Number.isFinite(decimal) ? decimal : 0;
    }
  }
  return 0;
}

export function normalizeWorksiteRow(
  row: Record<string, unknown>,
): WorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? ''),
    code: String(row.code ?? ''),
    latitude: normalizeNumericValue(row.latitude),
    longitude: normalizeNumericValue(row.longitude),
    radiusMeters: normalizeNumericValue(row.radiusMeters),
    isActive: Boolean(row.isActive),
  };
}

export function normalizeAssignedWorksiteRow(
  row: Record<string, unknown>,
): AssignedWorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? row.worksiteName ?? ''),
    code: String(row.code ?? row.worksiteCode ?? ''),
    radiusMeters:
      row.radiusMeters == null ? 0 : normalizeNumericValue(row.radiusMeters),
    isPrimary: Boolean(row.isPrimary),
  };
}

export function normalizeAttendanceUserOption(
  row: Record<string, unknown>,
): AttendanceUserOption {
  return {
    hrUserId: Number(row.hrUserId ?? 0),
    appUserId: Number(row.appUserId ?? 0),
    employeeCode:
      typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'),
    isActive: Boolean(row.isActive),
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName:
      typeof row.defaultWorksiteName === 'string'
        ? row.defaultWorksiteName
        : null,
    assignedWorksites: Array.isArray(row.assignedWorksites)
      ? row.assignedWorksites
          .filter(
            (entry): entry is Record<string, unknown> =>
              Boolean(entry && typeof entry === 'object'),
          )
          .map((entry) => normalizeAssignedWorksiteRow(entry))
      : [],
  };
}
