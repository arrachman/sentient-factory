import { PrismaService } from '../prisma/prisma.service';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';
import { FaceIdentificationService } from './face-identification.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
type AttendanceEventPayload = {
    sessionId?: number | null;
    eventType: string;
    result: string;
    reasonCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    faceScore?: number | null;
    livenessScore?: number | null;
    snapshotUrl?: string | null;
    deviceInfo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};
export declare class FaceEnrollmentService {
    private prisma;
    private settingsService;
    private worksiteService;
    private faceIdentificationService;
    constructor(prisma: PrismaService, settingsService: AttendanceSettingsService, worksiteService: WorksiteService, faceIdentificationService: FaceIdentificationService);
    requireFaceEmbedding(faceEmbedding: unknown): number[];
    compareFaceEmbedding(left: number[], right: number[]): number;
    requireActiveFaceEnrollment(hrUserId: number): Promise<{
        embedding: number[];
    }>;
    private hasActiveFaceEnrollment;
    private findDuplicateFaceEnrollmentOwner;
    private resolveEnrollmentTargetProfile;
    insertAttendanceEvent(hrUserId: number, actorId: number | null, payload: AttendanceEventPayload): Promise<void>;
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
}
export {};
