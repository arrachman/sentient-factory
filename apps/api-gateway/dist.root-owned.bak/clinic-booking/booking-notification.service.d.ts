import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
type BookingForNotification = {
    id: number;
    scheduledStart: Date;
    scheduledEnd: Date;
    client: {
        name: string;
        phoneWa: string | null;
    };
    service: {
        name: string;
        basePrice: unknown;
    };
    psikolog: {
        fullName: string | null;
        phone?: string | null;
        clinicPsikologProfile?: {
            title: string | null;
            specialty: string[];
            license: string | null;
        } | null;
    };
    room: {
        name: string;
    };
};
export declare class BookingNotificationService {
    private readonly wa;
    private readonly prisma;
    private readonly logger;
    constructor(wa: ClinicWaService, prisma: PrismaService);
    private templateTargetsPsikolog;
    notify(booking: BookingForNotification, templateName: string, extraVars?: Record<string, string | number>): Promise<void>;
    notifyPsikologInfo(booking: BookingForNotification): Promise<void>;
    sendManualReminder(booking: {
        id: number;
        status: string;
        scheduledStart: Date;
        client: {
            name: string;
            phoneWa: string | null;
        } | null;
        service: {
            name: string;
        } | null;
        psikolog: {
            fullName: string | null;
        } | null;
        room: {
            name: string;
        } | null;
    }, templateName: string): Promise<{
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
    }>;
}
export {};
