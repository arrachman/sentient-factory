import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotesService } from './booking-notes.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingPackageService } from './booking-package.service';
import { BookingValidationService } from './booking-validation.service';
import { type BookingStatus, CancelBookingDto, CreateBookingDto, CreatePackageBookingDto, QueryBookingDto, RescheduleBookingDto, UpdateBookingDto } from './dto/clinic-booking.dto';
export declare class ClinicBookingService {
    private readonly prisma;
    private readonly validation;
    private readonly notifier;
    private readonly notes;
    private readonly packageService;
    private readonly events;
    constructor(prisma: PrismaService, validation: BookingValidationService, notifier: BookingNotificationService, notes: BookingNotesService, packageService: BookingPackageService, events: BookingEventsService);
    create(dto: CreateBookingDto, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    createPackage(dto: CreatePackageBookingDto, actorId?: number): Promise<{
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
                    basePrice: Prisma.Decimal;
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
                rescheduleHistory: Prisma.JsonValue;
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
    }>;
    update(id: number, dto: UpdateBookingDto, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    transition(id: number, target: BookingStatus, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    start(id: number, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    complete(id: number, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    cancel(id: number, dto: CancelBookingDto, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    reschedule(id: number, dto: RescheduleBookingDto, actorId?: number): Promise<{
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
                basePrice: Prisma.Decimal;
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
            rescheduleHistory: Prisma.JsonValue;
        };
        message: string;
    }>;
    addNote(bookingId: number, noteText: string, actorId?: number): Promise<{
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
    listNotes(bookingId: number): Promise<{
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
    sendReminder(id: number, templateName: string, actorId?: number): Promise<{
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
    private includeRelations;
}
