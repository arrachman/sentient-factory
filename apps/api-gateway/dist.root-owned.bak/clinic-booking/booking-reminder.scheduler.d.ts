import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
export declare class BookingReminderScheduler {
    private readonly prisma;
    private readonly wa;
    private readonly logger;
    constructor(prisma: PrismaService, wa: ClinicWaService);
    dispatchH1Reminders(): Promise<void>;
    dispatch30mReminders(): Promise<void>;
    dispatchFeedbackH1(): Promise<void>;
    private findCompletedInWindow;
    private dispatchFeedbackAndMark;
    private findBookingsInWindow;
    private dispatchAndMark;
}
