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
exports.OutboundStockReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outbound_helpers_1 = require("./outbound-helpers");
const outbound_stock_mutation_service_1 = require("./outbound-stock-mutation.service");
let OutboundStockReportService = class OutboundStockReportService {
    prisma;
    outboundStockMutationService;
    constructor(prisma, outboundStockMutationService) {
        this.prisma = prisma;
        this.outboundStockMutationService = outboundStockMutationService;
    }
    async findStockBatchReport(query) {
        const minimumStockPcs = 0;
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
                        uom: { select: { id: true, code: true, name: true } },
                    },
                },
                warehouse: { select: { id: true, name: true } },
                batch: { select: { id: true, batchNumber: true } },
            },
            orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        });
        const pairKeys = new Set();
        const itemIds = new Set();
        const batchNumbers = new Set();
        const warehouseIds = new Set();
        ledgerRows.forEach((row) => {
            const itemId = Number(row.item?.id ?? 0);
            const batchNumber = String(row.batch?.batchNumber ?? '').trim();
            const warehouseId = Number(row.warehouse?.id ?? 0);
            if (!Number.isInteger(itemId) || itemId <= 0 || !batchNumber || !warehouseId) {
                return;
            }
            pairKeys.add(`${itemId}::${batchNumber}::${warehouseId}`);
            itemIds.add(itemId);
            batchNumbers.add(batchNumber);
            warehouseIds.add(warehouseId);
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
        const balancesByKey = new Map();
        const data = ledgerRows
            .filter((row) => {
            if (supplierFilter === undefined) {
                return true;
            }
            const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return suppliers.some((supplier) => supplier.id === supplierFilter);
        })
            .map((row) => {
            const qtyPcs = Number(row.quantityPcs ?? 0);
            const numericQty = Number.isFinite(qtyPcs) ? qtyPcs : 0;
            const inbound = numericQty > 0 ? numericQty : 0;
            const outbound = numericQty < 0 ? Math.abs(numericQty) : 0;
            const balanceKey = `${row.itemId}::${row.batchId}::${row.warehouseId}`;
            const prevBalance = balancesByKey.get(balanceKey) ?? 0;
            const nextBalance = prevBalance + numericQty;
            balancesByKey.set(balanceKey, nextBalance);
            const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return {
                id: row.id,
                item: row.item,
                warehouse: row.warehouse,
                batch: row.batch,
                supplierNames: suppliers.map((supplier) => supplier.name),
                transactionDate: row.transactionDate,
                mmfOrDo: row.referenceNumber ?? '',
                description: row.notes ?? row.transactionType ?? '',
                inbound,
                outbound,
                balance: nextBalance,
                replenish: nextBalance <= minimumStockPcs ? 'YES' : '',
            };
        });
        return {
            success: true,
            data,
            meta: {
                total: data.length,
            },
        };
    }
    async findStockMutationReport(query) {
        return this.outboundStockMutationService.findStockMutationReport(query);
    }
};
exports.OutboundStockReportService = OutboundStockReportService;
exports.OutboundStockReportService = OutboundStockReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbound_stock_mutation_service_1.OutboundStockMutationService])
], OutboundStockReportService);
//# sourceMappingURL=outbound-stock-report.service.js.map