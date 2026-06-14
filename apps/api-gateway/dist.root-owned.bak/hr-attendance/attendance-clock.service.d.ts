import { PrismaService } from '../prisma/prisma.service';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { WorksiteService } from './worksite.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceClockService {
    private prisma;
    private settingsService;
    private faceEnrollmentService;
    private worksiteService;
    constructor(prisma: PrismaService, settingsService: AttendanceSettingsService, faceEnrollmentService: FaceEnrollmentService, worksiteService: WorksiteService);
    clockIn(authUser: AuthUser, dto: ClockAttendanceDto): Promise<{
        success: boolean;
        data: {
            sessionId: number;
            status: string;
            reasonCode: string | null;
            distanceMeters: number | null;
            insideGeofence: boolean;
        };
    }>;
    clockOut(authUser: AuthUser, dto: ClockAttendanceDto): Promise<{
        success: boolean;
        data: {
            sessionId: number;
            status: string;
            reasonCode: string | null;
            distanceMeters: number | null;
            totalWorkMinutes: number;
        };
    }>;
}
export {};
