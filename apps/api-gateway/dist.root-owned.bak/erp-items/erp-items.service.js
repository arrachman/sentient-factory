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
exports.ErpItemsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const ITEM_INCLUDE = {
    category: { select: { id: true, code: true, name: true } },
    baseUnit: { select: { id: true, code: true, name: true } },
};
let ErpItemsService = class ErpItemsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpItem.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Item code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.erpItem.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    type: dto.itemType,
                    categoryId: BigInt(dto.categoryId),
                    baseUnitId: BigInt(dto.unitId),
                    barcode: dto.barcode ?? null,
                    standardCost: dto.standardCost ? new client_1.Prisma.Decimal(dto.standardCost) : undefined,
                    purchasePrice: dto.purchasePrice ? new client_1.Prisma.Decimal(dto.purchasePrice) : undefined,
                    salePrice: dto.salePrice ? new client_1.Prisma.Decimal(dto.salePrice) : undefined,
                    minStock: dto.minStock ? new client_1.Prisma.Decimal(dto.minStock) : undefined,
                    maxStock: dto.maxStock ? new client_1.Prisma.Decimal(dto.maxStock) : undefined,
                    reorderQty: dto.reorderQty ? new client_1.Prisma.Decimal(dto.reorderQty) : undefined,
                    tracksSerial: dto.tracksSerial ?? false,
                    tracksBatch: dto.tracksBatch ?? false,
                    tracksBin: dto.tracksBin ?? false,
                    inventoryAccountId: dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null,
                    salesAccountId: dto.salesAccountId ? BigInt(dto.salesAccountId) : null,
                    cogsAccountId: dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null,
                    isActive: dto.isActive ?? true,
                    createdById: actorId ? BigInt(actorId) : null,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
                include: ITEM_INCLUDE,
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_items_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Item code', value: dto.code });
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
                { barcode: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.itemType !== undefined) {
            where.type = query.itemType;
        }
        if (query.categoryId !== undefined) {
            where.categoryId = BigInt(query.categoryId);
        }
        if (query.unitId !== undefined) {
            where.baseUnitId = BigInt(query.unitId);
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpItem.findMany({
                where,
                include: ITEM_INCLUDE,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpItem.count({ where }),
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
        const item = await this.prisma.erpItem.findFirst({
            where: { id, deletedAt: null },
            include: ITEM_INCLUDE,
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP item not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpItem.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP item not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpItem.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Item code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.erpItem.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    type: dto.itemType,
                    categoryId: dto.categoryId ? BigInt(dto.categoryId) : undefined,
                    baseUnitId: dto.unitId ? BigInt(dto.unitId) : undefined,
                    barcode: dto.barcode,
                    standardCost: dto.standardCost ? new client_1.Prisma.Decimal(dto.standardCost) : undefined,
                    purchasePrice: dto.purchasePrice ? new client_1.Prisma.Decimal(dto.purchasePrice) : undefined,
                    salePrice: dto.salePrice ? new client_1.Prisma.Decimal(dto.salePrice) : undefined,
                    minStock: dto.minStock ? new client_1.Prisma.Decimal(dto.minStock) : undefined,
                    maxStock: dto.maxStock ? new client_1.Prisma.Decimal(dto.maxStock) : undefined,
                    reorderQty: dto.reorderQty ? new client_1.Prisma.Decimal(dto.reorderQty) : undefined,
                    tracksSerial: dto.tracksSerial,
                    tracksBatch: dto.tracksBatch,
                    tracksBin: dto.tracksBin,
                    inventoryAccountId: dto.inventoryAccountId !== undefined
                        ? (dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null)
                        : undefined,
                    salesAccountId: dto.salesAccountId !== undefined
                        ? (dto.salesAccountId ? BigInt(dto.salesAccountId) : null)
                        : undefined,
                    cogsAccountId: dto.cogsAccountId !== undefined
                        ? (dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null)
                        : undefined,
                    isActive: dto.isActive,
                    updatedById: actorId ? BigInt(actorId) : null,
                },
                include: ITEM_INCLUDE,
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_items_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Item code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpItem.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP item not found');
        }
        await this.prisma.erpItem.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: actorId ? BigInt(actorId) : null,
            },
        });
        return { success: true, message: 'ERP item deleted' };
    }
};
exports.ErpItemsService = ErpItemsService;
exports.ErpItemsService = ErpItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpItemsService);
//# sourceMappingURL=erp-items.service.js.map