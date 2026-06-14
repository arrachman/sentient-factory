"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHrProfileByAppUserId = getHrProfileByAppUserId;
exports.requireHrProfileByAppUserId = requireHrProfileByAppUserId;
exports.isPrivileged = isPrivileged;
exports.normalizeHrDates = normalizeHrDates;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
async function getHrProfileByAppUserId(prisma, appUserId) {
    const rows = await prisma.$queryRaw(client_1.Prisma.sql `
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
async function requireHrProfileByAppUserId(prisma, appUserId) {
    const profile = await getHrProfileByAppUserId(prisma, appUserId);
    if (!profile) {
        throw new common_1.NotFoundException('HR attendance profile not found for current user.');
    }
    return profile;
}
function isPrivileged(roles) {
    return Array.isArray(roles) && roles.some((role) => role === 'admin' || role === 'manager');
}
function padTimestampPart(value) {
    return String(value).padStart(2, '0');
}
function serializeHrTimestampValue(value) {
    const year = value.getUTCFullYear();
    const month = padTimestampPart(value.getUTCMonth() + 1);
    const day = padTimestampPart(value.getUTCDate());
    const hour = padTimestampPart(value.getUTCHours());
    const minute = padTimestampPart(value.getUTCMinutes());
    const second = padTimestampPart(value.getUTCSeconds());
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
function normalizeHrDates(value) {
    if (value instanceof Date) {
        return serializeHrTimestampValue(value);
    }
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeHrDates(entry));
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
            key,
            normalizeHrDates(entry),
        ]));
    }
    return value;
}
//# sourceMappingURL=hr-attendance-helpers.js.map