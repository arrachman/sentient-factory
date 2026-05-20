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
exports.ErpUnitsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpUnitsService = class ErpUnitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpUnit.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Unit code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.erpUnit.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    isActive: dto.isActive ?? true,
                    createdById: actorId ? BigInt(actorId) : null,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_units_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Unit code', value: dto.code });
            }
            throw error;
        }
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpUnit.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpUnit.count({ where }),
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
        const item = await this.prisma.erpUnit.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP unit not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpUnit.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP unit not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpUnit.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Unit code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.erpUnit.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    isActive: dto.isActive,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_units_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Unit code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpUnit.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP unit not found');
        }
        await this.prisma.erpUnit.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: actorId ? BigInt(actorId) : null,
            },
        });
        return { success: true, message: 'ERP unit deleted' };
    }
};
exports.ErpUnitsService = ErpUnitsService;
exports.ErpUnitsService = ErpUnitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpUnitsService);
//# sourceMappingURL=erp-units.service.js.map