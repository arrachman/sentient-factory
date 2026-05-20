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
exports.ErpWarehousesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpWarehousesService = class ErpWarehousesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const locationId = BigInt(dto.locationId);
        const location = await this.prisma.erpLocation.findFirst({
            where: { id: locationId, deletedAt: null },
            select: { id: true },
        });
        if (!location) {
            throw new common_1.NotFoundException(`ERP Location with id '${dto.locationId}' not found`);
        }
        const existing = await this.prisma.erpWarehouse.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Warehouse code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        let created;
        try {
            created = await this.prisma.erpWarehouse.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    locationId,
                    allowNegativeStock: dto.allowNegativeStock ?? false,
                    notes: dto.notes,
                    isActive: dto.isActive ?? true,
                    createdById: actorBigInt,
                    updatedById: actorBigInt,
                },
                include: {
                    location: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            branch: { select: { id: true, code: true, name: true } },
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_warehouses_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Warehouse code', value: dto.code });
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
        if (query.locationId) {
            where.locationId = BigInt(query.locationId);
        }
        if (query.branchId) {
            where.location = { branchId: BigInt(query.branchId) };
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpWarehouse.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
                include: {
                    location: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            branch: { select: { id: true, code: true, name: true } },
                        },
                    },
                },
            }),
            this.prisma.erpWarehouse.count({ where }),
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
        const item = await this.prisma.erpWarehouse.findFirst({
            where: { id, deletedAt: null },
            include: {
                location: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        branch: { select: { id: true, code: true, name: true } },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP Warehouse not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpWarehouse.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Warehouse not found');
        }
        if (dto.locationId) {
            const locationId = BigInt(dto.locationId);
            const location = await this.prisma.erpLocation.findFirst({
                where: { id: locationId, deletedAt: null },
                select: { id: true },
            });
            if (!location) {
                throw new common_1.NotFoundException(`ERP Location with id '${dto.locationId}' not found`);
            }
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpWarehouse.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Warehouse code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        let updated;
        try {
            updated = await this.prisma.erpWarehouse.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    locationId: dto.locationId ? BigInt(dto.locationId) : undefined,
                    allowNegativeStock: dto.allowNegativeStock,
                    notes: dto.notes,
                    isActive: dto.isActive,
                    updatedById: actorBigInt,
                },
                include: {
                    location: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            branch: { select: { id: true, code: true, name: true } },
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_warehouses_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Warehouse code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpWarehouse.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Warehouse not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpWarehouse.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: actorBigInt,
            },
        });
        return { success: true, message: 'ERP Warehouse deleted' };
    }
};
exports.ErpWarehousesService = ErpWarehousesService;
exports.ErpWarehousesService = ErpWarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpWarehousesService);
//# sourceMappingURL=erp-warehouses.service.js.map