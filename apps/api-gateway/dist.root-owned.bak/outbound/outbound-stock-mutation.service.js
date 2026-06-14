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
exports.OutboundStockMutationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outbound_helpers_1 = require("./outbound-helpers");
let OutboundStockMutationService = class OutboundStockMutationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findStockMutationReport(query) {
        const warehouseFilter = (0, outbound_helpers_1.parseOptionalId)(query.warehouseId, 'warehouseId');
        const supplierFilter = (0, outbound_helpers_1.parseOptionalId)(query.supplierId, 'supplierId');
        const itemFilter = (0, outbound_helpers_1.parseOptionalId)(query.itemId, 'itemId');
        const [warehouseFilterRow, itemFilterRow] = await Promise.all([
            warehouseFilter !== undefined
                ? this.prisma.masterDataWarehouse.findFirst({
                    where: { id: warehouseFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
            itemFilter !== undefined
                ? this.prisma.masterDataItem.findFirst({
                    where: { id: itemFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
        ]);
        const ledgerRows = await this.prisma.inventoryLedger.findMany({
            where: {
                deletedAt: null,
                warehouseId: warehouseFilterRow?.id,
                itemId: itemFilterRow?.id,
            },
            include: {
                item: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                batch: {
                    select: {
                        id: true,
                        batchNumber: true,
                        expiryDate: true,
                    },
                },
            },
            orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        });
        const batchBalanceMap = new Map();
        ledgerRows.forEach((row) => {
            const itemId = String(row.itemId ?? '').trim();
            const warehouseId = Number(row.warehouseId ?? 0);
            const batchId = Number(row.batchId ?? 0);
            if (!itemId || !warehouseId || !batchId) {
                return;
            }
            const key = `${itemId}::${warehouseId}::${batchId}`;
            const current = batchBalanceMap.get(key) ?? {
                itemId: row.item?.id ?? itemId,
                itemCode: row.item?.code ?? '',
                itemName: row.item?.name ?? '',
                warehouseId: row.warehouse?.id ?? warehouseId,
                warehouseName: row.warehouse?.name ?? '',
                batchNumber: row.batch?.batchNumber ?? '',
                expiryDate: row.batch?.expiryDate ?? null,
                total: 0,
            };
            const qty = Number(row.quantityPcs ?? 0);
            current.total += Number.isFinite(qty) ? qty : 0;
            if (!current.expiryDate && row.batch?.expiryDate) {
                current.expiryDate = row.batch.expiryDate;
            }
            batchBalanceMap.set(key, current);
        });
        const balances = [...batchBalanceMap.values()].filter((row) => Math.abs(row.total) > 0.000001);
        const pairKeys = new Set();
        const itemIds = new Set();
        const batchNumbers = new Set();
        const warehouseIds = new Set();
        balances.forEach((row) => {
            if (!row.itemId || !row.batchNumber || !row.warehouseId) {
                return;
            }
            pairKeys.add(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`);
            itemIds.add(row.itemId);
            batchNumbers.add(row.batchNumber);
            warehouseIds.add(row.warehouseId);
        });
        const suppliersByPair = new Map();
        if (pairKeys.size > 0) {
            const inboundSources = await this.prisma.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            warehouseId: { in: [...warehouseIds] },
                        },
                    },
                },
                select: {
                    batchIn: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    warehouseId: true,
                                    supplierId: true,
                                    supplier: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            });
            inboundSources.forEach((row) => {
                const itemId = String(row.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(row.batchIn ?? '').trim();
                const warehouseId = Number(row.inboundDetail?.inbound?.warehouseId ?? 0);
                const supplierId = Number(row.inboundDetail?.inbound?.supplierId ?? 0);
                if (!itemId || !batchNumber || !warehouseId || !supplierId) {
                    return;
                }
                const pairKey = `${itemId}::${batchNumber}::${warehouseId}`;
                if (!pairKeys.has(pairKey)) {
                    return;
                }
                const current = suppliersByPair.get(pairKey) ?? [];
                if (!current.some((supplier) => supplier.id === supplierId)) {
                    current.push({
                        id: supplierId,
                        name: row.inboundDetail?.inbound?.supplier?.name ?? String(supplierId),
                    });
                }
                suppliersByPair.set(pairKey, current);
            });
        }
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const plusThreeMonths = new Date(startOfToday);
        plusThreeMonths.setMonth(plusThreeMonths.getMonth() + 3);
        const plusSixMonths = new Date(startOfToday);
        plusSixMonths.setMonth(plusSixMonths.getMonth() + 6);
        const data = balances
            .filter((row) => {
            if (supplierFilter === undefined) {
                return true;
            }
            const pairKey = `${row.itemId}::${row.batchNumber}::${row.warehouseId}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return suppliers.some((supplier) => supplier.id === supplierFilter);
        })
            .map((row) => {
            const exp = row.expiryDate ? new Date(row.expiryDate) : null;
            const expDateOnly = exp ? new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()) : null;
            const isExpiredOrToday = expDateOnly
                ? expDateOnly.getTime() <= startOfToday.getTime()
                : false;
            const isInThreeMonths = expDateOnly
                ? expDateOnly.getTime() > startOfToday.getTime() &&
                    expDateOnly.getTime() <= plusThreeMonths.getTime()
                : false;
            const isInSixMonths = expDateOnly
                ? expDateOnly.getTime() > plusThreeMonths.getTime() &&
                    expDateOnly.getTime() <= plusSixMonths.getTime()
                : false;
            let expireLabel = '-';
            let remarks = '';
            if (expDateOnly) {
                const diffMs = expDateOnly.getTime() - startOfToday.getTime();
                const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                if (diffDays < 0) {
                    expireLabel = `EXPIRED ${Math.abs(diffDays)} DAY`;
                    remarks = 'Expired';
                }
                else if (diffDays === 0) {
                    expireLabel = 'EXPIRED TODAY';
                    remarks = 'Expired Today';
                }
                else {
                    expireLabel = `${diffDays} DAY`;
                    if (diffDays <= 90) {
                        remarks = 'Near Expire <= 3 Mth';
                    }
                    else if (diffDays <= 180) {
                        remarks = 'Near Expire <= 6 Mth';
                    }
                }
            }
            return {
                itemId: row.itemId,
                warehouseId: row.warehouseId,
                supplierNames: suppliersByPair
                    .get(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`)
                    ?.map((supplier) => supplier.name) ?? [],
                description: `${row.itemCode} ${row.itemName}`.trim(),
                batchNumber: row.batchNumber,
                expiryDate: row.expiryDate,
                total: row.total,
                actualToday: isExpiredOrToday ? row.total : 0,
                actualThreeMonths: isInThreeMonths ? row.total : 0,
                actualSixMonths: isInSixMonths ? row.total : 0,
                expire: expireLabel,
                remarks,
            };
        })
            .sort((a, b) => {
            if (a.description !== b.description) {
                return a.description.localeCompare(b.description);
            }
            return a.batchNumber.localeCompare(b.batchNumber);
        });
        return {
            success: true,
            data,
            meta: {
                total: data.length,
            },
        };
    }
};
exports.OutboundStockMutationService = OutboundStockMutationService;
exports.OutboundStockMutationService = OutboundStockMutationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboundStockMutationService);
//# sourceMappingURL=outbound-stock-mutation.service.js.map