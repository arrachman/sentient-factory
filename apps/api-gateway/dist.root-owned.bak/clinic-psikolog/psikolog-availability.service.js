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
exports.PsikologAvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const timezone_util_1 = require("../clinic-booking/timezone.util");
const psikolog_utils_1 = require("./psikolog.utils");
let PsikologAvailabilityService = class PsikologAvailabilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listOwnDateOverrides(userId, from, to) {
        return this.listDateOverridesByUser(userId, from, to);
    }
    async listDateOverridesByUser(userId, from, to) {
        const where = {
            psikologUserId: userId,
        };
        if (from || to) {
            where.date = {};
            if (from)
                where.date.gte = new Date(from);
            if (to)
                where.date.lte = new Date(to);
        }
        const items = await this.prisma.clinicPsikologDateOverride.findMany({
            where,
            orderBy: [{ date: 'asc' }],
        });
        return { success: true, data: items };
    }
    async upsertOwnDateOverride(userId, input) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { userId, deletedAt: null },
            select: { userId: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Profile psikolog tidak ditemukan untuk user ${userId}.`);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
            throw new common_1.ConflictException(`Tanggal '${input.date}' bukan format ISO YYYY-MM-DD.`);
        }
        const dateObj = (0, timezone_util_1.dateStrToDateColumn)(input.date);
        const slotIndicesValue = input.slotIndices === undefined || input.slotIndices === null
            ? client_1.Prisma.DbNull
            : input.slotIndices;
        const upserted = await this.prisma.clinicPsikologDateOverride.upsert({
            where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
            create: {
                psikologUserId: userId,
                date: dateObj,
                isOpen: input.isOpen,
                slotIndices: slotIndicesValue,
                reason: input.reason ?? null,
                createdBy: userId,
                updatedBy: userId,
            },
            update: {
                isOpen: input.isOpen,
                slotIndices: slotIndicesValue,
                reason: input.reason ?? null,
                updatedBy: userId,
            },
        });
        return { success: true, data: upserted, message: 'Override tersimpan' };
    }
    async deleteOwnDateOverride(userId, dateStr) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new common_1.ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
        }
        const dateObj = (0, timezone_util_1.dateStrToDateColumn)(dateStr);
        await this.prisma.clinicPsikologDateOverride
            .delete({
            where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
        })
            .catch(() => {
            throw new common_1.NotFoundException(`Override tanggal ${dateStr} tidak ditemukan.`);
        });
        return { success: true, message: 'Override dihapus, kembali ke jadwal mingguan' };
    }
    async updateOwnAvailability(userId, weeklyAvailability) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { userId, deletedAt: null },
            select: { id: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Profile psikolog tidak ditemukan untuk user ${userId}. Hubungi admin.`);
        }
        const updated = await this.prisma.clinicPsikologProfile.update({
            where: { id: profile.id },
            data: {
                weeklyAvailability: weeklyAvailability,
                updatedBy: userId,
            },
            include: { user: (0, psikolog_utils_1.userSelect)() },
        });
        return {
            success: true,
            data: (0, psikolog_utils_1.mapPsikologToResponse)(updated.user, updated),
            message: 'Jadwal availability tersimpan',
        };
    }
    async resolveAvailabilityForDate(psikologUserId, dateStr) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new common_1.ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
        }
        const settings = await this.prisma.clinicSettings.findFirst({
            where: { id: 1 },
            select: { timezone: true },
        });
        const tz = settings?.timezone || 'Asia/Jakarta';
        const dateObj = (0, timezone_util_1.dateStrToDateColumn)(dateStr);
        const dow = (0, timezone_util_1.localPartsInTimezone)((0, timezone_util_1.localDateAtMidnight)(dateStr, tz), tz).dow;
        const [override, profile] = await Promise.all([
            this.prisma.clinicPsikologDateOverride.findUnique({
                where: { psikologUserId_date: { psikologUserId, date: dateObj } },
            }),
            this.prisma.clinicPsikologProfile.findFirst({
                where: { userId: psikologUserId, deletedAt: null },
                select: {
                    weeklyAvailability: true,
                    user: { select: { fullName: true, email: true } },
                },
            }),
        ]);
        if (!profile) {
            throw new common_1.NotFoundException(`Profile psikolog untuk user ${psikologUserId} tidak ditemukan.`);
        }
        if (override) {
            return {
                success: true,
                data: {
                    isOpen: override.isOpen,
                    slotIndices: override.slotIndices ?? null,
                    source: 'override',
                    reason: override.reason,
                    psikologName: profile.user.fullName ?? profile.user.email,
                },
            };
        }
        const wa = (profile.weeklyAvailability ?? {});
        if (Object.keys(wa).length === 0) {
            return {
                success: true,
                data: {
                    isOpen: false,
                    slotIndices: [],
                    source: 'unset',
                    reason: null,
                    psikologName: profile.user.fullName ?? profile.user.email,
                },
            };
        }
        const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayCfg = wa[DAY_KEYS[dow]];
        return {
            success: true,
            data: {
                isOpen: !!dayCfg?.isOpen,
                slotIndices: dayCfg?.slotIndices ?? null,
                source: 'weekly',
                reason: null,
                psikologName: profile.user.fullName ?? profile.user.email,
            },
        };
    }
};
exports.PsikologAvailabilityService = PsikologAvailabilityService;
exports.PsikologAvailabilityService = PsikologAvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PsikologAvailabilityService);
//# sourceMappingURL=psikolog-availability.service.js.map