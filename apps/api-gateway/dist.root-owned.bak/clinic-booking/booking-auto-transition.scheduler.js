"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BookingAutoTransitionScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingAutoTransitionScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_events_service_1 = require("./booking-events.service");
let BookingAutoTransitionScheduler = BookingAutoTransitionScheduler_1 = class BookingAutoTransitionScheduler {
    prisma;
    events;
    logger = new common_1.Logger(BookingAutoTransitionScheduler_1.name);
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async run() {
        const now = new Date();
        await Promise.all([this.autoStart(now), this.autoComplete(now)]);
    }
    async autoStart(now) {
        const bookings = await this.prisma.clinicBooking.findMany({
            where: {
                deletedAt: null,
                status: { in: ['checked_in'] },
                scheduledStart: { lte: now },
                scheduledEnd: { gt: now },
            },
            select: { id: true, status: true },
        });
        if (bookings.length === 0)
            return;
        this.logger.log(`[auto-start] ${bookings.length} booking(s) → in_progress`);
        for (const b of bookings) {
            await this.prisma.clinicBooking.update({
                where: { id: b.id },
                data: { status: 'in_progress', updatedAt: now },
            });
            this.events.emit({ type: 'transition', bookingId: b.id, status: 'in_progress' });
        }
    }
    async autoComplete(now) {
        const bookings = await this.prisma.clinicBooking.findMany({
            where: {
                deletedAt: null,
                status: 'in_progress',
                scheduledEnd: { lte: now },
            },
            select: { id: true },
        });
        if (bookings.length === 0)
            return;
        this.logger.log(`[auto-complete] ${bookings.length} booking(s) → completed`);
        for (const b of bookings) {
            await this.prisma.clinicBooking.update({
                where: { id: b.id },
                data: { status: 'completed', updatedAt: now },
            });
            this.events.emit({ type: 'transition', bookingId: b.id, status: 'completed' });
        }
    }
};
exports.BookingAutoTransitionScheduler = BookingAutoTransitionScheduler;
__decorate([
    (0, schedule_1.Cron)('* * * * *', { name: 'auto-transition' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingAutoTransitionScheduler.prototype, "run", null);
exports.BookingAutoTransitionScheduler = BookingAutoTransitionScheduler = BookingAutoTransitionScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_events_service_1.BookingEventsService])
], BookingAutoTransitionScheduler);
//# sourceMappingURL=booking-auto-transition.scheduler.js.map