import { PrismaService } from '../prisma/prisma.service';
export declare class BookingValidationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertEntitiesExist(clientId: number, serviceId: number, psikologUserId: number, roomId: number): Promise<void>;
    assertNoRoomConflict(args: {
        roomId: number;
        scheduledStart: Date;
        scheduledEnd: Date;
        excludeBookingId: number | null;
    }): Promise<void>;
    assertNoConflict(args: {
        psikologUserId: number;
        roomId: number;
        scheduledStart: Date;
        scheduledEnd: Date;
        excludeBookingId: number | null;
    }): Promise<void>;
    assertSlotMatch(start: Date, end: Date, serviceId?: number): Promise<void>;
    assertWithinOperatingHours(start: Date, end: Date): Promise<void>;
    assertPsikologAvailable(psikologUserId: number, start: Date, slotIdx?: number | null): Promise<void>;
}
