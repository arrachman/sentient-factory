import { PrismaService } from '../prisma/prisma.service';
export declare class PsikologDashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyStats(userId: number): Promise<{
        success: boolean;
        data: {
            sesi30Hari: number;
            klienAktif: number;
            kehadiran: number | null;
            ratingKlien: null;
        };
    }>;
    getDashboardStats(userId: number): Promise<{
        success: boolean;
        data: {
            today: {
                total: number;
                completed: number;
                inProgress: number;
                upcoming: number;
                cancelled: number;
            };
            week: {
                data: number[];
                total: number;
                startDate: string;
            };
            klienAktif: number;
            catatanTertunda: number;
            pendingNotes: {
                bookingId: number;
                clientName: string;
                serviceName: string;
                scheduledStart: string;
            }[];
            packageEndingSoon: {
                bookingId: number;
                clientName: string;
                sessionN: number;
                sessionTotal: number;
                scheduledStart: string;
            }[];
            anchorDate: string;
        };
    }>;
}
