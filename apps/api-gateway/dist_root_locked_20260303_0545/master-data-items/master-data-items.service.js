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
exports.MasterDataItemsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let MasterDataItemsService = class MasterDataItemsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const uomId = Number(dto.uomId);
        if (!Number.isInteger(uomId)) {
            throw new common_1.BadRequestException('UOM ID is invalid');
        }
        const existing = await this.prisma.masterDataItem.findFirst({
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
        const uom = await this.prisma.masterDataUom.findFirst({
            where: { id: uomId, deletedAt: null },
            select: { id: true },
        });
        if (!uom) {
            throw new common_1.BadRequestException('UOM not found or inactive');
        }
        let created;
        try {
            created = await this.prisma.masterDataItem.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    category: dto.category,
                    uomId,
                    itemType: dto.itemType,
                    isActive: dto.isActive ?? true,
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    uom: { select: { id: true, code: true, name: true, type: true } },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'm1_item_code_key'])) {
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
        const where = {
            deletedAt: null,
        };
        if (query.category?.trim()) {
            where.category = { equals: query.category.trim(), mode: 'insensitive' };
        }
        if (query.itemType?.trim()) {
            where.itemType = { equals: query.itemType.trim(), mode: 'insensitive' };
        }
        if (typeof query.isActive === 'boolean') {
            where.isActive = query.isActive;
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { category: { contains: q, mode: 'insensitive' } },
                { itemType: { contains: q, mode: 'insensitive' } },
                { uom: { code: { contains: q, mode: 'insensitive' } } },
                { uom: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataItem.findMany({
                where,
                include: {
                    uom: { select: { id: true, code: true, name: true, type: true } },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataItem.count({ where }),
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
        const item = await this.prisma.masterDataItem.findFirst({
            where: { id, deletedAt: null },
            include: {
                uom: { select: { id: true, code: true, name: true, type: true } },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data item not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataItem.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data item not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.masterDataItem.findFirst({
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
        const nextUomId = dto.uomId ? Number(dto.uomId) : undefined;
        if (dto.uomId) {
            if (!Number.isInteger(nextUomId)) {
                throw new common_1.BadRequestException('UOM ID is invalid');
            }
            const uom = await this.prisma.masterDataUom.findFirst({
                where: { id: nextUomId, deletedAt: null },
                select: { id: true },
            });
            if (!uom) {
                throw new common_1.BadRequestException('UOM not found or inactive');
            }
        }
        let updated;
        try {
            updated = await this.prisma.masterDataItem.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    category: dto.category,
                    uomId: nextUomId,
                    itemType: dto.itemType,
                    isActive: dto.isActive,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    uom: { select: { id: true, code: true, name: true, type: true } },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'm1_item_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Item code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataItem.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data item not found');
        }
        await this.prisma.masterDataItem.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data item deleted' };
    }
};
exports.MasterDataItemsService = MasterDataItemsService;
exports.MasterDataItemsService = MasterDataItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataItemsService);
//# sourceMappingURL=master-data-items.service.js.map