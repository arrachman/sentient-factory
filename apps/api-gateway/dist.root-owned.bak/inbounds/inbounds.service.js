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
exports.InboundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const inbound_detail_mapper_1 = require("./inbound-detail.mapper");
const inbound_ledger_sync_service_1 = require("./inbound-ledger-sync.service");
const inbound_stock_guard_service_1 = require("./inbound-stock-guard.service");
const inbound_transaction_utils_1 = require("./inbound-transaction.utils");
const inbound_warehouse_resolver_service_1 = require("./inbound-warehouse-resolver.service");
const inbound_utils_1 = require("./inbound.utils");
const INBOUND_LIST_INCLUDE = {
    supplier: { select: { id: true, code: true, name: true, type: true } },
    warehouse: {
        select: {
            id: true,
            name: true,
            locationName: true,
            city: { select: { id: true, name: true, postalCode: true } },
        },
    },
    details: {
        where: { deletedAt: null },
        select: { _count: { select: { batches: { where: { deletedAt: null } } } } },
    },
    _count: { select: { details: { where: { deletedAt: null } } } },
};
const INBOUND_DETAIL_INCLUDE = {
    supplier: { select: { id: true, code: true, name: true, type: true } },
    warehouse: {
        select: {
            id: true,
            name: true,
            locationName: true,
            addressDetail: true,
            city: {
                select: {
                    id: true,
                    name: true,
                    postalCode: true,
                    province: { select: { id: true, name: true, isoCode: true } },
                },
            },
        },
    },
    details: {
        where: { deletedAt: null },
        orderBy: [{ lineNo: 'asc' }],
        include: {
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
            batches: {
                where: { deletedAt: null },
                orderBy: [{ lineNo: 'asc' }],
            },
        },
    },
};
let InboundsService = class InboundsService {
    prisma;
    stockGuard;
    ledgerSync;
    warehouseResolver;
    constructor(prisma, stockGuard, ledgerSync, warehouseResolver) {
        this.prisma = prisma;
        this.stockGuard = stockGuard;
        this.ledgerSync = ledgerSync;
        this.warehouseResolver = warehouseResolver;
    }
    async create(dto, actorId) {
        const supplierId = (0, inbound_utils_1.parseInboundId)(dto.supplierId, 'Supplier ID');
        await (0, inbound_utils_1.ensureSupplierExists)(this.prisma, supplierId);
        const effectiveWarehouseId = await this.warehouseResolver.resolveForActor(actorId, dto.warehouseId);
        await (0, inbound_utils_1.ensureWarehouseExists)(this.prisma, effectiveWarehouseId);
        const detailPayload = (0, inbound_transaction_utils_1.normalizeAndValidateDetails)(dto.details);
        const itemMap = await (0, inbound_utils_1.getActiveItems)(this.prisma, detailPayload.map((d) => d.itemId));
        const created = await this.prisma.$transaction(async (tx) => {
            const transactionNo = await (0, inbound_utils_1.resolveTransactionNo)(tx, this.prisma, dto.transactionNo);
            const header = await tx.inbound.create({
                data: {
                    transactionNo,
                    transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
                    supplierId,
                    warehouseId: effectiveWarehouseId,
                    notes: dto.notes ?? null,
                    status: 'POSTED',
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            for (const [index, detail] of detailPayload.entries()) {
                await tx.inboundDetail.create({
                    data: (0, inbound_detail_mapper_1.buildInboundDetailCreateInput)(header.id, index + 1, detail, itemMap.get(detail.itemId), actorId),
                });
            }
            await this.ledgerSync.sync(tx, header.id, actorId);
            return header;
        });
        return this.findOne(created.id, actorId);
    }
    async findAll(query, actorId) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = await this.buildWhereFilter(query, actorId);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.inbound.findMany({
                where,
                include: INBOUND_LIST_INCLUDE,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.inbound.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => ({
                ...item,
                totalBatches: Array.isArray(item.details)
                    ? item.details.reduce((sum, d) => sum + Number(d?._count?.batches ?? 0), 0)
                    : 0,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        };
    }
    async findOne(id, actorId) {
        const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
        const item = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            include: INBOUND_DETAIL_INCLUDE,
        });
        if (!item) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
        const existing = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            select: { id: true, transactionNo: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        if (dto.transactionNo && dto.transactionNo !== existing.transactionNo) {
            await (0, inbound_utils_1.ensureTransactionNoAvailable)(this.prisma, dto.transactionNo, id);
        }
        if (dto.supplierId) {
            await (0, inbound_utils_1.ensureSupplierExists)(this.prisma, (0, inbound_utils_1.parseInboundId)(dto.supplierId, 'Supplier ID'));
        }
        const effectiveWarehouseId = await this.warehouseResolver.resolveForActor(actorId, dto.warehouseId);
        await (0, inbound_utils_1.ensureWarehouseExists)(this.prisma, effectiveWarehouseId);
        const detailsProvided = Array.isArray(dto.details);
        let detailPayload = [];
        let itemMap = new Map();
        if (detailsProvided) {
            detailPayload = (0, inbound_transaction_utils_1.normalizeAndValidateDetails)(dto.details);
            itemMap = await (0, inbound_utils_1.getActiveItems)(this.prisma, detailPayload.map((d) => d.itemId));
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.inbound.update({
                where: { id },
                data: {
                    transactionNo: dto.transactionNo,
                    transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
                    supplierId: dto.supplierId ? (0, inbound_utils_1.parseInboundId)(dto.supplierId, 'Supplier ID') : undefined,
                    warehouseId: effectiveWarehouseId,
                    notes: dto.notes,
                    status: dto.status,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            if (detailsProvided) {
                const existingDetails = await tx.inboundDetail.findMany({
                    where: { inboundId: id },
                    select: { id: true },
                });
                const detailIds = existingDetails.map((row) => row.id);
                if (detailIds.length > 0) {
                    await tx.inboundDetailBatch.deleteMany({
                        where: { inboundDetailId: { in: detailIds } },
                    });
                }
                await tx.inboundDetail.deleteMany({ where: { inboundId: id } });
                for (const [index, detail] of detailPayload.entries()) {
                    await tx.inboundDetail.create({
                        data: (0, inbound_detail_mapper_1.buildInboundDetailCreateInput)(id, index + 1, detail, itemMap.get(detail.itemId), actorId),
                    });
                }
            }
            await this.ledgerSync.sync(tx, id, actorId);
        });
        return this.findOne(id, actorId);
    }
    async remove(id, actorId) {
        const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
        const existing = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await this.stockGuard.ensureDeleteWillNotCauseNegativeStock(tx, id);
            await tx.inbound.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    status: 'CANCELLED',
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await tx.inboundDetail.updateMany({
                where: { inboundId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await tx.inboundDetailBatch.updateMany({
                where: { inboundDetail: { inboundId: id }, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await this.ledgerSync.sync(tx, id, actorId);
        });
        return { success: true, message: 'Inbound deleted' };
    }
    async buildWhereFilter(query, actorId) {
        const where = { deletedAt: null };
        const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId, query.warehouseId);
        if (typeof scopedWarehouseId === 'number') {
            where.warehouseId = scopedWarehouseId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.supplierId?.trim()) {
            where.supplierId = (0, inbound_utils_1.parseInboundId)(query.supplierId.trim(), 'Supplier ID');
        }
        if (query.warehouseId?.trim() && typeof scopedWarehouseId !== 'number') {
            where.warehouseId = (0, inbound_utils_1.parseInboundId)(query.warehouseId.trim(), 'Warehouse ID');
        }
        if (query.transactionDateFrom || query.transactionDateTo) {
            where.transactionDate = {
                gte: query.transactionDateFrom ? new Date(query.transactionDateFrom) : undefined,
                lte: query.transactionDateTo ? new Date(query.transactionDateTo) : undefined,
            };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { transactionNo: { contains: q, mode: 'insensitive' } },
                { notes: { contains: q, mode: 'insensitive' } },
                { supplier: { code: { contains: q, mode: 'insensitive' } } },
                { supplier: { name: { contains: q, mode: 'insensitive' } } },
                { warehouse: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        return where;
    }
};
exports.InboundsService = InboundsService;
exports.InboundsService = InboundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inbound_stock_guard_service_1.InboundStockGuardService,
        inbound_ledger_sync_service_1.InboundLedgerSyncService,
        inbound_warehouse_resolver_service_1.InboundWarehouseResolverService])
], InboundsService);
//# sourceMappingURL=inbounds.service.js.map