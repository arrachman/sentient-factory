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
exports.BookingPackageService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_events_service_1 = require("./booking-events.service");
const booking_notification_service_1 = require("./booking-notification.service");
const booking_validation_service_1 = require("./booking-validation.service");
let BookingPackageService = class BookingPackageService {
    prisma;
    validation;
    events;
    notifier;
    constructor(prisma, validation, events, notifier) {
        this.prisma = prisma;
        this.validation = validation;
        this.events = events;
        this.notifier = notifier;
    }
    async create(dto, actorId) {
        if (dto.sessions.length < 2) {
            throw new common_1.BadRequestException('Package booking butuh minimal 2 sesi');
        }
        await this.validation.assertEntitiesExist(dto.clientId, dto.serviceId, dto.psikologUserId, dto.roomId);
        const service = await this.prisma.clinicService.findFirst({
            where: { id: dto.serviceId, deletedAt: null, isActive: true },
            select: { id: true, sessionCount: true, name: true, durationMinutes: true },
        });
        if (!service)
            throw new common_1.NotFoundException(`Service ${dto.serviceId} not found`);
        if (service.sessionCount < 2) {
            throw new common_1.BadRequestException(`Service '${service.name}' adalah single-session (sessionCount=${service.sessionCount}). Pakai POST /clinic/booking biasa.`);
        }
        if (dto.sessions.length !== service.sessionCount) {
            throw new common_1.BadRequestException(`Jumlah sesi (${dto.sessions.length}) harus = service.sessionCount (${service.sessionCount})`);
        }
        const parsedSessions = this.parseSessions(dto);
        await this.validateSessions(dto, parsedSessions);
        this.assertNoCrossSessionOverlap(parsedSessions);
        return this.persistAndEmit(dto, parsedSessions, actorId);
    }
    parseSessions(dto) {
        return dto.sessions.map((s, idx) => {
            const start = new Date(s.scheduledStart);
            const end = new Date(s.scheduledEnd);
            if (!(start.getTime() < end.getTime())) {
                throw new common_1.BadRequestException(`Sesi ${idx + 1}: scheduledStart harus sebelum scheduledEnd`);
            }
            return {
                index: idx,
                start,
                end,
                psikologUserId: s.psikologUserId ?? dto.psikologUserId,
                roomId: s.roomId ?? dto.roomId,
            };
        });
    }
    async validateSessions(dto, sessions) {
        for (const s of sessions) {
            if (s.psikologUserId !== dto.psikologUserId || s.roomId !== dto.roomId) {
                await this.validation.assertEntitiesExist(dto.clientId, dto.serviceId, s.psikologUserId, s.roomId);
            }
            await this.validation.assertNoRoomConflict({
                roomId: s.roomId,
                scheduledStart: s.start,
                scheduledEnd: s.end,
                excludeBookingId: null,
            });
            await this.validation.assertNoConflict({
                psikologUserId: s.psikologUserId,
                roomId: s.roomId,
                scheduledStart: s.start,
                scheduledEnd: s.end,
                excludeBookingId: null,
            });
            await this.validation.assertSlotMatch(s.start, s.end, dto.serviceId);
            await this.validation.assertPsikologAvailable(s.psikologUserId, s.start);
        }
    }
    assertNoCrossSessionOverlap(sessions) {
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                const a = sessions[i];
                const b = sessions[j];
                if ((a.psikologUserId === b.psikologUserId || a.roomId === b.roomId) &&
                    a.start < b.end &&
                    a.end > b.start) {
                    throw new common_1.ConflictException({
                        message: `Sesi ${a.index + 1} dan ${b.index + 1} dalam paket ini overlap`,
                        conflictType: a.psikologUserId === b.psikologUserId ? 'psikolog' : 'room',
                    });
                }
            }
        }
    }
    async persistAndEmit(dto, sessions, actorId) {
        const packageGroupId = (0, crypto_1.randomUUID)();
        const created = await this.prisma.$transaction(sessions.map((s) => this.prisma.clinicBooking.create({
            data: {
                clientId: dto.clientId,
                serviceId: dto.serviceId,
                psikologUserId: s.psikologUserId,
                roomId: s.roomId,
                scheduledStart: s.start,
                scheduledEnd: s.end,
                sessionN: s.index + 1,
                sessionTotal: sessions.length,
                packageGroupId,
                status: 'checked_in',
                createdViaWalkIn: false,
                notes: dto.notes,
                createdBy: actorId,
                updatedBy: actorId,
            },
            include: this.includeRelations(),
        })));
        for (const b of created) {
            this.events.emit({ type: 'created', bookingId: b.id, status: b.status });
        }
        const createdIds = created.map((b) => b.id);
        const priorBookings = await this.prisma.clinicBooking.count({
            where: { clientId: dto.clientId, id: { notIn: createdIds }, deletedAt: null },
        });
        if (priorBookings === 0 && created.length > 0) {
            void this.notifier.notifyPsikologInfo(created[0]);
        }
        for (const b of created) {
            void this.notifier.notify(b, 'Konfirmasi Booking');
        }
        return {
            success: true,
            data: { packageGroupId, sessionCount: created.length, bookings: created },
            message: `Package created: ${created.length} sessions`,
        };
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
                    clinicPsikologProfile: {
                        select: { title: true, color: true, specialty: true, license: true },
                    },
                },
            },
            room: { select: { id: true, name: true, type: true } },
        };
    }
};
exports.BookingPackageService = BookingPackageService;
exports.BookingPackageService = BookingPackageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_validation_service_1.BookingValidationService,
        booking_events_service_1.BookingEventsService,
        booking_notification_service_1.BookingNotificationService])
], BookingPackageService);
//# sourceMappingURL=booking-package.service.js.map