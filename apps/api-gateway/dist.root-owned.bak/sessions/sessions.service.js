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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionsService = class SessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const userId = this.parseUserId(dto.userId);
        await this.ensureUserExists(userId);
        const expiresAt = this.parseExpiresAt(dto.expiresAt);
        let created;
        try {
            created = await this.prisma.session.create({
                data: {
                    userId,
                    token: dto.token,
                    expiresAt,
                    ipAddress: dto.ipAddress ?? null,
                    userAgent: dto.userAgent ?? null,
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            fullName: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['token'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Session token', value: dto.token });
            }
            throw error;
        }
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (query.userId?.trim()) {
            where.userId = this.parseUserId(query.userId);
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { token: { contains: q, mode: 'insensitive' } },
                { ipAddress: { contains: q, mode: 'insensitive' } },
                { userAgent: { contains: q, mode: 'insensitive' } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                { user: { username: { contains: q, mode: 'insensitive' } } },
                { user: { fullName: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.session.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            fullName: true,
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.session.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.session.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        fullName: true,
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Session not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.session.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, token: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Session not found');
        }
        const nextUserId = dto.userId ? this.parseUserId(dto.userId) : undefined;
        if (nextUserId !== undefined) {
            await this.ensureUserExists(nextUserId);
        }
        const nextExpiresAt = dto.expiresAt ? this.parseExpiresAt(dto.expiresAt) : undefined;
        let updated;
        try {
            updated = await this.prisma.session.update({
                where: { id },
                data: {
                    userId: nextUserId,
                    token: dto.token,
                    expiresAt: nextExpiresAt,
                    ipAddress: dto.ipAddress,
                    userAgent: dto.userAgent,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            fullName: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['token'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Session token', value: dto.token ?? existing.token });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.session.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Session not found');
        }
        await this.prisma.session.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return {
            success: true,
            message: 'Session deleted',
        };
    }
    parseUserId(userId) {
        const parsed = Number(userId);
        if (!Number.isInteger(parsed)) {
            throw new common_1.BadRequestException('User ID is invalid');
        }
        return parsed;
    }
    parseExpiresAt(expiresAt) {
        const parsed = new Date(expiresAt);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException('expiresAt must be a valid date-time');
        }
        return parsed;
    }
    async ensureUserExists(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map