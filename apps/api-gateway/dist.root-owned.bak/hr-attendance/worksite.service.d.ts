import { PrismaService } from '../prisma/prisma.service';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { UserWorksiteService } from './user-worksite.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
type HrWorksiteRow = {
    id: number;
    code: string;
    name: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
};
export declare class WorksiteService {
    private prisma;
    private userWorksiteService;
    constructor(prisma: PrismaService, userWorksiteService: UserWorksiteService);
    getAssignedWorksites(hrUserId: number): Promise<{
        id: number;
        name: string;
        code: string;
        latitude: number;
        longitude: number;
        radiusMeters: number;
        isPrimary: boolean;
    }[]>;
    getAssignedWorksiteMap(hrUserIds: number[]): Promise<Map<number, {
        id: number;
        name: string;
        code: string;
        radiusMeters: number;
        isPrimary: boolean;
    }[]>>;
    getAttendanceUsers(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            assignedWorksites: {
                id: number;
                name: string;
                code: string;
                radiusMeters: number;
                isPrimary: boolean;
            }[];
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
            assignedWorksites: {
                id: number;
                name: string;
                code: string;
                latitude: number;
                longitude: number;
                radiusMeters: number;
                isPrimary: boolean;
            }[];
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
            assignedWorksites: {
                id: number;
                name: string;
                code: string;
                latitude: number;
                longitude: number;
                radiusMeters: number;
                isPrimary: boolean;
            }[];
        };
    }>;
    resolveWorksiteForCoordinates(worksites: HrWorksiteRow[], latitude: number | null | undefined, longitude: number | null | undefined): {
        worksite: HrWorksiteRow;
        distanceMeters: number | null;
        insideGeofence: boolean;
    };
    calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number;
    getWorksites(query: QueryHrWorksiteDto): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createWorksite(dto: CreateHrWorksiteDto, authUser: AuthUser): Promise<{
        success: boolean;
        message: string;
    }>;
    updateWorksite(id: number, dto: UpdateHrWorksiteDto, authUser: AuthUser): Promise<{
        success: boolean;
        message: string;
    }>;
    removeWorksite(id: number, authUser: AuthUser): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
