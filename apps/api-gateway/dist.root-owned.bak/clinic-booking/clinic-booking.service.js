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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicBookingService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_events_service_1 = require("./booking-events.service");
const booking_notes_service_1 = require("./booking-notes.service");
const booking_notification_service_1 = require("./booking-notification.service");
const booking_package_service_1 = require("./booking-package.service");
const booking_validation_service_1 = require("./booking-validation.service");
const booking_state_machine_1 = require("./booking-state-machine");
const timezone_util_1 = require("./timezone.util");
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function addDaysIso(dateStr, days) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + days);
    const pad = (n) => String(n).padStart(2, '0');
    return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}
let ClinicBookingService = class ClinicBookingService {
    prisma;
    validation;
    notifier;
    notes;
    packageService;
    events;
    constructor(prisma, validation, notifier, notes, packageService, events) {
        this.prisma = prisma;
        this.validation = validation;
        this.notifier = notifier;
        this.notes = notes;
        this.packageService = packageService;
        this.events = events;
    }
    async create(dto, actorId) {
        const start = new Date(dto.scheduledStart);
        const end = new Date(dto.scheduledEnd);
        if (!(start.getTime() < end.getTime())) {
            throw new common_1.BadRequestException('scheduledStart harus sebelum scheduledEnd');
        }
        await this.validation.assertEntitiesExist(dto.clientId, dto.serviceId, dto.psikologUserId, dto.roomId);
        await this.validation.assertNoRoomConflict({
            roomId: dto.roomId,
            scheduledStart: start,
            scheduledEnd: end,
            excludeBookingId: null,
        });
        await this.validation.assertNoConflict({
            psikologUserId: dto.psikologUserId,
            roomId: dto.roomId,
            scheduledStart: start,
            scheduledEnd: end,
            excludeBookingId: null,
        });
        if (!dto.createdViaWalkIn) {
            await this.validation.assertSlotMatch(start, end, dto.serviceId);
            await this.validation.assertPsikologAvailable(dto.psikologUserId, start);
        }
        const booking = await this.prisma.clinicBooking.create({
            data: {
                clientId: dto.clientId,
                serviceId: dto.serviceId,
                psikologUserId: dto.psikologUserId,
                roomId: dto.roomId,
                scheduledStart: start,
                scheduledEnd: end,
                sessionN: dto.sessionN ?? 1,
                sessionTotal: dto.sessionTotal ?? 1,
                packageGroupId: dto.packageGroupId ?? (dto.sessionTotal && dto.sessionTotal > 1 ? (0, crypto_1.randomUUID)() : null),
                status: 'checked_in',
                createdViaWalkIn: dto.createdViaWalkIn ?? false,
                checkedInAt: new Date(),
                notes: dto.notes,
                createdBy: actorId,
                updatedBy: actorId,
            },
            include: this.includeRelations(),
        });
        this.events.emit({ type: 'created', bookingId: booking.id, status: booking.status });
        const priorBookings = await this.prisma.clinicBooking.count({
            where: { clientId: dto.clientId, id: { not: booking.id }, deletedAt: null },
        });
        if (priorBookings === 0) {
            void this.notifier.notifyPsikologInfo(booking);
        }
        void this.notifier.notify(booking, 'Konfirmasi Booking');
        return { success: true, data: booking, message: 'Booking created' };
    }
    createPackage(dto, actorId) {
        return this.packageService.create(dto, actorId);
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (!query.includeCancelled)
            where.status = { not: 'cancelled' };
        if (query.status)
            where.status = query.status;
        if (query.psikologUserId)
            where.psikologUserId = query.psikologUserId;
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.roomId)
            where.roomId = query.roomId;
        const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
        const tz = settings?.timezone || 'Asia/Jakarta';
        if (query.date) {
            if (!ISO_DATE_RE.test(query.date))
                throw new common_1.BadRequestException('date harus YYYY-MM-DD');
            const dayStart = (0, timezone_util_1.localDateAtMidnight)(query.date, tz);
            const dayEnd = (0, timezone_util_1.localDateAtMidnight)(addDaysIso(query.date, 1), tz);
            where.scheduledStart = { gte: dayStart, lt: dayEnd };
        }
        else if (query.dateFrom || query.dateTo) {
            const range = {};
            if (query.dateFrom) {
                if (!ISO_DATE_RE.test(query.dateFrom))
                    throw new common_1.BadRequestException('dateFrom harus YYYY-MM-DD');
                range.gte = (0, timezone_util_1.localDateAtMidnight)(query.dateFrom, tz);
            }
            if (query.dateTo) {
                if (!ISO_DATE_RE.test(query.dateTo))
                    throw new common_1.BadRequestException('dateTo harus YYYY-MM-DD');
                range.lt = (0, timezone_util_1.localDateAtMidnight)(addDaysIso(query.dateTo, 1), tz);
            }
            where.scheduledStart = range;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicBooking.findMany({
                where,
                include: this.includeRelations(),
                orderBy: [{ scheduledStart: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicBooking.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const booking = await this.prisma.clinicBooking.findFirst({
            where: { id, deletedAt: null },
            include: this.includeRelations(),
        });
        if (!booking)
            throw new common_1.NotFoundException(`Booking ${id} not found`);
        return { success: true, data: booking };
    }
    async update(id, dto, actorId) {
        const existing = await this.findOne(id);
        if (existing.data.status === 'cancelled' || existing.data.status === 'completed') {
            throw new common_1.BadRequestException(`Booking sudah ${existing.data.status}, tidak bisa update`);
        }
        const data = { updatedBy: actorId };
        if (dto.notes !== undefined)
            data.notes = dto.notes;
        const updated = await this.prisma.clinicBooking.update({
            where: { id },
            data,
            include: this.includeRelations(),
        });
        return { success: true, data: updated, message: 'Booking updated' };
    }
    async transition(id, target, actorId) {
        const existing = await this.findOne(id);
        const current = existing.data.status;
        const allowed = booking_state_machine_1.VALID_TRANSITIONS[current] || [];
        if (!allowed.includes(target)) {
            throw new common_1.BadRequestException(`Transisi ${current} → ${target} tidak valid. Allowed: [${allowed.join(', ')}]`);
        }
        const now = new Date();
        const data = { status: target, updatedBy: actorId };
        if (target === 'checked_in')
            data.checkedInAt = now;
        if (target === 'in_progress')
            data.startedAt = now;
        if (target === 'completed')
            data.completedAt = now;
        if (target === 'cancelled')
            data.cancelledAt = now;
        const updated = await this.prisma.clinicBooking.update({
            where: { id },
            data,
            include: this.includeRelations(),
        });
        if (target === 'completed') {
            const nextBooking = await this.prisma.clinicBooking.findFirst({
                where: {
                    clientId: updated.clientId,
                    id: { not: updated.id },
                    deletedAt: null,
                    status: { in: ['scheduled', 'confirmed', 'checked_in'] },
                    scheduledStart: { gt: now },
                },
                orderBy: { scheduledStart: 'asc' },
                select: { scheduledStart: true },
            });
            const sesiBerikutTanggal = nextBooking
                ? `${nextBooking.scheduledStart.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Asia/Jakarta',
                })} pukul ${nextBooking.scheduledStart.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Jakarta',
                })} WIB`
                : '(belum dijadwalkan)';
            void this.notifier.notify(updated, 'Follow-up Post Session', {
                sesi_berikut_tanggal: sesiBerikutTanggal,
            });
        }
        this.events.emit({ type: 'transition', bookingId: id, status: target });
        return { success: true, data: updated, message: `Booking → ${target}` };
    }
    async start(id, actorId) {
        return this.transition(id, 'in_progress', actorId);
    }
    async complete(id, actorId) {
        return this.transition(id, 'completed', actorId);
    }
    async cancel(id, dto, actorId) {
        const existing = await this.findOne(id);
        const current = existing.data.status;
        if (!booking_state_machine_1.VALID_TRANSITIONS[current].includes('cancelled')) {
            throw new common_1.BadRequestException(`Booking sudah ${current}, tidak bisa cancel`);
        }
        const updated = await this.prisma.clinicBooking.update({
            where: { id },
            data: {
                status: 'cancelled',
                cancelledAt: new Date(),
                cancelReason: dto.reason,
                updatedBy: actorId,
            },
            include: this.includeRelations(),
        });
        void this.notifier.notify(updated, 'Cancel Booking', { alasan: dto.reason ?? '-' });
        return { success: true, data: updated, message: 'Booking cancelled' };
    }
    async reschedule(id, dto, actorId) {
        const existing = await this.findOne(id);
        const current = existing.data.status;
        if (current === 'cancelled' || current === 'completed' || current === 'in_progress') {
            throw new common_1.BadRequestException(`Booking ${current}, tidak bisa di-reschedule`);
        }
        const newStart = new Date(dto.scheduledStart);
        const newEnd = new Date(dto.scheduledEnd);
        if (!(newStart.getTime() < newEnd.getTime())) {
            throw new common_1.BadRequestException('scheduledStart harus sebelum scheduledEnd');
        }
        const newPsikologUserId = dto.psikologUserId ?? existing.data.psikologUserId;
        const newRoomId = dto.roomId ?? existing.data.roomId;
        await this.validation.assertNoRoomConflict({
            roomId: newRoomId,
            scheduledStart: newStart,
            scheduledEnd: newEnd,
            excludeBookingId: id,
        });
        await this.validation.assertNoConflict({
            psikologUserId: newPsikologUserId,
            roomId: newRoomId,
            scheduledStart: newStart,
            scheduledEnd: newEnd,
            excludeBookingId: id,
        });
        const history = existing.data.rescheduleHistory || [];
        history.push({
            from: {
                start: existing.data.scheduledStart,
                end: existing.data.scheduledEnd,
                roomId: existing.data.roomId,
                psikologUserId: existing.data.psikologUserId,
            },
            to: {
                start: newStart,
                end: newEnd,
                roomId: newRoomId,
                psikologUserId: newPsikologUserId,
            },
            reason: dto.reason ?? null,
            by: actorId ?? null,
            at: new Date(),
        });
        const updated = await this.prisma.clinicBooking.update({
            where: { id },
            data: {
                scheduledStart: newStart,
                scheduledEnd: newEnd,
                psikologUserId: newPsikologUserId,
                roomId: newRoomId,
                rescheduleHistory: history,
                updatedBy: actorId,
            },
            include: this.includeRelations(),
        });
        const fmtTanggal = (d) => d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Jakarta',
        });
        const fmtWaktu = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) +
            ' WIB';
        void this.notifier.notify(updated, 'Reschedule Booking', {
            tanggal_lama: fmtTanggal(existing.data.scheduledStart),
            waktu_lama: fmtWaktu(existing.data.scheduledStart),
            tanggal_baru: fmtTanggal(newStart),
            waktu_baru: fmtWaktu(newStart),
            alasan: dto.reason ?? '-',
        });
        return { success: true, data: updated, message: 'Booking rescheduled' };
    }
    addNote(bookingId, noteText, actorId) {
        return this.notes.addNote(bookingId, noteText, actorId);
    }
    listNotes(bookingId) {
        return this.notes.listNotes(bookingId);
    }
    async sendReminder(id, templateName, actorId) {
        const booking = await this.findOne(id);
        void actorId;
        const result = await this.notifier.sendManualReminder(booking.data, templateName);
        return { success: true, data: result, message: `Reminder '${templateName}' dispatched` };
    }
    includeRelations() {
        return {
            client: { select: { id: true, name: true, gender: true, phoneWa: true } },
            service: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                    sessionCount: true,
                    durationMinutes: true,
                    basePrice: true,
                },
            },
            psikolog: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    avatarUrl: true,
                    phone: true,
                    clinicPsikologProfile: { select: { title: true, color: true, specialty: true, license: true } },
                },
            },
            room: { select: { id: true, name: true, type: true } },
        };
    }
};
exports.ClinicBookingService = ClinicBookingService;
exports.ClinicBookingService = ClinicBookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_validation_service_1.BookingValidationService,
        booking_notification_service_1.BookingNotificationService,
        booking_notes_service_1.BookingNotesService,
        booking_package_service_1.BookingPackageService,
        booking_events_service_1.BookingEventsService])
], ClinicBookingService);
//# sourceMappingURL=clinic-booking.service.js.map