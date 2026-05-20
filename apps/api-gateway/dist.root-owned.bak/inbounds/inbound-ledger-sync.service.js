"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundLedgerSyncService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const inbound_transaction_utils_1 = require("./inbound-transaction.utils");
let InboundLedgerSyncService = class InboundLedgerSyncService {
    async sync(tx, inboundId, actorId) {
        const now = new Date();
        await tx.inventoryLedger.updateMany({
            where: {
                referenceDocType: 'INBOUND',
                referenceDocId: String(inboundId),
                deletedAt: null,
            },
            data: {
                deletedAt: now,
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        const inbound = await tx.inbound.findFirst({
            where: { id: inboundId },
            select: {
                id: true,
                transactionNo: true,
                transactionDate: true,
                warehouse: { select: { id: true } },
                status: true,
                deletedAt: true,
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    select: {
                        itemId: true,
                        item: { select: { id: true, uom: { select: { id: true } } } },
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                            select: { batchIn: true, qty: true, expiredDate: true },
                        },
                    },
                },
            },
        });
        if (!inbound || inbound.deletedAt || inbound.status !== 'POSTED') {
            return;
        }
        const actorUserId = await this.resolveActorUserId(tx, actorId);
        for (const detail of inbound.details) {
            for (const batch of detail.batches) {
                const batchNumber = String(batch.batchIn ?? '').trim();
                if (!batchNumber)
                    continue;
                const inventoryBatch = await tx.inventoryBatch.upsert({
                    where: { itemId_batchNumber: { itemId: detail.item.id, batchNumber } },
                    update: {
                        expiryDate: batch.expiredDate ?? undefined,
                        deletedAt: null,
                        deletedBy: null,
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                    create: {
                        itemId: detail.item.id,
                        batchNumber,
                        expiryDate: batch.expiredDate ?? null,
                        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                    select: { id: true },
                });
                await tx.inventoryLedger.create({
                    data: {
                        transactionDate: inbound.transactionDate,
                        itemId: detail.item.id,
                        warehouseId: inbound.warehouse.id,
                        batchId: inventoryBatch.id,
                        transactionType: 'INBOUND',
                        referenceDocType: 'INBOUND',
                        referenceDocId: String(inbound.id),
                        referenceNumber: inbound.transactionNo,
                        quantityPcs: batch.qty,
                        quantityKg: 0,
                        uomId: detail.item.uom.id,
                        unitCost: null,
                        totalValue: 0,
                        userId: actorUserId ?? null,
                        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                });
            }
        }
    }
    async resolveActorUserId(tx, actorId) {
        if (actorId === undefined || actorId === null || actorId === '') {
            return undefined;
        }
        const normalizedActorId = (0, inbound_transaction_utils_1.parseIntStrict)(String(actorId), 'User ID');
        const actor = await tx.user.findFirst({
            where: { id: normalizedActorId, deletedAt: null },
            select: { id: true },
        });
        return actor?.id;
    }
};
exports.InboundLedgerSyncService = InboundLedgerSyncService;
exports.InboundLedgerSyncService = InboundLedgerSyncService = __decorate([
    (0, common_1.Injectable)()
], InboundLedgerSyncService);
//# sourceMappingURL=inbound-ledger-sync.service.js.map