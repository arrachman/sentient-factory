import { PrismaService } from '../prisma/prisma.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
type HrAssignedWorksite = {
    id: number;
    name: string;
    code: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    isPrimary: boolean;
};
type HrWorksiteAssignmentSummary = {
    id: number;
    name: string;
    code: string;
    radiusMeters: number;
    isPrimary: boolean;
};
export declare class UserWorksiteService {
    private prisma;
    constructor(prisma: PrismaService);
    getAssignedWorksites(hrUserId: number): Promise<HrAssignedWorksite[]>;
    getAssignedWorksiteMap(hrUserIds: number[]): Promise<Map<number, HrWorksiteAssignmentSummary[]>>;
    syncAssignedWorksites(targetHrUserId: number, worksiteIds: number[], actorId: number | null): Promise<void>;
    getAttendanceUsers(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            assignedWorksites: HrWorksiteAssignmentSummary[];
        }[];
    }>;
    getUserWorksites(authUser: AuthUser, targetAppUserId: number): Promise<{
        success: boolean;
        data: {
            hrUserId: number;
            appUserId: number;
            employeeCode: unknown;
            fullName: unknown;
            username: unknown;
            defaultWorksiteId: unknown;
            assignedWorksites: HrAssignedWorksite[];
        };
    }>;
    updateUserWorksites(authUser: AuthUser, targetAppUserId: number, dto: {
        worksiteIds: number[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            hrUserId: number;
            appUserId: number;
            defaultWorksiteId: {} | null;
            assignedWorksites: HrAssignedWorksite[];
        };
    }>;
}
export {};
