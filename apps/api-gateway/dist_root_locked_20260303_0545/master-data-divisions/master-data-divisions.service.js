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
exports.MasterDataDivisionsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let MasterDataDivisionsService = class MasterDataDivisionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.masterDataDivision.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Division code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const created = await this.prisma.masterDataDivision.create({
            data: {
                code: dto.code,
                name: dto.name,
                description: dto.description ?? null,
                isActive: dto.isActive,
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
        const where = {
            deletedAt: null,
            ...(query.search?.trim()
                ? {
                    OR: [
                        { code: { contains: query.search.trim(), mode: 'insensitive' } },
                        { name: { contains: query.search.trim(), mode: 'insensitive' } },
                        { description: { contains: query.search.trim(), mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataDivision.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.masterDataDivision.count({ where }),
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
        const item = await this.prisma.masterDataDivision.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data division not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataDivision.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, code: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data division not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.masterDataDivision.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Division code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        const updated = await this.prisma.masterDataDivision.update({
            where: { id },
            data: {
                code: dto.code,
                name: dto.name,
                description: dto.description,
                isActive: dto.isActive,
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataDivision.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data division not found');
        }
        await this.prisma.masterDataDivision.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, message: 'Master data division deleted' };
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.MasterDataDivisionsService = MasterDataDivisionsService;
exports.MasterDataDivisionsService = MasterDataDivisionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataDivisionsService);
//# sourceMappingURL=master-data-divisions.service.js.map