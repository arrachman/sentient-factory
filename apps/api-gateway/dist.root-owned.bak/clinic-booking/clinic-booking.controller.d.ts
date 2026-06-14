import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicBookingService } from './clinic-booking.service';
import { CancelBookingDto, CreateBookingDto, CreatePackageBookingDto, QueryBookingDto, RescheduleBookingDto, UpdateBookingDto } from './dto/clinic-booking.dto';
export declare class ClinicBookingController {
    private readonly service;
    constructor(service: ClinicBookingService);
    create(dto: CreateBookingDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    createPackage(dto: CreatePackageBookingDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            packageGroupId: `${string}-${string}-${string}-${string}-${string}`;
            sessionCount: number;
            bookings: ({
                psikolog: {
                    id: number;
                    email: string;
                    fullName: string | null;
                    avatarUrl: string | null;
                    phone: string | null;
                    clinicPsikologProfile: {
                        title: string | null;
                        specialty: string[];
                        color: string | null;
                        license: string | null;
                    } | null;
                };
                client: {
                    name: string;
                    id: number;
                    gender: string;
                    phoneWa: string;
                };
                service: {
                    name: string;
                    category: string;
                    id: number;
                    sessionCount: number;
                    durationMinutes: number;
                    basePrice: import("@prisma/client/runtime/library").Decimal;
                };
                room: {
                    name: string;
                    id: number;
                    type: string;
                };
            } & {
                createdAt: Date;
                createdBy: number | null;
                updatedAt: Date;
                updatedBy: number | null;
                deletedAt: Date | null;
                deletedBy: number | null;
                id: number;
                status: string;
                notes: string | null;
                clientId: number;
                serviceId: number;
                psikologUserId: number;
                roomId: number;
                scheduledStart: Date;
                scheduledEnd: Date;
                sessionN: number;
                sessionTotal: number;
                packageGroupId: string | null;
                bufferOverride: boolean;
                createdViaWalkIn: boolean;
                confirmedAt: Date | null;
                checkedInAt: Date | null;
                startedAt: Date | null;
                completedAt: Date | null;
                cancelledAt: Date | null;
                cancelReason: string | null;
                rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
            })[];
        };
        message: string;
    }>;
    findAll(query: QueryBookingDto): Promise<{
        success: boolean;
        data: ({
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    update(id: number, dto: UpdateBookingDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    start(id: number, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    complete(id: number, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    cancel(id: number, dto: CancelBookingDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    reschedule(id: number, dto: RescheduleBookingDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            psikolog: {
                id: number;
                email: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                clinicPsikologProfile: {
                    title: string | null;
                    specialty: string[];
                    color: string | null;
                    license: string | null;
                } | null;
            };
            client: {
                name: string;
                id: number;
                gender: string;
                phoneWa: string;
            };
            service: {
                name: string;
                category: string;
                id: number;
                sessionCount: number;
                durationMinutes: number;
                basePrice: import("@prisma/client/runtime/library").Decimal;
            };
            room: {
                name: string;
                id: number;
                type: string;
            };
        } & {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            status: string;
            notes: string | null;
            clientId: number;
            serviceId: number;
            psikologUserId: number;
            roomId: number;
            scheduledStart: Date;
            scheduledEnd: Date;
            sessionN: number;
            sessionTotal: number;
            packageGroupId: string | null;
            bufferOverride: boolean;
            createdViaWalkIn: boolean;
            confirmedAt: Date | null;
            checkedInAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            rescheduleHistory: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    addNote(id: number, dto: {
        noteText: string;
    }, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        };
        message: string;
    }>;
    listNotes(id: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        }[];
    }>;
    sendReminder(id: number, dto: {
        templateName?: string;
    }, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                logId: number;
                status: string;
                messageId?: undefined;
            };
            message: string;
        } | {
            success: boolean;
            data: {
                logId: number;
                status: string;
                messageId: string;
            };
            message: string | undefined;
        } | {
            success: boolean;
            error: string;
        };
        message: string;
    }>;
}
