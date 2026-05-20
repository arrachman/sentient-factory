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
exports.ErpItemCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpItemCategoriesService = class ErpItemCategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpItemCategory.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Item category code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.erpItemCategory.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    isActive: dto.isActive ?? true,
                    parentId: dto.parentId ? BigInt(dto.parentId) : null,
                    inventoryAccountId: dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null,
                    cogsAccountId: dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null,
                    salesAccountId: dto.salesAccountId ? BigInt(dto.salesAccountId) : null,
                    createdById: actorId ? BigInt(actorId) : null,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_item_categories_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Item category code', value: dto.code });
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
        if (query.parentId !== undefined) {
            where.parentId = BigInt(query.parentId);
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpItemCategory.findMany({
                where,
                include: {
                    parent: { select: { id: true, code: true, name: true } },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpItemCategory.count({ where }),
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
        const item = await this.prisma.erpItemCategory.findFirst({
            where: { id, deletedAt: null },
            include: {
                parent: { select: { id: true, code: true, name: true } },
                children: {
                    where: { deletedAt: null },
                    select: { id: true, code: true, name: true, isActive: true },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP item category not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpItemCategory.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP item category not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpItemCategory.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Item category code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.erpItemCategory.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    isActive: dto.isActive,
                    parentId: dto.parentId !== undefined
                        ? (dto.parentId ? BigInt(dto.parentId) : null)
                        : undefined,
                    inventoryAccountId: dto.inventoryAccountId !== undefined
                        ? (dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null)
                        : undefined,
                    cogsAccountId: dto.cogsAccountId !== undefined
                        ? (dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null)
                        : undefined,
                    salesAccountId: dto.salesAccountId !== undefined
                        ? (dto.salesAccountId ? BigInt(dto.salesAccountId) : null)
                        : undefined,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_item_categories_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Item category code',
                    value: dto.code ?? existing.code,
                });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpItemCategory.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP item category not found');
        }
        await this.prisma.erpItemCategory.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: actorId ? BigInt(actorId) : null,
            },
        });
        return { success: true, message: 'ERP item category deleted' };
    }
};
exports.ErpItemCategoriesService = ErpItemCategoriesService;
exports.ErpItemCategoriesService = ErpItemCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpItemCategoriesService);
//# sourceMappingURL=erp-item-categories.service.js.map