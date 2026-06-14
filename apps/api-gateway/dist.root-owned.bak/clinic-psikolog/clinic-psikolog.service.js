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
var ClinicPsikologService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicPsikologService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const password_hasher_1 = require("../auth/password-hasher");
const clinic_wa_service_1 = require("../clinic-wa/clinic-wa.service");
const psikolog_dashboard_service_1 = require("./psikolog-dashboard.service");
const psikolog_availability_service_1 = require("./psikolog-availability.service");
const psikolog_utils_1 = require("./psikolog.utils");
const timezone_util_1 = require("../clinic-booking/timezone.util");
const PSIKOLOG_ROLE_NAME = 'clinic-psikolog';
const DEFAULT_PASSWORD = 'Test1234!';
let ClinicPsikologService = ClinicPsikologService_1 = class ClinicPsikologService {
    prisma;
    dashboard;
    availability;
    wa;
    logger = new common_1.Logger(ClinicPsikologService_1.name);
    constructor(prisma, dashboard, availability, wa) {
        this.prisma = prisma;
        this.dashboard = dashboard;
        this.availability = availability;
        this.wa = wa;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            throw new common_1.ConflictException(`Email ${dto.email} sudah terdaftar${existing.deletedAt ? ' (soft-deleted)' : ''}.`);
        }
        const role = await this.prisma.role.findUnique({
            where: { name: PSIKOLOG_ROLE_NAME },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role '${PSIKOLOG_ROLE_NAME}' tidak ditemukan. Run db:seed:clinic dulu.`);
        }
        const username = (dto.username || (0, psikolog_utils_1.deriveUsername)(dto.email, dto.fullName)).slice(0, 120);
        const passwordHash = await (0, password_hasher_1.hashPassword)(dto.password || DEFAULT_PASSWORD);
        const created = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    username,
                    passwordHash,
                    fullName: dto.fullName,
                    phone: dto.phone ?? null,
                    isActive: dto.isActive ?? true,
                    createdBy: actorId,
                    updatedBy: actorId,
                },
            });
            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id,
                    createdBy: actorId,
                    updatedBy: actorId,
                },
            });
            const profile = await tx.clinicPsikologProfile.create({
                data: {
                    userId: user.id,
                    title: dto.title,
                    specialty: dto.specialty ?? [],
                    color: dto.color,
                    license: dto.license,
                    defaultSlots: dto.defaultSlots ?? 4,
                    weeklyAvailability: dto.weeklyAvailability ?? {},
                    bio: dto.bio,
                    isActive: dto.isActive ?? true,
                    createdBy: actorId,
                    updatedBy: actorId,
                },
            });
            if (dto.serviceIds && dto.serviceIds.length > 0) {
                await tx.clinicPsikologService.createMany({
                    data: dto.serviceIds.map((serviceId) => ({
                        psikologUserId: user.id,
                        serviceId,
                        createdBy: actorId,
                    })),
                    skipDuplicates: true,
                });
            }
            return { user, profile };
        });
        if (created.user.phone) {
            void this.wa
                .dispatch({
                templateName: 'Welcome Psikolog Baru',
                recipientType: 'psikolog',
                recipientPhone: created.user.phone,
                variables: {
                    nama_psikolog: created.user.fullName ?? created.user.email,
                    username: created.user.username ?? created.user.email,
                    login_url: process.env.WEB_ALTHEA_URL ?? 'https://althea.fr-labs.my.id',
                },
            })
                .catch((err) => this.logger.warn(`[psikolog-welcome] dispatch failed userId=${created.user.id}: ${err instanceof Error ? err.message : err}`));
        }
        return {
            success: true,
            data: (0, psikolog_utils_1.mapPsikologToResponse)(created.user, created.profile, dto.serviceIds ?? []),
            message: 'Psikolog created',
        };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = (0, psikolog_utils_1.buildPsikologWhereClause)(query);
        const [profiles, total] = await this.prisma.$transaction([
            this.prisma.clinicPsikologProfile.findMany({
                where,
                include: { user: (0, psikolog_utils_1.userSelect)() },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicPsikologProfile.count({ where }),
        ]);
        const userIds = profiles.map((p) => p.userId);
        const junctionRows = userIds.length === 0
            ? []
            : await this.prisma.clinicPsikologService.findMany({
                where: { psikologUserId: { in: userIds } },
                select: { psikologUserId: true, serviceId: true },
            });
        const serviceIdsByUser = (0, psikolog_utils_1.groupServiceIdsByUser)(junctionRows);
        const bookingUserIds = userIds.length === 0
            ? []
            : await this.prisma.clinicBooking.findMany({
                where: { psikologUserId: { in: userIds }, deletedAt: null },
                select: { psikologUserId: true },
                distinct: ['psikologUserId'],
            });
        const hasBookingsSet = new Set(bookingUserIds.map((b) => b.psikologUserId));
        const tz = 'Asia/Jakarta';
        const nowLocal = (0, timezone_util_1.localPartsInTimezone)(new Date(), tz);
        const todayStart = (0, timezone_util_1.localDateAtMidnight)(nowLocal.dateStr, tz);
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        const isoDow = nowLocal.dow === 0 ? 6 : nowLocal.dow - 1;
        const weekStart = new Date(todayStart.getTime() - isoDow * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(todayStart.getTime() - 90 * 24 * 60 * 60 * 1000);
        const todayCounts = userIds.length === 0 ? [] : await this.prisma.clinicBooking.groupBy({
            by: ['psikologUserId'],
            where: { psikologUserId: { in: userIds }, status: { not: 'cancelled' }, scheduledStart: { gte: todayStart, lt: todayEnd }, deletedAt: null },
            _count: { id: true },
        });
        const weekCounts = userIds.length === 0 ? [] : await this.prisma.clinicBooking.groupBy({
            by: ['psikologUserId'],
            where: { psikologUserId: { in: userIds }, status: { not: 'cancelled' }, scheduledStart: { gte: weekStart, lt: weekEnd }, deletedAt: null },
            _count: { id: true },
        });
        const clientCountRows = userIds.length === 0
            ? []
            : await this.prisma.$queryRaw `
            SELECT psikolog_user_id, COUNT(DISTINCT client_id)::int AS client_count
            FROM clinic_booking
            WHERE psikolog_user_id IN (${client_1.Prisma.join(userIds)})
              AND status != 'cancelled'
              AND scheduled_start >= ${ninetyDaysAgo}
              AND deleted_at IS NULL
            GROUP BY psikolog_user_id
          `;
        const todayMap = new Map(todayCounts.map((r) => [r.psikologUserId, r._count.id]));
        const weekMap = new Map(weekCounts.map((r) => [r.psikologUserId, r._count.id]));
        const clientMap = new Map(clientCountRows.map((r) => [Number(r.psikolog_user_id), Number(r.client_count)]));
        return {
            success: true,
            data: profiles.map((p) => ({
                ...(0, psikolog_utils_1.mapPsikologToResponse)(p.user, p, serviceIdsByUser.get(p.userId) ?? []),
                hasBookings: hasBookingsSet.has(p.userId),
                todayCount: todayMap.get(p.userId) ?? 0,
                weekCount: weekMap.get(p.userId) ?? 0,
                clientCount: clientMap.get(p.userId) ?? 0,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { id, deletedAt: null },
            include: { user: (0, psikolog_utils_1.userSelect)() },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
        }
        const serviceIds = await this.findServiceIds(profile.userId);
        return {
            success: true,
            data: (0, psikolog_utils_1.mapPsikologToResponse)(profile.user, profile, serviceIds),
        };
    }
    async findServiceIds(psikologUserId) {
        const rows = await this.prisma.clinicPsikologService.findMany({
            where: { psikologUserId },
            select: { serviceId: true },
        });
        return rows.map((r) => r.serviceId);
    }
    async findByUserId(userId) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { userId, deletedAt: null },
            include: { user: (0, psikolog_utils_1.userSelect)() },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
        }
        const serviceIds = await this.findServiceIds(profile.userId);
        return {
            success: true,
            data: (0, psikolog_utils_1.mapPsikologToResponse)(profile.user, profile, serviceIds),
        };
    }
    async updateMe(userId, dto) {
        const profile = await this.prisma.clinicPsikologProfile.findFirst({
            where: { userId, deletedAt: null },
            include: { user: { select: { id: true } } },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
        }
        (0, psikolog_utils_1.validateAvatarUrl)(dto.avatarUrl ?? undefined);
        await this.prisma.$transaction(async (tx) => {
            const userUpdates = { updatedBy: userId };
            let hasUserUpdate = false;
            if (dto.fullName !== undefined) {
                userUpdates.fullName = dto.fullName;
                hasUserUpdate = true;
            }
            if (dto.avatarUrl !== undefined) {
                userUpdates.avatarUrl = dto.avatarUrl;
                hasUserUpdate = true;
            }
            if (hasUserUpdate) {
                await tx.user.update({ where: { id: userId }, data: userUpdates });
            }
            const profileUpdates = {};
            if (dto.title !== undefined)
                profileUpdates.title = dto.title;
            if (dto.bio !== undefined)
                profileUpdates.bio = dto.bio;
            if (dto.color !== undefined)
                profileUpdates.color = dto.color;
            if (Object.keys(profileUpdates).length > 0) {
                profileUpdates.updatedBy = userId;
                await tx.clinicPsikologProfile.update({
                    where: { id: profile.id },
                    data: profileUpdates,
                });
            }
        });
        return this.findByUserId(userId);
    }
    getMyStats(userId) { return this.dashboard.getMyStats(userId); }
    getDashboardStats(userId) { return this.dashboard.getDashboardStats(userId); }
    listOwnDateOverrides(userId, from, to) {
        return this.availability.listOwnDateOverrides(userId, from, to);
    }
    listDateOverridesByUser(userId, from, to) {
        return this.availability.listDateOverridesByUser(userId, from, to);
    }
    upsertOwnDateOverride(userId, input) { return this.availability.upsertOwnDateOverride(userId, input); }
    deleteOwnDateOverride(userId, dateStr) {
        return this.availability.deleteOwnDateOverride(userId, dateStr);
    }
    updateOwnAvailability(userId, weeklyAvailability) { return this.availability.updateOwnAvailability(userId, weeklyAvailability); }
    resolveAvailabilityForDate(psikologUserId, dateStr) {
        return this.availability.resolveAvailabilityForDate(psikologUserId, dateStr);
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.clinicPsikologProfile.findFirst({
            where: { id, deletedAt: null },
            include: { user: { select: { id: true } } },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const userUpdates = {};
            if (dto.fullName !== undefined)
                userUpdates.fullName = dto.fullName;
            if (dto.phone !== undefined)
                userUpdates.phone = dto.phone || null;
            if (dto.isActive !== undefined)
                userUpdates.isActive = dto.isActive;
            if (Object.keys(userUpdates).length > 0) {
                userUpdates.updatedBy = actorId;
                await tx.user.update({
                    where: { id: existing.userId },
                    data: userUpdates,
                });
            }
            const profileUpdates = {};
            if (dto.title !== undefined)
                profileUpdates.title = dto.title;
            if (dto.specialty !== undefined)
                profileUpdates.specialty = dto.specialty;
            if (dto.color !== undefined)
                profileUpdates.color = dto.color;
            if (dto.license !== undefined)
                profileUpdates.license = dto.license;
            if (dto.defaultSlots !== undefined)
                profileUpdates.defaultSlots = dto.defaultSlots;
            if (dto.weeklyAvailability !== undefined)
                profileUpdates.weeklyAvailability = dto.weeklyAvailability;
            if (dto.bio !== undefined)
                profileUpdates.bio = dto.bio;
            if (dto.isActive !== undefined)
                profileUpdates.isActive = dto.isActive;
            profileUpdates.updatedBy = actorId;
            const profile = await tx.clinicPsikologProfile.update({
                where: { id },
                data: profileUpdates,
                include: { user: (0, psikolog_utils_1.userSelect)() },
            });
            if (dto.serviceIds !== undefined) {
                await tx.clinicPsikologService.deleteMany({
                    where: { psikologUserId: profile.userId },
                });
                if (dto.serviceIds.length > 0) {
                    await tx.clinicPsikologService.createMany({
                        data: dto.serviceIds.map((serviceId) => ({
                            psikologUserId: profile.userId,
                            serviceId,
                            createdBy: actorId,
                        })),
                        skipDuplicates: true,
                    });
                }
            }
            return profile;
        });
        const finalServiceIds = await this.findServiceIds(updated.userId);
        return {
            success: true,
            data: (0, psikolog_utils_1.mapPsikologToResponse)(updated.user, updated, finalServiceIds),
            message: 'Psikolog updated',
        };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.clinicPsikologProfile.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, userId: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
        }
        const bookingCount = await this.prisma.clinicBooking.count({
            where: { psikologUserId: existing.userId, deletedAt: null },
        });
        if (bookingCount > 0) {
            throw new common_1.ConflictException(`Psikolog ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif" di form edit.`);
        }
        const now = new Date();
        await this.prisma.$transaction([
            this.prisma.clinicPsikologProfile.update({
                where: { id },
                data: {
                    deletedAt: now,
                    deletedBy: actorId,
                    isActive: false,
                    updatedBy: actorId,
                },
            }),
            this.prisma.user.update({
                where: { id: existing.userId },
                data: {
                    deletedAt: now,
                    deletedBy: actorId,
                    isActive: false,
                    updatedBy: actorId,
                },
            }),
        ]);
        return {
            success: true,
            message: 'Psikolog deleted (soft delete)',
        };
    }
};
exports.ClinicPsikologService = ClinicPsikologService;
exports.ClinicPsikologService = ClinicPsikologService = ClinicPsikologService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        psikolog_dashboard_service_1.PsikologDashboardService,
        psikolog_availability_service_1.PsikologAvailabilityService,
        clinic_wa_service_1.ClinicWaService])
], ClinicPsikologService);
//# sourceMappingURL=clinic-psikolog.service.js.map