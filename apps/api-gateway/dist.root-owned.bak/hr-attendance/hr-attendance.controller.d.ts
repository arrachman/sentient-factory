import type { Response } from 'express';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { UpdateUserWorksitesDto } from './dto/update-user-worksites.dto';
import { UpdateHrAttendanceReviewDto } from './dto/update-hr-attendance-review.dto';
import { UpdateHrSettingDto } from './dto/update-hr-setting.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { HrAttendanceService } from './hr-attendance.service';
export declare class HrAttendanceController {
    private readonly service;
    constructor(service: HrAttendanceService);
    getAttendanceMe(req: any): Promise<{
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
    getAttendanceHistory(req: any, query: QueryHrAttendanceHistoryDto): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAttendanceDashboard(req: any): Promise<{
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
    getHrAttendanceUsers(req: any): Promise<{
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
    getUserWorksites(req: any, appUserId: number): Promise<{
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
    updateUserWorksites(req: any, appUserId: number, dto: UpdateUserWorksitesDto): Promise<{
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
    getFaceEnrollments(req: any): Promise<{
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
    getAttendanceReviews(req: any, query: QueryHrAttendanceReviewDto): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAttendanceReviewDetail(req: any, eventId: number): Promise<{
        success: boolean;
        data: {
            reviewHistory: Record<string, unknown>[];
        };
    }>;
    approveAttendanceReview(req: any, eventId: number, dto: UpdateHrAttendanceReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventId: number;
            reviewStatus: "pending" | "approved" | "rejected" | "needs_clarification";
        };
    }>;
    rejectAttendanceReview(req: any, eventId: number, dto: UpdateHrAttendanceReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventId: number;
            reviewStatus: "pending" | "approved" | "rejected" | "needs_clarification";
        };
    }>;
    requestAttendanceReviewClarification(req: any, eventId: number, dto: UpdateHrAttendanceReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventId: number;
            reviewStatus: "pending" | "approved" | "rejected" | "needs_clarification";
        };
    }>;
    reopenAttendanceReview(req: any, eventId: number, dto: UpdateHrAttendanceReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventId: number;
            reviewStatus: "pending" | "approved" | "rejected" | "needs_clarification";
        };
    }>;
    createFaceEnrollment(dto: CreateFaceEnrollmentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            snapshotUrl: string | null;
            faceEnrollmentStatus: string;
            targetAppUserId: number;
            targetUsername: string;
        };
    }>;
    identifyFace(dto: IdentifyFaceDto, req: any): Promise<{
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
    clockIn(dto: ClockAttendanceDto, req: any): Promise<{
        success: boolean;
        data: {
            sessionId: number;
            status: string;
            reasonCode: string | null;
            distanceMeters: number | null;
            insideGeofence: boolean;
        };
    }>;
    clockOut(dto: ClockAttendanceDto, req: any): Promise<{
        success: boolean;
        data: {
            sessionId: number;
            status: string;
            reasonCode: string | null;
            distanceMeters: number | null;
            totalWorkMinutes: number;
        };
    }>;
    reportAttendanceFailure(dto: ReportAttendanceFailureDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            eventType: string;
            reasonCode: string;
            snapshotUrl: string | null;
        };
    }>;
    getAttendanceEventSnapshot(eventId: number, req: any, res: Response): Promise<void>;
    getFaceEnrollmentSnapshot(enrollmentId: number, req: any, res: Response): Promise<void>;
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
    getSettings(req: any): Promise<{
        success: boolean;
        data: {
            autoSubmitEnabled: boolean;
            autoSubmitConfidenceThreshold: number;
            faceIdentifyConfidenceThreshold: number;
            faceVerifyConfidenceThreshold: number;
        };
    }>;
    updateSetting(settingKey: string, dto: UpdateHrSettingDto, req: any): Promise<{
        success: boolean;
        data: {
            settingKey: string;
            value: string;
        };
    }>;
    createWorksite(dto: CreateHrWorksiteDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    updateWorksite(id: number, dto: UpdateHrWorksiteDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    removeWorksite(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
