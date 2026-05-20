import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
export declare class BookingAutoTransitionScheduler {
    private readonly prisma;
    private readonly events;
    private readonly logger;
    constructor(prisma: PrismaService, events: BookingEventsService);
    run(): Promise<void>;
    private autoStart;
    private autoComplete;
}
