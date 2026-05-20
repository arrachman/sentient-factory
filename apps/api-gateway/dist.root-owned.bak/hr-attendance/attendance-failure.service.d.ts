import { PrismaService } from '../prisma/prisma.service';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { FaceEnrollmentService } from './face-enrollment.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceFailureService {
    private prisma;
    private faceEnrollmentService;
    constructor(prisma: PrismaService, faceEnrollmentService: FaceEnrollmentService);
    reportAttendanceFailure(authUser: AuthUser, dto: ReportAttendanceFailureDto): Promise<{
        success: boolean;
        message: string;
        data: {
            eventType: string;
            reasonCode: string;
            snapshotUrl: string | null;
        };
    }>;
}
export {};
