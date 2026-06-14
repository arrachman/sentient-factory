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
exports.OutboundInventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outbound_helpers_1 = require("./outbound-helpers");
let OutboundInventoryService = class OutboundInventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncOutboundInventoryLedger(tx, deliveryOrderId, actorId) {
        const auditActor = (0, outbound_helpers_1.normalizeAuditActor)(actorId);
        const now = new Date();
        await tx.inventoryLedger.updateMany({
            where: {
                referenceDocType: 'OUTBOUND',
                referenceDocId: String(deliveryOrderId),
                deletedAt: null,
            },
            data: {
                deletedAt: now,
                deletedBy: auditActor ?? null,
                updatedBy: auditActor ?? null,
            },
        });
        const outbound = await tx.deliveryOrder.findFirst({
            where: { id: deliveryOrderId },
            select: {
                id: true,
                doNumber: true,
                doDate: true,
                warehouseId: true,
                deletedAt: true,
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    select: {
                        itemId: true,
                        item: {
                            select: {
                                id: true,
                                uom: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                            select: {
                                batchOut: true,
                                qtyPcs: true,
                                qtyKg: true,
                                expiredDate: true,
                                notes: true,
                            },
                        },
                    },
                },
            },
        });
        if (!outbound || outbound.deletedAt) {
            return;
        }
        const actorWarehouseId = await this.resolveWarehouseForActor(tx, actorId);
        const actorUserId = await this.resolveActorUserId(tx, actorId);
        const itemIds = new Set();
        const batchNumbers = new Set();
        outbound.details.forEach((detail) => {
            const itemId = Number(detail.itemId ?? 0);
            if (!itemId) {
                return;
            }
            itemIds.add(itemId);
            detail.batches.forEach((batch) => {
                const batchNumber = String(batch.batchOut ?? '').trim();
                if (batchNumber) {
                    batchNumbers.add(batchNumber);
                }
            });
        });
        const sourceByPair = new Map();
        if (itemIds.size > 0 && batchNumbers.size > 0) {
            const inboundSources = await tx.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            status: 'POSTED',
                        },
                    },
                },
                select: {
                    batchIn: true,
                    expiredDate: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    warehouse: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                    transactionDate: true,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ inboundDetail: { inbound: { transactionDate: 'asc' } } }, { createdAt: 'asc' }],
            });
            inboundSources.forEach((source) => {
                const itemId = String(source.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(source.batchIn ?? '').trim();
                const warehouseId = Number(source.inboundDetail?.inbound?.warehouse?.id ?? 0);
                if (!itemId || !batchNumber || !warehouseId) {
                    return;
                }
                const key = `${itemId}::${batchNumber.toLowerCase()}`;
                if (!sourceByPair.has(key)) {
                    sourceByPair.set(key, {
                        warehouseId,
                        expiryDate: source.expiredDate ?? null,
                    });
                }
            });
        }
        for (const detail of outbound.details) {
            for (const batch of detail.batches) {
                const batchNumber = String(batch.batchOut ?? '').trim();
                if (!batchNumber) {
                    continue;
                }
                const pairKey = `${detail.itemId}::${batchNumber.toLowerCase()}`;
                const source = sourceByPair.get(pairKey);
                const warehouseId = outbound.warehouseId || source?.warehouseId || actorWarehouseId;
                if (!warehouseId) {
                    throw new common_1.BadRequestException(`Warehouse source is not found for item ${detail.itemId} batch ${batchNumber}`);
                }
                const inventoryBatch = await tx.inventoryBatch.upsert({
                    where: {
                        itemId_batchNumber: {
                            itemId: detail.item.id,
                            batchNumber,
                        },
                    },
                    update: {
                        expiryDate: source?.expiryDate ?? batch.expiredDate ?? undefined,
                        deletedAt: null,
                        deletedBy: null,
                        updatedBy: auditActor ?? null,
                    },
                    create: {
                        itemId: detail.item.id,
                        batchNumber,
                        expiryDate: source?.expiryDate ?? batch.expiredDate ?? null,
                        createdBy: auditActor ?? null,
                        updatedBy: auditActor ?? null,
                    },
                    select: { id: true },
                });
                const qtyPcs = Number(batch.qtyPcs ?? 0);
                const qtyKg = Number(batch.qtyKg ?? 0);
                await tx.inventoryLedger.create({
                    data: {
                        transactionDate: outbound.doDate ?? now,
                        itemId: detail.item.id,
                        warehouseId,
                        batchId: inventoryBatch.id,
                        transactionType: 'OUTBOUND',
                        referenceDocType: 'OUTBOUND',
                        referenceDocId: String(outbound.id),
                        referenceNumber: outbound.doNumber,
                        quantityPcs: -Math.abs(Number.isFinite(qtyPcs) ? qtyPcs : 0),
                        quantityKg: -Math.abs(Number.isFinite(qtyKg) ? qtyKg : 0),
                        uomId: detail.item.uom.id,
                        unitCost: null,
                        totalValue: 0,
                        userId: actorUserId ?? null,
                        notes: batch.notes ?? null,
                        createdBy: auditActor ?? null,
                        updatedBy: auditActor ?? null,
                    },
                });
            }
        }
    }
    async ensureBatchAvailability(details, tx, excludeDoId, warehouseId) {
        const requestedByPair = new Map();
        const pairLabelByKey = new Map();
        const itemIds = new Set();
        const batchNumbers = new Set();
        details.forEach((detail) => {
            const itemId = detail.itemId;
            const batchNumber = String(detail.batchNumber ?? '').trim();
            const qty = Number(detail.qtyPcs ?? 0);
            const qtyPcs = Number.isFinite(qty) ? qty : 0;
            const key = `${String(itemId)}::${batchNumber.toLowerCase()}`;
            requestedByPair.set(key, (requestedByPair.get(key) ?? 0) + qtyPcs);
            if (!pairLabelByKey.has(key)) {
                pairLabelByKey.set(key, { itemId, batchNumber });
            }
            itemIds.add(itemId);
            batchNumbers.add(batchNumber);
        });
        if (pairLabelByKey.size === 0) {
            return;
        }
        const normalizedExcludeDoId = excludeDoId;
        const [inboundRows, usedRows] = await Promise.all([
            tx.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            status: 'POSTED',
                            warehouseId,
                        },
                    },
                },
                select: {
                    batchIn: true,
                    qty: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                        },
                    },
                },
            }),
            tx.outboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchOut: { in: [...batchNumbers] },
                    outboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        deliveryOrder: {
                            deletedAt: null,
                            id: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
                            warehouseId,
                        },
                    },
                },
                select: {
                    batchOut: true,
                    qtyPcs: true,
                    outboundDetail: {
                        select: {
                            itemId: true,
                        },
                    },
                },
            }),
        ]);
        const inboundByPair = new Map();
        inboundRows.forEach((row) => {
            const itemId = String(row.inboundDetail?.itemId ?? '').trim();
            const batchNumber = String(row.batchIn ?? '').trim();
            if (!itemId || !batchNumber) {
                return;
            }
            const key = `${itemId}::${batchNumber.toLowerCase()}`;
            const qty = Number(row.qty ?? 0);
            inboundByPair.set(key, (inboundByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
        });
        const usedByPair = new Map();
        usedRows.forEach((row) => {
            const itemId = String(row.outboundDetail?.itemId ?? '').trim();
            const batchNumber = String(row.batchOut ?? '').trim();
            if (!itemId || !batchNumber) {
                return;
            }
            const key = `${itemId}::${batchNumber.toLowerCase()}`;
            const qty = Number(row.qtyPcs ?? 0);
            usedByPair.set(key, (usedByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
        });
        requestedByPair.forEach((requestedQty, key) => {
            const pair = pairLabelByKey.get(key);
            if (!pair) {
                return;
            }
            const inboundQty = inboundByPair.get(key) ?? 0;
            const usedQty = usedByPair.get(key) ?? 0;
            const availableQty = Math.max(inboundQty - usedQty, 0);
            if (requestedQty > availableQty) {
                throw new common_1.BadRequestException(`Insufficient stock for item ${pair.itemId} batch ${pair.batchNumber}. Remaining ${availableQty.toLocaleString('en-US')} pcs, requested ${requestedQty.toLocaleString('en-US')} pcs.`);
            }
        });
    }
    async resolveWarehouseForActor(tx, actorId) {
        const parsedActorId = (0, outbound_helpers_1.parseOptionalActorUserId)(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: {
                warehouse: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const mappedWarehouseId = actor?.warehouse?.id;
        if (!mappedWarehouseId || mappedWarehouseId <= 0) {
            return undefined;
        }
        return mappedWarehouseId;
    }
    async resolveActorUserId(tx, actorId) {
        const parsedActorId = (0, outbound_helpers_1.parseOptionalActorUserId)(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: { id: true },
        });
        return actor?.id;
    }
};
exports.OutboundInventoryService = OutboundInventoryService;
exports.OutboundInventoryService = OutboundInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboundInventoryService);
//# sourceMappingURL=outbound-inventory.service.js.map