import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { AttendanceClockService } from './attendance-clock.service';
import { AttendanceFailureService } from './attendance-failure.service';
import { AttendanceQueryService } from './attendance-query.service';
import { AttendanceReviewService } from './attendance-review.service';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { WorksiteService } from './worksite.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class HrAttendanceService {
    private clockService;
    private failureService;
    private queryService;
    private reviewService;
    private settingsService;
    private faceEnrollmentService;
    private worksiteService;
    constructor(clockService: AttendanceClockService, failureService: AttendanceFailureService, queryService: AttendanceQueryService, reviewService: AttendanceReviewService, settingsService: AttendanceSettingsService, faceEnrollmentService: FaceEnrollmentService, worksiteService: WorksiteService);
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
    createFaceEnrollment(authUser: AuthUser, dto: CreateFaceEnrollmentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            snapshotUrl: string | null;
            faceEnrollmentStatus: string;
            targetAppUserId: number;
            targetUsername: string;
        };
    }>;
    getFaceEnrollmentManagement(authUser: AuthUser): Promise<{
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
    identifyFace(authUser: AuthUser, dto: IdentifyFaceDto): Promise<{
        success: boolean;
        data: {
            matched: boolean;
            threshold: number;
            currentUserHrId: number;
            currentUserAppId: number;
            candidate: {
                hrUserId: number;
                appUserId: number;
                employeeCode: string | null;
                username: string;
                fullName: string | null;
                similarity: number;
                isCurrentUser: boolean;
            } | null;
            topMatches: {
                hrUserId: number;
                appUserId: number;
                employeeCode: string | null;
                username: string;
                fullName: string | null;
                similarity: number;
                isCurrentUser: boolean;
            }[];
        };
    }>;
    getFaceEnrollmentSnapshot(authUser: AuthUser, enrollmentId: number): Promise<{
        buffer: NonSharedBuffer;
        mimeType: string;
        fileName: string;
    }>;
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
    reportAttendanceFailure(authUser: AuthUser, dto: ReportAttendanceFailureDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventType: string;
            reasonCode: string;
            snapshotUrl: string | null;
        };
    }>;
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
    getAttendanceReviews(authUser: AuthUser, query: QueryHrAttendanceReviewDto): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAttendanceReviewDetail(authUser: AuthUser, eventId: number): Promise<{
        success: boolean;
        data: {
            reviewHistory: Record<string, unknown>[];
        };
    }>;
    updateAttendanceReview(authUser: AuthUser, eventId: number, nextStatus: 'pending' | 'approved' | 'rejected' | 'needs_clarification', note?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            eventId: number;
            reviewStatus: "pending" | "approved" | "rejected" | "needs_clarification";
        };
    }>;
    getSettings(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            autoSubmitEnabled: boolean;
            autoSubmitConfidenceThreshold: number;
            faceIdentifyConfidenceThreshold: number;
            faceVerifyConfidenceThreshold: number;
        };
    }>;
    updateSetting(authUser: AuthUser, settingKey: string, value: string): Promise<{
        success: boolean;
        data: {
            settingKey: string;
            value: string;
        };
    }>;
}
export {};
