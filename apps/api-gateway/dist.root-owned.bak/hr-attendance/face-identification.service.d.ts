import { PrismaService } from '../prisma/prisma.service';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { AttendanceSettingsService } from './attendance-settings.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class FaceIdentificationService {
    private prisma;
    private settingsService;
    constructor(prisma: PrismaService, settingsService: AttendanceSettingsService);
    requireFaceEmbedding(faceEmbedding: unknown): number[];
    compareFaceEmbedding(left: number[], right: number[]): number;
    requireActiveFaceEnrollment(hrUserId: number): Promise<{
        embedding: number[];
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
