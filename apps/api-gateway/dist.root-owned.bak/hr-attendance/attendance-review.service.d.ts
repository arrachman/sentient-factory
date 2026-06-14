import { PrismaService } from '../prisma/prisma.service';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceReviewService {
    private prisma;
    constructor(prisma: PrismaService);
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
}
export {};
