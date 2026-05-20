import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingValidationService } from './booking-validation.service';
import { CreatePackageBookingDto } from './dto/clinic-booking.dto';
export declare class BookingPackageService {
    private readonly prisma;
    private readonly validation;
    private readonly events;
    private readonly notifier;
    constructor(prisma: PrismaService, validation: BookingValidationService, events: BookingEventsService, notifier: BookingNotificationService);
    create(dto: CreatePackageBookingDto, actorId?: number): Promise<{
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
    private parseSessions;
    private validateSessions;
    private assertNoCrossSessionOverlap;
    private persistAndEmit;
    private includeRelations;
}
