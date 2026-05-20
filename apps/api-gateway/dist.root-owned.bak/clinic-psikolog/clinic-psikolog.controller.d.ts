import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicPsikologService } from './clinic-psikolog.service';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';
export declare class ClinicPsikologController {
    private readonly service;
    constructor(service: ClinicPsikologService);
    create(dto: CreatePsikologDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    findAll(query: QueryPsikologDto): Promise<{
        success: boolean;
        data: {
            hasBookings: boolean;
            todayCount: number;
            weekCount: number;
            clientCount: number;
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findMe(req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    myStats(req: AuthRequest): Promise<{
        success: boolean;
        data: {
            sesi30Hari: number;
            klienAktif: number;
            kehadiran: number | null;
            ratingKlien: null;
        };
    }>;
    myDashboardStats(req: AuthRequest): Promise<{
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
    updateMe(body: {
        fullName?: string;
        title?: string;
        bio?: string;
        color?: string;
        avatarUrl?: string | null;
    }, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateMyAvailability(body: {
        weeklyAvailability: Record<string, {
            isOpen: boolean;
            slotIndices?: number[];
        }>;
    }, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    listMyDateOverrides(from: string | undefined, to: string | undefined, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            psikologUserId: number;
            date: Date;
            isOpen: boolean;
            slotIndices: import("@prisma/client/runtime/library").JsonValue | null;
            reason: string | null;
        }[];
    }>;
    upsertMyDateOverride(body: {
        date: string;
        isOpen: boolean;
        slotIndices?: number[] | null;
        reason?: string | null;
    }, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            psikologUserId: number;
            date: Date;
            isOpen: boolean;
            slotIndices: import("@prisma/client/runtime/library").JsonValue | null;
            reason: string | null;
        };
        message: string;
    }>;
    deleteMyDateOverride(date: string, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    listDateOverridesByUser(userId: number, from: string | undefined, to: string | undefined): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            psikologUserId: number;
            date: Date;
            isOpen: boolean;
            slotIndices: import("@prisma/client/runtime/library").JsonValue | null;
            reason: string | null;
        }[];
    }>;
    getAvailabilityForDate(userId: number, date: string): Promise<{
        success: boolean;
        data: {
            isOpen: boolean;
            slotIndices: number[] | null;
            source: "override";
            reason: string | null;
            psikologName: string;
        };
    } | {
        success: boolean;
        data: {
            isOpen: boolean;
            slotIndices: number[];
            source: "unset";
            reason: null;
            psikologName: string;
        };
    } | {
        success: boolean;
        data: {
            isOpen: boolean;
            slotIndices: number[] | null;
            source: "weekly";
            reason: null;
            psikologName: string;
        };
    }>;
    update(id: number, dto: UpdatePsikologDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            title: string | null;
            specialty: string[];
            color: string | null;
            license: string | null;
            defaultSlots: number;
            weeklyAvailability: Record<string, {
                isOpen: boolean;
                slotIndices?: number[];
            }>;
            serviceIds: number[];
            bio: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
