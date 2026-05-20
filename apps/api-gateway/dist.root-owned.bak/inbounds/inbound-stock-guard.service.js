"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundStockGuardService = void 0;
const common_1 = require("@nestjs/common");
let InboundStockGuardService = class InboundStockGuardService {
    async ensureDeleteWillNotCauseNegativeStock(tx, inboundId) {
        const inboundContributions = await tx.inventoryLedger.groupBy({
            by: ['itemId', 'warehouseId', 'batchId'],
            where: {
                referenceDocType: 'INBOUND',
                referenceDocId: String(inboundId),
                deletedAt: null,
            },
            _sum: {
                quantityPcs: true,
            },
        });
        if (!inboundContributions.length) {
            return;
        }
        const keySet = new Set();
        const inboundQtyByKey = new Map();
        inboundContributions.forEach((row) => {
            const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
            keySet.add(key);
            const qty = Number(row._sum.quantityPcs ?? 0);
            inboundQtyByKey.set(key, Number.isFinite(qty) ? qty : 0);
        });
        const whereOr = [...keySet].map((key) => {
            const [itemId, warehouseId, batchId] = key.split('::').map((v) => Number(v));
            return { itemId, warehouseId, batchId };
        });
        const currentBalances = await tx.inventoryLedger.groupBy({
            by: ['itemId', 'warehouseId', 'batchId'],
            where: {
                deletedAt: null,
                OR: whereOr,
            },
            _sum: {
                quantityPcs: true,
            },
        });
        const currentBalanceByKey = new Map();
        currentBalances.forEach((row) => {
            const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
            const qty = Number(row._sum.quantityPcs ?? 0);
            currentBalanceByKey.set(key, Number.isFinite(qty) ? qty : 0);
        });
        const violations = [...keySet].filter((key) => {
            const currentBalance = currentBalanceByKey.get(key) ?? 0;
            const inboundQty = inboundQtyByKey.get(key) ?? 0;
            return currentBalance - inboundQty < -0.000001;
        });
        if (!violations.length) {
            return;
        }
        const batchIds = [...new Set(violations.map((key) => Number(key.split('::')[2])))];
        const batchRows = await tx.inventoryBatch.findMany({
            where: { id: { in: batchIds } },
            select: { id: true, batchNumber: true },
        });
        const batchById = new Map(batchRows.map((row) => [row.id, row.batchNumber]));
        const firstViolation = violations[0];
        const [itemId, warehouseId, batchId] = firstViolation.split('::').map((v) => Number(v));
        const batchNumber = batchById.get(batchId) ?? String(batchId);
        throw new common_1.BadRequestException(`Inbound tidak bisa dihapus karena stok akan minus. Item ${itemId}, batch ${batchNumber}, warehouse ${warehouseId} sudah dipakai outbound.`);
    }
};
exports.InboundStockGuardService = InboundStockGuardService;
exports.InboundStockGuardService = InboundStockGuardService = __decorate([
    (0, common_1.Injectable)()
], InboundStockGuardService);
//# sourceMappingURL=inbound-stock-guard.service.js.map