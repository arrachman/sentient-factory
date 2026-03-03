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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        if (dto.userId) {
            await this.ensureUserExists(dto.userId);
        }
        const created = await this.prisma.auditLog.create({
            data: {
                userId: dto.userId ?? null,
                action: dto.action,
                entityType: dto.entityType,
                entityId: dto.entityId ?? null,
                oldData: this.normalizeJsonInput(dto.oldData),
                newData: this.normalizeJsonInput(dto.newData),
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
        return { success: true, data: this.serializeItem(created) };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (query.userId) {
            where.userId = query.userId;
        }
        if (query.action?.trim()) {
            where.action = { contains: query.action.trim(), mode: 'insensitive' };
        }
        if (query.entityType?.trim()) {
            where.entityType = { contains: query.entityType.trim(), mode: 'insensitive' };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { action: { contains: q, mode: 'insensitive' } },
                { entityType: { contains: q, mode: 'insensitive' } },
                { entityId: { contains: q, mode: 'insensitive' } },
                { ipAddress: { contains: q, mode: 'insensitive' } },
                { userAgent: { contains: q, mode: 'insensitive' } },
                { user: { is: { email: { contains: q, mode: 'insensitive' } } } },
                { user: { is: { username: { contains: q, mode: 'insensitive' } } } },
                { user: { is: { fullName: { contains: q, mode: 'insensitive' } } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.auditLog.findMany({
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
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => this.serializeItem(item)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.auditLog.findFirst({
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
            throw new common_1.NotFoundException('Audit log not found');
        }
        return { success: true, data: this.serializeItem(item) };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.auditLog.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Audit log not found');
        }
        if (dto.userId) {
            await this.ensureUserExists(dto.userId);
        }
        const updated = await this.prisma.auditLog.update({
            where: { id },
            data: {
                userId: dto.userId,
                action: dto.action,
                entityType: dto.entityType,
                entityId: dto.entityId,
                oldData: this.normalizeJsonInput(dto.oldData),
                newData: this.normalizeJsonInput(dto.newData),
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
        return { success: true, data: this.serializeItem(updated) };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.auditLog.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Audit log not found');
        }
        await this.prisma.auditLog.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Audit log deleted' };
    }
    async ensureUserExists(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    normalizeJsonInput(value) {
        if (value === undefined) {
            return undefined;
        }
        if (value === null) {
            return client_1.Prisma.DbNull;
        }
        return value;
    }
    serializeItem(item) {
        return {
            ...item,
            userName: item.user?.fullName ?? item.user?.username ?? null,
            userEmail: item.user?.email ?? null,
        };
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map