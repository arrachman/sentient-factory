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
exports.OutboundQueryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outbound_helpers_1 = require("./outbound-helpers");
const outbound_validators_service_1 = require("./outbound-validators.service");
let OutboundQueryService = class OutboundQueryService {
    prisma;
    validators;
    constructor(prisma, validators) {
        this.prisma = prisma;
        this.validators = validators;
    }
    async findAll(query, actorId) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId, query.warehouseId);
        if (typeof scopedWarehouseId === 'number') {
            where.warehouseId = scopedWarehouseId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.customerId?.trim()) {
            where.customerId = (0, outbound_helpers_1.parseId)(query.customerId, 'customerId');
        }
        if (query.doDateFrom || query.doDateTo) {
            where.doDate = {
                gte: query.doDateFrom ? new Date(query.doDateFrom) : undefined,
                lte: query.doDateTo ? new Date(query.doDateTo) : undefined,
            };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { doNumber: { contains: q, mode: 'insensitive' } },
                { bu: { contains: q, mode: 'insensitive' } },
                { customer: { code: { contains: q, mode: 'insensitive' } } },
                { customer: { name: { contains: q, mode: 'insensitive' } } },
                { warehouse: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        let items = [];
        let total = 0;
        try {
            const result = await this.prisma.$transaction([
                this.prisma.deliveryOrder.findMany({
                    where,
                    include: {
                        customer: { select: { id: true, code: true, name: true, type: true } },
                        warehouse: { select: { id: true, name: true, locationName: true } },
                        destinationCity: { select: { id: true, name: true, postalCode: true } },
                        _count: { select: { details: { where: { deletedAt: null } } } },
                        details: {
                            where: { deletedAt: null },
                            select: {
                                qtyKg: true,
                                batches: {
                                    where: { deletedAt: null },
                                    select: { id: true },
                                },
                            },
                        },
                    },
                    orderBy: [{ createdAt: 'desc' }],
                    skip,
                    take: limit,
                }),
                this.prisma.deliveryOrder.count({ where }),
            ]);
            [items, total] = result;
        }
        catch (error) {
            if ((0, outbound_helpers_1.isMissingWarehouseColumnError)(error)) {
                throw new common_1.BadRequestException('Schema database outbound belum update. Jalankan migration terbaru (warehouse_id pada m2_outbound).');
            }
            throw error;
        }
        const data = items.map((item) => {
            const totalItemTypes = item._count?.details ?? 0;
            const totalBatches = item.details.reduce((sum, detail) => sum + detail.batches.length, 0);
            const totalKg = item.details.reduce((sum, detail) => {
                const qtyKg = Number(detail.qtyKg ?? 0);
                return sum + (Number.isFinite(qtyKg) ? qtyKg : 0);
            }, 0);
            return {
                ...item,
                totalItemTypes,
                totalBatches,
                totalKg,
            };
        });
        return {
            success: true,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id, actorId) {
        const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
        const item = await this.prisma.deliveryOrder.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            include: {
                customer: { select: { id: true, code: true, name: true, type: true } },
                destinationCity: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    include: {
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                        },
                        item: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                category: true,
                                itemType: true,
                                uom: { select: { id: true, code: true, name: true, type: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('outbound not found');
        }
        return { success: true, data: item };
    }
};
exports.OutboundQueryService = OutboundQueryService;
exports.OutboundQueryService = OutboundQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbound_validators_service_1.OutboundValidatorsService])
], OutboundQueryService);
//# sourceMappingURL=outbound-query.service.js.map