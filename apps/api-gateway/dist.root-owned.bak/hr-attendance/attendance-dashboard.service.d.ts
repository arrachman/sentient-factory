import { PrismaService } from '../prisma/prisma.service';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceDashboardService {
    private prisma;
    private settingsService;
    private worksiteService;
    constructor(prisma: PrismaService, settingsService: AttendanceSettingsService, worksiteService: WorksiteService);
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
}
export {};
