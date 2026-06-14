import { PrismaService } from '../prisma/prisma.service';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';
import { AttendanceDashboardService } from './attendance-dashboard.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceQueryService {
    private prisma;
    private settingsService;
    private worksiteService;
    private attendanceDashboardService;
    constructor(prisma: PrismaService, settingsService: AttendanceSettingsService, worksiteService: WorksiteService, attendanceDashboardService: AttendanceDashboardService);
    getAttendanceMe(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            profile: null;
            today: null;
            recentEvents: never[];
            message: string;
            settings?: undefined;
        };
    } | {
        success: boolean;
        data: {
            profile: {
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
            today: Record<string, unknown>;
            recentEvents: Record<string, unknown>[];
            settings: {
                autoSubmitEnabled: boolean;
                autoSubmitConfidenceThreshold: number;
                faceIdentifyConfidenceThreshold: number;
                faceVerifyConfidenceThreshold: number;
            };
            message?: undefined;
        };
    }>;
    getAttendanceHistory(authUser: AuthUser, query: QueryHrAttendanceHistoryDto): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAttendanceDashboard(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            mode: string;
            summary: Record<string, unknown>;
            qualityOverview: Record<string, unknown>;
            reviewOverview: Record<string, unknown>;
            productivityOverview: Record<string, unknown>;
            recentSessions: Record<string, unknown>[];
            exceptionEvents: Record<string, unknown>[];
            settings: {
                autoSubmitEnabled: boolean;
                autoSubmitConfidenceThreshold: number;
                faceIdentifyConfidenceThreshold: number;
                faceVerifyConfidenceThreshold: number;
            };
        };
    }>;
    getAttendanceEventSnapshot(authUser: AuthUser, eventId: number): Promise<{
        buffer: NonSharedBuffer;
        mimeType: string;
        fileName: string;
    }>;
}
export {};
