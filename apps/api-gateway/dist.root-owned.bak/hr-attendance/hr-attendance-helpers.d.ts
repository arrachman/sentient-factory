import { PrismaService } from '../prisma/prisma.service';
export declare function getHrProfileByAppUserId(prisma: PrismaService, appUserId: number): Promise<Record<string, unknown>>;
export declare function requireHrProfileByAppUserId(prisma: PrismaService, appUserId: number): Promise<{
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
}>;
export declare function isPrivileged(roles?: string[]): boolean;
export declare function normalizeHrDates<T>(value: T): T;
