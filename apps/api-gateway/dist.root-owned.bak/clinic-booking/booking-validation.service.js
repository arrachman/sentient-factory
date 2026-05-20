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
exports.BookingValidationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const timezone_util_1 = require("./timezone.util");
const slot_resolve_util_1 = require("./slot-resolve.util");
let BookingValidationService = class BookingValidationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertEntitiesExist(clientId, serviceId, psikologUserId, roomId) {
        const [client, service, psikolog, room] = await Promise.all([
            this.prisma.clinicClient.findFirst({
                where: { id: clientId, deletedAt: null },
                select: { id: true },
            }),
            this.prisma.clinicService.findFirst({
                where: { id: serviceId, deletedAt: null, isActive: true },
                select: { id: true },
            }),
            this.prisma.user.findFirst({
                where: {
                    id: psikologUserId,
                    deletedAt: null,
                    isActive: true,
                    roles: { some: { deletedAt: null, role: { name: 'clinic-psikolog' } } },
                },
                select: { id: true },
            }),
            this.prisma.clinicRoom.findFirst({
                where: { id: roomId, deletedAt: null, isActive: true },
                select: { id: true },
            }),
        ]);
        if (!client)
            throw new common_1.NotFoundException(`Client ${clientId} not found / deleted`);
        if (!service)
            throw new common_1.NotFoundException(`Service ${serviceId} not found / inactive`);
        if (!psikolog) {
            throw new common_1.NotFoundException(`Psikolog user ${psikologUserId} not found / not active clinic-psikolog`);
        }
        if (!room)
            throw new common_1.NotFoundException(`Room ${roomId} not found / inactive`);
    }
    async assertNoRoomConflict(args) {
        const { roomId, scheduledStart, scheduledEnd, excludeBookingId } = args;
        const overlapWhere = {
            deletedAt: null,
            status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
            roomId,
            scheduledStart: { lt: scheduledEnd },
            scheduledEnd: { gt: scheduledStart },
        };
        if (excludeBookingId)
            overlapWhere.id = { not: excludeBookingId };
        const roomConflict = await this.prisma.clinicBooking.findFirst({
            where: overlapWhere,
            select: { id: true, scheduledStart: true, scheduledEnd: true },
        });
        if (roomConflict) {
            throw new common_1.ConflictException({
                message: 'Room conflict — ruangan sudah terpakai di waktu tersebut',
                conflictType: 'room',
                conflictBookingId: roomConflict.id,
                scheduledStart: roomConflict.scheduledStart,
                scheduledEnd: roomConflict.scheduledEnd,
            });
        }
    }
    async assertNoConflict(args) {
        const { psikologUserId, scheduledStart, scheduledEnd, excludeBookingId } = args;
        const overlapWhere = {
            deletedAt: null,
            status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
            scheduledStart: { lt: scheduledEnd },
            scheduledEnd: { gt: scheduledStart },
        };
        if (excludeBookingId)
            overlapWhere.id = { not: excludeBookingId };
        const psikologConflict = await this.prisma.clinicBooking.findFirst({
            where: { ...overlapWhere, psikologUserId },
            select: { id: true, scheduledStart: true, scheduledEnd: true },
        });
        if (psikologConflict) {
            throw new common_1.ConflictException({
                message: 'Psikolog conflict',
                conflictType: 'psikolog',
                conflictBookingId: psikologConflict.id,
                scheduledStart: psikologConflict.scheduledStart,
                scheduledEnd: psikologConflict.scheduledEnd,
            });
        }
    }
    async assertSlotMatch(start, end, serviceId) {
        const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
        if (!settings)
            return;
        const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const tz = settings.timezone || 'Asia/Jakarta';
        const startParts = (0, timezone_util_1.localPartsInTimezone)(start, tz);
        const endParts = (0, timezone_util_1.localPartsInTimezone)(end, tz);
        const closed = settings.closedDayOfWeek || [];
        if (closed.includes(startParts.dow)) {
            throw new common_1.BadRequestException(`Klinik tutup di hari ${DAY_NAMES[startParts.dow]}. Aktifkan "Lewati validasi jeda & jam buka" untuk override.`);
        }
        const holidays = settings.holidays || [];
        if (holidays.includes(startParts.dateStr)) {
            throw new common_1.BadRequestException(`Tanggal ${startParts.dateStr} adalah hari libur. Aktifkan "Lewati validasi jeda & jam buka" untuk override.`);
        }
        const globalSlots = settings.slotsOfDay || [];
        if (globalSlots.length === 0)
            return;
        let slots = globalSlots;
        if (serviceId !== undefined) {
            const service = await this.prisma.clinicService.findFirst({
                where: { id: serviceId, deletedAt: null },
                select: { slotOverrides: true },
            });
            slots = (0, slot_resolve_util_1.resolveServiceSlots)(globalSlots, service?.slotOverrides ?? null);
        }
        const matched = slots.find((s) => s.start === startParts.hhmm && s.end === endParts.hhmm);
        if (!matched) {
            const available = slots.map((s) => `${s.start}-${s.end}`).join(', ');
            throw new common_1.BadRequestException(`Booking ${startParts.hhmm}-${endParts.hhmm} tidak cocok dengan slot layanan ini. Slot tersedia: ${available}.`);
        }
    }
    async assertWithinOperatingHours(start, end) {
        return this.assertSlotMatch(start, end);
    }
    async assertPsikologAvailable(psikologUserId, start, slotIdx = null) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { userId: psikologUserId, deletedAt: null },
            select: { weeklyAvailability: true, user: { select: { fullName: true, email: true } } },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Psikolog profile untuk user ${psikologUserId} tidak ditemukan.`);
        }
        const settings = await this.prisma.clinicSettings.findFirst({
            where: { id: 1 },
            select: { timezone: true },
        });
        const tz = settings?.timezone || 'Asia/Jakarta';
        const psikologName = profile.user.fullName ?? profile.user.email;
        const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const DAY_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const startParts = (0, timezone_util_1.localPartsInTimezone)(start, tz);
        const dow = startParts.dow;
        const dateOnly = (0, timezone_util_1.dateStrToDateColumn)(startParts.dateStr);
        const override = await this.prisma.clinicPsikologDateOverride.findUnique({
            where: { psikologUserId_date: { psikologUserId, date: dateOnly } },
        });
        if (override) {
            if (!override.isOpen) {
                throw new common_1.BadRequestException(override.reason
                    ? `${psikologName} tidak praktik di tanggal ini (${override.reason}).`
                    : `${psikologName} tidak praktik di tanggal ini (override jadwal).`);
            }
            const overrideSlots = (override.slotIndices ?? null);
            if (slotIdx !== null &&
                Array.isArray(overrideSlots) &&
                overrideSlots.length > 0 &&
                !overrideSlots.includes(slotIdx)) {
                throw new common_1.BadRequestException(`Slot terpilih tidak masuk jadwal khusus ${psikologName} di tanggal ini.`);
            }
            return;
        }
        const availability = (profile.weeklyAvailability ?? {});
        if (Object.keys(availability).length === 0) {
            throw new common_1.BadRequestException(`Psikolog ${psikologName} belum mengatur jadwal mingguan. Set dulu di menu Psikolog → Edit → Jadwal Mingguan.`);
        }
        const dayCfg = availability[DAY_KEYS[dow]];
        if (!dayCfg || !dayCfg.isOpen) {
            throw new common_1.BadRequestException(`Psikolog ${psikologName} tidak praktik di hari ${DAY_ID[dow]}. Pilih psikolog atau hari lain.`);
        }
        if (slotIdx !== null && Array.isArray(dayCfg.slotIndices) && dayCfg.slotIndices.length > 0) {
            if (!dayCfg.slotIndices.includes(slotIdx)) {
                throw new common_1.BadRequestException(`Slot terpilih tidak masuk jadwal ${psikologName} di hari ${DAY_ID[dow]}.`);
            }
        }
    }
};
exports.BookingValidationService = BookingValidationService;
exports.BookingValidationService = BookingValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingValidationService);
//# sourceMappingURL=booking-validation.service.js.map