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
var BookingReminderScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingReminderScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const clinic_wa_service_1 = require("../clinic-wa/clinic-wa.service");
const timezone_util_1 = require("./timezone.util");
let BookingReminderScheduler = BookingReminderScheduler_1 = class BookingReminderScheduler {
    prisma;
    wa;
    logger = new common_1.Logger(BookingReminderScheduler_1.name);
    constructor(prisma, wa) {
        this.prisma = prisma;
        this.wa = wa;
    }
    async dispatchH1Reminders() {
        const tz = 'Asia/Jakarta';
        const now = new Date();
        const { dateStr: todayStr } = (0, timezone_util_1.localPartsInTimezone)(now, tz);
        const todayMidnight = (0, timezone_util_1.localDateAtMidnight)(todayStr, tz);
        const tomorrowStart = new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000 - 1);
        const { dateStr: tomorrowStr } = (0, timezone_util_1.localPartsInTimezone)(tomorrowStart, tz);
        this.logger.log(`[reminder-h1] checking bookings for ${tomorrowStr}`);
        const bookings = await this.findBookingsInWindow(tomorrowStart, tomorrowEnd, 'h1');
        this.logger.log(`[reminder-h1] candidate ${bookings.length} bookings`);
        for (const b of bookings) {
            await this.dispatchAndMark(b, 'Pengingat H-1 Booking', 'h1');
        }
    }
    async dispatch30mReminders() {
        const now = new Date();
        const start = new Date(now.getTime() + 25 * 60 * 1000);
        const end = new Date(now.getTime() + 35 * 60 * 1000);
        const bookings = await this.findBookingsInWindow(start, end, 'm30');
        this.logger.log(`[reminder-30m] candidate ${bookings.length} bookings`);
        for (const b of bookings) {
            await this.dispatchAndMark(b, 'Pengingat 30 Menit Sebelum Sesi', 'm30');
        }
    }
    async dispatchFeedbackH1() {
        const tz = 'Asia/Jakarta';
        const now = new Date();
        const { dateStr: todayStr } = (0, timezone_util_1.localPartsInTimezone)(now, tz);
        const todayMidnight = (0, timezone_util_1.localDateAtMidnight)(todayStr, tz);
        const yesterdayStart = new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayEnd = new Date(todayMidnight.getTime() - 1);
        const { dateStr: yesterdayStr } = (0, timezone_util_1.localPartsInTimezone)(yesterdayStart, tz);
        this.logger.log(`[feedback-h1] checking bookings completed on ${yesterdayStr}`);
        const bookings = await this.findCompletedInWindow(yesterdayStart, yesterdayEnd);
        this.logger.log(`[feedback-h1] candidate ${bookings.length} bookings`);
        for (const b of bookings) {
            await this.dispatchFeedbackAndMark(b);
        }
    }
    async findCompletedInWindow(start, end) {
        const bookings = await this.prisma.clinicBooking.findMany({
            where: {
                deletedAt: null,
                status: 'completed',
                completedAt: { gte: start, lte: end },
            },
            include: {
                client: { select: { id: true, name: true, phoneWa: true, waOptedOut: true } },
                psikolog: { select: { fullName: true } },
            },
        });
        const result = [];
        for (const b of bookings) {
            if (!b.client?.phoneWa || b.client.waOptedOut)
                continue;
            const existingLog = await this.prisma.clinicWaLog.findFirst({
                where: {
                    bookingId: b.id,
                    metadata: { path: ['reminderFlag'], equals: 'feedback_h1' },
                },
                select: { id: true },
            });
            if (!existingLog)
                result.push(b);
        }
        return result;
    }
    async dispatchFeedbackAndMark(booking) {
        try {
            const result = await this.wa.dispatch({
                templateName: 'Form Feedback',
                recipientType: 'klien',
                recipientPhone: booking.client.phoneWa,
                variables: {
                    nama_klien: booking.client.name,
                    nama_psikolog: booking.psikolog?.fullName ?? 'psikolog kami',
                },
                bookingId: booking.id,
            });
            const lastLog = await this.prisma.clinicWaLog.findFirst({
                where: { bookingId: booking.id },
                orderBy: { createdAt: 'desc' },
            });
            if (lastLog) {
                await this.prisma.clinicWaLog.update({
                    where: { id: lastLog.id },
                    data: {
                        metadata: {
                            ...(lastLog.metadata ?? {}),
                            reminderFlag: 'feedback_h1',
                        },
                    },
                });
            }
            this.logger.log(`[feedback-h1] sent booking ${booking.id} → ${result.success ? 'OK' : 'fail'}`);
        }
        catch (err) {
            this.logger.warn(`[feedback-h1] failed booking ${booking.id}: ${err instanceof Error ? err.message : err}`);
        }
    }
    async findBookingsInWindow(start, end, flag) {
        const bookings = await this.prisma.clinicBooking.findMany({
            where: {
                deletedAt: null,
                status: { in: ['confirmed', 'checked_in'] },
                scheduledStart: { gte: start, lte: end },
            },
            include: {
                client: { select: { id: true, name: true, phoneWa: true, waOptedOut: true } },
                service: { select: { name: true } },
                psikolog: { select: { fullName: true } },
                room: { select: { name: true } },
            },
        });
        const result = [];
        for (const b of bookings) {
            if (!b.client?.phoneWa || b.client.waOptedOut)
                continue;
            const existingLog = await this.prisma.clinicWaLog.findFirst({
                where: {
                    bookingId: b.id,
                    metadata: { path: ['reminderFlag'], equals: flag },
                },
                select: { id: true },
            });
            if (!existingLog)
                result.push(b);
        }
        return result;
    }
    async dispatchAndMark(booking, templateName, flag) {
        const date = new Date(booking.scheduledStart);
        try {
            const result = await this.wa.dispatch({
                templateName,
                recipientType: 'klien',
                recipientPhone: booking.client.phoneWa,
                variables: {
                    nama_klien: booking.client.name,
                    layanan: booking.service?.name ?? '',
                    nama_psikolog: booking.psikolog?.fullName ?? 'psikolog kami',
                    ruang: booking.room?.name ?? '',
                    tanggal: date.toLocaleString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    }),
                    waktu: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                },
                bookingId: booking.id,
            });
            const lastLog = await this.prisma.clinicWaLog.findFirst({
                where: { bookingId: booking.id },
                orderBy: { createdAt: 'desc' },
            });
            if (lastLog) {
                await this.prisma.clinicWaLog.update({
                    where: { id: lastLog.id },
                    data: {
                        metadata: {
                            ...(lastLog.metadata ?? {}),
                            reminderFlag: flag,
                        },
                    },
                });
            }
            this.logger.log(`[reminder-${flag}] sent booking ${booking.id} → ${result.success ? 'OK' : 'fail'}`);
        }
        catch (err) {
            this.logger.warn(`[reminder-${flag}] failed booking ${booking.id}: ${err instanceof Error ? err.message : err}`);
        }
    }
};
exports.BookingReminderScheduler = BookingReminderScheduler;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *', { name: 'reminder-h1', timeZone: 'Asia/Jakarta' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingReminderScheduler.prototype, "dispatchH1Reminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES, { name: 'reminder-30m' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingReminderScheduler.prototype, "dispatch30mReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * *', { name: 'feedback-h1', timeZone: 'Asia/Jakarta' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingReminderScheduler.prototype, "dispatchFeedbackH1", null);
exports.BookingReminderScheduler = BookingReminderScheduler = BookingReminderScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clinic_wa_service_1.ClinicWaService])
], BookingReminderScheduler);
//# sourceMappingURL=booking-reminder.scheduler.js.map