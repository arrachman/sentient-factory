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
exports.MasterDataPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let MasterDataPermissionsService = class MasterDataPermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const normalizedName = dto.name.trim();
        const existing = await this.prisma.permission.findFirst({
            where: { name: normalizedName },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Permission name',
                value: normalizedName,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const created = await this.prisma.permission.create({
            data: {
                name: normalizedName,
                module: dto.module.trim(),
                action: dto.action.trim(),
                description: dto.description?.trim() || null,
                createdBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const q = query.search?.trim();
        const where = {
            deletedAt: null,
            ...(q
                ? {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { module: { contains: q, mode: 'insensitive' } },
                        { action: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.permission.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.permission.count({ where }),
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
        const item = await this.prisma.permission.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data permission not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.permission.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data permission not found');
        }
        const nextName = dto.name?.trim();
        if (nextName && nextName !== existing.name) {
            const duplicate = await this.prisma.permission.findFirst({
                where: { name: nextName, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Permission name',
                    value: nextName,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        const updated = await this.prisma.permission.update({
            where: { id },
            data: {
                name: nextName,
                module: dto.module?.trim(),
                action: dto.action?.trim(),
                description: dto.description?.trim() ?? dto.description,
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.permission.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data permission not found');
        }
        await this.prisma.permission.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, message: 'Master data permission deleted' };
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.MasterDataPermissionsService = MasterDataPermissionsService;
exports.MasterDataPermissionsService = MasterDataPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataPermissionsService);
//# sourceMappingURL=master-data-permissions.service.js.map