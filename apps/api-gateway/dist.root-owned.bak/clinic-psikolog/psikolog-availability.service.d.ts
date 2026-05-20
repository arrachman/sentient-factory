import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class PsikologAvailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listOwnDateOverrides(userId: number, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            date: Date;
            reason: string | null;
            psikologUserId: number;
            isOpen: boolean;
            slotIndices: Prisma.JsonValue | null;
        }[];
    }>;
    listDateOverridesByUser(userId: number, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            date: Date;
            reason: string | null;
            psikologUserId: number;
            isOpen: boolean;
            slotIndices: Prisma.JsonValue | null;
        }[];
    }>;
    upsertOwnDateOverride(userId: number, input: {
        date: string;
        isOpen: boolean;
        slotIndices?: number[] | null;
        reason?: string | null;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            date: Date;
            reason: string | null;
            psikologUserId: number;
            isOpen: boolean;
            slotIndices: Prisma.JsonValue | null;
        };
        message: string;
    }>;
    deleteOwnDateOverride(userId: number, dateStr: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateOwnAvailability(userId: number, weeklyAvailability: Record<string, {
        isOpen: boolean;
        slotIndices?: number[];
    }>): Promise<{
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
    resolveAvailabilityForDate(psikologUserId: number, dateStr: string): Promise<{
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
}
