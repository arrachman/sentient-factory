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
exports.PsikologDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const timezone_util_1 = require("../clinic-booking/timezone.util");
let PsikologDashboardService = class PsikologDashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyStats(userId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const [completed30d, cancelled30d, distinctClients] = await Promise.all([
            this.prisma.clinicBooking.count({
                where: {
                    psikologUserId: userId,
                    status: 'completed',
                    scheduledStart: { gte: thirtyDaysAgo, lte: now },
                    deletedAt: null,
                },
            }),
            this.prisma.clinicBooking.count({
                where: {
                    psikologUserId: userId,
                    status: 'cancelled',
                    scheduledStart: { gte: thirtyDaysAgo, lte: now },
                    deletedAt: null,
                },
            }),
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    status: { not: 'cancelled' },
                    scheduledStart: { gte: ninetyDaysAgo },
                    deletedAt: null,
                },
                select: { clientId: true },
                distinct: ['clientId'],
            }),
        ]);
        const total30d = completed30d + cancelled30d;
        const kehadiran = total30d > 0 ? Math.round((completed30d / total30d) * 100) : null;
        return {
            success: true,
            data: {
                sesi30Hari: completed30d,
                klienAktif: distinctClients.length,
                kehadiran,
                ratingKlien: null,
            },
        };
    }
    async getDashboardStats(userId) {
        const tz = 'Asia/Jakarta';
        const nowLocal = (0, timezone_util_1.localPartsInTimezone)(new Date(), tz);
        const todayStr = nowLocal.dateStr;
        const todayStart = (0, timezone_util_1.localDateAtMidnight)(todayStr, tz);
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        const isoDow = nowLocal.dow === 0 ? 6 : nowLocal.dow - 1;
        const weekStart = new Date(todayStart.getTime() - isoDow * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAhead = new Date(todayStart.getTime() + 14 * 24 * 60 * 60 * 1000);
        const [todayBookings, weekBookings, distinctClients30d, completedNoNote, packageEnding] = await Promise.all([
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    scheduledStart: { gte: todayStart, lt: todayEnd },
                    deletedAt: null,
                },
                select: { status: true },
            }),
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    scheduledStart: { gte: weekStart, lt: weekEnd },
                    status: { not: 'cancelled' },
                    deletedAt: null,
                },
                select: { scheduledStart: true },
            }),
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    status: { not: 'cancelled' },
                    scheduledStart: { gte: thirtyDaysAgo, lte: todayEnd },
                    deletedAt: null,
                },
                select: { clientId: true },
                distinct: ['clientId'],
            }),
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    status: 'completed',
                    scheduledStart: { gte: sevenDaysAgo, lte: todayEnd },
                    deletedAt: null,
                },
                select: {
                    id: true,
                    scheduledStart: true,
                    client: { select: { name: true } },
                    service: { select: { name: true } },
                },
                orderBy: { scheduledStart: 'desc' },
                take: 20,
            }),
            this.prisma.clinicBooking.findMany({
                where: {
                    psikologUserId: userId,
                    status: { notIn: ['cancelled', 'completed'] },
                    scheduledStart: { gte: todayStart, lt: fourteenDaysAhead },
                    sessionTotal: { gt: 1 },
                    deletedAt: null,
                },
                select: {
                    id: true,
                    scheduledStart: true,
                    sessionN: true,
                    sessionTotal: true,
                    client: { select: { name: true } },
                },
                orderBy: { scheduledStart: 'asc' },
                take: 10,
            }),
        ]);
        const completedIds = completedNoNote.map((b) => b.id);
        const notesExisting = completedIds.length
            ? await this.prisma.clinicSessionNote.findMany({
                where: {
                    bookingId: { in: completedIds },
                    deletedAt: null,
                },
                select: { bookingId: true },
            })
            : [];
        const bookingsWithNote = new Set(notesExisting.map((n) => n.bookingId));
        const pendingNotes = completedNoNote
            .filter((b) => !bookingsWithNote.has(b.id))
            .map((b) => ({
            bookingId: b.id,
            clientName: b.client.name,
            serviceName: b.service.name,
            scheduledStart: b.scheduledStart.toISOString(),
        }));
        const packageEndingSoon = packageEnding
            .filter((b) => b.sessionN === b.sessionTotal - 1)
            .slice(0, 5)
            .map((b) => ({
            bookingId: b.id,
            clientName: b.client.name,
            sessionN: b.sessionN,
            sessionTotal: b.sessionTotal,
            scheduledStart: b.scheduledStart.toISOString(),
        }));
        const today = {
            total: todayBookings.length,
            completed: todayBookings.filter((b) => b.status === 'completed').length,
            inProgress: todayBookings.filter((b) => b.status === 'in_progress').length,
            upcoming: todayBookings.filter((b) => ['awaiting_dp', 'confirmed', 'checked_in'].includes(b.status)).length,
            cancelled: todayBookings.filter((b) => b.status === 'cancelled').length,
        };
        const weekData = [0, 0, 0, 0, 0, 0, 0];
        for (const b of weekBookings) {
            const parts = (0, timezone_util_1.localPartsInTimezone)(b.scheduledStart, tz);
            const idx = parts.dow === 0 ? 6 : parts.dow - 1;
            weekData[idx]++;
        }
        const weekTotal = weekData.reduce((a, b) => a + b, 0);
        return {
            success: true,
            data: {
                today,
                week: {
                    data: weekData,
                    total: weekTotal,
                    startDate: (0, timezone_util_1.localPartsInTimezone)(weekStart, tz).dateStr,
                },
                klienAktif: distinctClients30d.length,
                catatanTertunda: pendingNotes.length,
                pendingNotes,
                packageEndingSoon,
                anchorDate: todayStr,
            },
        };
    }
};
exports.PsikologDashboardService = PsikologDashboardService;
exports.PsikologDashboardService = PsikologDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PsikologDashboardService);
//# sourceMappingURL=psikolog-dashboard.service.js.map