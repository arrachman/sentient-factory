import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export async function getHrProfileByAppUserId(prisma: PrismaService, appUserId: number) {
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
    SELECT
      hu.id AS "hrUserId",
      hu.user_id AS "appUserId",
      hu.employee_code AS "employeeCode",
      hu.face_enrollment_status AS "faceEnrollmentStatus",
      hu.employee_role_type AS "employeeRoleType",
      hu.is_active AS "isActive",
      u.username,
      u.full_name AS "fullName",
      hw.id AS "defaultWorksiteId",
      hw.name AS "defaultWorksiteName",
      hw.code AS "defaultWorksiteCode",
      hw.radius_meters AS "defaultWorksiteRadiusMeters"
    FROM public.hr_users hu
    JOIN public.m0_users u ON u.id = hu.user_id
    LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
    WHERE hu.deleted_at IS NULL
      AND hu.user_id = ${appUserId}
    LIMIT 1
  `);

  return rows[0] ?? null;
}

export async function requireHrProfileByAppUserId(prisma: PrismaService, appUserId: number) {
  const profile = await getHrProfileByAppUserId(prisma, appUserId);
  if (!profile) {
    throw new NotFoundException('HR attendance profile not found for current user.');
  }
  return profile as {
    hrUserId: number;
    appUserId: number;
    employeeCode: string | null;
    faceEnrollmentStatus: string;
    employeeRoleType: string;
    isActive: boolean;
    username: string;
    fullName: string | null;
    defaultWorksiteId: number | null;
    defaultWorksiteName: string | null;
    defaultWorksiteCode: string | null;
    defaultWorksiteRadiusMeters: number | null;
  };
}

export function isPrivileged(roles?: string[]) {
  return Array.isArray(roles) && roles.some((role) => role === 'admin' || role === 'manager');
}

function padTimestampPart(value: number) {
  return String(value).padStart(2, '0');
}

function serializeHrTimestampValue(value: Date) {
  const year = value.getUTCFullYear();
  const month = padTimestampPart(value.getUTCMonth() + 1);
  const day = padTimestampPart(value.getUTCDate());
  const hour = padTimestampPart(value.getUTCHours());
  const minute = padTimestampPart(value.getUTCMinutes());
  const second = padTimestampPart(value.getUTCSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function normalizeHrDates<T>(value: T): T {
  if (value instanceof Date) {
    return serializeHrTimestampValue(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeHrDates(entry)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        normalizeHrDates(entry),
      ]),
    ) as T;
  }

  return value;
}
